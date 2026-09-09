import { boundsToWKT, parseWKTToGeoJSON } from './wkt';

// Offline fallback for the SAR scene catalog. Mirrors the ASF asf_search
// response shape documented in read/readit.txt so the UI keeps working
// before the backend is deployed.
const DEFAULT_BOUNDS = [
  [36.0, -122.3],
  [38.0, -119.5],
];

const pad = (n) => String(n).padStart(2, '0');

function toFileName(sceneName, orbitHex, stop) {
  const d = new Date(stop);
  const stamp =
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
  return `S1A_IW_GRDH_1SDV_${sceneName.slice(17)}_${stamp}_${orbitHex}`;
}

function makeScene(date, index, wkt, geometry) {
  const start = new Date(date);
  const stop = new Date(start.getTime() + 25 * 1000);
  const platform = index % 2 === 0 ? 'Sentinel-1A' : 'Sentinel-1B';
  const flightDirection = index % 2 === 0 ? 'ASCENDING' : 'DESCENDING';
  const orbit = 50400 + index * 12;
  const orbitHex = orbit.toString(16).toUpperCase().padStart(6, '0');
  const pathNumber = 42 + (index % 6);
  const frameNumber = 125 + index;
  const sceneName = `S1A_IW_GRDH_1SDV_${start.toISOString().slice(0, 19).replace(/[-:]/g, '')}`;
  const fileID = `${sceneName}_${stop.toISOString().slice(0, 19).replace(/[-:]/g, '')}_${orbitHex}_${pathNumber.toString().padStart(5, '0')}_E1C2` + (index % 2 === 0 ? '-V' : '-VH');
  const bytes = 786432000 + (index * 100663296) % 419430400;
  return {
    fileID,
    sceneName,
    platform,
    sensor: 'C-SAR',
    processingLevel: 'GRD',
    beamModeType: 'IW',
    polarization: 'VV+VH',
    startTime: start.toISOString(),
    stopTime: stop.toISOString(),
    flightDirection,
    orbit,
    pathNumber,
    frameNumber,
    bytes,
    url: `https://datapool.asf.alaska.edu/GRD_HD/SA/${toFileName(sceneName, orbitHex, stop)}.zip`,
    pgeVersion: '003.61',
    granuleType: `SENTINEL_${platform.replace('Sentinel-', '').replace('1A', '1A').replace('1B', '1B')}_FRAME`,
    geometry,
    geometryWKT: wkt,
  };
}

export function mockSARCatalog(query = {}) {
  const {
    wkt,
    bounds = DEFAULT_BOUNDS,
    startDate,
    endDate,
    maxResults = 20,
  } = query;

  const geometry = wkt ? parseWKTToGeoJSON(wkt) : [[...boundsToWKT(bounds)]];

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate
    ? new Date(startDate)
    : new Date(end.getTime() - 180 * 24 * 60 * 60 * 1000);

  const scenes = [];
  const step = 12 * 24 * 60 * 60 * 1000;
  let index = 0;
  for (let t = start.getTime(); t <= end.getTime() && index < maxResults; t += step, index += 1) {
    scenes.push(makeScene(t, index, wkt, geometry));
  }
  return scenes.sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
}