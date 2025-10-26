import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import TopMenu from "../components/layout/TopMenu";
import Home from "../pages/Home/Home";
import About from "../pages/AboutPage";
import { RoadmapPage } from "../pages/RoadmapPage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegesterPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function App() {
  return (
      <BrowserRouter>
        <TopMenu /> {/* Visible on all pages */}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
            <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          {/* <Route path="/intraday" element={<Intraday />} />
          <Route path="/backtest" element={<Backtest />} /> */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
