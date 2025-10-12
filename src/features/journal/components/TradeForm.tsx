// src/components/trades/TradeForm.tsx
import React, { useState } from "react";
import { Button, Group, NumberInput, Select, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useAddTrade } from "../hooks/useJournal";

export const TradeForm: React.FC = () => {
  const [ticker, setTicker] = useState("xauusd");
  const [direction, setDirection] = useState("long");
  const [size, setSize] = useState<number>(0.01);
  const [entryPrice, setEntryPrice] = useState<number | "">("");
  const [exitPrice, setExitPrice] = useState<number | "">("");
  const [entryTime, setEntryTime] = useState<Date | null>(new Date());
  const [exitTime, setExitTime] = useState<Date | null>(new Date());

  const addTrade = useAddTrade();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- validate required fields ---
    if (!ticker || !direction || entryPrice === "" || !entryTime) {
      alert("Please fill all required fields");
      return;
    }

    addTrade.mutate({
      ticker: ticker.toLowerCase(),
      direction: direction.toLowerCase(),
      size: Number(size),                     // always a number
      type: "real",
      entry_price: Number(entryPrice),        // always a number
      exit_price: exitPrice === "" ? null : Number(exitPrice),  // optional
      entry_time: entryTime.toISOString(),    // always string ISO
      exit_time: exitTime ? exitTime.toISOString() : null, // optional
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Ticker"
        value={ticker.toUpperCase()}
        onChange={(e) => setTicker(e.currentTarget.value)}
        required
      />
      <Select
        label="Direction"
        value={direction}
        onChange={(val) => val && setDirection(val)}
        data={[
          { value: "long", label: "Long" },
          { value: "short", label: "Short" },
        ]}
        required
        mt="sm"
      />
      <NumberInput
        label="Size"
        value={size}
        onChange={(val) => setSize(typeof val === "number" ? val : 0.01)} // fallback to 0.01 if cleared
        step={0.01}
        min={0.01}
      />
      <NumberInput
        label="Entry Price"
        value={entryPrice}
        onChange={(val) => setEntryPrice(typeof val === "number" ? val : "")}
        required
        mt="sm"
      />
      <NumberInput
        label="Exit Price"
        value={exitPrice}
        onChange={(val) => setExitPrice(typeof val === "number" ? val : "")}
        required
        mt="sm"
      />
      <DateTimePicker
        label="Entry Time"
        value={entryTime}
        onChange={(val: string | null) => {
          if (val) {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
              setEntryTime(date);
            }
          } else {
            setEntryTime(null);
          }
        }}
        required
        mt="sm"
      />
      <DateTimePicker
        label="Exit Time"
        value={exitTime}
        onChange={(val: string | null) => {
          if (val) {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
              setExitTime(date);
            }
          } else {
            setExitTime(null);
          }
        }}
        required
        mt="sm"
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit" loading={addTrade.isPending}>
          Submit
        </Button>
      </Group>
    </form>
  );
};
