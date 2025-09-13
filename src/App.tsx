import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import TopMenu from "./components/layout/TopMenu";
import { Intraday } from "./components/pages/Intraday/Intraday";
import Backtest from "./components/pages/Backtest/Backtest";

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <TopMenu /> {/* Visible on all pages */}

        <Routes>
          <Route path="/intraday" element={<Intraday />} />
          <Route path="/backtest" element={<Backtest />} />
          {/* <Route path="*" element={<Intraday />} /> */}
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
