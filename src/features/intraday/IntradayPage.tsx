import React, { useState, useEffect } from "react";
import { MantineProvider, Card, Text, Loader, Center, Group, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import IntradayChart from "./components/IntradayChart";
import { useIntradayData, useTrades } from "../intraday";
import { showNotification } from '@mantine/notifications';

export const IntradayPage: React.FC<{ apiUrl?: string }> = ({
  apiUrl = import.meta.env.VITE_API_URL,
}) => {
  const [ticker, setTicker] = useState("xauusd");
  const [timeframe, setTimeframe] = useState("5min");
  const [tradingDate, setTradingDate] = useState<Date | null>(new Date());

  const { data: candles = [], isLoading, error, noData } = useIntradayData(
    ticker,
    timeframe,
    tradingDate,
    apiUrl
  );

  const { data: backendTrades = [] } = useTrades(ticker, tradingDate, apiUrl);
  const [trades, setTrades] = useState(
    backendTrades.map((t) => ({
      ...t,
      // Convert UTC timestamp to local time for display
      entry_time: t.entry_time ? new Date(t.entry_time) : null,
      exit_time: t.exit_time ? new Date(t.exit_time) : null,
    }))
  );

  // Only update local trades if backend data really changed
  useEffect(() => {
    setTrades((prev) => {
      // simple shallow compare: lengths + ids
      const prevIds = prev.map((t) => t.id).join(",");
      const backendIds = backendTrades.map((t) => t.id).join(",");
      if (prevIds !== backendIds) {
        return backendTrades.map((t) => ({
          ...t,
          entry_time: t.entry_time ? new Date(t.entry_time) : null,
          exit_time: t.exit_time ? new Date(t.exit_time) : null,
        }));
      }
      return prev; // no update
    });
  }, [backendTrades]);

  // 1️⃣ Backend save function
  const saveTrade = async (trade: any) => {
    // Convert times to UTC ISO string for backend
    const tradeToSend = {
      ...trade,
      entry_time: trade.entry_time ? new Date(trade.entry_time).toISOString() : undefined,
      exit_time: trade.exit_time ? new Date(trade.exit_time).toISOString() : undefined,
      ticker: ticker.toLowerCase(),
    };

    // Convert times to local Date for frontend display
    const tradeForDisplay = {
      ...trade,
      entry_time: trade.entry_time ? new Date(trade.entry_time) : null,
      exit_time: trade.exit_time ? new Date(trade.exit_time) : null,
    };

    // Optimistically update frontend
    setTrades((prev) => [...prev, tradeForDisplay]);

    try {
      const res = await fetch(`${apiUrl}/trades/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeToSend),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      // Convert returned UTC timestamps from backend to local Date
      const dataForDisplay = {
        ...data,
        entry_time: data.entry_time ? new Date(data.entry_time) : null,
        exit_time: data.exit_time ? new Date(data.exit_time) : null,
      };

      setTrades((prev) =>
        prev.map((t) => (t === tradeForDisplay ? dataForDisplay : t))
      );

      showNotification({
        title: "Trade saved",
        message: `Trade logged successfully!`,
        color: "green",
      });

    } catch (err: any) {
      console.error("Failed to save trade:", err);
      showNotification({
        title: "Error saving trade",
        message: err.message ?? "Unknown error",
        color: "red",
      });

      // remove optimistic trade
      setTrades((prev) => prev.filter((t) => t !== tradeForDisplay));
    }
  };

  return (
      <Card shadow="sm" p="lg" radius="md" style={{ width: "100%", height: "80vh", minHeight: 600, display: "flex", flexDirection: "column" }}>
        {/* Filters */}
        <Group mb="md" gap="md" align="center">
          <Text size="sm" fw={500}>Ticker:</Text>
          <Select value={ticker} onChange={(val) => val && setTicker(val)} data={[{ value: "xauusd", label: "XAUUSD" }]} w={120} />
          <Text size="sm" fw={500}>Timeframe:</Text>
          <Select value={timeframe} onChange={(val) => val && setTimeframe(val)} data={[{ value: "5min", label: "5 Minutes" }]} w={120} />
          <Text size="sm" fw={500}>Trading Date:</Text>
          <Group gap="xs" align="center">
            <DatePickerInput value={tradingDate} onChange={(val) => setTradingDate(val ? new Date(val) : null)} w={180} />
            <Text size="sm" c="blue" style={{ cursor: "pointer", userSelect: "none" }} onClick={() => setTradingDate(new Date())}>
              Today
            </Text>
          </Group>
        </Group>

        <Text size="xl" fw={500} mb="md">
          {tradingDate ? tradingDate.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : ""}
        </Text>

        {/* Chart / messages */}
        {isLoading ? (
          <Center style={{ flex: 1 }}><Loader size="xl" variant="dots" /></Center>
        ) : error ? (
          <Center style={{ flex: 1 }}><Text c="red" size="lg">Failed to load candles: {error.message}</Text></Center>
        ) : noData ? (
          <Center style={{ flex: 1 }}><Text c="dimmed" size="lg">No data available for {tradingDate?.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</Text></Center>
        ) : (
          <IntradayChart
            candles={candles}
            trades={trades}
            onTradeMarked={(trade) => saveTrade(trade)}
          />
        )}
      </Card>
  );
};
