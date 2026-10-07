export const BASE = "https://emixiszao.github.io/quadro-owlbear/";
export const PD = "com.quadro.ordem/d/";      // um item de metadata por documento
export const PC = "com.quadro.ordem/c/";      // um item de metadata por linha de tricô
export const PM = "com.quadro.ordem/m/";      // um item de metadata por traço de marca-texto
export const CH_MOV = "com.quadro.ordem/mov";
export const MODAL_ID = "com.quadro.ordem/quadro";
export const STAGE_W = 1600, STAGE_H = 900, PIN_OFF = 16;

export const novoId = () => Math.random().toString(36).slice(2, 8);
export const tamanho = o => new Blob([JSON.stringify(o)]).size;
export const arred = (n, c = 1) => Math.round(n * 10 ** c) / 10 ** c;

/* Lê documentos e linhas da metadata da sala (inclui "lápides" com del:1). */
export function lerQuadro(meta) {
  const docs = [], cords = [], marks = [];
  for (const k of Object.keys(meta || {})) {
    const v = meta[k];
    if (!v || typeof v !== "object" || !v.id) continue;
    if (k.startsWith(PD)) docs.push(v);
    else if (k.startsWith(PC)) cords.push(v);
    else if (k.startsWith(PM)) marks.push(v);
  }
  return { docs, cords, marks };
}

/* Reaproveita o id de um item apagado (lápide) para a metadata não crescer. */
export function idLivre(lista) {
  const l = lista.find(v => v.del);
  return l ? l.id : novoId();
}

export const PIN_CORES = [["#e8453c", "#9c1f19"], ["#3b82f6", "#1d4ea8"], ["#f2c230", "#a5800c"], ["#3fae6a", "#1f6e40"]];
export function pinSVG(i) {
  const [c1, c2] = PIN_CORES[(i || 0) % PIN_CORES.length];
  return `<svg viewBox="0 0 24 24" width="24" height="24">
    <ellipse cx="14" cy="15" rx="8" ry="6" fill="rgba(0,0,0,.35)"/>
    <defs><radialGradient id="g${i}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
    <circle cx="12" cy="11" r="8" fill="url(#g${i})"/>
    <ellipse cx="9" cy="8" rx="2.6" ry="1.7" fill="rgba(255,255,255,.65)" transform="rotate(-30 9 8)"/>
  </svg>`;
}

export const MARCA_CORES = ["#ffe933", "#7be07a", "#ff8fc2", "#6fc3ff"];
