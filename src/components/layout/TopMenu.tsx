import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Group, Button, Container } from "@mantine/core";

export default function TopMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage = location.pathname === "/backtest" ? "backtest" : "intraday";

  return (
    <Paper
      shadow="sm"
      p="sm"
      mb="lg"
      style={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container>
        <Group spacing={16} position="left">
          <Button
            variant={activePage === "intraday" ? "filled" : "outline"}
            color={activePage === "intraday" ? "blue" : "gray"}
            onClick={() => navigate("/intraday")}
          >
            Intraday
          </Button>
          <Button
            variant={activePage === "backtest" ? "filled" : "outline"}
            color={activePage === "backtest" ? "blue" : "gray"}
            onClick={() => navigate("/backtest")}
          >
            Backtest
          </Button>
        </Group>
      </Container>
    </Paper>
  );
}
