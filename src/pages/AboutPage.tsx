import { Container, Text, Paper } from "@mantine/core";

export default function About() {
  return (
    <Container style={{ padding: 40, maxWidth: 800 }}>
      <Paper shadow="xs" style={{ backgroundColor: "#f8fafc" }}>
        <Text size="xl" fw={700} c="#1e293b">
          About Martlet
        </Text>
        <Text mt="md" c="#475569">
          Work in progress...
        </Text>
      </Paper>
    </Container>
  );
}