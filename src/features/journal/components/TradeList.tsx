import React from "react";
import { Card, Text, Group, Button } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function toProperCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

interface Trade {
  id: number;
  ticker: string;
  direction: string;
  size: number;
  type: string;
  entry_price: number;
  exit_price?: number;
  entry_time: string;
  exit_time?: string;
  pnl?: number;
}

interface TradeListProps {
  trades: Trade[];
}

export const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  const queryClient = useQueryClient();

  // --- Delete trade mutation ---
  const deleteTradeFn = async (tradeId: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/trades/${tradeId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete trade");
  };

  const deleteTrade = useMutation<void, Error, number>({
    mutationFn: deleteTradeFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
    },
  });

  if (trades.length === 0) {
    return <Text c="dimmed">No trades recorded yet.</Text>;
  }

  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {trades.map((trade) => (
        <li key={trade.id}>
          <Card shadow="xs" padding="sm" radius="md" withBorder mb="sm">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={500}>
                  {trade.ticker.toUpperCase()} ({toProperCase(trade.direction)}) x {trade.size}
                </Text>
                <Text size="sm" c="dimmed">
                  {new Date(trade.entry_time).toLocaleString()} →{" "}
                  {trade.exit_time ? new Date(trade.exit_time).toLocaleString() : "Open"}
                </Text>
                <Text size="sm">
                  Entry: {trade.entry_price} | Exit: {trade.exit_price ?? "-"} | P/L:{" "}
                  {trade.pnl ?? "-"} | Type: {toProperCase(trade.type)}
                </Text>
              </div>
              <Button
                color="red"
                size="xs"
                variant="light"
                onClick={() => deleteTrade.mutate(trade.id)}
                loading={deleteTrade.status === "pending"}
              >
                Delete
              </Button>
            </Group>
          </Card>
        </li>
      ))}
    </ul>
  );
};
