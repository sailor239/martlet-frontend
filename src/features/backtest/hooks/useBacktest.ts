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
  strategy: string,
  apiUrl: string
): Promise<BacktestResult[]> => {
  // Build URL with strategy as query parameter
  const url = new URL(`${apiUrl}/backtest/${ticker}/${timeframe}/`);
  url.searchParams.append("strategy", strategy);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  console.log("Fetch backtest response:", res);

  if (!res.ok) throw new Error("Failed to fetch backtest data");

  const data: BacktestResult[] = await res.json();
  return data.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// React Query hook
export const useBacktestData = (
  ticker: string,
  timeframe: string,
  strategy: string,
  apiUrl: string
) => {
  const query = useQuery<BacktestResult[], Error>({
    queryKey: ["backtest", ticker, timeframe, strategy],
    queryFn: () => fetchBacktestData(ticker, timeframe, strategy, apiUrl),
    enabled: !!ticker && !!timeframe && !!strategy,
  });

  const noData = !query.isLoading && !query.error && (query.data?.length ?? 0) === 0;

  return { ...query, noData };
};
