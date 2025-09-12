import { useQuery } from "@tanstack/react-query";

export type Candle = {
  timestamp: string;
  timestamp_sgt: string;
  open: number;
  high: number;
  low: number;
  close: number;
  trading_date: string;
  ema20: number | null;
  prev_day_high: number | null;
  prev_day_low: number | null;
};

// Fetch function for the POST /candles/ endpoint
export const fetchCandles = async (
  ticker: string,
  timeframe: string,
  apiUrl: string,
  tradingDate?: Date | null
): Promise<Candle[]> => {
  const body: Record<string, any> = { ticker, timeframe };
  if (tradingDate) {
    // Format to YYYY-MM-DD (assuming backend expects this format)
    body.trading_date = tradingDate.toISOString().split("T")[0];
  }

  const res = await fetch(`${apiUrl}/candles/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch candles");
  }

  const text = await res.text();

  if (!text.trim()) {
    return []; // empty response → no data
  }

  const candles: Candle[] = text
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  return candles;
};

// React Query hook using options-object syntax (v5 compliant)
export const useCandles = (
  ticker: string,
  timeframe: string,
  apiUrl: string,
  tradingDate?: Date | null
) => {
  const query = useQuery<Candle[], Error>({
    queryKey: ["candles", ticker, timeframe, tradingDate?.toISOString()],
    queryFn: () => fetchCandles(ticker, timeframe, apiUrl, tradingDate),
    enabled: !!ticker && !!timeframe, // only run if required filters are set
  });

  // add a derived flag for "no data"
  const noData = !query.isLoading && !query.error && (query.data?.length ?? 0) === 0;

  return { ...query, noData };
};
