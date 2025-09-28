import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import TopMenu from "../components/layout/TopMenu";
import Home from "../pages/Home/Home";
import About from "../pages/AboutPage";

function App() {
  return (
    // <MantineProvider>
      <BrowserRouter>
        <TopMenu /> {/* Visible on all pages */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/intraday" element={<Intraday />} />
          <Route path="/backtest" element={<Backtest />} /> */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
    // </MantineProvider>
  );
}

export default App;
