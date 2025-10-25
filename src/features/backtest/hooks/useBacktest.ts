import { useQuery } from "@tanstack/react-query";

export interface BacktestResult {
  timestamp: string;
  equity: number;
  position: "long" | "short" | "flat";
  pnl: number;
}

// Fetch function
export const fetchBacktestData = async (
  strategy: string,
  ticker: string,
  timeframe: string,
  apiUrl: string
): Promise<BacktestResult[]> => {
  const url = new URL(`${apiUrl}/backtest/results/`);
  url.searchParams.set("strategy", strategy);
  url.searchParams.set("ticker", ticker);
  url.searchParams.set("timeframe", timeframe);
  
  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch backtest data");

  const data: BacktestResult[] = await res.json();

  return data.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// React Query hook
export const useBacktestData = (
  strategy: string,
  ticker: string,
  timeframe: string,
  apiUrl: string
) => {
  const query = useQuery<BacktestResult[], Error>({
    queryKey: ["backtest", strategy, ticker, timeframe],
    queryFn: () => fetchBacktestData(strategy, ticker, timeframe, apiUrl),
    enabled: !!strategy && !!ticker && !!timeframe,
  });

  const noData = !query.isLoading && !query.error && (query.data?.length ?? 0) === 0;

  return { ...query, noData };
};
