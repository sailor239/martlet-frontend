import React, { useState } from "react";
import { MantineProvider, Card, Text, Loader, Center, Group, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import IntradayChart from "./IntradayChart";
import { useIntradayData, useTrades } from "./hooks";

export const Intraday: React.FC<{ apiUrl?: string }> = ({
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

  const { data: trades = [] } = useTrades(ticker, tradingDate, apiUrl);

  return (
    <MantineProvider>
      <Card shadow="sm" p="lg" radius="md" style={{ width: "90vw", height: "80vh", minHeight: 600, display: "flex", flexDirection: "column" }}>
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
          <IntradayChart candles={candles} trades={trades} />
        )}
      </Card>
    </MantineProvider>
  );
};
