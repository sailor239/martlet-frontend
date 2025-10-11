import Plot from "react-plotly.js";
import type { BacktestResult } from "../hooks/useBacktest";

interface Props {
  results: BacktestResult[];
}

export function BacktestChart({ results }: Props) {
  if (!results.length) return <div>No backtest data</div>;

  return (
    <Plot
      data={[
        {
          x: results.map(r => r.timestamp),
          y: results.map(r => r.equity),
          type: "scatter",
          mode: "lines+markers",
          name: "Equity Curve",
        },
      ]}
      layout={{
        title: "Backtest Results",
        yaxis: { title: "Equity" },
        xaxis: { title: "Time" },
      }}
      style={{ width: "100%", height: 600 }}
    />
  );
}
