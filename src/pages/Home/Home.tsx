import { useState } from "react";
import { Card, Text, Center, NavLink, Flex } from "@mantine/core";
import IntradayPage from "../IntradayPage";
import BacktestPage from "../BacktestPage";
import JournalPage from "../JournalPage";
import ReplayPage from "../ReplayPage";

export default function Home() {
  const [activePage, setActivePage] = useState<string | null>(null);

  return (
    <Flex style={{ height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 128,
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #dee2e6",
          padding: "1rem",
        }}
      >
        <NavLink
          label="Intraday"
          active={activePage === "intraday"}
          onClick={() => setActivePage("intraday")}
        />
        <NavLink
          label="Backtest"
          active={activePage === "backtest"}
          onClick={() => setActivePage("backtest")}
        />
        <NavLink
          label="Journal"
          active={activePage === "journal"}
          onClick={() => setActivePage("journal")}
        />
        <NavLink
          label="Replay"
          active={activePage === "replay"}
          onClick={() => setActivePage("replay")}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "1rem" }}>
        {!activePage && (
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

        {activePage === "intraday" && <IntradayPage />}
        {activePage === "backtest" && <BacktestPage />}
        {activePage === "journal" && <JournalPage />}
        {activePage === "replay" && <ReplayPage />}
      </div>
    </Flex>
  );
}
