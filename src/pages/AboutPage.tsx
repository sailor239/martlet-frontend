import { Card, Text } from "@mantine/core";

export default function About() {
  return (
    <Card shadow="sm" p="lg" radius="md" style={{ width: "100%", height: "80vh", minHeight: 600, display: "flex", flexDirection: "column" }}> 
      <Text size="xl" fw={700} c="#1e293b">
        About Martlet
      </Text>
      <Text mt="md" c="#475569">
        Work in progress...
      </Text>
    </Card>
  );
}