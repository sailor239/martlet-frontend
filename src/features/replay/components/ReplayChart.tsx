import { Modal, Button, Group, NumberInput, Select, Text, Switch } from "@mantine/core";
import { useState } from "react";
import Plot from "react-plotly.js";
import type { Candle } from "../../../types/candle";
import type { Trade } from "../hooks/useIntraday";

interface Props {
  candles: Candle[];
  trades?: Trade[];
  cumulativePL?: number[];
  onTradeMarked?: (trade: Trade) => void;
}

export default function ReplayChart({ candles, trades = [], cumulativePL = [], onTradeMarked }: Props) {
  if (!candles.length) return null;
  
  const [markMode, setMarkMode] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  // track active entry
  const [activeEntry, setActiveEntry] = useState<any>(null);

  // entry fields
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [size, setSize] = useState<number>(0.01);
  const [entryPriceType, setEntryPriceType] = useState<"open" | "close">("close");

  // exit fields
  const [exitPriceType, setExitPriceType] = useState<"open" | "close">("close");

  const handleClick = (event: any) => {
    if (!markMode) return; // only allow marking when enabled

    const point = event.points?.[0];
    if (!point) return;

    setSelectedPoint({
      x: point.x, // timestamp
      y: point.y, // raw y, but we will override with open/close
      idx: point.pointIndex,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedPoint) return;

    if (!activeEntry) {
      // save entry
      const candle = candles[selectedPoint.idx];
      const entryPrice = entryPriceType === "open" ? candle.open : candle.close;
      const entry = {
        direction,
        size,
        entry_time: selectedPoint.x,
        entry_price: entryPrice,
      };
      setActiveEntry(entry);
      console.log("Entry logged:", entry);
    } else {
      // save exit trade
      const candle = candles[selectedPoint.idx];
      const exitPrice = exitPriceType === "open" ? candle.open : candle.close;

      const trade = {
        ...activeEntry,
        exit_time: selectedPoint.x,
        exit_price: exitPrice,
      };
      console.log("Full trade:", trade);

      onTradeMarked?.(trade);
      setActiveEntry(null); // reset for next trade
    }

    setModalOpen(false);
  };

  return (
    <>
      <Group gap="xs" align="center">
        <Switch
          checked={markMode}
          onChange={(e) => setMarkMode(e.currentTarget.checked)}
          label={null} // remove built-in label
          styles={{
            input: { cursor: "pointer" }, // the hidden checkbox
            track: { cursor: "pointer" }, // the switch track
            thumb: { cursor: "pointer" }, // the knob
          }}
        />
        <Text size="sm" fw={500} style={{ cursor: "default", userSelect: "none" }}>
          Mark Trades
        </Text>
      </Group>

      <Plot
        key={candles[candles.length - 1].timestamp_sgt}
        data={[
          // Candlestick
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
            xaxis: "x",
            yaxis: "y",
          },
          // EMA20
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
          // Cumulative P/L
          {
            x: candles.map(c => c.timestamp_sgt), // same as candlesticks
            y: cumulativePL,
            type: "scatter",
            mode: "lines+markers",
            line: { color: "orange", width: 2 },
            name: "Cumulative P/L",
            yaxis: "y2",
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 160, r: 10, t: 40, b: 40 },
          grid: { rows: 2, columns: 1, roworder: "top to bottom", row_heights: [0.9, 0.1], },
          xaxis: { rangeslider: { visible: false }, type: "date" },
          yaxis: { title: "Price", domain: [0.3, 1], },
          yaxis2: { title: "Cumulative P/L", domain: [0, 0.3], },
          legend: {
            orientation: "h", // horizontal layout
            yanchor: "top",
            y: -0.2, // push below chart
            xanchor: "center",
            x: 0.5,
          },
          hovermode: "x unified",
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
        config={{ responsive: true, displayModeBar: false }}
        // @ts-ignore
        onClick={handleClick}
      />
      
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={activeEntry ? "Mark Exit" : "Mark Entry"}
      >
        {!activeEntry ? (
          <>
            <Select
              label="Direction"
              data={[
                { value: "long", label: "Long" },
                { value: "short", label: "Short" },
              ]}
              value={direction}
              onChange={(val) => setDirection(val as "long" | "short")}
              mb="sm"
            />
            <NumberInput
              label="Size"
              value={size}
              onChange={(val) => setSize(typeof val === "number" ? val : Number(val) || 0.01)}
              min={0.01}
              step={0.01}
            />
            <Select
              label="Entry price"
              data={[
                { value: "open", label: "Open price" },
                { value: "close", label: "Close price" },
              ]}
              value={entryPriceType}
              onChange={(val) => setEntryPriceType(val as "open" | "close")}
            />
            {/* Preview */}
            <Text size="sm" c="dimmed">
              {selectedPoint
                ? `Selected entry price: ${
                    entryPriceType === "open"
                      ? candles[selectedPoint.idx].open.toFixed(2)
                      : candles[selectedPoint.idx].close.toFixed(2)
                  }`
                : "No candle selected yet"}
            </Text>
          </>
        ) : (
          <>
            <Text mb="sm">
              Exit trade for <b>{activeEntry.direction}</b> size{" "}
              <b>{activeEntry.size}</b>
            </Text>
            <Select
              label="Exit price"
              data={[
                { value: "open", label: "Open price" },
                { value: "close", label: "Close price" },
              ]}
              value={exitPriceType}
              onChange={(val) => setExitPriceType(val as "open" | "close")}
            />
            <Text size="sm" c="dimmed">
              {selectedPoint
                ? `Selected exit price: ${
                    exitPriceType === "open"
                      ? candles[selectedPoint.idx].open.toFixed(2)
                      : candles[selectedPoint.idx].close.toFixed(2)
                  }`
                : "No candle selected yet"}
            </Text>
          </>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {activeEntry ? "Confirm Exit" : "Confirm Entry"}
          </Button>
        </Group>
      </Modal>
    </>
  );
}
