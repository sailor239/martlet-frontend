import React from "react";
import {
  Box,
  Container,
  Group,
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
import { TradeForm, TradeList, TradeAnalytics, DailyPerformance, useTrades } from "../journal";

export const JournalPage: React.FC = () => {
  const { data: trades, isLoading, error } = useTrades();

  return (
    <Container size="xl" py="xl">
      <Tabs defaultValue="analytics">
        <Tabs.List grow mb="xl">
          <Tabs.Tab value="analytics">
            <Group gap="xs" justify="center" align="center">
              <IconChartBar style={{ width: rem(16), height: rem(16) }} />
              <Text>Trading Analytics</Text>
            </Group>
          </Tabs.Tab>
          <Tabs.Tab value="manage">
            <Group gap="xs" justify="center" align="center">
              <IconClipboardList style={{ width: rem(16), height: rem(16) }} />
              <Text>Trade Management</Text>
            </Group>
          </Tabs.Tab>
          <Tabs.Tab value="daily">
            <Group gap="xs" justify="center" align="center">
              <IconCalendarStats style={{ width: rem(16), height: rem(16) }} />
              <Text>Daily Performance</Text>
            </Group>
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
            <Grid.Col span={{ base: 12, md: 4 }} style={{ display: "flex", flexDirection: "column" }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box style={{ flex: "0 0 10px", display: "flex", alignItems: "center" }}>
                  <Title order={4}>Add Trade</Title>
                </Box>
                <Box style={{ flex: "1 1 auto", overflowY: "auto", paddingTop: "var(--mantine-spacing-md)" }}>
                  <TradeForm />
                </Box>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }} style={{ display: "flex", flexDirection: "column" }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box style={{ flex: "0 0 10px", display: "flex", alignItems: "center" }}>
                  <Title order={4}>Your Trades</Title>
                </Box>

                <Box style={{ flex: "1 1 auto", overflowY: "auto", paddingTop: "var(--mantine-spacing-md)" }}>
                  {isLoading && (
                    <Center style={{ height: "200px" }}>
                      <Loader size="lg" variant="dots" />
                    </Center>
                  )}

                  {error && <Text c="red">Failed to load trades: {error.message}</Text>}

                  {!isLoading && !error && trades && <TradeList trades={trades} />}
                </Box>
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
