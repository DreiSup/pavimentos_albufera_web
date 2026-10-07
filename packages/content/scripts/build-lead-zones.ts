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
type Row = {
  place: string; municipality: string; ineCode: string; province: string;
  lat: number | null; lon: number | null; accuracy: number;
};

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

// ---------- Forced Zone A postal codes ----------
// Owner decision (2026-10-07): a municipality used as a vertex sits ON the border, so its own
// postal codes can fall a few hundred metres outside the polygon (Benidorm did). Every Comunitat
// Valenciana vertex municipality is forced into Zone A, plus Vinaròs and Benicarló (owner request).
// Almansa is a vertex but belongs to Albacete (prefix 02): it stays Zone C by design.
// Codes taken from the GeoNames source; the build fails if one of them is missing there.
const FORCE_ZONE_A_POSTAL_CODES: Record<string, string[]> = {
  'Peñíscola': ['12598'],
  'Les Coves de Vinromà': ['12185'],
  "Vall d'Alba": ['12190', '12193', '12194'],
  Barracas: ['12420'],
  Chelva: ['46176', '46351'],
  Utiel: ['46300', '46312', '46313', '46321'],
  'Venta del Moro': ['46310', '46311'],
  Cofrentes: ['46625'],
  Villena: ['03400', '03408', '03639'],
  Castalla: ['03420'],
  Benidorm: ['03500', '03501', '03502', '03503', '03508'],
  'Vinaròs': ['12500'],
  'Benicarló': ['12580'],
};

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
// GeoNames accuracy: 1 = estimated, 3/4 = place-level. Accuracy-1 points are often defaults or
// plainly wrong (e.g. 03540 'Cabo De Las Huertas' sits in the sea off Benidorm), so they never
// decide a zone on their own: such a CP falls back to its municipality's reliable points.
const MIN_RELIABLE_ACCURACY = 3;

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
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const medianPoint = (pts: LatLon[]): LatLon => ({ lat: median(pts.map((p) => p.lat)), lon: median(pts.map((p) => p.lon)) });
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

// ---------- Load GeoNames (columns: 0 country, 1 cp, 2 place, 5 province, 7 municipality, 8 INE code, 9 lat, 10 lon, 11 accuracy) ----------
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
      ineCode: f[8] ?? '',
      province: f[5] ?? '',
      lat: Number.isFinite(lat) && f[9] !== '' ? lat : null,
      lon: Number.isFinite(lon) && f[10] !== '' ? lon : null,
      accuracy: Number(f[11]) || 0,
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

const forcedCodes = new Set(Object.values(FORCE_ZONE_A_POSTAL_CODES).flat());
const missingForced = [...forcedCodes].filter((cp) => !byCp.has(cp));
if (missingForced.length > 0) {
  throw new Error(`FORCE_ZONE_A_POSTAL_CODES not found in the source: ${missingForced.join(', ')}`);
}

type GeoRow = Row & LatLon;
const isGeo = (r: Row): r is GeoRow => r.lat !== null && r.lon !== null;

// Reliable points per municipality (INE code), used when a CP only has estimated points.
const reliableByMunicipality = new Map<string, GeoRow[]>();
for (const rows of byCp.values()) {
  for (const r of rows) {
    if (!isGeo(r) || r.accuracy < MIN_RELIABLE_ACCURACY || !r.ineCode) continue;
    reliableByMunicipality.set(r.ineCode, [...(reliableByMunicipality.get(r.ineCode) ?? []), r]);
  }
}

type CpResult = {
  cp: string; zone: 'A' | 'B'; places: string; municipality: string; province: string;
  lat: number | null; lon: number | null; kmToSollana: number | null; borderKm: number | null;
  mixed: boolean; forced: boolean; estimated: boolean;
};
const results: CpResult[] = [];
const notGeolocated: string[] = [];

