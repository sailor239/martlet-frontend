import { useState } from "react";
import { MantineProvider, Button, Card, Loader, Center, Group, Select, Text, Tooltip } from "@mantine/core";
import { BacktestChart, useBacktestData } from "../backtest";
import { notifications } from "@mantine/notifications";

interface StrategyOption {
  value: string;
  label: string;
  description: string;
  disabled?: boolean;
}

export const BacktestPage: React.FC<{ apiUrl?: string }> = ({
  apiUrl = import.meta.env.VITE_API_URL,
}) => {
  const [ticker, setTicker] = useState("xauusd");
  const [timeframe, setTimeframe] = useState("5min");
  const [strategy, setStrategy] = useState("previous_day_breakout");
  const [isRunning, setIsRunning] = useState(false);

  const strategies: StrategyOption[] = [
    {
      value: "previous_day_breakout",
      label: "Previous Day Breakout",
      description: "Trades momentum on a breakout of the prior day's high or low.",
    },
    {
      value: "compression_breakout_scalp",
      label: "Compression Breakout Scalp",
      description: "Quick scalp on prior day's range breakout, only if it’s contained within the day-before’s range.",
    },
    {
      value: "ema_respect_follow",
      label: "EMA Respect Follow",
      description:
        "Quick scalp following EMA breakout, with EMA acting as confirmed support or resistance.",
      disabled: true,
    },
  ];
  const tickers = [
    { value: "xauusd", label: "XAUUSD" }
  ];
  const timeframes = [
    { value: "5min", label: "5 Minutes" }
  ];

  const runBacktest = async () => {
    setIsRunning(true);
    try {
      const res = await fetch(`${apiUrl}/trigger_backtest_run/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, timeframe, strategy }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      notifications.show({
        title: "Backtest Complete",
        message: "Backtest finished successfully",
        color: "green",
      });
    } catch (err: any) {
      console.error("Backtest error:", err);
      notifications.show({
        title: "Backtest Failed",
        message: err.message ?? "Unknown error",
        color: "red",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const { data: results = [], isLoading, error, noData } = useBacktestData(strategy, ticker, timeframe, apiUrl);

  return (
    <MantineProvider>
      <Card shadow="sm" p="lg" radius="md" style={{ width: "100%", height: "80vh", minHeight: 600, display: "flex", flexDirection: "column" }}>
        <Group mb="md" gap="md" align="center">
          <Text size="sm" fw={500}>Strategy:</Text>
          <Select
            value={strategy}
            onChange={(val) => val && setStrategy(val)}
            data={strategies}
            w={280}
            renderOption={({ option }) => {
              const opt = option as StrategyOption;
              return (
                <Tooltip label={opt.description} position="right" withArrow>
                  <div>{opt.label}</div>
                </Tooltip>
              );
            }}
          />
          <Text size="sm" fw={500}>Ticker:</Text>
          <Select
            value={ticker} onChange={(val) => val && setTicker(val)}
            data={tickers}
            w={120}
          />
          <Text size="sm" fw={500}>Timeframe:</Text>
          <Select
            value={timeframe}
            onChange={(val) => val && setTimeframe(val)}
            data={timeframes}
            w={120}
          />
          <Button onClick={runBacktest} disabled={isRunning}>
            {isRunning ? <Loader size="xs" /> : "Run Backtest"}
          </Button>
        </Group>

        {isLoading && (
          <Center style={{ height: 200 }}>
            <Loader />
          </Center>
        )}

        {error && <Text c="red">{error.message}</Text>}
        {noData && <Text>No backtest results for the selected strategy/ticker/timeframe</Text>}

        {!isLoading && !error && results.length > 0 && <BacktestChart results={results} />}
      </Card>
    </MantineProvider>
  );
}
