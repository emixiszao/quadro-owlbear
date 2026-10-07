export const BASE = "https://emixiszao.github.io/quadro-owlbear/";
export const PD = "com.quadro.ordem/d/";      // um item de metadata por documento
export const PC = "com.quadro.ordem/c/";      // um item de metadata por linha de tricô
export const PM = "com.quadro.ordem/m/";      // um item de metadata por traço de marca-texto
export const CH_MOV = "com.quadro.ordem/mov";
export const CH_FITA = "com.quadro.ordem/fita";
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

/* ---------- fitas / gravadores ---------- */
export const FITAS = {
  cassete:  { w: 230, ar: 0.633, nome: "Fita cassete" },
  vhs:      { w: 280, ar: 0.553, nome: "Fita VHS" },
  gravador: { w: 120, ar: 1.9,   nome: "Gravador de voz" }
};
const escXml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FONTE = "Caveat,'Segoe Script','Bradley Hand',cursive";
function carretel(cx, cy, r) {
  const raios = [0, 60, 120, 180, 240, 300].map(a => `<rect x="${cx - 2}" y="${cy - r + 2}" width="4" height="${(r * 0.55).toFixed(1)}" rx="2" fill="#2c2c2c" transform="rotate(${a} ${cx} ${cy})"/>`).join("");
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e6e6e6" stroke="#8a8a8a" stroke-width="1.5"/><g class="reel">${raios}<circle cx="${cx}" cy="${cy}" r="${(r * 0.32).toFixed(1)}" fill="#bdbdbd" stroke="#555"/></g>`;
}
function rotuloSVG(txt, x, y, max, tam) {
  const n = String(txt).length, t = Math.max(15, Math.min(tam, tam - (n - max) * 1.3));
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${FONTE}" font-weight="700" font-size="${t.toFixed(0)}" fill="#1c1c1c">${escXml(txt)}</text>`;
}
export function fitaSVG(estilo, rotulo, u) {
  rotulo = rotulo || "Gravação";
  if (estilo === "vhs") return `<svg viewBox="0 0 380 210" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="374" height="204" rx="9" fill="#18181b" stroke="#050505" stroke-width="3"/>
    <rect x="22" y="12" width="336" height="11" rx="3" fill="#26262b"/>
    <rect x="44" y="32" width="292" height="88" rx="4" fill="#f1ede0"/>
    <rect x="44" y="32" width="24" height="88" rx="4" fill="#c8352c"/>
    <text x="82" y="54" font-family="Arial,sans-serif" font-weight="900" font-size="15" fill="#333">VHS</text>
    <text x="320" y="54" text-anchor="end" font-family="Arial,sans-serif" font-size="11" fill="#777">T-120</text>
    <line x1="80" y1="66" x2="326" y2="66" stroke="#cfc6aa"/><line x1="80" y1="90" x2="326" y2="90" stroke="#cfc6aa"/><line x1="80" y1="112" x2="326" y2="112" stroke="#cfc6aa"/>
    ${rotuloSVG(rotulo, 203, 98, 16, 34)}
    <rect x="96" y="132" width="188" height="64" rx="32" fill="#0a0a0b" stroke="#3d3d42" stroke-width="2"/>
    ${carretel(144, 164, 24)}${carretel(236, 164, 24)}
  </svg>`;
  if (estilo === "gravador") return `<svg viewBox="0 0 150 285" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="gb${u}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#7d8086"/><stop offset=".5" stop-color="#c6c9cf"/><stop offset="1" stop-color="#74777d"/></linearGradient></defs>
    <rect x="6" y="4" width="138" height="277" rx="26" fill="url(#gb${u})" stroke="#383a3f" stroke-width="3"/>
    ${[0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => `<circle cx="${45 + c * 15}" cy="${26 + r * 12}" r="2.6" fill="#3b3d42"/>`).join("")).join("")}
    <rect x="24" y="80" width="102" height="46" rx="6" fill="#1d2a1c" stroke="#2c3a2a" stroke-width="2"/>
    <circle class="luz-rec" cx="38" cy="96" r="5" fill="#ff3b30"/>
    <text x="50" y="100" font-family="monospace" font-size="12" fill="#8be28b">REC</text>
    ${[0, 1, 2, 3, 4].map(i => `<rect class="eq" style="animation-delay:${i * 0.11}s" x="${40 + i * 14}" y="106" width="8" height="16" fill="#8be28b"/>`).join("")}
    <rect x="22" y="138" width="106" height="52" rx="4" fill="#f3ead2"/>
    ${rotuloSVG(rotulo, 75, 171, 9, 26)}
    <circle cx="45" cy="224" r="16" fill="#b8312a" stroke="#6e1b17" stroke-width="2"/><circle cx="45" cy="224" r="6" fill="#ffb3ad"/>
    <circle cx="75" cy="224" r="16" fill="#2f6b3a" stroke="#183b20" stroke-width="2"/><polygon points="70,216 70,232 83,224" fill="#e8f5e9"/>
    <circle cx="105" cy="224" r="16" fill="#3a3a3e" stroke="#18181a" stroke-width="2"/><rect x="98" y="217" width="14" height="14" fill="#e9e9e9"/>
    ${[0, 1, 2, 3].map(i => `<line x1="38" y1="${252 + i * 7}" x2="112" y2="${252 + i * 7}" stroke="#55585e" stroke-width="3" stroke-linecap="round"/>`).join("")}
  </svg>`;
  return `<svg viewBox="0 0 300 190" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="cb${u}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a3a3f"/><stop offset="1" stop-color="#1b1b1e"/></linearGradient></defs>
    <rect x="3" y="3" width="294" height="184" rx="13" fill="url(#cb${u})" stroke="#0b0b0c" stroke-width="3"/>
    <rect x="22" y="16" width="256" height="92" rx="6" fill="#f3ead2"/>
    <rect x="22" y="16" width="256" height="22" rx="6" fill="#c8352c"/><rect x="22" y="30" width="256" height="8" fill="#c8352c"/>
    <line x1="34" y1="62" x2="266" y2="62" stroke="#cdbf9c"/><line x1="34" y1="82" x2="266" y2="82" stroke="#cdbf9c"/><line x1="34" y1="100" x2="266" y2="100" stroke="#cdbf9c"/>
    ${rotuloSVG(rotulo, 150, 80, 14, 34)}
    <rect x="78" y="116" width="144" height="50" rx="25" fill="#0d0d0f" stroke="#4a4a50" stroke-width="2"/>
    ${carretel(112, 141, 18)}${carretel(188, 141, 18)}
    <polygon points="62,187 78,170 222,170 238,187" fill="#101012"/>
    ${[[16, 16], [284, 16], [16, 174], [284, 174]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#58585e"/>`).join("")}
  </svg>`;
}
