// packages/content/scripts/build-lead-zones.ts
//
// Builds lead-zone data (Zone A postal codes) for Pavimentos Albufera.
// Run from packages/content:
//   node --experimental-strip-types scripts/build-lead-zones.ts [--skip-nominatim]
//
// Input : data-raw/ES.txt  (GeoNames postal codes, tab-separated; see docs/zonas-cp.md)
// Output: src/data/lead-zones.ts, ../../docs/zonas-cp.csv, ../../docs/zonas-cp.md
//
// To change the zone: edit LEAD_ZONE_VERTICES below and re-run. Nothing else.

import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------- Types ----------
type LatLon = { lat: number; lon: number };
type Vertex = LatLon & { name: string; verified: boolean };
type Row = { place: string; municipality: string; province: string; lat: number | null; lon: number | null };

// ---------- Editable polygon (ordered, implicitly closed) ----------
// verified=true: coordinate taken from a cited source or a sea-closing point.
// verified=false: approximate; cross-checked against Nominatim at run time (warning only).
// Shape: rounded "half ellipse" by drive time from Sollana. Owner-measured times (Google Maps):
// Peñíscola 105 min, Utiel 60 min, Benidorm 73 min. Intermediate vertices are NOT time-verified.
export const LEAD_ZONE_VERTICES: Vertex[] = [
  { name: 'Peñíscola', lat: 40.35917, lon: 0.4075, verified: true },
  { name: 'Les Coves de Vinromà', lat: 40.309, lon: 0.115, verified: false },
  { name: "Vall d'Alba", lat: 40.176, lon: -0.035, verified: false },
  { name: 'Barracas', lat: 40.024, lon: -0.688, verified: false },
  { name: 'Chelva', lat: 39.749, lon: -0.998, verified: false },
  { name: 'Utiel', lat: 39.5694, lon: -1.20372, verified: true },
  { name: 'Venta del Moro', lat: 39.483, lon: -1.355, verified: false },
  { name: 'Cofrentes', lat: 39.233, lon: -1.061, verified: false },
  { name: 'Almansa', lat: 38.869, lon: -1.097, verified: false },
  { name: 'Villena', lat: 38.6318, lon: -0.861221, verified: true },
  { name: 'Castalla', lat: 38.597, lon: -0.672, verified: false },
  { name: 'Benidorm', lat: 38.5411, lon: -0.122494, verified: true },
  { name: 'Sea E of Cap de la Nau', lat: 38.7, lon: 0.4, verified: true },
  { name: 'Sea E of Peñíscola', lat: 40.359, lon: 0.55, verified: true },
];

// ---------- Constants ----------
const SOLLANA: LatLon = { lat: 39.278, lon: -0.383023 };
const SOLLANA_POSTAL_CODE = '46430';
const EARTH_RADIUS_KM = 6371;
const NEAR_BORDER_KM = 10;
const NOMINATIM_MAX_DRIFT_KM = 2;
const NOMINATIM_DELAY_MS = 1100; // Nominatim usage policy: max 1 request/second
const NOMINATIM_USER_AGENT = 'pavimentos-albufera-lead-zones/1.0 (build script)';
const KM_PER_DEG_LAT = 110.57;
const KM_PER_DEG_LON_EQUATOR = 111.32;
const ZONE_B_PREFIXES = ['03', '12', '46'] as const;
const CP_REGEX = /^(03|12|46)\d{3}$/;
const CODES_PER_LINE = 10;

const KEY_MUNICIPALITIES: { label: string; aliases: string[] }[] = [
  { label: 'Vinaròs', aliases: ['vinaros'] },
  { label: 'Benicarló', aliases: ['benicarlo'] },
  { label: 'Morella', aliases: ['morella'] },
  { label: 'Dénia', aliases: ['denia'] },
  { label: 'Xàbia', aliases: ['xabia', 'javea'] },
  { label: 'Calp', aliases: ['calp', 'calpe'] },
  { label: 'Moixent', aliases: ['moixent', 'mogente'] },
  { label: 'Ontinyent', aliases: ['ontinyent', 'onteniente'] },
  { label: 'Alcoi', aliases: ['alcoi', 'alcoy'] },
  { label: 'Villena', aliases: ['villena'] },
  { label: 'Requena', aliases: ['requena'] },
  { label: 'Chiva', aliases: ['chiva'] },
  { label: 'Buñol', aliases: ['bunol'] },
  { label: 'Xàtiva', aliases: ['xativa', 'jativa'] },
  { label: 'Gandia', aliases: ['gandia', 'gandía'] },
  { label: 'Segorbe', aliases: ['segorbe'] },
  { label: 'Castelló de la Plana', aliases: ['castello de la plana', 'castellon de la plana'] },
  { label: 'Sollana', aliases: ['sollana'] },
];

