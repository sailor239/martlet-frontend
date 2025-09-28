import { useQuery } from "@tanstack/react-query";
import type { Candle } from "../../../types/candle";

// Fetch function for the POST /intraday/ endpoint
export const fetchIntradayData = async (
  ticker: string,
  timeframe: string,
  tradingDate: Date | null,
  apiUrl: string,
): Promise<Candle[]> => {
  const body: Record<string, any> = { ticker, timeframe };
  if (tradingDate) {
    // Format to YYYY-MM-DD (assuming backend expects this format)
    body.trading_date = tradingDate.toISOString().split("T")[0];
  }

  const res = await fetch(`${apiUrl}/intraday/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch candles");
  }

  const candles: Candle[] = await res.json();

  return candles.sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};


// React Query hook using options-object syntax (v5 compliant)
export const useIntradayData = (
  ticker: string,
  timeframe: string,
  tradingDate: Date | null,
  apiUrl: string,
) => {
  const query = useQuery<Candle[], Error>({
    queryKey: ["candles", ticker, timeframe, tradingDate?.toISOString()],
    queryFn: () => fetchIntradayData(ticker, timeframe, tradingDate, apiUrl),
    enabled: !!ticker && !!timeframe, // only run if required filters are set
  });

  // add a derived flag for "no data"
  const noData = !query.isLoading && !query.error && (query.data?.length ?? 0) === 0;

  return { ...query, noData };
};

export interface Trade {
  id: number;
  ticker: string;
  direction: "long" | "short";
  size: number;
  entry_price: number;
  exit_price?: number;
  entry_time: Date | string | null;
  exit_time?: Date | string | null;
  notes?: string;
}

export const fetchTrades = async (
  ticker: string,
  tradingDate: Date | null,
  apiUrl: string,
): Promise<Trade[]> => {
  if (!tradingDate) return [];
  const dateStr = tradingDate.toISOString().split("T")[0];
  const res = await fetch(`${apiUrl}/trades/${ticker}/${dateStr}`);
  if (!res.ok) throw new Error("Failed to fetch trades");
  return res.json();
};

export const useTrades = (
  ticker: string,
  tradingDate: Date | null,
  apiUrl: string,
) => {
  return useQuery<Trade[], Error>({
    queryKey: ["trades", ticker, tradingDate?.toISOString()],
    queryFn: () => fetchTrades(ticker, tradingDate, apiUrl),
    enabled: !!ticker && !!tradingDate,
  });
};

