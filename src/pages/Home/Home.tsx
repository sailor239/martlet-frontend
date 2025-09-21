import { useState } from "react";
import { Card, Text, Center, Tabs } from "@mantine/core";
import { Intraday } from "../Intraday/Intraday";
import { Backtest } from "../Backtest/Backtest";
import { Journal } from "../Journal/Journal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <Tabs
      value={activeTab}
      onChange={setActiveTab}
      variant="pills"
      radius="md"
      keepMounted={false}
    >
      <Tabs.List grow>
        <Tabs.Tab value="intraday">Intraday</Tabs.Tab>
        <Tabs.Tab value="backtest">Backtest</Tabs.Tab>
        <Tabs.Tab value="journal">Journal</Tabs.Tab>
      </Tabs.List>

      {/* Show welcome card only before a tab is selected */}
      {!activeTab && (
        <Center style={{ height: "60vh" }}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            style={{ width: 400, textAlign: "center" }}
          >
            <Text size="xl" fw={700} mb="md">
              Welcome to Martlet
            </Text>
            <Text size="sm" mb="lg">
              Choose a page to start analyzing intraday candles or backtesting your strategy.
            </Text>
          </Card>
        </Center>
      )}

      {/* Show tab content after selection */}
      {activeTab && (
        <>
          <Tabs.Panel value="intraday" pt="md">
            <Intraday />
          </Tabs.Panel>
          <Tabs.Panel value="backtest" pt="md">
            <Backtest />
          </Tabs.Panel>
          <Tabs.Panel value="journal" pt="md">
            <Journal />
          </Tabs.Panel>
        </>
      )}
    </Tabs>
  );
}
