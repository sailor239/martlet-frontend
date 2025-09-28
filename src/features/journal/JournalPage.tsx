import React from "react";
import { Container, Grid, Title, Card, Loader, Text, Center } from "@mantine/core";
import { TradeForm, TradeList, useTrades } from "../journal";

export const JournalPage: React.FC = () => {
  const { data: trades, isLoading, error } = useTrades();

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="lg">Trading Journal</Title>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Add Trade</Title>
            <TradeForm />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Your Trades</Title>

            {isLoading && (
              <Center style={{ height: "200px" }}>
                <Loader size="lg" variant="dots" />
              </Center>
            )}

            {error && <Text c="red">Failed to load trades: {error.message}</Text>}

            {!isLoading && !error && trades && (
              <TradeList trades={trades} />
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
