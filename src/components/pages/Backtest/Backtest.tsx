import { useState } from "react";
import { Container, Loader, Center, Group, Select, Text } from "@mantine/core";
import BacktestChart from "./BacktestChart";
import { useBacktestData } from "./hooks";

const API_URL = "http://localhost:8000"; // replace with your backend

export default function Backtest() {
  const [ticker, setTicker] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("5m");

  const { data: results = [], isLoading, error, noData } = useBacktestData(
    ticker,
    timeframe,
    API_URL
  );

  return (
    <Container>
      <Group spacing="md" style={{ marginBottom: 20 }}>
        <Select
          label="Ticker"
          value={ticker}
          onChange={setTicker}
          data={["AAPL", "MSFT", "GOOG"]}
        />
        <Select
          label="Timeframe"
          value={timeframe}
          onChange={setTimeframe}
          data={["1m", "5m", "15m", "30m", "60m"]}
        />
      </Group>

      {isLoading && (
        <Center style={{ height: 200 }}>
          <Loader />
        </Center>
      )}

      {error && <Text color="red">{error.message}</Text>}
      {noData && <Text>No backtest data for selected ticker/timeframe</Text>}

      {!isLoading && !error && results.length > 0 && <BacktestChart results={results} />}
    </Container>
  );
}
