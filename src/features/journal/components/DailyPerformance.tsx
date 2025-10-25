import React, { useState, useMemo } from "react";
import {
  Card,
  Title,
  Group,
  Select,
  Loader,
  Center,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import Plot from "react-plotly.js";

interface DailyPerformanceProps {
  trades: any[];
}

// Example: trades = [{ ticker: 'AAPL', trading_date: '2025-10-25', timestamp: '2025-10-25T09:35', equity: 10000 }, ...]

export const DailyPerformance: React.FC<DailyPerformanceProps> = ({ trades }) => {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const availableTickers = useMemo(
    () => Array.from(new Set(trades.map(t => t.ticker))).sort(),
    [trades]
  );

  // Filter trades for the selected day/ticker
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchTicker = selectedTicker ? t.ticker === selectedTicker : true;
      const matchDate = selectedDate
        ? new Date(t.trading_date).toDateString() === selectedDate.toDateString()
        : true;
      return matchTicker && matchDate;
    });
  }, [trades, selectedTicker, selectedDate]);

  // --- Analytics summary ---
  const summary = useMemo(() => {
    if (!filteredTrades.length) return { pnl: 0, winRate: 0, count: 0 };
    const totalPnL = filteredTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
    const wins = filteredTrades.filter((t) => (t.result || (t.pnl ?? 0) > 0) === true).length;
    const winRate = (wins / filteredTrades.length) * 100;
    return {
      pnl: totalPnL,
      winRate: winRate,
      count: filteredTrades.length,
    };
  }, [filteredTrades]);

  // Generate 5-min equity curve
  const equityData = useMemo(() => {
    if (!filteredTrades.length) return [];
    return filteredTrades
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(t => ({
        x: t.timestamp,
        y: t.equity,
      }));
  }, [filteredTrades]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* Filters */}
        <Group mb="md" gap="md" align="center">
            <Text size="sm" fw={500}>Ticker:</Text>
            <Select value={selectedTicker} onChange={(val) => val && setSelectedTicker(val)} data={[{ value: "xauusd", label: "XAUUSD" }]} w={120} />
            <Text size="sm" fw={500}>Trading Date:</Text>
            <Group gap="xs" align="center">
                <DatePickerInput value={selectedDate} onChange={(val) => setSelectedDate(val ? new Date(val) : null)} w={180} />
                <Text size="sm" c="blue" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => setSelectedDate(new Date())}>
                    Today
                </Text>
            </Group>
        </Group>

      {/* Summary Section */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="lg">
        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text c="dimmed" size="sm">
            Total PnL
          </Text>
          <Text
            fw={600}
            c={summary.pnl >= 0 ? "green" : "red"}
            size="lg"
          >
            {summary.pnl.toFixed(2)}
          </Text>
        </Card>

        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text c="dimmed" size="sm">
            Win Rate
          </Text>
          <Text fw={600} size="lg">
            {summary.winRate.toFixed(1)}%
          </Text>
        </Card>

        <Card shadow="xs" padding="md" radius="md" withBorder>
          <Text c="dimmed" size="sm">
            Number of Trades
          </Text>
          <Text fw={600} size="lg">
            {summary.count}
          </Text>
        </Card>
      </SimpleGrid>


      {/* Chart */}
      {filteredTrades.length === 0 ? (
        <Center style={{ height: "200px" }}>
          <Text c="dimmed">No data available for the selected filters.</Text>
        </Center>
      ) : (
        <Plot
          data={[
            {
              x: equityData.map(d => d.x),
              y: equityData.map(d => d.y),
              type: "scatter",
              mode: "lines+markers",
              name: "Equity",
            },
          ]}
          layout={{
            height: 400,
            margin: { t: 40, r: 20, l: 50, b: 40 },
            xaxis: { title: "Time (5-min intervals)" },
            yaxis: { title: "Equity" },
            title: `${selectedTicker || "All"} — ${
              selectedDate ? selectedDate.toDateString() : "All Dates"
            }`,
          }}
          config={{ responsive: true }}
        />
      )}
    </Card>
  );
};
