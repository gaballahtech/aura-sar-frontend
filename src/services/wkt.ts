export type Bounds = [[number, number], [number, number]];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function boundsToWKT(bounds: Bounds): string {
  const [southWest, northEast] = bounds;
  const south = clamp(Math.min(southWest[0], northEast[0]), -90, 90);
  const north = clamp(Math.max(southWest[0], northEast[0]), -90, 90);
  const west = clamp(Math.min(southWest[1], northEast[1]), -180, 180);
  const east = clamp(Math.max(southWest[1], northEast[1]), -180, 180);
  const points = [
    [west, south],
    [east, south],
    [east, north],
    [west, north],
    [west, south],
  ];
  const ring = points.map((p) => p.join(' ')).join(', ');
  return `POLYGON ((${ring}))`;
}

export function parseWKTToGeoJSON(wkt: string): number[][][] {
  const match = wkt.match(/\(\(([^)]+)\)\)/);
  if (!match) return [];
  return [
    match[1].split(',').map((pair) => {
      const [lng, lat] = pair.trim().split(/\s+/).map(Number);
      return [lng, lat];
    }),
  ];
}