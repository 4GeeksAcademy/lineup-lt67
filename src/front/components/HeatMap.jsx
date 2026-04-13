import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const GDL_CENTER = [20.6737, -103.3440];

export default function HeatMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js";
    script.onload = () => {

      if (mapInstanceRef.current) return
      if(!mapRef.current) return

      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }

      const map = L.map(mapRef.current, {
        center: GDL_CENTER,
        zoom: 12
      });
      
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO"
      }).addTo(map);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/heatmap/data`)
        .then(res => res.json())
        .then(data => {
          const points = data.map(p => [p.lat, p.lng, p.weight || 0.5]);
          L.heatLayer(points, {
            radius: 40,
            blur: 25,
            maxZoom: 16,
            gradient: {
              0.0: "#313695",
              0.4: "#74add1",
              0.6: "#fee090",
              0.8: "#f46d43",
              1.0: "#d73027"
            }
          }).addTo(map);
        })
        .catch(err => console.error("Error heatmap:", err));
    };
    document.head.appendChild(script);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "500px", borderRadius: "12px" }}
    />
  );
}