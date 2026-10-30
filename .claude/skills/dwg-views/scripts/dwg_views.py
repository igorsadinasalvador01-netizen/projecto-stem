#!/usr/bin/env python3
"""Extract an inventory of what a human sees when opening a DWG drawing.

Backend: GNU LibreDWG (dwg2dxf) converts DWG -> DXF, ezdxf reads the DXF.
All output goes to stdout as JSON. Diagnostics go to stderr.

Exit codes:
    0  success
    2  bad usage / file not found
    3  backend (dwg2dxf) not found
    4  conversion failed
    5  unsupported DWG version
    6  DXF parse failed
    7  self-check failed
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SCHEMA = "dwg-views/1"

# Directory this script lives in. Every internal path is derived from it.
SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_ROOT = SCRIPT_DIR.parent

BACKEND_EXE = "dwg2dxf.exe" if os.name == "nt" else "dwg2dxf"

INSTALL_HINT = r"""Backend nao encontrado: dwg2dxf (GNU LibreDWG).

Instale sem interacao. Rode como comando PowerShell nativo, em uma linha
(nao envolva em `powershell -Command "..."`: as variaveis expandem cedo e quebra):

$d="$env:LOCALAPPDATA\libredwg"; New-Item -ItemType Directory -Force $d | Out-Null; Invoke-WebRequest 'https://github.com/LibreDWG/libredwg/releases/download/0.14/libredwg-0.14-win64.zip' -OutFile "$env:TEMP\libredwg.zip" -UseBasicParsing; Expand-Archive "$env:TEMP\libredwg.zip" -DestinationPath $d -Force

Depois confirme com:  & "$env:LOCALAPPDATA\libredwg\dwg2dxf.exe" --version

O script procura o executavel nesta ordem:
  1. variavel de ambiente DWG2DXF (caminho completo do executavel)
  2. <raiz-da-skill>/vendor/dwg2dxf.exe
  3. dwg2dxf no PATH
  4. %LOCALAPPDATA%\libredwg\dwg2dxf.exe
