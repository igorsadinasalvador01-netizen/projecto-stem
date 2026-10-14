// Gera um kit mínimo de efeitos sonoros (WAV 16-bit, 44.1 kHz) — sem downloads.
// Uso: node scripts/gen-sfx.mjs
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const out = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", "sfx");
fs.mkdirSync(out, { recursive: true });

// Gerador pseudo-aleatório determinístico.
let seed = 1234567;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

// Normaliza pela janela de 100 ms mais forte (loudness percebida) até ao alvo em dBFS,
// calibrado contra a voz original (~-32 dBFS de mediana).
const writeWav = (name, samples, targetDb) => {
  const n = samples.length;
  const win = Math.round(0.1 * SR);
  let loud = 0;
  for (let i = 0; i + win <= n || i === 0; i += Math.round(win / 4)) {
    let acc = 0;
    const end = Math.min(n, i + win);
    for (let k = i; k < end; k++) acc += samples[k] * samples[k];
    loud = Math.max(loud, Math.sqrt(acc / Math.max(1, end - i)));
    if (end === n) break;
  }
  const g = loud > 0 ? Math.pow(10, targetDb / 20) / loud : 1;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i] * g)) * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(out, name), buf);
};

const len = (s) => Math.round(s * SR);

// Whoosh: ruído filtrado com varrimento de frequência e envelope em sino.
const whoosh = (dur, f0, f1) => {
  const n = len(dur);
  const o = new Float32Array(n);
  let lp = 0;
  let bp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = f0 + (f1 - f0) * t;
    const a = Math.min(1, (2 * Math.PI * f) / SR);
    lp += a * (rnd() * 2 - 1 - lp);
    bp += a * (lp - bp);
    const env = Math.sin(Math.PI * Math.pow(t, 0.7)) ** 2;
    o[i] = (lp - bp) * env;
  }
  return o;
};

// Pop: seno com queda de afinação.
const pop = (dur, f0, f1) => {
  const n = len(dur);
  const o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = f1 + (f0 - f1) * Math.exp(-t * 9);
    ph += (2 * Math.PI * f) / SR;
    o[i] = Math.sin(ph) * Math.exp(-t * 7) * Math.min(1, i / 60);
  }
  return o;
};

// Tick: clique curto e brilhante.
const tick = () => {
  const n = len(0.035);
  const o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    o[i] = (Math.sin((2 * Math.PI * 2400 * i) / SR) * 0.6 + (rnd() * 2 - 1) * 0.4) * Math.exp(-t * 14);
  }
  return o;
};

// Thud: pancada grave e macia (cartão a assentar).
const thud = () => {
  const n = len(0.28);
  const o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = 70 + 90 * Math.exp(-t * 12);
    ph += (2 * Math.PI * f) / SR;
    o[i] = (Math.sin(ph) + (rnd() * 2 - 1) * 0.08 * Math.exp(-t * 30)) * Math.exp(-t * 6) * Math.min(1, i / 40);
  }
  return o;
};

// Shimmer: cacho de senos agudos ligeiramente desafinados com cauda longa.
const shimmer = () => {
  const n = len(1.4);
  const o = new Float32Array(n);
  const freqs = [1568, 2093, 2349, 3136, 4186];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    let s = 0;
    freqs.forEach((f, k) => {
      const tr = 1 + 0.3 * Math.sin(2 * Math.PI * (5 + k) * (i / SR));
      s += Math.sin((2 * Math.PI * f * (1 + 0.002 * k) * i) / SR) * tr * Math.exp(-t * (3 + k));
    });
    o[i] = s * Math.min(1, i / 400);
  }
  return o;
};

// Sino de notificação: duas notas com parciais inarmónicos (som de "alerta positivo").
const ding = () => {
  const n = len(1.3);
  const o = new Float32Array(n);
  const notes = [
    { f: 1318.5, at: 0 },
    { f: 1760, at: 0.11 },
  ];
  const partials = [
    { r: 1, a: 1, d: 3.2 },
    { r: 2.76, a: 0.32, d: 6 },
    { r: 5.4, a: 0.1, d: 10 },
  ];
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    let s = 0;
    for (const nt of notes) {
      const t = tt - nt.at;
      if (t < 0) continue;
      const atk = Math.min(1, t / 0.004);
      for (const p of partials) s += Math.sin(2 * Math.PI * nt.f * p.r * t) * p.a * Math.exp(-t * p.d) * atk;
    }
    o[i] = s;
  }
  return o;
};

// Alerta "zero": bip-bop descendente, curto e macio.
const alert = () => {
  const n = len(0.32);
  const o = new Float32Array(n);
  const tones = [
    { f: 988, at: 0, d: 0.1 },
    { f: 740, at: 0.11, d: 0.16 },
  ];
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    let s = 0;
    for (const tn of tones) {
      const t = tt - tn.at;
      if (t < 0 || t > tn.d) continue;
      const env = Math.min(1, t / 0.006) * Math.pow(1 - t / tn.d, 1.6);
      s += (Math.sin(2 * Math.PI * tn.f * t) + 0.18 * Math.sin(4 * Math.PI * tn.f * t)) * env;
    }
    o[i] = s;
  }
  return o;
};

// Destaque: pancada sub-grave + transiente + cauda de ar (frases de impacto).
const hit = () => {
  const n = len(0.9);
  const o = new Float32Array(n);
  let ph = 0;
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 42 + 26 * Math.exp(-t * 14);
    ph += (2 * Math.PI * f) / SR;
    const body = Math.sin(ph) * Math.exp(-t * 5.5) * Math.min(1, t / 0.003);
    const nz = rnd() * 2 - 1;
    lp += 0.25 * (nz - lp);
    const click = (nz - lp) * Math.exp(-t * 90) * 0.6;
    const air = Math.sin(2 * Math.PI * 2637 * t) * 0.05 * Math.exp(-t * 4) + lp * 0.05 * Math.exp(-t * 6);
    o[i] = body + click + air;
  }
  return o;
};

// Riser: ruído a subir + seno em glissando, crescendo até cortar seco (antes do boom).
const riser = () => {
  const n = len(1.0);
  const o = new Float32Array(n);
  let lp = 0;
  let bp = 0;
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = 400 + 5600 * t * t;
    const a = Math.min(1, (2 * Math.PI * f) / SR);
    lp += a * (rnd() * 2 - 1 - lp);
    bp += a * (lp - bp);
    ph += (2 * Math.PI * (220 + 660 * t * t)) / SR;
    const env = Math.pow(t, 2.2) * Math.min(1, (n - i) / 300);
    o[i] = ((lp - bp) * 0.8 + Math.sin(ph) * 0.25) * env;
  }
  return o;
};

// Entradas
writeWav("whoosh.wav", whoosh(0.55, 300, 3200), -37);
writeWav("swish.wav", whoosh(0.28, 900, 5200), -38);
writeWav("thud.wav", thud(), -35);
writeWav("pop.wav", pop(0.16, 900, 260), -35);
writeWav("tick.wav", tick(), -42);
// Destaques
writeWav("hit.wav", hit(), -29);
writeWav("riser.wav", riser(), -33);
writeWav("shimmer.wav", shimmer(), -31);
// Alertas
writeWav("alert.wav", alert(), -33);
writeWav("ding.wav", ding(), -21);
console.log("SFX gerados em", out);
