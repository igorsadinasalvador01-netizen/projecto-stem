# Vídeo 9 — limpeza das pausas da voz de public/v9/conteudo_original.mp4.
# Uso (numpy + soundfile):
#   ffmpeg -i public/v9/conteudo_original.mp4 -vn -ac 2 -ar 48000 /tmp/conteudo48st.wav
#   python -I scripts/edit-v9-voz.py /tmp/conteudo48st.wav /tmp -50 0.08 0.04
#   ffmpeg -i /tmp/voz_editada_raw.wav -af "highpass=f=70,loudnorm=I=-15:TP=-1.5:LRA=11" -ar 48000 public/v9/voz.wav
#   cp /tmp/edit9.json src/v9/edit9.json
# Só se remove silêncio verdadeiro (< -50 dB) dentro da fala; os limites da fala vêm do
# VAD Silero (k2-fsa/sherpa-onnx) e o texto foi corrigido cruzando Parakeet v3 e Whisper-small.
# Uso: python -I edit9.py <conteudo48st.wav> <out_dir>
# 1) deteta a fala, 2) encurta as pausas (sem tocar nas palavras), 3) alinha as
# palavras do texto corrigido dentro de cada frase, 4) escreve o áudio editado e
# o mapa de cortes (fonte -> novo tempo) para o Remotion.
import json, re, sys
import numpy as np
import soundfile as sf

src, out = sys.argv[1], sys.argv[2]
DEAD_DB = float(sys.argv[3]) if len(sys.argv) > 3 else -44.0
MIN_DEAD = float(sys.argv[4]) if len(sys.argv) > 4 else 0.22
PAD = float(sys.argv[5]) if len(sys.argv) > 5 else 0.09
FPS = 30
a, sr = sf.read(src, dtype="float32")
mono = a.mean(axis=1)

# ——— texto corrigido por segmento (fronteiras = meio das pausas) ———
SEGS = [
    (0.0, 2.49, "Um dos meus maiores problemas nunca foi a falta de ideias,"),
    (2.49, 5.92, "mas sim de tempo para transformar essas ideias em conteúdo."),
    (5.92, 10.36, "Tenho que parar, gravar, repetir partes, editar, colocar legendas"),
    (10.36, 11.35, "e publicar."),
    (11.35, 14.64, "E quando tens trabalho, responsabilidades e outras prioridades,"),
    (14.64, 15.69, "produzir conteúdo"),
    (15.69, 17.93, "constantemente torna-se um pouco complicado."),
    (17.93, 21.28, "Até que pude perceber que podia utilizar a inteligência artificial"),
    (21.28, 22.88, "para mudar completamente este processo."),
    (23.37, 24.98, "Hoje eu pego todo o meu conhecimento,"),
    (24.98, 27.82, "ideias e tudo aquilo que eu aprendo, transformo isso em um roteiro,"),
    (27.82, 29.09, "prompts e vídeos."),
    (29.09, 29.84, "A ideia"),
    (29.84, 33.26, "continua a ser a minha. A inteligência artificial ajuda a estruturar a mensagem,"),
    (33.26, 34.47, "a melhorar os roteiros"),
    (34.47, 35.23, "e a construir"),
    (35.23, 36.61, "todas as cenas visuais."),
    (36.61, 40.77, "E com ferramentas como o Remotion, consigo preparar este processo em vários vídeos dinâmicos"),
    (40.77, 42.37, "e produzir vários conteúdos"),
    (42.37, 43.24, "em um só dia."),
    (43.24, 44.11, "E atenção."),
    (44.11, 47.32, "Isso não significa substituir a sua imagem ou deixar de aparecer."),
    (47.32, 51.24, "Significa que vais ter uma ferramenta que vai te ajudar a partilhar o seu conhecimento,"),
    (51.24, 52.83, "conectar e agregar as pessoas,"),
    (52.83, 53.35, "mesmo"),
    (53.35, 54.2, "que não tenhas tempo"),
    (54.2, 55.17, "para estar diante das câmeras."),
    (55.53, 58.06, "Se tens conhecimento para partilhar, mas o tempo te limita,"),
    (58.06, 60.13, "isso não significa que tu tens que trabalhar mais."),
    (60.13, 63.02, "Significa que talvez precisas mudar o seu processo."),
    (63.02, 63.74, "Para isso,"),
    (63.74, 66.47, "siga o meu perfil, que eu vou mostrar tudo isso todos os dias."),
    (66.47, 67.28, "Deixe o seu like,"),
    (67.28, 67.78, "curte"),
    (67.78, 68.65, "e compartilhe."),
]