"""

# AutoCAD $INSUNITS code table. Code 0 means "unitless" in the file itself.
INSUNITS = {
    0: "indeterminada",
    1: "polegada",
    2: "pe",
    3: "milha",
    4: "milimetro",
    5: "centimetro",
    6: "metro",
    7: "quilometro",
    8: "micropolegada",
    9: "mil",
    10: "jarda",
    11: "angstrom",
    12: "nanometro",
    13: "micrometro",
    14: "decimetro",
    15: "decametro",
    16: "hectometro",
    17: "gigametro",
    18: "unidade astronomica",
    19: "ano-luz",
    20: "parsec",
}

# DWG file signatures LibreDWG documents as readable.
DWG_SIGNATURES = {
    "AC1006": "R10",
    "AC1009": "R11/R12",
    "AC1012": "R13",
    "AC1014": "R14",
    "AC1015": "R2000",
    "AC1018": "R2004",
    "AC1021": "R2007",
    "AC1024": "R2010",
    "AC1027": "R2013",
    "AC1032": "R2018",
}

# View-label patterns. Portuguese drafting conventions. Heuristic by nature:
# a view label has no formal structure in DWG, it is just text on the sheet.
LABEL_PATTERNS = [
    ("corte", r"\bCORTE\s+[A-Z0-9]{1,4}(?:\s*[-/]\s*[A-Z0-9]{1,4})?\b"),
    ("secao", r"\bSE[CÇ][AÃ]O\s+[A-Z0-9]{1,4}(?:\s*[-/]\s*[A-Z0-9]{1,4})?\b"),
    ("detalhe", r"\bDETALHE(?:\s+[A-Z0-9]{1,4})?\b"),
    ("ampliacao", r"\bAMPLIA[CÇ][AÃ]O(?:\s+[A-Z0-9]{1,4})?\b"),
    ("vista", r"\bVISTA(?:\s+[A-ZÇÃÁÉÍÓÚÂÊÔ0-9]+)?\b"),
    ("elevacao", r"\bELEVA[CÇ][AÃ]O(?:\s+[A-Z0-9]{1,4})?\b"),
    ("planta", r"\bPLANTA(?:\s+BAIXA)?\b"),
    ("fachada", r"\bFACHADA(?:\s+[A-Z0-9]{1,4})?\b"),
    ("escala", r"\bESC(?:ALA)?\.?\s*[:=]?\s*1\s*[:/]\s*\d+\b"),
]
COMPILED_LABELS = [(kind, re.compile(pat, re.IGNORECASE)) for kind, pat in LABEL_PATTERNS]

CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------

def die(code: int, message: str) -> "NoReturn":  # type: ignore[name-defined]
    sys.stderr.write(message.rstrip() + "\n")
    sys.exit(code)


def num(value):
    """Return a JSON-safe float, or None when the value is missing/non-finite."""
    if value is None:
        return None
    try:
        f = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(f):
        return None
    return round(f, 6)


def point(value):
    """Return [x, y, z] or None. Never fabricates a missing coordinate."""
    if value is None:
        return None
    try:
        coords = [num(c) for c in tuple(value)]
    except TypeError:
        return None
    if not coords or any(c is None for c in coords):
        return None
    while len(coords) < 3:
        coords.append(0.0)
    return coords[:3]


def clean(text):
    """Strip control characters from DWG-sourced text. Content is not altered."""
    if text is None:
        return None
    return CONTROL_CHARS.sub("", str(text))


def attr(entity, name):
    """Read a DXF attribute, returning None when it is absent or unsupported."""
    try:
        return entity.dxf.get(name)
    except Exception:
        return None


def entity_bbox(entity):
    from ezdxf import bbox

    try:
        box = bbox.extents([entity], fast=False)
    except Exception:
        return None
    if not box.has_data:
        return None
    lo, hi = point(box.extmin), point(box.extmax)
    if lo is None or hi is None:
        return None
    return {"min": lo, "max": hi}


def merge_bbox(current, new):
    if new is None:
        return current
    if current is None:
        return {"min": list(new["min"]), "max": list(new["max"])}
    for i in range(3):
        current["min"][i] = min(current["min"][i], new["min"][i])
        current["max"][i] = max(current["max"][i], new["max"][i])
    return current


# --------------------------------------------------------------------------
# backend
# --------------------------------------------------------------------------

def find_backend():
    env = os.environ.get("DWG2DXF")
    if env and Path(env).is_file():
        return Path(env)

    bundled = SKILL_ROOT / "vendor" / BACKEND_EXE
    if bundled.is_file():
        return bundled

    on_path = shutil.which("dwg2dxf")
    if on_path:
        return Path(on_path)

    local = os.environ.get("LOCALAPPDATA")
    if local:
        candidate = Path(local) / "libredwg" / BACKEND_EXE
        if candidate.is_file():
            return candidate

    return None


def backend_version(exe: Path):
    try:
        proc = subprocess.run(
            [str(exe), "--version"], capture_output=True, text=True, timeout=30
        )
    except Exception:
        return None
    first = (proc.stdout or proc.stderr or "").strip().splitlines()
    return first[0].strip() if first else None


def read_signature(path: Path):
    """Read the 6-byte DWG version signature without locking the file."""
    try:
        with open(path, "rb") as handle:
            raw = handle.read(6)
    except OSError:
        return None
    try:
        return raw.decode("ascii")
    except UnicodeDecodeError:
        return None


def sanitize(name: str) -> str:
    """Make a layout name safe to embed in a filename."""
    cleaned = re.sub(r"[^0-9A-Za-z._-]+", "_", name).strip("._-")
    return cleaned or "layout"


def resolve_json_target(source: Path, json_out, no_json, layout):
    """Where the JSON inventory should land. None means 'do not write'.

    Default: next to the source file, as <stem>.dwg-views.json. The suffix is
    explicit so the file never collides with an unrelated <stem>.json, and a
    --layout run gets its own name instead of overwriting the full extraction.
    """
    if no_json:
        return None
    stem = source.stem
    if layout:
        stem = "%s.%s" % (stem, sanitize(layout))
    filename = stem + ".dwg-views.json"
    if json_out is None:
        return source.parent / filename
    candidate = Path(json_out).expanduser()
    if candidate.is_dir() or candidate.suffix.lower() != ".json":
        return candidate / filename
    return candidate


def resolve_dxf_target(dwg: Path, dxf_out, no_dxf):
    """Where the converted DXF should land. None means 'temporary only'.

    Default: next to the source DWG, same stem. --dxf-out accepts either a
    directory (file keeps the DWG's stem) or an explicit .dxf path.
    """
    if no_dxf:
        return None
    if dxf_out is None:
        return dwg.with_suffix(".dxf")
    candidate = Path(dxf_out).expanduser()
    if candidate.is_dir() or candidate.suffix.lower() != ".dxf":
        return candidate / (dwg.stem + ".dxf")
    return candidate


def run_converter(exe: Path, dwg: Path, dxf: Path):
    try:
        return subprocess.run(
            [str(exe), "-y", "-o", str(dxf), str(dwg)],
            capture_output=True,
            text=True,
            errors="replace",
        )
    except OSError as exc:
        die(4, "Falha ao executar %s: %s" % (exe, exc))


def convert(dwg: Path, preferred, fallback_dir: Path):
    exe = find_backend()
    if exe is None:
        die(3, INSTALL_HINT)

    signature = read_signature(dwg)
    if signature is None:
        die(2, "Nao foi possivel ler a assinatura de %s (arquivo ilegivel ou vazio)." % dwg)
    if signature not in DWG_SIGNATURES:
        die(
            5,
            "Versao de DWG nao suportada: assinatura %r.\n"
            "O backend LibreDWG 0.14 le %s.\n"
            "Reabra o arquivo no CAD de origem e salve como DWG 2018 ou anterior."
            % (signature, ", ".join(sorted(DWG_SIGNATURES))),
        )

    notes = []
    target = preferred
    if target is not None:
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            notes.append(
                "Nao foi possivel criar %s (%s). DXF gerado apenas em diretorio temporario."
                % (target.parent, exc)
            )
            target = None

    persisted = target is not None
    if target is None:
        target = fallback_dir / (dwg.stem + ".dxf")

    proc = run_converter(exe, dwg, target)

    # A failure while writing to the chosen destination (read-only folder, file
    # locked by a CAD session) must not lose the extraction: redo in the temp dir.
    if (proc.returncode != 0 or not target.is_file()) and persisted:
        notes.append(
            "Falha ao gravar o DXF em %s. Refeito em diretorio temporario; "
            "o arquivo ao lado do DWG nao foi atualizado." % target
        )
        target = fallback_dir / (dwg.stem + ".dxf")
        persisted = False
        proc = run_converter(exe, dwg, target)

    if proc.returncode != 0 or not target.is_file():
        tail = "\n".join((proc.stderr or "").strip().splitlines()[-15:])
        die(
            4,
            "dwg2dxf falhou (exit %s) em %s.\n"
            "Ultimas linhas do stderr:\n%s" % (proc.returncode, dwg, tail),
        )

    warnings = [line for line in (proc.stderr or "").splitlines() if line.strip()]
    return target, exe, signature, warnings, persisted, notes


# --------------------------------------------------------------------------
# extraction
# --------------------------------------------------------------------------

def extract_document(doc, source):
    header = doc.header
    code = header.get("$INSUNITS", None)
    try:
        code = int(code) if code is not None else None
    except (TypeError, ValueError):
        code = None

    return {
        "dxf_version": doc.dxfversion,
        "acad_release": doc.acad_release,
        "codepage": header.get("$DWGCODEPAGE", None),
        "insunits": {
            "code": code,
            "name": INSUNITS.get(code, "indeterminada") if code is not None else "indeterminada",
        },
        "measurement": header.get("$MEASUREMENT", None),
        "current_layer": clean(header.get("$CLAYER", None)),
        "extmin": point(header.get("$EXTMIN", None)),
        "extmax": point(header.get("$EXTMAX", None)),
        "limmin": point(header.get("$LIMMIN", None)),
        "limmax": point(header.get("$LIMMAX", None)),
        "ltscale": num(header.get("$LTSCALE", None)),
        "dimscale": num(header.get("$DIMSCALE", None)),
        "counts": {
            "layers": len(doc.layers),
            "blocks": len(doc.blocks),
            "layouts": len(doc.layout_names()),
            "named_views": len(doc.views),
            "dimstyles": len(doc.dimstyles),
            "text_styles": len(doc.styles),
            "linetypes": len(doc.linetypes),
        },
        "source": source,
    }


def extract_layers(doc):
    out = []
    for layer in doc.layers:
        out.append(
            {
                "name": clean(layer.dxf.name),
                "handle": layer.dxf.handle,
                "color_index": attr(layer, "color"),
                "true_color": attr(layer, "true_color"),
                "rgb": list(layer.rgb) if layer.rgb else None,
                "linetype": clean(attr(layer, "linetype")),
                "lineweight": attr(layer, "lineweight"),
                "plot": attr(layer, "plot"),
                "on": layer.is_on(),
                "frozen": layer.is_frozen(),
                "locked": layer.is_locked(),
                "transparency": num(layer.transparency),
                "description": clean(layer.description) or None,
            }
        )
    return out


def extract_blocks(doc, insert_index):
    out = []
    xrefs = []
    for block in doc.blocks:
        definition = block.block
        flags = 0
        xref_path = None
        base = None
        if definition is not None:
            flags = attr(definition, "flags") or 0
            xref_path = clean(attr(definition, "xref_path"))
            base = point(attr(definition, "base_point"))

        is_xref = bool(flags & 4)
        record = {
            "name": clean(block.name),
            "handle": definition.dxf.handle if definition is not None else None,
            "is_xref": is_xref,
            "is_anonymous": bool(flags & 1) or block.name.startswith("*"),
            "xref_path": xref_path,
            "base_point": base,
            "flags": flags,
            "entity_count": len(block),
            "attdef_tags": sorted({clean(a.dxf.tag) for a in block.attdefs()}) or None,
            "insert_count": insert_index.get(block.name, 0),
        }
        out.append(record)
        if is_xref:
            xrefs.append(
                {
                    "name": record["name"],
                    "handle": record["handle"],
                    "path": xref_path,
                    "resolved": record["entity_count"] > 0,
                    "entity_count": record["entity_count"],
                }
            )
    return out, xrefs


def extract_named_views(doc):
    out = []
    for view in doc.views:
        out.append(
            {
                "name": clean(view.dxf.name),
                "handle": view.dxf.handle,
                "center": point(attr(view, "center")),
                "height": num(attr(view, "height")),
                "width": num(attr(view, "width")),
                "direction": point(attr(view, "direction_point")),
                "target": point(attr(view, "target_point")),
            }
        )
    return out


def scale_ratio(scale):
    """Format a viewport scale as '1:N'. Pure arithmetic on the unrounded value."""
    if scale is None or not math.isfinite(scale) or scale <= 0:
        return None
    denominator = 1.0 / scale
    # CAD scales carry float noise (0.019999996 for 1:50). Snap only when the
    # nearest integer is within 0.1% -- otherwise report the value as computed.
    nearest = round(denominator)
    if nearest > 0 and abs(denominator - nearest) / nearest < 0.001:
        denominator = float(nearest)
    return "1:%g" % round(denominator, 4)


def extract_viewport(viewport, layout_name):
    try:
        raw_scale = float(viewport.get_scale())
    except Exception:
        raw_scale = None
    scale = num(raw_scale)

    try:
        limits = viewport.get_modelspace_limits()
        window = {
            "min": [num(limits[0]), num(limits[1])],
            "max": [num(limits[2]), num(limits[3])],
        }
    except Exception:
        window = None

    vp_id = attr(viewport, "id")
    center = point(attr(viewport, "center"))
    view_center = point(attr(viewport, "view_center_point"))

    # DXF spec: the sheet's own viewport carries id 1. LibreDWG does not always
    # write that id, so fall back to its structural signature: it looks at paper
    # space itself (view centre == centre) at scale 1.
    if vp_id == 1:
        basis = "id"
    elif scale == 1.0 and center is not None and center == view_center:
        basis = "identity_view"
    else:
        basis = None

    return {
        "handle": viewport.dxf.handle,
        "layout": layout_name,
        "id": vp_id,
        "layer": clean(attr(viewport, "layer")),
        "is_sheet_viewport": basis is not None,
        "sheet_viewport_basis": basis,
        "center": center,
        "width": num(attr(viewport, "width")),
        "height": num(attr(viewport, "height")),
        "view_center": view_center,
        "view_height": num(attr(viewport, "view_height")),
        "view_target": point(attr(viewport, "view_target_point")),
        "view_direction": point(attr(viewport, "view_direction_vector")),
        "twist_angle": num(attr(viewport, "view_twist_angle")),
        "is_top_view": bool(viewport.is_top_view),
        "scale": scale,
        "scale_ratio": scale_ratio(raw_scale),
        "status": attr(viewport, "status"),
        "flags": attr(viewport, "flags"),
        "modelspace_window": window,
        "frozen_layers": [clean(n) for n in viewport.frozen_layers] or None,
    }


def extract_layouts(doc):
    layouts = []
    viewports = []
    for name in doc.layout_names():
        layout = doc.layouts.get(name)
        settings = layout.dxf_layout

        counts = {}
        layer_usage = {}
        box = None
        for entity in layout:
            counts[entity.dxftype()] = counts.get(entity.dxftype(), 0) + 1
            layer = clean(attr(entity, "layer")) or "<sem camada>"
            layer_usage[layer] = layer_usage.get(layer, 0) + 1
            if entity.dxftype() != "VIEWPORT":
                box = merge_bbox(box, entity_bbox(entity))

        layout_viewports = []
        if not layout.is_modelspace:
            for viewport in layout.query("VIEWPORT"):
                record = extract_viewport(viewport, name)
                layout_viewports.append(record)
                viewports.append(record)

        layouts.append(
            {
                "name": clean(name),
                "handle": settings.dxf.handle,
                "block_record": clean(layout.block_record_name),
                "is_modelspace": layout.is_modelspace,
                "taborder": attr(settings, "taborder"),
                "paper_size": clean(attr(settings, "paper_size")),
                "paper_width": num(attr(settings, "paper_width")),
                "paper_height": num(attr(settings, "paper_height")),
                "paper_units_code": attr(settings, "plot_paper_units"),
                "plot_rotation": attr(settings, "plot_rotation"),
                "plot_configuration_file": clean(attr(settings, "plot_configuration_file")),
                "plot_scale_numerator": num(attr(settings, "scale_numerator")),
                "plot_scale_denominator": num(attr(settings, "scale_denominator")),
                "limmin": point(attr(settings, "limmin")),
                "limmax": point(attr(settings, "limmax")),
                "entity_counts": dict(sorted(counts.items(), key=lambda kv: -kv[1])),
                "layer_usage": dict(sorted(layer_usage.items(), key=lambda kv: -kv[1])),
                "content_bbox": box,
                "viewport_count": len(layout_viewports),
                "viewport_handles": [v["handle"] for v in layout_viewports],
            }
        )
    return layouts, viewports


def text_of(entity):
    """Return (plain_text, raw_text) for any text-bearing entity."""
    kind = entity.dxftype()
    if kind == "TEXT":
        raw = attr(entity, "text")
        return clean(raw), clean(raw)
    if kind == "MTEXT":
        raw = entity.text
        try:
            plain = entity.plain_text()
        except Exception:
            plain = raw
        return clean(plain), clean(raw)
    if kind == "MULTILEADER":
        if not entity.has_mtext_content:
            return None, None
        try:
            raw = entity.get_mtext_content()
        except Exception:
            return None, None
        return clean(raw), clean(raw)
    return None, None


def extract_texts(doc):
    out = []
    for name in doc.layout_names():
        layout = doc.layouts.get(name)
        for entity in layout.query("TEXT MTEXT MULTILEADER"):
            plain, raw = text_of(entity)
            if plain is None or not plain.strip():
                continue
            height = attr(entity, "height")
            if height is None:
                height = attr(entity, "char_height")
            out.append(
                {
                    "handle": entity.dxf.handle,
                    "layout": clean(name),
                    "type": entity.dxftype(),
                    "layer": clean(attr(entity, "layer")),
                    "style": clean(attr(entity, "style")),
                    "text": plain,
                    "raw": raw if raw != plain else None,
                    "height": num(height),
                    "rotation": num(attr(entity, "rotation")),
                    "insert": point(attr(entity, "insert")),
                }
            )
    return out


def extract_block_references(doc):
    out = []
    index = {}
    for name in doc.layout_names():
        layout = doc.layouts.get(name)
        for insert in layout.query("INSERT"):
            block_name = clean(attr(insert, "name"))
            index[block_name] = index.get(block_name, 0) + 1
            attributes = [
                {
                    "tag": clean(a.dxf.tag),
                    "text": clean(attr(a, "text")),
                    "handle": a.dxf.handle,
                }
                for a in insert.attribs
            ]
            out.append(
                {
                    "handle": insert.dxf.handle,
                    "layout": clean(name),
                    "block": block_name,
                    "layer": clean(attr(insert, "layer")),
                    "insert": point(attr(insert, "insert")),
                    "rotation": num(attr(insert, "rotation")),
                    "scale": [
                        num(attr(insert, "xscale")),
                        num(attr(insert, "yscale")),
                        num(attr(insert, "zscale")),
                    ],
                    "attributes": attributes or None,
                    "bbox": entity_bbox(insert),
                }
            )
    # INSERTs nested inside block definitions also count as references.
    for block in doc.blocks:
        for insert in block.query("INSERT"):
            block_name = clean(attr(insert, "name"))
            index[block_name] = index.get(block_name, 0) + 1
    return out, index


def extract_dimensions(doc):
    out = []
    for name in doc.layout_names():
        layout = doc.layouts.get(name)
        for dim in layout.query("DIMENSION"):
            try:
                measurement = dim.get_measurement()
            except Exception:
                measurement = None
            if not isinstance(measurement, (int, float)):
                measurement = None
            override = clean(attr(dim, "text"))
            out.append(
                {
                    "handle": dim.dxf.handle,
                    "layout": clean(name),
                    "layer": clean(attr(dim, "layer")),
                    "dimtype": attr(dim, "dimtype"),
                    "dimstyle": clean(attr(dim, "dimstyle")),
                    "measurement": num(measurement),
                    "actual_measurement": num(attr(dim, "actual_measurement")),
                    "text_override": override if override not in (None, "", "<>") else None,
                    "defpoint": point(attr(dim, "defpoint")),
                    "text_midpoint": point(attr(dim, "text_midpoint")),
                }
            )
    return out


def extract_images(doc):
    out = []
    for name in doc.layout_names():
        layout = doc.layouts.get(name)
        for image in layout.query("IMAGE"):
            filename = None
            try:
                filename = clean(image.image_def.dxf.filename)
            except Exception:
                filename = None
            out.append(
                {
                    "handle": image.dxf.handle,
                    "layout": clean(name),
                    "layer": clean(attr(image, "layer")),
                    "path": filename,
                    "insert": point(attr(image, "insert")),
                    "image_size": point(attr(image, "image_size")),
                }
            )
    return out


def geometry_metrics(entity):
    kind = entity.dxftype()
    metrics = {}
    if kind == "LINE":
        start, end = attr(entity, "start"), attr(entity, "end")
        metrics["start"] = point(start)
        metrics["end"] = point(end)
        if start is not None and end is not None:
            try:
                metrics["length"] = num((end - start).magnitude)
            except Exception:
                metrics["length"] = None
    elif kind == "LWPOLYLINE":
        metrics["closed"] = bool(entity.closed)
        metrics["vertex_count"] = len(entity)
    elif kind == "POLYLINE":
        metrics["closed"] = bool(entity.is_closed)
        metrics["vertex_count"] = len(entity.vertices)
    elif kind == "CIRCLE":
        metrics["center"] = point(attr(entity, "center"))
        metrics["radius"] = num(attr(entity, "radius"))
    elif kind == "ARC":
        metrics["center"] = point(attr(entity, "center"))
        metrics["radius"] = num(attr(entity, "radius"))
        metrics["start_angle"] = num(attr(entity, "start_angle"))
        metrics["end_angle"] = num(attr(entity, "end_angle"))
    elif kind == "ELLIPSE":
        metrics["center"] = point(attr(entity, "center"))
        metrics["major_axis"] = point(attr(entity, "major_axis"))
        metrics["ratio"] = num(attr(entity, "ratio"))
    elif kind == "HATCH":
        metrics["pattern"] = clean(attr(entity, "pattern_name"))
        metrics["solid_fill"] = attr(entity, "solid_fill")
        try:
            metrics["path_count"] = len(entity.paths)
        except Exception:
            metrics["path_count"] = None
    elif kind == "SPLINE":
        metrics["degree"] = attr(entity, "degree")
        try:
            metrics["control_point_count"] = len(entity.control_points)
        except Exception:
            metrics["control_point_count"] = None
    elif kind == "POINT":
        metrics["location"] = point(attr(entity, "location"))
    return metrics or None


SKIP_IN_GEOMETRY = {"TEXT", "MTEXT", "MULTILEADER", "DIMENSION", "INSERT", "VIEWPORT", "IMAGE"}


def extract_geometry(doc, detailed):
    items = []
    summary = {}
    for name in doc.layout_names():
        layout = doc.layouts.get(name)
        for entity in layout:
            kind = entity.dxftype()
            if kind in SKIP_IN_GEOMETRY:
                continue
            layer = clean(attr(entity, "layer"))
            box = entity_bbox(entity)
            key = (clean(name), layer, kind)
            bucket = summary.setdefault(key, {"count": 0, "bbox": None})
            bucket["count"] += 1
            bucket["bbox"] = merge_bbox(bucket["bbox"], box)
            if detailed:
                items.append(
                    {
                        "handle": entity.dxf.handle,
                        "layout": clean(name),
                        "type": kind,
                        "layer": layer,
                        "bbox": box,
                        "metrics": geometry_metrics(entity),
                    }
                )

    summary_list = [
        {
            "layout": layout_name,
            "layer": layer,
            "type": kind,
            "count": data["count"],
            "bbox": data["bbox"],
        }
        for (layout_name, layer, kind), data in sorted(
            summary.items(), key=lambda kv: (-kv[1]["count"], kv[0])
        )
    ]
    return summary_list, (items if detailed else None)


def extract_view_labels(texts):
    labels = []
    for item in texts:
        content = item["text"]
        for kind, pattern in COMPILED_LABELS:
            match = pattern.search(content)
            if match:
                labels.append(
                    {
                        "handle": item["handle"],
                        "layout": item["layout"],
                        "layer": item["layer"],
                        "kind": kind,
                        "matched_text": clean(match.group(0)).strip(),
                        "source_text": content,
                        "insert": item["insert"],
                        "heuristic": True,
                    }
                )
                break
    return labels


# --------------------------------------------------------------------------
# driver
# --------------------------------------------------------------------------

def build(path: Path, detailed_geometry: bool, dxf_out, no_dxf: bool):
    try:
        import ezdxf
    except ImportError:
        die(3, "Dependencia ausente: ezdxf. Instale com:  python -m pip install ezdxf")

    suffix = path.suffix.lower()
    temp_dir = None
    conversion_warnings = []
    backend = None
    signature = None
    notes = []

    if suffix == ".dxf":
        # Already a DXF: nothing to convert, nothing to write.
        dxf_path = path
        persisted = True
        dxf_requested = False
        notes.append("Entrada ja era DXF; nenhuma conversao foi feita.")
    else:
        temp_dir = Path(tempfile.mkdtemp(prefix="dwg_views_"))
        target = resolve_dxf_target(path, dxf_out, no_dxf)
        dxf_requested = target is not None
        dxf_path, backend, signature, conversion_warnings, persisted, notes = convert(
            path, target, temp_dir
        )

    try:
        try:
            doc = ezdxf.readfile(str(dxf_path))
        except Exception as exc:
            die(6, "Falha ao ler o DXF gerado (%s): %s" % (dxf_path, exc))

        distinct = []
        for line in conversion_warnings:
            token = re.sub(r"\b0x[0-9a-fA-F]+\b|\b\d+\b", "N", line)
            if token not in distinct:
                distinct.append(token)

        source = {
            "path": str(path),
            "bytes": path.stat().st_size,
            "dwg_signature": signature,
            "dwg_release": DWG_SIGNATURES.get(signature) if signature else None,
            "backend": str(backend) if backend else None,
            "backend_version": backend_version(backend) if backend else None,
            "conversion_warnings": {
                "count": len(conversion_warnings),
                "distinct_sample": distinct[:10],
            },
            "dxf_requested": dxf_requested,
            "dxf_path": str(dxf_path) if persisted else None,
            "dxf_bytes": dxf_path.stat().st_size if persisted else None,
            "dxf_notes": notes or None,
            # Filled in by main() once the destination is known. The byte count
            # cannot live here: it would change the file it describes.
            "json_requested": None,
            "json_path": None,
            "json_notes": None,
        }

        block_references, insert_index = extract_block_references(doc)
        blocks, xrefs = extract_blocks(doc, insert_index)
        layouts, viewports = extract_layouts(doc)
        texts = extract_texts(doc)
        geometry_summary, geometry = extract_geometry(doc, detailed_geometry)

        result = {
            "schema": SCHEMA,
            "document": extract_document(doc, source),
            "layers": extract_layers(doc),
            "blocks": blocks,
            "xrefs": xrefs,
            "named_views": extract_named_views(doc),
            "layouts": layouts,
            "viewports": viewports,
            "view_labels": extract_view_labels(texts),
            "texts": texts,
            "block_references": block_references,
            "dimensions": extract_dimensions(doc),
            "images": extract_images(doc),
            "geometry_summary": geometry_summary,
            "geometry": geometry,
        }

        return result
    finally:
        if temp_dir is not None:
            shutil.rmtree(temp_dir, ignore_errors=True)


def filter_layout(result, wanted):
    names = {layout["name"] for layout in result["layouts"]}
    if wanted not in names:
        die(
            2,
            "Layout %r nao existe. Layouts do arquivo: %s"
            % (wanted, ", ".join(sorted(names))),
        )
    result["layouts"] = [lo for lo in result["layouts"] if lo["name"] == wanted]
    for key in (
        "viewports",
        "view_labels",
        "texts",
        "block_references",
        "dimensions",
        "images",
        "geometry_summary",
    ):
        result[key] = [item for item in result[key] if item.get("layout") == wanted]
    if result["geometry"] is not None:
        result["geometry"] = [i for i in result["geometry"] if i.get("layout") == wanted]
    result["document"]["filtered_to_layout"] = wanted
    return result


def serialize(result) -> str:
    return json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False) + "\n"


def write_json(result, target):
    """Persist the inventory next to the drawing. Returns (path, bytes, notes).

    A failure here never costs the extraction: the caller still has the result
    in memory and can print it.
    """
    if target is None:
        return None, None, []
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        result["document"]["source"]["json_path"] = str(target)
        payload = serialize(result)
        with open(target, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(payload)
    except OSError as exc:
        result["document"]["source"]["json_path"] = None
        return None, None, ["Nao foi possivel gravar o JSON em %s (%s)." % (target, exc)]
    return target, len(payload.encode("utf-8")), []


def summarize(result, json_bytes):
    """Compact report for stdout: enough to answer simple questions without
    opening the full inventory, plus the paths where the artifacts landed."""
    doc = result["document"]
    src = doc["source"]
    out = []
    add = out.append

    add("dwg-views %s" % SCHEMA)
    add("  fonte      %s (%s bytes)" % (src["path"], format(src["bytes"], ",")))
    if src["dwg_release"]:
        add("  versao     %s (%s)" % (src["dwg_release"], src["dwg_signature"]))
    add("  unidade    %s (codigo $INSUNITS: %s)"
        % (doc["insunits"]["name"], doc["insunits"]["code"]))
    add("  extents    min=%s  max=%s" % (doc["extmin"], doc["extmax"]))

    add("")
    add("  JSON       %s%s" % (
        src["json_path"] or "(nao gravado)",
        " (%s bytes)" % format(json_bytes, ",") if json_bytes else ""))
    add("  DXF        %s%s" % (
        src["dxf_path"] or "(nao gravado)",
        " (%s bytes)" % format(src["dxf_bytes"], ",") if src["dxf_bytes"] else ""))

    add("")
    add("  camadas=%d  blocos=%d  viewports=%d  textos=%d  cotas=%d  rotulos=%d  imagens=%d"
        % (len(result["layers"]), len(result["blocks"]), len(result["viewports"]),
           len(result["texts"]), len(result["dimensions"]),
           len(result["view_labels"]), len(result["images"])))

    add("")
    add("  LAYOUTS:")
    for layout in sorted(result["layouts"], key=lambda l: (l["is_modelspace"], l["taborder"] or 0)):
        scales = sorted({v["scale_ratio"] for v in result["viewports"]
                         if v["layout"] == layout["name"]
                         and not v["is_sheet_viewport"] and v["scale_ratio"]})
        add("    %-12s %-11s %sx%s mm  viewports=%-3d escalas=%s"
            % (layout["name"],
               "MODEL" if layout["is_modelspace"] else (layout["paper_size"] or "?")[:11],
               layout["paper_width"], layout["paper_height"],
               layout["viewport_count"], ", ".join(scales) or "-"))

    labels = sorted({b["matched_text"] for b in result["view_labels"]})
    if labels:
        add("")
        add("  ROTULOS DE VISTA (heuristica): %s" % ", ".join(labels))

    warn = src["conversion_warnings"]["count"]
    if warn:
        add("")
        add("  %d avisos de conversao do LibreDWG (ver conversion_warnings no JSON)" % warn)

    for note in (src["dxf_notes"] or []) + (src["json_notes"] or []):
        add("  AVISO: %s" % note)

    add("")
    if src["json_path"]:
        add("  Abra o JSON acima para detalhe -- leia so a secao que a pergunta pede.")
    else:
        add("  Nenhum JSON gravado. Rode sem --no-json, ou com --stdout para receber"
            " o inventario inteiro na saida.")
    return "\n".join(out) + "\n"


HANDLE_RE = re.compile(r"^[0-9A-Fa-f]+$")


def self_check(result):
    """Minimal assertions. Fails loudly if extraction regressed."""
    failures = []

    def check(condition, message):
        if not condition:
            failures.append(message)

    doc = result["document"]
    check(result["schema"] == SCHEMA, "schema divergente")
    check(bool(doc["dxf_version"]), "document.dxf_version vazio")
    check("insunits" in doc and "code" in doc["insunits"], "document.insunits ausente")
    check(
        doc["insunits"]["name"] is not None,
        "document.insunits.name nulo (deveria ser 'indeterminada')",
    )
    check(len(result["layers"]) > 0, "nenhuma camada extraida")
    check(len(result["layouts"]) > 0, "nenhum layout extraido")
    check(
        any(not lo["is_modelspace"] for lo in result["layouts"]),
        "nenhum layout de paper space extraido",
    )
    check(len(result["viewports"]) > 0, "nenhuma viewport extraida")
    check(len(result["texts"]) > 0, "nenhum texto extraido")

    src = doc["source"]
    if src["dxf_requested"]:
        check(src["dxf_path"], "DXF convertido nao foi gravado no destino pedido")
        if src["dxf_path"]:
            check(Path(src["dxf_path"]).is_file(), "dxf_path aponta para arquivo inexistente")
            check((src["dxf_bytes"] or 0) > 0, "DXF gravado esta vazio")

    if src["json_requested"]:
        check(src["json_path"], "JSON nao foi gravado no destino pedido")
        if src["json_path"]:
            written = Path(src["json_path"])
            check(written.is_file(), "json_path aponta para arquivo inexistente")
            if written.is_file():
                check(written.stat().st_size > 0, "JSON gravado esta vazio")
                try:
                    with open(written, encoding="utf-8") as handle:
                        reread = json.load(handle)
                    check(
                        reread["schema"] == SCHEMA
                        and len(reread["layouts"]) == len(result["layouts"]),
                        "JSON gravado nao corresponde ao resultado em memoria",
                    )
                except (OSError, ValueError) as exc:
                    failures.append("JSON gravado nao pode ser relido: %s" % exc)

    scaled = [v for v in result["viewports"] if v["scale"] is not None]
    check(scaled, "nenhuma viewport com escala numerica")
    check(
        any(v["scale_ratio"] for v in scaled),
        "nenhuma viewport com scale_ratio formatado",
    )

    handled = (
        result["layers"]
        + result["viewports"]
        + result["texts"]
        + result["block_references"]
        + result["dimensions"]
        + result["named_views"]
        + result["view_labels"]
    )
    bad = [
        item
        for item in handled
        if not item.get("handle") or not HANDLE_RE.match(str(item["handle"]))
    ]
    check(not bad, "%d item(ns) sem handle hexadecimal valido" % len(bad))

    check(
        all(lo["handle"] for lo in result["layouts"]),
        "layout sem handle",
    )
    check(
        all(b["kind"] and b["heuristic"] is True for b in result["view_labels"]),
        "rotulo de vista sem kind ou sem marca heuristic",
    )

    try:
        dumped = json.dumps(result, ensure_ascii=False, allow_nan=False)
        json.loads(dumped)
    except (ValueError, TypeError) as exc:
        failures.append("JSON invalido ou com NaN/Infinity: %s" % exc)
        dumped = ""

    check("NaN" not in dumped and "Infinity" not in dumped, "JSON contem NaN/Infinity")

    return failures


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="dwg_views.py",
        description="Extrai o inventario de vistas, camadas, textos e cotas de um DWG.",
    )
    parser.add_argument("arquivo", help="caminho do .dwg (ou .dxf ja convertido)")
    parser.add_argument("--layout", help="restringe a saida a um unico layout")
    parser.add_argument(
        "--geometry",
        action="store_true",
        help="inclui um registro por entidade grafica alem do resumo agregado",
    )
    parser.add_argument(
        "--dxf-out",
        metavar="DESTINO",
        help="grava o DXF convertido em DESTINO (diretorio ou caminho .dxf) "
        "em vez de ao lado do DWG",
    )
    parser.add_argument(
        "--no-dxf",
        action="store_true",
        help="nao deixa o DXF em disco; converte apenas em diretorio temporario",
    )
    parser.add_argument(
        "--json-out",
        metavar="DESTINO",
        help="grava o JSON em DESTINO (diretorio ou caminho .json) "
        "em vez de ao lado do arquivo de entrada",
    )
    parser.add_argument(
        "--no-json",
        action="store_true",
        help="nao grava o JSON em disco",
    )
    parser.add_argument(
        "--stdout",
        action="store_true",
        help="imprime o JSON inteiro em stdout no lugar do resumo (saida grande)",
    )
    parser.add_argument(
        "--self-check",
        action="store_true",
        help="roda as asserts internas contra o arquivo e reporta em stderr",
    )
    args = parser.parse_args(argv)

    path = Path(args.arquivo).expanduser()
    if not path.is_file():
        die(2, "Arquivo nao encontrado: %s" % path)

    if args.dxf_out and args.no_dxf:
        die(2, "--dxf-out e --no-dxf sao mutuamente exclusivos.")
    if args.json_out and args.no_json:
        die(2, "--json-out e --no-json sao mutuamente exclusivos.")

    source = path.resolve()
    result = build(source, args.geometry, args.dxf_out, args.no_dxf)

    if args.layout:
        result = filter_layout(result, args.layout)

    json_target = resolve_json_target(source, args.json_out, args.no_json, args.layout)
    result["document"]["source"]["json_requested"] = json_target is not None
    json_path, json_bytes, json_notes = write_json(result, json_target)
    result["document"]["source"]["json_notes"] = json_notes or None

    if args.self_check:
        failures = self_check(result)
        if failures:
            sys.stderr.write("SELF-CHECK FALHOU:\n")
            for item in failures:
                sys.stderr.write("  - %s\n" % item)
            sys.exit(7)
        doc = result["document"]
        sys.stderr.write(
            "SELF-CHECK OK: %d camadas, %d layouts, %d viewports, %d textos, "
            "%d rotulos, %d cotas, %d blocos, unidade=%s\n"
            % (
                len(result["layers"]),
                len(result["layouts"]),
                len(result["viewports"]),
                len(result["texts"]),
                len(result["view_labels"]),
                len(result["dimensions"]),
                len(result["blocks"]),
                doc["insunits"]["name"],
            )
        )
        if doc["source"]["dxf_path"]:
            sys.stderr.write(
                "DXF:  %s (%d bytes)\n"
                % (doc["source"]["dxf_path"], doc["source"]["dxf_bytes"] or 0)
            )
        if json_path:
            sys.stderr.write("JSON: %s (%d bytes)\n" % (json_path, json_bytes or 0))
        return 0

    for note in (result["document"]["source"]["dxf_notes"] or []) + (json_notes or []):
        sys.stderr.write("Aviso: %s\n" % note)

    if args.stdout:
        sys.stdout.write(serialize(result))
    else:
        sys.stdout.write(summarize(result, json_bytes))
    return 0


if __name__ == "__main__":
    sys.exit(main())