// A CP is placed at the median of its most accurate points (a median, not "any point inside":
// one misplaced locality must not drag a whole city into Zone A, as it did with 03540 Alicante).
for (const cp of [...byCp.keys()].sort()) {
  const rows = byCp.get(cp)!;
  const geo = rows.filter(isGeo);
  if (geo.length === 0) notGeolocated.push(cp);
  const best = Math.max(0, ...geo.map((r) => r.accuracy));
  let pts: LatLon[] = geo.filter((r) => r.accuracy === best);
  const estimated = geo.length > 0 && best < MIN_RELIABLE_ACCURACY;
  if (estimated) {
    const ine = rows.find((r) => r.ineCode)?.ineCode;
    const fallback = ine ? reliableByMunicipality.get(ine) : undefined;
    if (fallback?.length) pts = fallback;
  }
  const ref = pts.length > 0 ? medianPoint(pts) : null;
  const inside = ref ? pointInPolygon(ref, polygon) : false;
  const forced = forcedCodes.has(cp);
  const reliable = geo.filter((r) => r.accuracy >= MIN_RELIABLE_ACCURACY).map((r) => pointInPolygon(r, polygon));
  results.push({
    cp,
    zone: inside || forced ? 'A' : 'B',
    places: [...new Set(rows.map((r) => r.place))].join('; '),
    municipality: rows.find((r) => r.municipality)?.municipality ?? '',
    province: rows[0].province,
    lat: ref?.lat ?? null,
    lon: ref?.lon ?? null,
    kmToSollana: ref ? haversineKm(ref, SOLLANA) : null,
    borderKm: ref ? signedBorderDistanceKm(ref, polygon) : null,
    // Reliable localities on both sides of the border: informational, for human review.
    mixed: reliable.includes(true) && reliable.includes(false),
    forced,
    estimated,
  });
}

const zoneA = results.filter((r) => r.zone === 'A').map((r) => r.cp);
const zoneBCount = results.length - zoneA.length;

// ---------- Guardrail (before writing anything) ----------
if (!zoneA.includes(SOLLANA_POSTAL_CODE)) {
  throw new Error(`Sanity check failed: ${SOLLANA_POSTAL_CODE} (Sollana) is not in Zone A.`);
}

// Municipality centroids (mean of geolocated rows) for the near-border and key-municipality reports.
const muniPoints = new Map<string, { name: string; pts: LatLon[] }>();
for (const rows of byCp.values()) {
  for (const r of rows) {
    if (r.lat === null || r.lon === null || r.accuracy < MIN_RELIABLE_ACCURACY) continue;
    const key = r.ineCode || normalize(r.municipality || r.place);
    const entry = muniPoints.get(key) ?? { name: r.municipality || r.place, pts: [] };
    entry.pts.push({ lat: r.lat, lon: r.lon });
    muniPoints.set(key, entry);
  }
}
const munis = [...muniPoints.entries()].map(([key, { name, pts }]) => ({
  key,
  name,
  borderKm: signedBorderDistanceKm(medianPoint(pts), polygon),
}));
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
const csvHeader = 'cp,zona,localidades,municipio,provincia,lat,lon,km_linea_recta_a_Sollana,distancia_al_borde_km,mixto,forzado,coordenada_estimada';
const csvRows = results.map((r) =>
  [
    r.cp, r.zone, csvCell(r.places), csvCell(r.municipality), csvCell(r.province),
    r.lat ?? '', r.lon ?? '',
    r.kmToSollana === null ? '' : round(r.kmToSollana),
    r.borderKm === null ? '' : round(r.borderKm),
    r.mixed ? 'sí' : 'no',
    r.forced ? 'sí' : 'no',
    r.estimated ? 'sí' : 'no',
  ].join(','),
);
writeFileSync(OUT_CSV, [csvHeader, ...csvRows].join('\n') + '\n');

