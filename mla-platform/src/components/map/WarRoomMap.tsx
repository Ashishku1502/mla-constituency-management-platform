"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { mapCenter } from "@/lib/mock-geo-data";

// Custom icons based on priority/type
const createIcon = (color: string) => L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const redIcon = createIcon("#ef4444"); // Critical
const amberIcon = createIcon("#f59e0b"); // High/Medium
const blueIcon = createIcon("#3b82f6"); // Ground Report

export default function WarRoomMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [markers, setMarkers] = useState<any[]>([]);
  const [constituencyBoundary, setConstituencyBoundary] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Fetch initial map boundaries
    fetch("/api/map").then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        const cFeature = data.find(f => f.featureType === "Constituency");
        if (cFeature) {
          try {
            setConstituencyBoundary(JSON.parse(cFeature.geoJson));
          } catch(e) {}
        }
      }
    });

    const fetchLiveData = () => {
      fetch("/api/war-room/live")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMarkers(data.data);
          }
        })
        .catch(console.error);
    };

    // Initial fetch
    fetchLiveData();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return <div className="h-full w-full flex items-center justify-center bg-muted/20">Loading Map...</div>;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={11}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {constituencyBoundary && (
          <GeoJSON
            data={constituencyBoundary}
            style={{
              color: "#3b82f6",
              weight: 2,
              fillColor: "transparent",
              dashArray: "5, 5"
            }}
          />
        )}

        {markers.map(m => {
          const icon = m.type === "GroundReport" ? blueIcon : 
                       (m.priority === "Critical" || m.priority === "High") ? redIcon : amberIcon;
          
          return (
            <Marker key={m.id} position={m.coordinates} icon={icon}>
              <Popup>
                <div className="font-sans min-w-[200px]">
                  <p className="font-semibold text-sm m-0">{m.title}</p>
                  <p className="text-xs text-muted-foreground m-0 mt-1">{m.type} • {new Date(m.timestamp).toLocaleTimeString()}</p>
                  <p className="text-sm mt-2">{m.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
