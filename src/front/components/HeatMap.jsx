// HeatMap.jsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const GDL_CENTER = [20.6737, -103.3440];

export default function HeatMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(GDL_CENTER, 12);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/heatmap/data`)
      .then(res => res.json())
      .then(data => {
        const points = data.map(p => [p.lat, p.lng, p.weight ?? 1.0]);
        L.heatLayer(points, {
          radius: 30,
          blur: 20,
          gradient: {
            0.0: "#313695",
            0.4: "#74add1",
            0.6: "#fee090",
            0.8: "#f46d43",
            1.0: "#d73027"
          }
        }).addTo(map);
      });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "500px", borderRadius: "12px" }} />
  );
}