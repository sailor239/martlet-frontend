import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, type CandlestickData, type UTCTimestamp } from 'lightweight-charts';

type Candle = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export const CandlestickChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null); // Store chart instance

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#000000',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

    const fetchData = async () => {
      const res = await fetch('http://127.0.0.1:8000/candles');
      const candles: Candle[] = await res.json();

      const transformedData: CandlestickData[] = candles
        .map((c) => ({
          time: Math.floor(new Date(c.timestamp).getTime() / 1000) as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
        // .sort((a, b) => a.time - b.time); // Ensure ascending order

      series.setData(transformedData);
    };

    fetchData();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          chart.applyOptions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: '100%', minHeight: '500px' }}
    />
  );
};
