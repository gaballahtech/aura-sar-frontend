# AURA SAR — Backend / API Requirements

> Status: the frontend data layer is **live-ready**. This file lists exactly what the
> backend (`VITE_API_BASE_URL`, default `http://localhost:3001/api`) must implement,
> what already works without it, and what is still missing.

---

## 1. What the frontend already does WITHOUT a backend (working today)

| Feature | Source (keyless, CORS-enabled, no server needed) | Fallback |
|---|---|---|
| Active fires (map + alert feed) | NASA EONET v3 — `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires` | bundled demo data, labeled `[ DEMO DATA ]` |
| Air quality (US AQI, 5 cities) | Open-Meteo Air Quality — `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=..&longitude=..&hourly=us_aqi` | bundled demo data, labeled |
| SAR scene catalog | **none** (ASF blocks CORS) → bundled mock catalog mirroring ASF `asf_search` shape, labeled `mock-fallback` | — |
| Time-series charts (backscatter/soilMoisture/fuelLoad/recovery) | **none** → local simulated generator, labeled `[ SIMULATED SERIES (NO SERVER) ]` | — |
| Community reports | offline queue in `localStorage` (key `aura_queued_reports`), shown with `Pending Sync` badge | empty state |
| Hero stats | EONET open-wildfire count | `—` + `Awaiting live data` |

**Rule enforced frontend-side:** when `VITE_API_BASE_URL` is NOT set, the frontend
sends **zero** server requests (no console errors). When it IS set, backend is tried
first, then public sources, then the labeled demo fallback. No synthetic/random data
is ever generated.

---

## 2. Required API endpoints (must match `src/types/index.ts` contracts)

Standard envelope (raw array/object also tolerated):

```json
{ "data": <T>, "success": true, "message?": "..." , "error?": "..." }
```

| # | Endpoint | Method | Purpose | Response (`T`) | Frontend usage |
|---|----------|--------|---------|----------------|----------------|
| 1 | `/health` | GET | Health check | `{ status, timestamp, version }` | optional |
| 2 | `/fires?bounds=[[lat,lng],[lat,lng]]` | GET | Active fire points for map + derived alert feed | `FireDataPoint[]` | Dashboard (60s poll with auto-refresh) |
| 3 | `/fires/:id` · `/fires/:id/history?days=30` | GET | Single fire · historical series | `FireDataPoint` · `TimeSeriesData[]` | reserved |
| 4 | `/alerts?limit=50&severity=` | GET | Alert stream | `AlertData[]` | reserved (alerts currently derived from fires) |
| 5 | WebSocket `VITE_WEBSOCKET_URL` | WS | Push alerts: `{ type: "alert", payload: AlertData }` | message | apiClient.subscribeToAlerts (polling fallback exists) |
| 6 | `/safe-zones` | GET | Shelters (public view) | `SafeZone[]` | Dashboard map + used on success |
| 7 | `/evacuation-routes` | GET | Route status chips | `EvacuationRoute[]` | Dashboard public view |
| 8 | `/aqi` · `/aqi/location?lat=&lng=` | GET | Air quality cards (US AQI + level) | `AQIData[]` · `AQIData` | Dashboard (overrides Open-Meteo) |
| 9 | `/reports?verified=&limit=100` | GET | Community feed | `FieldReport[]` | Report tab "Feed" |
| 10 | `/reports` | **POST** | Submit field report — **the offline-queue sync target** | `FieldReport` | Report submit |
| 11 | `/reports/:id/verify` | POST | Verification workflow | `FieldReport` | reserved |
| 12 | `/reports/:id/vote` | POST | Up/down vote (`{ "vote": "up" \| "down" }`) | `FieldReport` | Feed vote buttons |
| 13 | `/analytics/timeseries?lat=&lng=&start=&end=&metrics=backscatter,soilMoisture,fuelLoad,recovery` | GET | Chart series (replaces simulated data) | `TimeSeriesData[]` | Analytics (fetched on range change) |
| 14 | `/analytics/snapshots` | POST | Before/after comparison (`{ lat, lng, dates[] }`) | `SARSnapshot[]` | reserved |
| 15 | **`/sar/scenes?wkt=&startDate=&endDate=&polarization=&beamModeType=&maxResults=12`** | GET | **ASF `asf_search` proxy** (ASF blocks CORS — server required) | `SARSenseScene[]` (ASF-shaped) | Analytics catalog (mock fallback exists) |
| 16 | `/sar/catalog?startDate=&endDate=&polarization=&frequency=&bounds=` | GET | Snapshot catalog | `SARSnapshot[]` | reserved |
| 17 | `/sar/download/:id` | GET | Dataset download (Blob, supports Bearer) | `Blob` | reserved |
| 18 | `/stats/dashboard` | GET | Hero stats | `{ activeZones, hazardIndex, recoveryRate, totalReports, verifiedReports }` | Hero (overrides EONET count) |
| 19 | `/nasa/sources` · `/nasa/search?q=` | GET | NASA source registry / search | `NASASource[]` · `SARSnapshot[]` | reserved |

