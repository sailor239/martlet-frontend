import React, { useState } from "react";
import Plot from "react-plotly.js";
import {
  MantineProvider,
  Card,
  Text,
  Loader,
  Center,
  Group,
  Select,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useCandles } from "./useCandles";

interface CandlestickChartProps {
  apiUrl?: string;
}

function makeLineAndLabel(
  y: number,
  color: string,
  label: string,
  x0: string,
  x1: string
) {
  return {
    shape: {
      type: "line",
      xref: "x",
      yref: "y",
      x0,
      x1,
      y0: y,
      y1: y,
      line: { color, width: 1.5, dash: "dashdot" },
    },
    annotation: {
      x: -0.05,
      xref: "paper",
      y,
      yref: "y",
      text: `${label}<br>${Number(y).toFixed(2)}`,
      showarrow: false,
      font: { color, size: 12 },
      xanchor: "right",
      yanchor: "middle",
      bgcolor: "rgba(0,0,0,0)",
      bordercolor: color,
      borderwidth: 1,
    },
  };
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  apiUrl = import.meta.env.VITE_API_URL,
}) => {
  // --- filter state ---
  const [ticker, setTicker] = useState<string>("xauusd");
  const [timeframe, setTimeframe] = useState<string>("5min");
  const [tradingDate, setTradingDate] = useState<Date | null>(new Date());

  const { data: candles = [], isLoading, error, noData } = useCandles(
    ticker,
    timeframe,
    apiUrl,
    tradingDate
  );

  return (
    <MantineProvider>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        style={{
          width: "90vw",
          height: "80vh",
          minHeight: 600,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* --- Filters --- */}
        <Group mb="md" gap="md" align="center">
          <Text size="sm" fw={500}>Ticker:</Text>
          <Select
            value={ticker}
            onChange={(val) => val && setTicker(val)}
            data={[{ value: "xauusd", label: "XAUUSD" }]}
            w={120}
          />
          <Text size="sm" fw={500}>Timeframe:</Text>
          <Select
            value={timeframe}
            onChange={(val) => val && setTimeframe(val)}
            data={[{ value: "5min", label: "5 Minutes" }]}
            w={120}
          />
          <Text size="sm" fw={500}>Trading Date:</Text>
          <DatePickerInput
            value={tradingDate}
            onChange={(val) => setTradingDate(val ? new Date(val) : null)}
            w={180}
          />
        </Group>

        {/* --- Chart or messages --- */}
        <Text size="xl" fw={500} mb="md">
          {tradingDate
            ? tradingDate.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : ""}
        </Text>

        {isLoading ? (
          <Center style={{ flex: 1 }}>
            <Loader size="xl" variant="dots" />
          </Center>
        ) : error ? (
          <Center style={{ flex: 1 }}>
            <Text c="red" size="lg">
              Failed to load candles: {error.message}
            </Text>
          </Center>
        ) : noData ? (
          <Center style={{ flex: 1 }}>
            <Text c="dimmed" size="lg">
              No data available for{" "}
              {tradingDate
                ? tradingDate.toLocaleDateString()
                : "the selected date"}
            </Text>
          </Center>
        ) : (
          <Plot
            data={[
              {
                x: candles.map((c) => c.timestamp_sgt),
                open: candles.map((c) => c.open),
                high: candles.map((c) => c.high),
                low: candles.map((c) => c.low),
                close: candles.map((c) => c.close),
                type: "candlestick",
                name: "Price",
                increasing: {
                  line: { color: "green", width: 1.5 },
                  fillcolor: "white",
                },
                decreasing: {
                  line: { color: "red", width: 1.5 },
                  fillcolor: "red",
                },
              },
              {
                x: candles.filter((c) => c.ema20 != null).map((c) => c.timestamp_sgt),
                y: candles.filter((c) => c.ema20 != null).map((c) => c.ema20!),
                type: "scatter",
                mode: "lines",
                line: { color: "purple", width: 1.5 },
                name: "EMA20",
                hoverinfo: "y+name",
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 160, r: 10, t: 40, b: 40 },
              xaxis: { rangeslider: { visible: false }, type: "date" },
              yaxis: { autorange: true },
              shapes: [
                makeLineAndLabel(
                  candles[0]?.prev_day_high ?? 0,
                  "green",
                  "Prev Day High",
                  candles[0].timestamp_sgt,
                  candles[candles.length - 1].timestamp_sgt
                ).shape,
                makeLineAndLabel(
                  candles[0]?.prev_day_low ?? 0,
                  "red",
                  "Prev Day Low",
                  candles[0].timestamp_sgt,
                  candles[candles.length - 1].timestamp_sgt
                ).shape,
                {
                  type: "rect",
                  xref: "x",
                  yref: "y",
                  x0: candles[0].timestamp_sgt,
                  x1: candles[candles.length - 1].timestamp_sgt,
                  y0: candles[0]?.prev_day_low ?? 0,
                  y1: candles[0]?.prev_day_high ?? 0,
                  fillcolor: "rgba(173,216,230,0.2)",
                  line: { width: 0 },
                  layer: "below",
                },
              ],
              annotations: [
                makeLineAndLabel(
                  candles[0]?.prev_day_high ?? 0,
                  "green",
                  "Prev Day High",
                  candles[0].timestamp_sgt,
                  candles[candles.length - 1].timestamp_sgt
                ).annotation,
                makeLineAndLabel(
                  candles[0]?.prev_day_low ?? 0,
                  "red",
                  "Prev Day Low",
                  candles[0].timestamp_sgt,
                  candles[candles.length - 1].timestamp_sgt
                ).annotation,
              ],
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        )}
      </Card>
    </MantineProvider>
  );
};
