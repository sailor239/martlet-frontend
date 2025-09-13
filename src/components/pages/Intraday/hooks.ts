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
