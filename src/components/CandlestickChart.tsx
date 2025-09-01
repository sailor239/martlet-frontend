import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

type Candle = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export const CandlestickChart: React.FC = () => {
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
    //   const res = await fetch("http://127.0.0.1:8000/candles");
      const res = await fetch("https://martlet-backend.onrender.com/candles");
      const data = await res.json();
      setCandles(data);
    };

    fetchData();
  }, []);

  if (candles.length === 0) {
    return <p>Loading chart...</p>;
  }

  return (
  <div style={{ width: "80vw", height: "60vh" }}>
    <Plot
      data={[
        {
          x: candles.map(c => c.timestamp),
          open: candles.map(c => c.open),
          high: candles.map(c => c.high),
          low: candles.map(c => c.low),
          close: candles.map(c => c.close),
          type: "candlestick",
        },
      ]}
      layout={{
        title: "Candlestick Chart",
        autosize: true,
        margin: { l: 60, r: 10, t: 40, b: 40 },
        xaxis: {
          rangeslider: { visible: false },
          type: "date",
        },
        yaxis: {
          autorange: true,
        },
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
    />
  </div>
);

};
