import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { MantineProvider, Card, Text, Loader, Center } from "@mantine/core";
import "@mantine/core/styles.css"; // Mantine global styles

type Candle = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export const CandlestickChart: React.FC = () => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/candles/xauusd");
        const text = await res.text();

        const parsed: Candle[] = text
          .trim()
          .split("\n")
          .map((line) => {
            const obj = JSON.parse(line);
            return {
              timestamp: obj.timestamp,
              open: parseFloat(obj.open),
              high: parseFloat(obj.high),
              low: parseFloat(obj.low),
              close: parseFloat(obj.close),
            };
          })
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

        setCandles(parsed);
      } catch (err) {
        console.error("Failed to fetch candles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MantineProvider>
      <Card shadow="sm" padding="lg" radius="md" style={{ width: "80vw", height: "60vh" }}>
        <Text
          component="h2"
          style={{
            fontWeight: 500,
            fontSize: 20,
            marginBottom: 16,
          }}
        >
          Candlestick Chart
        </Text>

        {loading ? (
          <Center style={{ height: "100%" }}>
            <Loader size="xl" variant="dots" />
          </Center>
        ) : (
          <Plot
            data={[
              {
                x: candles.map((c) => c.timestamp),
                open: candles.map((c) => c.open),
                high: candles.map((c) => c.high),
                low: candles.map((c) => c.low),
                close: candles.map((c) => c.close),
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
        )}
      </Card>
    </MantineProvider>
  );
};
