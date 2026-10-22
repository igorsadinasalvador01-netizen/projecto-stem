---
name: plan-takeoff
description: Run quantity takeoffs on building plans with the OpenTakeoff MCP tools and deliver a quantities readout (chat summary + Excel workbook + marked-up PDF). Use this skill whenever the user shares floor plans, architectural drawings, a plan set, elevations, or schedules, or asks for areas, lengths, counts, quantities, a takeoff, a materials list, or "how much X is in this plan" — even if they don't say "takeoff". Covers residential builds (primary) and commercial projects.
compatibility: Requires the OpenTakeoff MCP server (opentakeoff-mcp 0.9.98, 53 tools, configured in this project's .mcp.json) connected in Claude Desktop or Claude Code.
---

# Plan Takeoff

Measure quantities off building plans using the OpenTakeoff engine, then give the user a readout they can price from and check.

## Ground rules (read first)

These come from how OpenTakeoff works. Breaking them produces confident, wrong numbers.

1. **Never measure by eye.** Every quantity must come from an OpenTakeoff tool result. If a tool can't produce a number, report it as an open item — never estimate it silently.
2. **Scale is a gate.** Call `set_scale` explicitly on every sheet you measure, then verify it against a printed dimension on that sheet. If verification is off by more than 1%, stop and resolve it before measuring. A wrong scale makes every number wrong.
3. **Withheld is an answer.** When a tool refuses or withholds (e.g. a flood fill spills, a transition across a wall is reported but not counted), record it in the Open Items list with the tool's reason.
4. **Agent work is a proposal.** Everything you commit is pencil until the user approves it in the OpenTakeoff canvas. Say so in the readout. Use `mark_verdict` to sign your work; never claim it is approved.
5. **Check tool schemas.** Use the parameter names from the connected tools' definitions — don't guess them. If a tool returns an actionable refusal string, follow its advice.
6. **Units.** Default to metric (m², m, m³, each) and Australian residential conventions unless the plans or user say otherwise.

## Notes for opentakeoff-mcp 0.9.98 (this project)

The workflow below was written for an older server. With the pinned 0.9.98:

- **`one_click` and `detect_rooms` are not registered** — upstream gates them off while the flood engine is re-validated. Trace rooms with `measure_polygon` instead (ring on the inner wall faces from `get_sheet_vectors`; check with `view_sheet` overlay and fix with `edit_shape`). Do not enable the gate.
- **`export_report` returns JSON** (`opentakeoff.report.v1`), not an Excel file. Write it to disk with `path`, then build the Excel workbook from that JSON yourself and save it next to it.
- **Batch shapes with `propose_takeoff`** before each trade section (label + rationale), so the user approves one proposal per batch instead of one shape at a time.

## Workflow

### 1. Intake
- Confirm with the user (one short message, only if not already clear): project type (residential/commercial), which sheets to measure, and anything out of scope.
- `load_plan` each file. Use merge mode to add schedules, specs, or addenda to the same session.
- `sheet_info`, `sheet_context`, `read_sheet_text` on each sheet to identify sheet type (floor plan, roof plan, elevations, site plan, schedules) and the title-block scale.

### 2. Scale every sheet
- Read the scale note, `set_scale`, then verify against a known dimension (overall building dimension is best).
- Record per sheet: scale used, how it was set, verification result. This goes in the readout.
- Do not measure sheets marked NTS / not to scale — list them as open items.

### 3. Read the drawing set
- `find_schedule` for door, window, finish, and fixture schedules. `sheet_graph` / `resolve_tag` to link room tags and door/window marks to schedule rows.
- Build conditions from schedules where they exist (`edit_condition`, `duplicate_condition`). Set waste % and wall heights before measuring (see the trade reference for defaults).

### 4. Measure
Load the trade reference for the project type and work through its checklist in order:
- Residential → `references/residential.md`
- Commercial → `references/commercial.md`

Tool selection:
| Need | Tool |
|---|---|
| Room / floor areas | `one_click` or `detect_rooms`; `measure_polygon` if the fill spills |
| Deductions (voids, stairs, islands) | `cut_out` |
| Linear runs (walls, skirting, gutters) | `measure_line`; `derive_base` for skirting from measured rooms |
| Wall faces (plasterboard, paint, tiles) | `measure_surface` with the condition's wall height |
| Repeated symbols (GPOs, lights, fixtures) | `place_count` for one, `symbol_sweep` for all instances |
| Doors / windows from schedule | `sweep_schedule_row` |
| Finish changes | `derive_transitions` |

After each trade section, run `takeoff_summary` and sanity-check (see Checks below).

### 5. Check
Before exporting, verify:
- Sum of room areas ≈ internal floor area (gross floor area minus wall thickness). Flag gaps >3%.
- Door/window counts match schedule totals.
- Wall face areas are plausible for ceiling height × perimeter.
- No condition has net = gross when waste should apply.
- Every measured sheet has a verified scale.
Fix with `edit_shape`, `delete_shape`, or `undo_last`. List anything unresolved as an open item.

### 6. Deliver
1. `export_report` → Excel workbook (.xlsx).
2. `export_marked_pdf` → marked-up plan set.
3. `mark_verdict` on reviewed work.
4. Write the chat readout using `references/readout-template.md`. Tell the user where both files were saved.

## Derived quantities

Some quantities need a calculation on top of a measured figure (roof area from plan area × pitch factor, concrete m³ from slab area × thickness, sheet counts from m²). Always:
- show the measured input, the factor, and the source of the factor (drawing note, spec, or stated assumption);
- put them in a separate "Derived" section of the readout, never mixed with measured quantities.

## What not to do
- Don't invent dimensions, room sizes, or counts not supported by a tool result.
- Don't apply a scale silently or measure an unscaled sheet.
- Don't price anything unless the user supplies rates.
- Don't present quantities as approved or final.
