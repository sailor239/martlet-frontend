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
  SimpleGrid,
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
      x: 0,
      xref: "paper",
      y,
      yref: "y",
      text: label,
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

  const { data: candles, isLoading, error } = useCandles(
    ticker,
    timeframe,
    apiUrl,
    tradingDate
  );

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
  const prevDayHigh = candles[0]?.prev_day_high ?? 0;
  const prevDayLow = candles[0]?.prev_day_low ?? 0;

  const xVals = candles.map((c) => c.timestamp_sgt);

  // --- EMA20 trace ---
  const emaTrace = {
    x: xVals.filter((_, i) => candles[i].ema20 != null),
    y: candles.filter((c) => c.ema20 != null).map((c) => c.ema20!),
    type: "scatter",
    mode: "lines",
    line: { color: "purple", width: 1.5 },
    name: "EMA20",
    hoverinfo: "y+name",
  };

  // --- Previous day high/low lines + labels ---
  const { shape: highLine, annotation: highAnnotation } = makeLineAndLabel(
    prevDayHigh,
    "green",
    "Prev Day High",
    xVals[0],
    xVals[xVals.length - 1]
  );
  const { shape: lowLine, annotation: lowAnnotation } = makeLineAndLabel(
    prevDayLow,
    "red",
    "Prev Day Low",
    xVals[0],
    xVals[xVals.length - 1]
  );

  // --- Shaded previous day range ---
  const rangeShape = {
    type: "rect",
    xref: "x",
    yref: "y",
    x0: xVals[0],
    x1: xVals[xVals.length - 1],
    y0: prevDayLow,
    y1: prevDayHigh,
    fillcolor: "rgba(173,216,230,0.2)",
    line: { width: 0 },
    layer: "below",
  };

  return (
    <MantineProvider>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        style={{
          width: "90vw",
          height: "80vh",
          minHeight: 500, // ensures enough vertical space
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* --- Filters --- */}
        <Group mb="md" gap="md">
          <Select
            label="Ticker"
            value={ticker}
            onChange={(val) => val && setTicker(val)}
            data={["xauusd"]}
            w={120}
          />
          <Select
            label="Timeframe"
            value={timeframe}
            onChange={(val) => val && setTimeframe(val)}
            data={[
              { value: "5min", label: "5 Minutes" },
            ]}
            w={120}
          />
          <DatePickerInput
            label="Trading Date"
            placeholder="Pick a date"
            value={tradingDate}
            onChange={(val) => setTradingDate(val ? new Date(val) : null)}
            clearable
            w={180}
          />
        </Group>

        {/* --- Chart --- */}
        <Text size="xl" fw={500} mb="md">
          Candlestick Chart - {latestTradingDate}
        </Text>

        <Plot
          data={[
            {
              x: xVals,
              open: candles.map((c) => c.open),
              high: candles.map((c) => c.high),
              low: candles.map((c) => c.low),
              close: candles.map((c) => c.close),
              type: "candlestick",
              name: "Price",
              increasing: {
                line: { color: "green", width: 1.5 },
                fillcolor: "white",
              }, // hollow up
              decreasing: {
                line: { color: "red", width: 1.5 },
                fillcolor: "red",
              }, // solid down
            },
            emaTrace,
          ]}
          layout={{
            autosize: true,
            margin: { l: 120, r: 10, t: 40, b: 40 },
            xaxis: { rangeslider: { visible: false }, type: "date" },
            yaxis: { autorange: true },
            shapes: [highLine, lowLine, rangeShape],
            annotations: [highAnnotation, lowAnnotation],
          }}
          style={{ width: "100%", height: "100%" }}
          useResizeHandler={true}
        />
      </Card>
    </MantineProvider>
  );
};
