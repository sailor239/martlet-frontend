import React from "react";
import {
  Container,
  Grid,
  Title,
  Card,
  Loader,
  Text,
  Center,
  Tabs,
  rem,
} from "@mantine/core";
import { IconChartBar, IconClipboardList, IconCalendarStats } from "@tabler/icons-react";
import { TradeForm, TradeList, useTrades } from "../journal";
import { TradeAnalytics } from "./components/TradingAnalytics";
import { DailyPerformance } from "./components/DailyPerformance";

export const JournalPage: React.FC = () => {
  const { data: trades, isLoading, error } = useTrades();

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="lg">
        Trading Journal
      </Title>

      <Tabs defaultValue="manage">
        <Tabs.List grow mb="xl">
          <Tabs.Tab value="daily" leftSection={<IconCalendarStats style={{ width: rem(16), height: rem(16) }} />}>
            Daily Performance
          </Tabs.Tab>
          <Tabs.Tab value="manage" leftSection={<IconClipboardList style={{ width: rem(16), height: rem(16) }} />}>
            Trade Management
          </Tabs.Tab>
          <Tabs.Tab value="analytics" leftSection={<IconChartBar style={{ width: rem(16), height: rem(16) }} />}>
            Trading Analytics
          </Tabs.Tab>
        </Tabs.List>

        {/* --- Daily Performance Tab --- */}
        <Tabs.Panel value="daily">
          {isLoading && (
            <Center style={{ height: "200px" }}>
              <Loader size="lg" variant="dots" />
            </Center>
          )}

          {error && <Text c="red">Failed to load trades: {error.message}</Text>}

          {!isLoading && !error && trades && <DailyPerformance trades={trades} />}
        </Tabs.Panel>

        {/* --- Manage Trades Tab --- */}
        <Tabs.Panel value="manage">
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Add Trade
                </Title>
                <TradeForm />
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Your Trades
                </Title>

                {isLoading && (
                  <Center style={{ height: "200px" }}>
                    <Loader size="lg" variant="dots" />
                  </Center>
                )}

                {error && (
                  <Text c="red">Failed to load trades: {error.message}</Text>
                )}

                {!isLoading && !error && trades && <TradeList trades={trades} />}
              </Card>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* --- Trade Analytics Tab --- */}
        <Tabs.Panel value="analytics">
          {isLoading && (
            <Center style={{ height: "200px" }}>
              <Loader size="lg" variant="dots" />
            </Center>
          )}

          {error && <Text c="red">Failed to load trades: {error.message}</Text>}

          {!isLoading && !error && trades && <TradeAnalytics trades={trades} />}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};