# ——— envelope a 10 ms e regiões de fala ———
hop = int(0.01 * sr)
n = len(mono) // hop
env = np.sqrt((mono[: n * hop].reshape(n, hop) ** 2).mean(axis=1))
db = 20 * np.log10(env + 1e-9)
# suavização 30 ms
dbs = np.convolve(db, np.ones(3) / 3, mode="same")
voiced = dbs > -40.5

def regions(mask):
    out, i = [], 0
    while i < len(mask):
        if mask[i]:
            j = i
            while j < len(mask) and mask[j]:
                j += 1
            out.append([i * 0.01, j * 0.01])
            i = j
        else:
            i += 1
    return out

# Fala segundo o VAD Silero (oficial k2-fsa), só dentro dos segmentos com texto.
VAD = [(0.08,2.47),(2.67,5.67),(6.22,11.14),(11.73,14.66),(14.80,15.62),(15.79,17.83),(18.19,21.29),(21.42,23.18),(23.63,25.00),(25.10,27.78),(27.98,29.13),(29.33,29.83),(29.94,34.47),(34.61,35.21),(35.34,36.42),(36.91,40.87),(41.01,43.14),(43.47,44.10),(44.27,47.27),(47.44,51.27),(51.38,52.87),(53.01,54.22),(54.32,55.50),(55.60,62.92),(63.22,63.66),(63.82,66.54),(66.70,67.30),(67.44,67.72),(67.98,68.49)]
def in_text(s, e):
    return any(s < b and e > a for a, b, _ in SEGS)
# ruído isolado (sem palavras): 22,9–23,4 s e 55,2–55,5 s
NOISE = [(22.88, 23.37), (55.17, 55.53)]
spk0 = []
for s_, e_ in VAD:
    for na, nb in NOISE:
        if s_ < nb and e_ > na:
            if s_ < na:
                spk0.append([s_, na])
            s_ = max(s_, nb)
    if e_ - s_ > 0.05 and in_text(s_, e_):
        spk0.append([s_, e_])
# margens nas pontas de cada bloco do VAD (consoantes suaves)
PRE, POST = 0.05, 0.09
for r in spk0:
    r[0] = max(0.0, r[0] - PRE)
    r[1] = min(len(mono) / sr, r[1] + POST)
m0 = []
for r in spk0:
    if m0 and r[0] <= m0[-1][1]:
        m0[-1][1] = max(m0[-1][1], r[1])
    else:
        m0.append(list(r))
# Corte por silêncio verdadeiro em toda a fala (os limites do VAD incluem caudas
# silenciosas): os blocos passam a ser os trechos com texto, sem os ruídos isolados.
m0 = []
for sa_, sb_, _ in SEGS:
    if m0 and sa_ <= m0[-1][1] + 0.01:
        m0[-1][1] = max(m0[-1][1], sb_)
    else:
        m0.append([sa_, sb_])
# dentro de cada bloco só se corta silêncio verdadeiro (abaixo de DEAD_DB durante >= MIN_DEAD),
# deixando PAD de cada lado
dead = dbs < DEAD_DB
spk = []
for s_, e_ in m0:
    i0, i1 = int(s_ / 0.01), int(e_ / 0.01)
    cur = s_
    i = i0
    while i < i1:
        if dead[i]:
            j = i
            while j < i1 and dead[j]:
                j += 1
            if (j - i) * 0.01 >= MIN_DEAD:
                spk.append([cur, i * 0.01 + PAD])
                cur = j * 0.01 - PAD
            i = j
        else:
            i += 1
    spk.append([cur, e_])

# ——— política de pausas: encurta o silêncio do meio, mantém a respiração natural ———
def target_gap(g):
    if g >= 0.45:
        return 0.12
    if g >= 0.22:
        return 0.07
    return min(g, 0.04)

