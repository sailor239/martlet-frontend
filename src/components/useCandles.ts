import { useQuery } from "@tanstack/react-query";

export type Candle = {
  timestamp: string;
  timestamp_sgt: string;
  open: number;
  high: number;
  low: number;
  close: number;
  trading_date: string;
};

// Fetch function for the POST /candles/ endpoint
export const fetchCandles = async (
  ticker: string,
  timeframe: string,
  apiUrl: string
): Promise<Candle[]> => {
  const res = await fetch(`${apiUrl}/candles/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker, timeframe }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch candles");
  }

  const text = await res.text();

  const candles: Candle[] = text
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return candles;
};

// React Query hook using options-object syntax (v5 compliant)
export const useCandles = (ticker: string, timeframe: string, apiUrl: string) => {
  return useQuery<Candle[], Error>({
    queryKey: ["candles", ticker, timeframe],
    queryFn: () => fetchCandles(ticker, timeframe, apiUrl),
  });
};
