import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./app/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider>
          {/* ✅ Notifications must be inside MantineProvider */}
          <Notifications
            position="top-right"
            zIndex={2000}
            autoClose={1500}
            transitionDuration={750}
          />
          <App />
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