keep = []  # intervalos da fonte a manter
cur = [spk[0][0], spk[0][1]]
for nxt in spk[1:]:
    g = nxt[0] - cur[1]
    t = target_gap(g)
    if g <= t + 1e-6:
        cur[1] = nxt[1]
    else:
        cur[1] += t / 2
        keep.append(cur)
        cur = [nxt[0] - t / 2, nxt[1]]
keep.append(cur)

# quantiza ao fotograma (áudio e vídeo cortam exatamente no mesmo sítio)
kq = []
for s, e in keep:
    fs, fe = int(np.floor(s * FPS)), int(np.ceil(e * FPS))
    if kq and fs <= kq[-1][1]:
        kq[-1][1] = max(kq[-1][1], fe)
    else:
        kq.append([fs, fe])
cuts = []
dst = 0
for fs, fe in kq:
    cuts.append({"srcFrom": fs, "srcTo": fe, "dstFrom": dst})
    dst += fe - fs
total_frames = dst

def to_new(t):
    f = t * FPS
    for c in cuts:
        if c["srcFrom"] <= f <= c["srcTo"]:
            return (c["dstFrom"] + (f - c["srcFrom"])) / FPS
    # num corte: cola ao início do intervalo seguinte
    for c in cuts:
        if f < c["srcFrom"]:
            return c["dstFrom"] / FPS
    return total_frames / FPS

# ——— alinhamento de palavras: proporcional às sílabas no tempo com voz ———
def syl(w):
    w = w.lower()
    v = len(re.findall(r"[aeiouáéíóúâêôãõà]+", w))
    return max(1, v) + (0.4 if len(w) > 6 else 0)

words = []
for si, (sa, sb, text) in enumerate(SEGS):
    ws = text.split()
    fr = np.arange(int(sa / 0.01), min(n, int(sb / 0.01)))
    vf = fr[voiced[fr]]
    if len(vf) == 0:
        vf = fr
    # tempo "com voz" acumulado
    weights = np.array([syl(w) for w in ws], dtype=float)
    cum = np.concatenate([[0], np.cumsum(weights)]) / weights.sum()
    idx = np.clip((cum * (len(vf) - 1)).round().astype(int), 0, len(vf) - 1)
    for k, w in enumerate(ws):
        t0 = vf[idx[k]] * 0.01
        t1 = vf[idx[k + 1]] * 0.01 + 0.01 if k + 1 < len(ws) else vf[-1] * 0.01 + 0.01
        words.append({"text": w, "seg": si, "srcStart": round(t0, 3), "srcEnd": round(t1, 3), "start": round(to_new(t0), 3), "end": round(to_new(t1), 3)})

# ——— áudio editado com micro-fades em cada corte ———
FADE = int(0.012 * sr)
parts = []
for c in cuts:
    s0, s1 = int(c["srcFrom"] / FPS * sr), int(c["srcTo"] / FPS * sr)
    seg = a[s0:s1].copy()
    if len(seg) > 2 * FADE:
        ramp = np.linspace(0, 1, FADE)[:, None]
        seg[:FADE] *= ramp
        seg[-FADE:] *= ramp[::-1]
    parts.append(seg)
edited = np.concatenate(parts)
sf.write(f"{out}/voz_editada_raw.wav", edited, sr)

json.dump(
    {
        "fps": FPS,
        "totalFrames": total_frames,
        "cuts": cuts,
        "words": words,
        "sentences": [{"seg": i, "text": t, "start": round(to_new(a_), 3), "end": round(to_new(b_), 3)} for i, (a_, b_, t) in enumerate(SEGS)],
    },
    open(f"{out}/edit9.json", "w"),
    ensure_ascii=False,
    indent=1,
)
orig = len(mono) / sr
print(f"original {orig:.2f}s -> editado {total_frames / FPS:.2f}s | cortes {len(cuts)} | palavras {len(words)}")
gaps = [cuts[i + 1]["srcFrom"] - cuts[i]["srcTo"] for i in range(len(cuts) - 1)]
print("silêncio removido %.2fs" % (sum(gaps) / FPS))
