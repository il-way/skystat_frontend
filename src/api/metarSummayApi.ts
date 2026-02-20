export type AverageMetricsResponse = {
  coverageFrom: string | null
  coverageTo: string | null
  totalCount: number
  avgVisibilityM: number | null
  avgWindSpeedKt: number | null
  avgWindPeakKt: number | null
  avgAltimeterHpa: number | null
  avgCeilingFt: number | null
}

export type MonthlyObservationCounts = {
  year: number
  month: number
  windPeakCount: number
  visibilityCount: number
  ceilingCount: number
  phenomenonCount: number
  descriptorCount: number
}

export type MonthlyObservationCountsResponse = {
  coverageFrom: string | null
  coverageTo: string | null
  totalCount: number
  monthly: MonthlyObservationCounts[]
}

function toIsoZdt(value: string) {
  if (!value) return value
  if (value.includes("T")) return value
  return `${value}T00:00:00Z`
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: "application/json" } })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`)
  }
  return res.json()
}

export async function fetchAverageMetrics(params: {
  icao: string
  from: string
  to: string
}): Promise<AverageMetricsResponse> {
  const qs = new URLSearchParams()
  qs.set("icao", params.icao)
  qs.set("from", toIsoZdt(params.from))
  qs.set("to", toIsoZdt(params.to))

  // ✅ Vite proxy(/api) 타도록 상대경로로 호출
  return getJson(`/api/metar/summary/average/metrics?${qs.toString()}`)
}

export async function fetchMonthlyObservationCounts(params: {
  icao: string
  from: string
  to: string
  windPeak: number
  visibility: number
  ceiling: number
  phenomenon: string
  descriptor: string
}): Promise<MonthlyObservationCountsResponse> {
  const qs = new URLSearchParams()
  qs.set("icao", params.icao)
  qs.set("from", toIsoZdt(params.from))
  qs.set("to", toIsoZdt(params.to))
  qs.set("windpeak", String(params.windPeak))
  qs.set("visibility", String(params.visibility))
  qs.set("ceiling", String(params.ceiling))
  qs.set("phenomenon", params.phenomenon)
  qs.set("descriptor", params.descriptor)

  return getJson(`/api/metar/summary/observation?${qs.toString()}`)
}