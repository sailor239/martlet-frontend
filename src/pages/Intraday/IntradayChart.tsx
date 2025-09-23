import Plot from "react-plotly.js";
import type { Candle } from "../../types/candle";
import type { Trade } from "./hooks";

interface Props {
  candles: Candle[];
  trades?: Trade[];
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

export default function IntradayChart({ candles, trades = [] }: Props) {
  if (!candles.length) return null;

  const x0 = candles[0].timestamp_sgt;
  const x1 = candles[candles.length - 1].timestamp_sgt;

  return (
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
          increasing: { line: { color: "green", width: 1.5 }, fillcolor: "white" },
          decreasing: { line: { color: "red", width: 1.5 }, fillcolor: "red" },
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
        // Entry markers
        {
          x: trades.map((t) => t.entry_time),
          y: trades.map((t) => t.entry_price),
          text: trades.map((t) => `${t.direction.toUpperCase()} x ${t.size}`),
          mode: "markers+text",
          textposition: "top center",
          name: "Entries",
          marker: {
            symbol: trades.map((t) =>
              t.direction === "long" ? "triangle-up" : "triangle-down"
            ),
            size: 14,
            color: trades.map((t) =>
              t.direction === "long" ? "green" : "red"
            ),
          },
        },
        // Exit markers
        {
          x: trades.filter((t) => t.exit_time).map((t) => t.exit_time!),
          y: trades.filter((t) => t.exit_price).map((t) => t.exit_price!),
          text: trades.filter((t) => t.exit_time).map(() => "Exit"),
          mode: "markers+text",
          textposition: "bottom center",
          name: "Exits",
          marker: {
            symbol: "circle",
            size: 12,
            color: trades.map((t) => {
              if (!t.exit_price) return "gray"; // still open
              const profit = t.direction === "long"
                ? t.exit_price > t.entry_price
                : t.exit_price < t.entry_price;
              return profit ? "green" : "red";
            })
          },
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 160, r: 10, t: 40, b: 40 },
        xaxis: { rangeslider: { visible: false }, type: "date" },
        yaxis: { autorange: true },
        shapes: [
          makeLineAndLabel(candles[0]?.prev_day_high ?? 0, "green", "Prev Day High", x0, x1).shape,
          makeLineAndLabel(candles[0]?.prev_day_low ?? 0, "red", "Prev Day Low", x0, x1).shape,
          {
            type: "rect",
            xref: "x",
            yref: "y",
            x0,
            x1,
            y0: candles[0]?.prev_day_low ?? 0,
            y1: candles[0]?.prev_day_high ?? 0,
            fillcolor: "rgba(173,216,230,0.2)",
            line: { width: 0 },
            layer: "below",
          },
        ],
        annotations: [
          makeLineAndLabel(candles[0]?.prev_day_high ?? 0, "green", "Prev Day High", x0, x1).annotation,
          makeLineAndLabel(candles[0]?.prev_day_low ?? 0, "red", "Prev Day Low", x0, x1).annotation,
        ],
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
    />
  );
}
