// src/components/trades/TradeList.tsx
import React from "react";
import { Card, Text } from "@mantine/core";

export const TradeList: React.FC<{ trades: any[] }> = ({ trades }) => {
  if (trades.length === 0) {
    return <Text c="dimmed">No trades recorded yet.</Text>;
  }

  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {trades.map((trade) => (
        <li key={trade.id}>
          <Card shadow="xs" padding="sm" radius="md" withBorder mb="sm">
            <Text fw={500}>
              {trade.ticker} ({trade.direction})
            </Text>
            <Text size="sm" c="dimmed">
              {new Date(trade.entry_time).toLocaleString()} →{" "}
              {trade.exit_time ? new Date(trade.exit_time).toLocaleString() : "Open"}
            </Text>
            <Text size="sm">
              Entry: {trade.entry_price} | Exit: {trade.exit_price ?? "-"} | P/L:{" "}
              {trade.pnl ?? "-"}
            </Text>
          </Card>
        </li>
      ))}
    </ul>
  );
};
