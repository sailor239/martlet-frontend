// src/components/trades/TradeForm.tsx
import React, { useState } from "react";
import { Button, Group, NumberInput, Select, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useAddTrade } from "./hooks";

export const TradeForm: React.FC = () => {
  const [symbol, setSymbol] = useState("XAUUSD");
  const [side, setSide] = useState("long");
  const [entryPrice, setEntryPrice] = useState<number | "">(0);
  const [exitPrice, setExitPrice] = useState<number | "">("");
  const [entryTime, setEntryTime] = useState<Date | null>(new Date());
  const [exitTime, setExitTime] = useState<Date | null>(null);

  const addTrade = useAddTrade();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrade.mutate({
      symbol,
      side,
      entry_price: entryPrice,
      exit_price: exitPrice || null,
      entry_time: entryTime?.toISOString(),
      exit_time: exitTime?.toISOString() ?? null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.currentTarget.value)}
        required
      />

      <Select
        label="Side"
        value={side}
        onChange={(val) => val && setSide(val)}
        data={[
          { value: "long", label: "Long" },
          { value: "short", label: "Short" },
        ]}
        required
        mt="sm"
      />

      <NumberInput
        label="Entry Price"
        value={entryPrice}
        onChange={setEntryPrice}
        required
        mt="sm"
      />

      <NumberInput
        label="Exit Price"
        value={exitPrice}
        onChange={setExitPrice}
        mt="sm"
      />

      <DateTimePicker
        label="Entry Time"
        value={entryTime}
        onChange={setEntryTime}
        required
        mt="sm"
      />

      <DateTimePicker
        label="Exit Time"
        value={exitTime}
        onChange={setExitTime}
        mt="sm"
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit" loading={addTrade.isPending}>
          Save Trade
        </Button>
      </Group>
    </form>
  );
};
