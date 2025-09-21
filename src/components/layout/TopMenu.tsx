import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Group, Button, Container } from "@mantine/core";

export default function TopMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const activePage =
    path === "/" ? "home" : path.includes("backtest") ? "backtest" : "intraday";

  const pages = ["home"];
  // const pages = ["home", "intraday", "backtest"];
  const pathMap: Record<string, string> = {
    home: "/",
    // intraday: "/intraday",
    // backtest: "/backtest",
  };

  return (
    <Paper
      shadow="xs"
      style={{
        background: "#5f6e83ff", // background color
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: 60, // height of the menu bar
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Container style={{ display: "flex", alignItems: "stretch", height: "100%" }}>
        <Group grow gap="0" style={{ height: "100%" }}>
          {pages.map((page) => {
            const isActive = activePage === page;
            const label = page.charAt(0).toUpperCase() + page.slice(1);

            return (
              <Button
                key={page}
                variant={isActive ? "filled" : "subtle"}
                color="white"
                onClick={() => navigate(pathMap[page])}
                styles={{
                  root: {
                    height: "100%", // fill full height of menu bar
                    minHeight: 0,
                    borderRadius: 0, // flush buttons
                    color: isActive ? "#3b82f6" : "#fff",
                    fontWeight: 600,
                    minWidth: 120,   // 👈 minimum width
                    padding: "0 20px", // 👈 more horizontal padding
                  },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Group>
      </Container>
    </Paper>
  );
}
