import React from "react";
import { MantineProvider, Card, Stack, Title, Timeline, Text, Badge } from "@mantine/core";

interface RoadmapItem {
  title: string;
  description?: string;
  status: "planned" | "in-progress" | "completed";
}

const roadmapData: RoadmapItem[] = [
  { title: "Allow user to view live intraday candles", status: "completed" },
  { title: "Allow user to record trades on journal page", status: "completed" },
  { title: "Allow user to mark trades directly on the intraday chart", status: "completed" },
  { title: "Show a live countdown to candle close on the intraday chart", status: "completed" },
  { title: "Allow user to replay the daily candles for manual backtesting", status: "completed" },
  { title: "Add multiple trading strategies to backtest", status: "completed" },
  { title: "Allow user to set different types of alerts", status: "planned" },
  { title: "Show the status of market: open or closed", status: "planned" },
  { title: "Add last updated time on the intraday page for the candlestick chart", status: "planned" },
  { title: "Add last run time on the backtest page for each strategy", status: "planned" },
];

const statusColor = {
  "planned": "gray",
  "in-progress": "yellow",
  "completed": "green",
};

export const RoadmapPage: React.FC = () => {
  return (
    <MantineProvider>
      <Card shadow="sm" p="lg" radius="md" style={{ width: "100%", height: "80vh", minHeight: 600, display: "flex", flexDirection: "column" }}> 
        <Stack gap="xl" p="lg" style={{ width: "100%", minHeight: "100vh" }}>
          <Title order={2}>Roadmap</Title>

          <Timeline active={roadmapData.filter(r => r.status === "completed").length} bulletSize={20} lineWidth={4}>
            {roadmapData.map((item, index) => (
              <Timeline.Item
                key={index}
                bullet={<Badge color={statusColor[item.status]} variant="filled" size="sm">{item.status.replace("-", " ")}</Badge>}
                title={item.title}
              >
                {item.description && <Text size="sm" c="dimmed">{item.description}</Text>}
              </Timeline.Item>
            ))}
          </Timeline>
        </Stack>
      </Card>
    </MantineProvider>
  );
};
