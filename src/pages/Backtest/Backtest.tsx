import { useState } from "react";
import { Container, Loader, Center, Group, Select, Text } from "@mantine/core";
import BacktestChart from "./BacktestChart";
import { useBacktestData } from "./hooks";

export const Backtest: React.FC<{ apiUrl?: string }> = ({
  apiUrl = import.meta.env.VITE_API_URL,
}) => {
  const [ticker, setTicker] = useState("xauusd");
  const [timeframe, setTimeframe] = useState("5min");

  const { data: results = [], isLoading, error, noData } = useBacktestData(
    ticker,
    timeframe,
    apiUrl
  );

  return (
    <Container>
      <Group mb="md" gap="md" align="center">
        <Text size="sm" fw={500}>Ticker:</Text>
        <Select value={ticker} onChange={(val) => val && setTicker(val)} data={[{ value: "xauusd", label: "XAUUSD" }]} w={120} />
        <Text size="sm" fw={500}>Timeframe:</Text>
        <Select value={timeframe} onChange={(val) => val && setTimeframe(val)} data={[{ value: "5min", label: "5 Minutes" }]} w={120} />
      </Group>

      {isLoading && (
        <Center style={{ height: 200 }}>
          <Loader />
        </Center>
      )}

      {error && <Text c="red">{error.message}</Text>}
      {noData && <Text>No backtest data for selected ticker/timeframe</Text>}

      {!isLoading && !error && results.length > 0 && <BacktestChart results={results} />}
    </Container>
  );
}
