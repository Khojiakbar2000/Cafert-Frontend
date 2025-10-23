// src/app/hooks/useVpsZoom.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useVpsZoom() {
  const location = useLocation();

  useEffect(() => {
    const allowedHosts = ["72.60.236.97", "cafert.uz"];
    if (!allowedHosts.includes(window.location.hostname)) return;

    const applyZoom = () => {
      const devWidth = 2160;
      const devDPR = 1.3333;
      const currentWidth = window.innerWidth;
      const currentDPR = window.devicePixelRatio;
      const baseZoom = (devWidth / currentWidth) * (devDPR / currentDPR);
      const zoom = baseZoom * 0.66;

      document.documentElement.style.zoom = zoom.toFixed(2);
      const realVh = window.innerHeight * zoom;
      document.documentElement.style.setProperty("--real-vh", `${realVh}px`);

      console.log(
        ` Zoom applied: ${zoom.toFixed(2)} | Path: ${location.pathname}`
      );
    };

   
    applyZoom();

 
    window.addEventListener("resize", applyZoom);


    return () => window.removeEventListener("resize", applyZoom);
  }, [location.pathname]);
}