const ROOT = resolve(import.meta.dirname, '..');
const REPO = resolve(ROOT, '../..');
const SOURCE_FILE = resolve(ROOT, 'data-raw/ES.txt');
const OUT_DATA = resolve(ROOT, 'src/data/lead-zones.ts');
const OUT_CSV = resolve(REPO, 'docs/zonas-cp.csv');
const OUT_MD = resolve(REPO, 'docs/zonas-cp.md');

// ---------- Geometry (hand-written, no dependencies) ----------
const toRad = (deg: number) => (deg * Math.PI) / 180;

function haversineKm(a: LatLon, b: LatLon): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// Ray casting in lat/lon space.
function pointInPolygon(p: LatLon, poly: LatLon[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    const crosses = a.lat > p.lat !== b.lat > p.lat;
    if (crosses && p.lon < ((b.lon - a.lon) * (p.lat - a.lat)) / (b.lat - a.lat) + a.lon) inside = !inside;
  }
  return inside;
}

// Signed distance (km) to the nearest polygon side: negative inside, positive outside.
// Local equirectangular projection; accurate enough at this scale (<150 km).
function signedBorderDistanceKm(p: LatLon, poly: LatLon[]): number {
  const kmPerDegLon = Math.cos(toRad(p.lat)) * KM_PER_DEG_LON_EQUATOR;
  const project = (v: LatLon): [number, number] => [v.lon * kmPerDegLon, v.lat * KM_PER_DEG_LAT];
  const [px, py] = project(p);
  let min = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = project(poly[j]);
    const [bx, by] = project(poly[i]);
    const dx = bx - ax;
    const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
    min = Math.min(min, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)));
  }
  return pointInPolygon(p, poly) ? -min : min;
}

