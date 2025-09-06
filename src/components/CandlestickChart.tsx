import React from "react";
import Plot from "react-plotly.js";
import { MantineProvider, Card, Text, Loader, Center } from "@mantine/core";
import { useCandles } from "./useCandles";
import type { Candle } from "./useCandles";

interface CandlestickChartProps {
  ticker: string;
  timeframe: string;
  apiUrl?: string;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  ticker,
  timeframe,
  apiUrl = import.meta.env.VITE_API_URL,
}) => {
  const { data: candles, isLoading, error } = useCandles(ticker, timeframe, apiUrl);

  if (isLoading) {
    return (
      <Center style={{ height: "60vh" }}>
        <Loader size="xl" variant="dots" />
      </Center>
    );
  }

  if (error || !candles || candles.length === 0) {
    return <Text c="red">Failed to load candles or no data available</Text>;
  }

  const latestTradingDate = candles[0]?.trading_date ?? "";

  return (
    <MantineProvider>
      <Card shadow="sm" padding="lg" radius="md" style={{ width: "80vw", height: "60vh" }}>
        <Text
          component="h2"
          style={{ fontWeight: 500, fontSize: 20, marginBottom: 16 }}
        >
          Candlestick Chart - {latestTradingDate}
        </Text>

        <Plot
          data={[
            {
              x: candles.map((c: Candle) => c.timestamp_sgt),
              open: candles.map((c: Candle) => c.open),
              high: candles.map((c: Candle) => c.high),
              low: candles.map((c: Candle) => c.low),
              close: candles.map((c: Candle) => c.close),
              type: "candlestick",
            },
          ]}
          layout={{
            autosize: true,
            margin: { l: 60, r: 10, t: 40, b: 40 },
            xaxis: { rangeslider: { visible: false }, type: "date" },
            yaxis: { autorange: true },
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler={true}
        />
      </Card>
    </MantineProvider>
  );
};