// ---------- Write docs/zonas-cp.md ----------
// Matched on the place name and on every '/'-separated variant of the municipality name
// (GeoNames writes 'Calp / Calpe', 'Mogente/Moixent'...). Reported per CP, not per centroid:
// the CP is what the form classifies.
const nameVariants = (s: string) => s.split('/').map(normalize).filter(Boolean);
const keyStatus = KEY_MUNICIPALITIES.map(({ label, aliases }) => {
  const hits = results.filter((r) =>
    byCp.get(r.cp)!.some((row) => [normalize(row.place), ...nameVariants(row.municipality)].some((n) => aliases.includes(n))),
  );
  if (hits.length === 0) return `| ${label} | no encontrado en la fuente | — |`;
  const cps = hits.map((r) => `${r.cp} ${r.zone}${r.forced ? ' (forzado)' : ''}`).join(', ');
  return `| ${label} | ${cps} | ${hits.map((r) => (r.borderKm === null ? '—' : round(r.borderKm))).join(', ')} |`;
});
const md = `# Zonas por código postal (Comunitat Valenciana)

Generado por \`packages/content/scripts/build-lead-zones.ts\` el ${new Date().toISOString().slice(0, 10)}. No editar a mano.

## Metodología
- Zona A: CP cuyo punto representativo cae dentro del polígono (ray casting en lat/lon), más los CP forzados (municipios vértice, Vinaròs y Benicarló).
- Punto representativo de un CP: mediana de sus localidades con la mejor precisión GeoNames. Si solo tiene puntos estimados (precisión < ${MIN_RELIABLE_ACCURACY}), mediana de los puntos fiables de su municipio (código INE). Se descartó «si alguna localidad cae dentro, es A»: con coordenadas erróneas de GeoNames metía 03540 (Alicante) y 03550 (Sant Joan d'Alacant) en Zona A.
- Zona B: resto de CP con prefijo ${ZONE_B_PREFIXES.join(', ')}. Zona C: resto de España (no se lista).
- Forma del polígono: redondeada, por tiempo de coche desde Sollana. Tiempos medidos por el dueño (Google Maps): Peñíscola 105 min, Utiel 60 min, Benidorm 73 min. **Los vértices intermedios no están verificados por tiempo**; se pueden mejorar editando \`LEAD_ZONE_VERTICES\` y volviendo a ejecutar el script.
- \`distancia_al_borde_km\`: al lado más cercano del polígono; negativa si el CP está dentro. Proyección local equirrectangular.

## Fuentes y licencias
- GeoNames postal codes (ES.zip), licencia CC BY 4.0 (© GeoNames), datos "as is". Fecha de descarga: ${downloadDate}. Las coordenadas pueden ser interpoladas o aproximadas: los CP cercanos al borde conviene contrastarlos con CartoCiudad (IGN, CC BY 4.0).
- Coordenadas de vértices: Peñíscola (Wikipedia), Utiel, Villena y Benidorm (distanciasentreciudades.com); resto aproximadas y contrastadas con Nominatim/OSM (ODbL) al ejecutar.
- Correos no publica base abierta; no se ha usado.
- Cómo regenerar: descargar https://download.geonames.org/export/zip/ES.zip, descomprimir \`ES.txt\` en \`packages/content/data-raw/\` (ignorado por git; conservar la fecha del archivo, \`cp -p\`) y ejecutar desde \`packages/content\`: \`node --experimental-strip-types scripts/build-lead-zones.ts\`.
- Contraste de vértices con Nominatim: en este entorno la red lo bloquea; se generó con \`--skip-nominatim\`.

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
Centroide municipal = mediana de las coordenadas GeoNames fiables (precisión ≥ ${MIN_RELIABLE_ACCURACY}) del municipio. Un municipio fuera puede tener CP forzados a A (ver más abajo).

| Municipio | Distancia al borde (km) | Estado |
|---|---|---|
${nearBorder.map((m) => `| ${m.name} | ${round(m.borderKm)} | ${m.borderKm < 0 ? 'Dentro' : 'Fuera'} |`).join('\n')}

## Estado de municipios clave
| Municipio | CP y zona | Distancia al borde (km) |
|---|---|---|
${keyStatus.join('\n')}

## CP forzados a Zona A
${Object.entries(FORCE_ZONE_A_POSTAL_CODES).map(([name, cps]) => `- ${name}: ${cps.map((cp) => `${cp}${results.find((r) => r.cp === cp)?.borderKm! > 0 ? ' (fuera del polígono)' : ''}`).join(', ')}`).join('\n')}
- Almansa (vértice) es de Albacete, prefijo 02: queda en Zona C a propósito.

## CP mixtos (localidades fiables a ambos lados del borde; se clasifican por la mediana)
${results.filter((r) => r.mixed).map((r) => `- ${r.cp} (${r.zone}): ${r.places}`).join('\n') || '- Ninguno'}

## CP con coordenadas solo estimadas (precisión < ${MIN_RELIABLE_ACCURACY}; se usa la posición fiable de su municipio)
${results.filter((r) => r.estimated).map((r) => `- ${r.cp} (${r.zone}): ${r.municipality || r.places}`).join('\n') || '- Ninguno'}

## CP sin geolocalizar (clasificados B por defecto; revisar)
${notGeolocated.map((c) => `- ${c}`).join('\n') || '- Ninguno'}
`;
writeFileSync(OUT_MD, md);

console.log(`Zone A: ${zoneA.length} (forced ${forcedCodes.size}) | Zone B: ${zoneBCount} | total: ${results.length} | not geolocated: ${notGeolocated.length}`);
