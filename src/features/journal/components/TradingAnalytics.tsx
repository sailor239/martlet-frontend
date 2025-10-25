import React from "react";
import { Card, Title, Text } from "@mantine/core";
// If you plan to add charts later, import Plotly or Mantine charts here

interface TradeAnalyticsProps {
  trades: any[];
}

export const TradeAnalytics: React.FC<TradeAnalyticsProps> = ({ trades }) => {
  if (!trades?.length) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          Trade Analytics
        </Title>
        <Text c="dimmed">No trades available to analyze yet.</Text>
      </Card>
    );
  }

  // Example metrics (replace with real calculations)
  const totalTrades = trades.length;
  const winRate = "62%";
  const avgRR = "1.8";

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="md">
        Trade Analytics
      </Title>
      <Text>📊 Total Trades: {totalTrades}</Text>
      <Text>💰 Win Rate: {winRate}</Text>
      <Text>📈 Avg R:R: {avgRR}</Text>

      {/* Insert your charts here later */}
      {/* Example: <Plot data={...} layout={...} /> */}
    </Card>
  );
};
