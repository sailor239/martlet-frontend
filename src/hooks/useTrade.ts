import { useQuery } from "@tanstack/react-query";

export interface Trade {
  id: number;
  ticker: string;
  direction: "long" | "short";
  size: number;
  type: "real" | "simulated";
  entry_price: number;
  exit_price?: number;
  entry_time: Date | string | null;
  exit_time?: Date | string | null;
  notes?: string;
}

// --- Fetch function ---
export const fetchTrades = async (
  type: "real" | "simulated",
  ticker: string,
  tradingDate: Date | null,
  apiUrl: string,
): Promise<Trade[]> => {
  if (!tradingDate) return [];

  const dateStr = tradingDate.toISOString().split("T")[0];
  const url = new URL(`${apiUrl}/trades/${ticker}/${dateStr}`);
  url.searchParams.append("type", type);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`Failed to fetch ${type} trades for ${ticker} (${dateStr})`);

  const data: Trade[] = await res.json();
  return data;
};

// --- React Query hook ---
export const useTrades = (
  type: "real" | "simulated",
  ticker: string,
  tradingDate: Date | null,
  apiUrl: string,
) => {
  const dateStr = tradingDate ? tradingDate.toISOString().split("T")[0] : null;

  const query = useQuery<Trade[], Error>({
    queryKey: ["trades", type, ticker, dateStr],
    queryFn: () => fetchTrades(type, ticker, tradingDate, apiUrl),
    enabled: !!type && !!ticker && !!tradingDate,
    staleTime: 60_000, // optional: cache for 1 minute
  });

  const noData = !query.isLoading && !query.error && (query.data?.length ?? 0) === 0;

  return { ...query, noData };
};
