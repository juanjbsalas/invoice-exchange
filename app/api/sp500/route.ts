import { NextResponse } from "next/server";

export const revalidate = 86400; // cache for 24 hours

type Candle = {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  t: number; // unix ms timestamp
};

export type YearlyReturn = {
  year: number;
  spReturn: number;
  ixReturn: number;
};

const PROBES = [
  { region: "US", code: "SPX",   kType: 9  }, // weekly
  { region: "US", code: "SPX",   kType: 8  }, // daily
  { region: "US", code: "GSPC",  kType: 10 }, // monthly
  { region: "US", code: "GSPC",  kType: 9  }, // weekly
  { region: "US", code: ".SPX",  kType: 10 }, // dot-prefixed monthly
  { region: "US", code: ".GSPC", kType: 10 },
];

async function fetchKline(
  apiKey: string,
  region: string,
  code: string,
  kType: number,
  limit: number
): Promise<{ candles: Candle[] | null; raw: unknown }> {
  const url = `https://api.itick.org/stock/kline?region=${region}&code=${encodeURIComponent(code)}&kType=${kType}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { accept: "application/json", token: apiKey },
    cache: "no-store",
  });
  if (!res.ok) return { candles: null, raw: `HTTP ${res.status}` };
  const json = await res.json();
  const data = json?.data;
  if (Array.isArray(data) && data.length > 0) return { candles: data, raw: json };
  return { candles: null, raw: json };
}

export async function GET() {
  const apiKey = process.env.ITICK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ITICK_API_KEY not configured" }, { status: 500 });
  }

  let candles: Candle[];
  try {
    // Try probes in order — first non-empty result wins
    const probeResults: Record<string, unknown> = {};
    let found: { candles: Candle[]; kType: number; code: string } | null = null;

    for (const probe of PROBES) {
      const { candles: c, raw } = await fetchKline(apiKey, probe.region, probe.code, probe.kType, 500);
      probeResults[`${probe.code}_kType${probe.kType}`] = Array.isArray((raw as {data?:unknown})?.data) ? `${((raw as {data:unknown[]}).data).length} candles` : raw;
      if (c && c.length > 0 && !found) {
        found = { candles: c, kType: probe.kType, code: probe.code };
      }
    }

    if (!found) {
      return NextResponse.json({ error: "All symbol probes returned empty data", probeResults }, { status: 502 });
    }

    candles = found.candles;
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch from iTick: ${String(err)}` },
      { status: 502 }
    );
  }

  // Group candles by year, keeping the last closing price of each year
  const yearlyClose: Record<number, number> = {};
  for (const candle of candles) {
    const year = new Date(candle.t).getFullYear();
    // Overwrite with each candle so the last one (highest month) wins
    yearlyClose[year] = candle.c;
  }

  const years = Object.keys(yearlyClose)
    .map(Number)
    .sort((a, b) => a - b);

  const results: YearlyReturn[] = [];
  for (let i = 1; i < years.length; i++) {
    const year = years[i];
    const prevYear = years[i - 1];
    const thisClose = yearlyClose[year];
    const prevClose = yearlyClose[prevYear];
    if (prevClose && thisClose) {
      const spReturn = Math.round(((thisClose / prevClose - 1) * 100) * 100) / 100;
      results.push({ year, spReturn, ixReturn: 8 });
    }
  }

  return NextResponse.json(results);
}
