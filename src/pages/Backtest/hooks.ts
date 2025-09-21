import { useQuery } from "@tanstack/react-query";

export interface BacktestResult {
  timestamp: string;
  equity: number;
  position: "long" | "short" | "flat";
  pnl: number;
}

// Fetch function
export const fetchBacktestData = async (
  ticker: string,
  timeframe: string,
  apiUrl: string
): Promise<BacktestResult[]> => {
  const body = { ticker, timeframe };

  const res = await fetch(`${apiUrl}/backtest/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to fetch backtest data");

  const data: BacktestResult[] = await res.json();
  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// React Query hook
export const useBacktestData = (ticker: string, timeframe: string, apiUrl: string) => {
  const query = useQuery<BacktestResult[], Error>({
    queryKey: ["backtest", ticker, timeframe],
    queryFn: () => fetchBacktestData(ticker, timeframe, apiUrl),
    enabled: !!ticker && !!timeframe,
  });

  const noData = !query.isLoading && !query.error && (query.data?.length ?? 0) === 0;

  return { ...query, noData };
};
