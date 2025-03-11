import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { theme } from "./styles/theme";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/easter-market-admin/sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });
  });
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/easter-market-admin">
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>
);
