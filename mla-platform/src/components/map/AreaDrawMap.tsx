"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON
} from "react-leaflet";

let EditControl: any = null;
if (typeof window !== "undefined") {
  (window as any).L = L;
  try {
    EditControl = require("react-leaflet-draw").EditControl;
  } catch (e) {
    console.error("Failed to load react-leaflet-draw", e);
  }
}

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { mapCenter } from "@/lib/mock-geo-data";

export default function AreaDrawMap({
  onBoundaryDrawn,
  existingBoundary
}: {
  onBoundaryDrawn: (geoJson: string) => void;
  existingBoundary?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onCreated = (e: any) => {
    const geoJson = e.layer.toGeoJSON();
    onBoundaryDrawn(JSON.stringify(geoJson));
  };

  const onEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      onBoundaryDrawn(JSON.stringify(layer.toGeoJSON()));
    });
  };

  const onDeleted = () => {
    onBoundaryDrawn("");
  };

  if (!isMounted) return <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">Loading map...</div>;

  let geoJsonData = null;
  if (existingBoundary) {
    try {
      geoJsonData = JSON.parse(existingBoundary);
    } catch (e) {
      console.error("Invalid GeoJSON string");
    }
  }

  return (
    <div className="h-[400px] w-full relative rounded-md overflow-hidden border">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        
        <FeatureGroup>
          {EditControl && (
            <EditControl
              position="topright"
              onCreated={onCreated}
              onEdited={onEdited}
              onDeleted={onDeleted}
              draw={{
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                rectangle: true,
                polygon: { allowIntersection: false, showArea: true },
              }}
            />
          )}
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={{
                color: "#3b82f6",
                weight: 3,
                fillColor: "#60a5fa",
                fillOpacity: 0.2,
              }}
            />
          )}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}
