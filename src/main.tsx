import { ThemeProvider } from "@/components/theme-provider";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import "./App.css";
import { router } from "./app/router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
