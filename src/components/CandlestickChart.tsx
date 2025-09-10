import React from "react";
import Plot from "react-plotly.js";
import { MantineProvider, Card, Text, Loader, Center } from "@mantine/core";
import { useCandles } from "./useCandles";

interface CandlestickChartProps {
  ticker: string;
  timeframe: string;
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
      x: 0, // left edge
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
    fillcolor: "rgba(173,216,230,0.2)", // light blue
    line: { width: 0 },
    layer: "below",
  };

  return (
    <MantineProvider>
      <Card shadow="sm" padding="lg" radius="md" style={{ width: "80vw", height: "60vh" }}>
        <Text component="h2" style={{ fontWeight: 500, fontSize: 20, marginBottom: 16 }}>
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
              increasing: { line: { color: "green", width: 1.5 }, fillcolor: "white" }, // hollow up with green border
              decreasing: { line: { color: "red", width: 1.5 }, fillcolor: "red" },      // solid down
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