### POST /reports payload (send exactly this)

```json
{
  "hazardType": "smoke | activeFire | fallenTrees | landslide",
  "description": "string",
  "location": "string (formatted coords or free text)",
  "lat": 37.5,          // optional (browser geolocation)
  "lng": -119.5,        // optional
  "photoName": "x.jpg"  // optional, metadata only
}
```

The frontend may reconnect later; queued reports (50 max, kept locally) can be replayed
against this endpoint by the backend sync feature below.

---

## 3. What is MISSING on the backend (to-do list)

1. **ASF `asf_search` proxy** — `/sar/scenes`: highest value; client-side call is
   impossible (CORS). Proxy `https://api.daac.asf.alaska.edu/services/search/endpoint`,
   pass WKT/polarization through, return ASF-shaped features.
2. **Photo upload** — `/reports` currently accepts `photoName` metadata only.
   Add multipart/`POST /uploads` (image, ≤10 MB) + return/deliver URL in `FieldReport.photo`.
3. **Alert generation + push** — real `AlertData` derivation server-side (from FIRMS/EONET
   or model) + WebSocket broadcast (`{ type: "alert", payload }`). Note: without this the
   frontend derives alerts from `/fires` — acceptable but less granular.
4. **FIRMS integration (NRT hotspots)** — with `VITE_FIRMS_MAP_KEY` the fires layer could
   upgrade from EONET events to raw VIIRS/MODIS detections (30m-fresh). Backend should cache
   (FIRMS allows 1 req/min) and serve via `/fires`.
5. **Time-series pipeline** — `/analytics/timeseries` from Sentinel-1 (GEO/GEE or SNAP):
   aggregates backscatter, soil moisture, fuel load, recovery between two dates.
   This is the only way charts become real — no public keyless API provides it.
6. **Offline-queue sync** — endpoint or job that ingests the localStorage queue entries
   `{ id: "local-<ts>", hazardType, description, location, lat?, lng?, photoName,
   timestamp, verified:false, votes:0 }` on POST /reports, then clears the queue.
7. **Pagination + filtering** — `ApiResponse.pagination { page, ... }` for reports/fires
   when datasets grow.
8. **Auth (optional)** — the client already sends `Authorization: Bearer <token>` when
   `apiClient.setAuthToken()` is used; wire verify/vote to authenticated users.
9. **Persistance** — any store for safe zones/evacuation routes so public-view content
   stops being the bundled static config (Sacramento/Oakland/Fresno landmarks).
10. **Rate limiting / caching** — 60s poll on `/fires` + `/aqi` from every client;
    add server-side cache (e.g. 2–5 min) for EONET/Open-Meteo upstream.

---

## 4. Acceptance criteria

- [ ] `VITE_API_BASE_URL` set → every card shows `[ LIVE ]`-class source (no Demo badge).
- [ ] `POST /reports` stores and returns the report; queued offline ones sync without loss.
- [ ] Charts on Analytics get data from `/analytics/timeseries` (chip says `LIVE SERVER DATA`).
- [ ] `/sar/scenes` returns ASF-shaped scenes for a WKT polygon (catalog chip says `live`).
- [ ] `/health` answers 200 in <200 ms.
- [ ] All endpoints tolerate the envelope `{ data, success }` or plain arrays.
