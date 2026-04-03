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
import { HelmetProvider } from "react-helmet-async";
import "./css/index.css";
import "./css/elegant.css";
import ContextProvider from "./app/context/ContextProvider";
import "./i18n";
import { SocketProvider } from "./app/context/SocketContext";
import axios from "axios";

// Configure axios defaults for cookie handling
// This ensures cookies are sent with all requests to the same origin or configured API
axios.defaults.withCredentials = true;

// Development-specific cookie fix
// In development, cookies might not work properly due to different ports
// This helps ensure cookies are accessible
if (process.env.NODE_ENV === 'development') {
  // Log cookie status for debugging (only in development)
  console.log('=== DEVELOPMENT MODE ===');
  console.log('Current origin:', window.location.origin);
  console.log('API URL:', process.env.REACT_APP_API_URL || 'http://localhost:3003');
  console.log('Cookies available:', document.cookie);
  
  // Note: The backend must set cookies with:
  // - domain: 'localhost' (without port)
  // - sameSite: 'lax' or 'none' (with secure: true if using HTTPS)
  // - path: '/'
}



const container = document.getElementById("root")!;
const root = createRoot(container);

// Zoom fix for VPS and production - prevents infinite resize loops
// Works on: VPS (72.60.236.97), production (cafert.uz), and localhost for testing
(function () {
  const allowedHosts = ["72.60.236.97", "cafert.uz", "localhost", "127.0.0.1"];
  if (!allowedHosts.includes(window.location.hostname)) return;

  // Store state on window to persist across hot reloads and prevent loops
  if (!(window as any).__ZOOM_STATE__) {
    (window as any).__ZOOM_STATE__ = {
      isApplyingZoom: false,
      lastAppliedZoom: null,
      ignoreNextResize: false
    };
  }
  const zoomState = (window as any).__ZOOM_STATE__;

  /** Opt-out via `<html data-disable-viewport-zoom="true">` only (no route exceptions). */
  const shouldSkipViewportZoom = () =>
    document.documentElement.getAttribute("data-disable-viewport-zoom") === "true";

  const applyZoom = () => {
    // Prevent infinite loop - don't apply if already applying
    if (zoomState.isApplyingZoom) {
      return;
    }

    if (shouldSkipViewportZoom()) {
      document.documentElement.style.zoom = "1";
      zoomState.lastAppliedZoom = "1";
      return;
    }

    zoomState.isApplyingZoom = true;

    const devWidth = 2160;
    const devDPR = 1.3333;
    const currentWidth = window.innerWidth;
    const currentDPR = window.devicePixelRatio;
    const baseZoom = (devWidth / currentWidth) * (devDPR / currentDPR);
    const zoom = baseZoom * 0.66;
    const zoomValue = zoom.toFixed(2);

    // Only apply if zoom value has actually changed
    if (zoomState.lastAppliedZoom === zoomValue) {
      zoomState.isApplyingZoom = false;
      return;
    }

    zoomState.lastAppliedZoom = zoomValue;
    
    // Set flag to ignore the next resize event (which zoom change might trigger)
    zoomState.ignoreNextResize = true;
    
    // Apply zoom
    document.documentElement.style.zoom = zoomValue;
    
    // Reset flags after a delay
    setTimeout(() => {
      zoomState.isApplyingZoom = false;
      // Give extra time before allowing resize handler to run again
      setTimeout(() => {
        zoomState.ignoreNextResize = false;
      }, 100);
    }, 200);
  };

  // Debounced resize handler
  const handleResize = () => {
    // Ignore resize events triggered by zoom changes
    if (zoomState.ignoreNextResize) {
      zoomState.ignoreNextResize = false;
      return;
    }
    
    // Prevent rapid-fire resize events
    if (zoomState.isApplyingZoom) {
      return;
    }
    
    clearTimeout(window.__zoomTimeout);
    window.__zoomTimeout = setTimeout(() => {
      if (!zoomState.isApplyingZoom) {
        applyZoom();
      }
    }, 300); // Increased debounce time
  };

  // Initial zoom application
  applyZoom();

  // Apply zoom on load (only once)
  if (!zoomState.loadListenerAttached) {
    window.addEventListener("load", applyZoom, { once: true });
    zoomState.loadListenerAttached = true;
  }

  // Attach resize listener (only once)
  if (!zoomState.resizeListenerAttached) {
    window.addEventListener("resize", handleResize);
    zoomState.resizeListenerAttached = true;
  }
})();



// Temporarily disable StrictMode to prevent double-invocation loops in development
// Re-enable for production if needed, but it causes loops with our effects
root.render(
  <HelmetProvider>
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
  </HelmetProvider>
);

reportWebVitals();

