// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./app/material 5/MaterialTheme";
import { BrowserRouter as Router } from "react-router-dom";
import "./css/index.css";
import "./css/elegant.css";
import ContextProvider from "./app/context/ContextProvider";
import "./i18n";
import { SocketProvider } from "./app/context/SocketContext";


(function () {
  const devWidth = 2160;
  const devDPR = 1.3333;
  const currentWidth = window.innerWidth;
  const currentDPR = window.devicePixelRatio;
  const baseZoom = (devWidth / currentWidth) * (devDPR / currentDPR);
  const zoom = baseZoom * 0.66;

  document.documentElement.style.zoom = zoom.toFixed(2);
  console.log(" VPS scaling applied:", document.documentElement.style.zoom);
})();


const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <SocketProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <App />
            </Router>
          </ThemeProvider>
        </SocketProvider>
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