// ---------- Helpers ----------
const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
const csvCell = (v: string | number | null) => (v === null ? '' : `"${String(v).replaceAll('"', '""')}"`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const round = (n: number, d = 1) => n.toFixed(d);

// ---------- Vertex cross-check (warning only; never aborts) ----------
async function checkVertices(): Promise<string[]> {
  const notes: string[] = [];
  if (process.argv.includes('--skip-nominatim')) return ['Nominatim check skipped (--skip-nominatim).'];
  for (const v of LEAD_ZONE_VERTICES.filter((x) => !x.verified)) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=es&q=${encodeURIComponent(`${v.name}, España`)}`;
      const res = await fetch(url, { headers: { 'User-Agent': NOMINATIM_USER_AGENT } });
      const hits = (await res.json()) as { lat: string; lon: string }[];
      if (!hits[0]) {
        notes.push(`${v.name}: no Nominatim result (not verified).`);
      } else {
        const drift = haversineKm(v, { lat: Number(hits[0].lat), lon: Number(hits[0].lon) });
        notes.push(
          drift > NOMINATIM_MAX_DRIFT_KM
            ? `${v.name}: WARNING ${round(drift)} km away from Nominatim (${hits[0].lat}, ${hits[0].lon}). Review.`
            : `${v.name}: OK (${round(drift)} km from Nominatim).`,
        );
      }
    } catch (err) {
      notes.push(`${v.name}: Nominatim unreachable (${(err as Error).message}). Not verified.`);
    }
    await sleep(NOMINATIM_DELAY_MS);
  }
  return notes;
}

// ---------- Load GeoNames (columns: 0 country, 1 cp, 2 place, 5 province, 7 municipality, 9 lat, 10 lon) ----------
function loadPostalCodes(): Map<string, Row[]> {
  const byCp = new Map<string, Row[]>();
  for (const line of readFileSync(SOURCE_FILE, 'utf8').split('\n')) {
    const f = line.split('\t');
    const cp = f[1];
    if (!cp || !CP_REGEX.test(cp)) continue;
    const lat = Number(f[9]);
    const lon = Number(f[10]);
    const row: Row = {
      place: f[2] ?? '',
      municipality: f[7] ?? '',
      province: f[5] ?? '',
      lat: Number.isFinite(lat) && f[9] !== '' ? lat : null,
      lon: Number.isFinite(lon) && f[10] !== '' ? lon : null,
    };
    byCp.set(cp, [...(byCp.get(cp) ?? []), row]);
  }
  return byCp;
}

// ---------- Main ----------
const vertexNotes = await checkVertices();
const polygon: LatLon[] = LEAD_ZONE_VERTICES.map(({ lat, lon }) => ({ lat, lon }));
const byCp = loadPostalCodes();
const downloadDate = statSync(SOURCE_FILE).mtime.toISOString().slice(0, 10);

type CpResult = {
  cp: string; zone: 'A' | 'B'; places: string; municipality: string; province: string;
  lat: number | null; lon: number | null; kmToSollana: number | null; borderKm: number | null; mixed: boolean;
};
const results: CpResult[] = [];
const notGeolocated: string[] = [];

for (const cp of [...byCp.keys()].sort()) {
  const rows = byCp.get(cp)!;
  const geo = rows.filter((r): r is Row & LatLon => r.lat !== null && r.lon !== null);
  if (geo.length === 0) notGeolocated.push(cp);
  const flags = geo.map((r) => pointInPolygon(r, polygon));
  const isA = flags.some(Boolean);
  const mixed = isA && flags.some((f) => !f); // some localities in, some out -> accepted as A
  const ref = geo[flags.indexOf(true)] ?? geo[0] ?? null;
  results.push({
    cp,
    zone: isA ? 'A' : 'B',
    places: [...new Set(rows.map((r) => r.place))].join('; '),
    municipality: rows[0].municipality,
    province: rows[0].province,
    lat: ref?.lat ?? null,
    lon: ref?.lon ?? null,
    kmToSollana: ref ? haversineKm(ref, SOLLANA) : null,
    borderKm: ref ? signedBorderDistanceKm(ref, polygon) : null,
    mixed,
  });
}

const zoneA = results.filter((r) => r.zone === 'A').map((r) => r.cp);
const zoneBCount = results.length - zoneA.length;

// Municipality centroids (mean of geolocated rows) for the near-border and key-municipality reports.
const muniPoints = new Map<string, { name: string; pts: LatLon[] }>();
for (const rows of byCp.values()) {
  for (const r of rows) {
    if (r.lat === null || r.lon === null) continue;
    const key = normalize(r.municipality || r.place);
    const entry = muniPoints.get(key) ?? { name: r.municipality || r.place, pts: [] };
    entry.pts.push({ lat: r.lat, lon: r.lon });
    muniPoints.set(key, entry);
  }
}
const munis = [...muniPoints.entries()].map(([key, { name, pts }]) => {
  const c = { lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length, lon: pts.reduce((s, p) => s + p.lon, 0) / pts.length };
  return { key, name, borderKm: signedBorderDistanceKm(c, polygon) };
});
const nearBorder = munis.filter((m) => Math.abs(m.borderKm) < NEAR_BORDER_KM).sort((a, b) => a.borderKm - b.borderKm);

// ---------- Write src/data/lead-zones.ts ----------
const codeLines: string[] = [];
for (let i = 0; i < zoneA.length; i += CODES_PER_LINE) {
  codeLines.push('  ' + zoneA.slice(i, i + CODES_PER_LINE).map((c) => `'${c}'`).join(', ') + ',');
}
writeFileSync(
  OUT_DATA,
  `// generated by build-lead-zones.ts, do not edit
// Source: GeoNames postal codes (CC BY 4.0), downloaded ${downloadDate}. Server-only module.

/** Ordered polygon vertices (implicitly closed). Rounded shape by drive time from Sollana. */
export const LEAD_ZONE_POLYGON = ${JSON.stringify(
    LEAD_ZONE_VERTICES.map(({ name, lat, lon }) => ({ name, lat, lon })),
    null,
    2,
  )} as const;

/** Zone A postal codes: any surface accepted. Sorted, 5-digit strings. */
export const ZONE_A_POSTAL_CODES: readonly string[] = [
${codeLines.join('\n')}
];

/** Zone B: Comunitat Valenciana postal prefixes not in Zone A. */
export const ZONE_B_PREFIXES = ${JSON.stringify(ZONE_B_PREFIXES)} as const;

/** Minimum surface (m2) accepted in Zone B. */
export const ZONE_B_MIN_M2 = 500;

/** Minimum surface (m2) accepted in Zone C (rest of Spain). */
export const ZONE_C_MIN_M2 = 1000;

/** Valid Spanish province prefixes (01-52). */
export const VALID_PROVINCE_RANGE = { min: 1, max: 52 } as const;
`,
);

// ---------- Write docs/zonas-cp.csv ----------
const csvHeader = 'cp,zona,localidades,municipio,provincia,lat,lon,km_linea_recta_a_Sollana,distancia_al_borde_km,mixto';
const csvRows = results.map((r) =>
  [
    r.cp, r.zone, csvCell(r.places), csvCell(r.municipality), csvCell(r.province),
    r.lat ?? '', r.lon ?? '',
    r.kmToSollana === null ? '' : round(r.kmToSollana),
    r.borderKm === null ? '' : round(r.borderKm),
    r.mixed ? 'sí' : 'no',
  ].join(','),
);
writeFileSync(OUT_CSV, [csvHeader, ...csvRows].join('\n') + '\n');

// ---------- Write docs/zonas-cp.md ----------
const keyStatus = KEY_MUNICIPALITIES.map(({ label, aliases }) => {
  const found = munis.find((m) => aliases.some((a) => m.key === normalize(a)));
  if (!found) return `| ${label} | no encontrado en la fuente | — |`;
  return `| ${label} | ${found.borderKm < 0 ? 'Dentro (A)' : 'Fuera (B)'} | ${round(found.borderKm)} |`;
});
const md = `# Zonas por código postal (Comunitat Valenciana)

Generado por \`packages/content/scripts/build-lead-zones.ts\` el ${new Date().toISOString().slice(0, 10)}. No editar a mano.

## Metodología
- Zona A: CP cuyo centroide cae dentro del polígono de vértices (ray casting en lat/lon). Si un CP tiene varias localidades y alguna cae dentro, es A (caso mixto, ante la duda se acepta más).
- Zona B: resto de CP con prefijo ${ZONE_B_PREFIXES.join(', ')}. Zona C: resto de España (no se lista).
- Forma del polígono: redondeada, por tiempo de coche desde Sollana. Tiempos medidos por el dueño (Google Maps): Peñíscola 105 min, Utiel 60 min, Benidorm 73 min. **Los vértices intermedios no están verificados por tiempo**; se pueden mejorar editando \`LEAD_ZONE_VERTICES\` y volviendo a ejecutar el script.
- \`distancia_al_borde_km\`: al lado más cercano del polígono; negativa si el CP está dentro. Proyección local equirrectangular.

## Fuentes y licencias
- GeoNames postal codes (ES.zip), licencia CC BY 4.0 (© GeoNames), datos "as is". Fecha de descarga: ${downloadDate}. Las coordenadas pueden ser interpoladas o aproximadas: los CP cercanos al borde conviene contrastarlos con CartoCiudad (IGN, CC BY 4.0).
- Coordenadas de vértices: Peñíscola (Wikipedia), Utiel, Villena y Benidorm (distanciasentreciudades.com); resto aproximadas y contrastadas con Nominatim/OSM (ODbL) al ejecutar.
- Correos no publica base abierta; no se ha usado.

## Vértices (en orden)
| # | Vértice | lat | lon | Coordenada |
|---|---|---|---|---|
${LEAD_ZONE_VERTICES.map((v, i) => `| ${i + 1} | ${v.name} | ${v.lat} | ${v.lon} | ${v.verified ? 'verificada / punto marino' : 'aproximada'} |`).join('\n')}

### Contraste con Nominatim
${vertexNotes.map((n) => `- ${n}`).join('\n')}

## Recuento de CP
- Zona A: ${zoneA.length}
- Zona B: ${zoneBCount}
- Total CP Comunitat Valenciana en la fuente: ${results.length}

## Municipios a menos de ${NEAR_BORDER_KM} km del borde (negativo = dentro)
Centroide municipal = media de las coordenadas GeoNames del municipio.

| Municipio | Distancia al borde (km) | Estado |
|---|---|---|
${nearBorder.map((m) => `| ${m.name} | ${round(m.borderKm)} | ${m.borderKm < 0 ? 'Dentro' : 'Fuera'} |`).join('\n')}

## Estado de municipios clave
| Municipio | Estado | Distancia al borde (km) |
|---|---|---|
${keyStatus.join('\n')}

## CP mixtos (alguna localidad dentro, otra fuera; clasificados A)
${results.filter((r) => r.mixed).map((r) => `- ${r.cp}: ${r.places}`).join('\n') || '- Ninguno'}

## CP sin geolocalizar (clasificados B por defecto; revisar)
${notGeolocated.map((c) => `- ${c}`).join('\n') || '- Ninguno'}
`;
writeFileSync(OUT_MD, md);

// ---------- Guardrail: the three owner-defined anchors must be Zone A ----------
console.log(`Zone A: ${zoneA.length} | Zone B: ${zoneBCount} | total: ${results.length} | not geolocated: ${notGeolocated.length}`);
if (!zoneA.includes(SOLLANA_POSTAL_CODE)) {
  throw new Error(`Sanity check failed: ${SOLLANA_POSTAL_CODE} (Sollana) is not in Zone A.`);
}
