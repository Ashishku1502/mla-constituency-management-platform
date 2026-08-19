"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON
} from "react-leaflet";
import { Info, Map as MapIcon, PenTool } from "lucide-react";

let EditControl: any = null;
if (typeof window !== "undefined") {
  (window as any).L = L;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    EditControl = require("react-leaflet-draw").EditControl;
  } catch (e) {
    console.error("Failed to load react-leaflet-draw", e);
  }
}

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function AreaDrawMap({
  onBoundaryDrawn,
  existingBoundary
}: {
  onBoundaryDrawn: (geoJson: string) => void;
  existingBoundary?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!existingBoundary);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const onCreated = (e: any) => {
    const geoJson = e.layer.toGeoJSON();
    onBoundaryDrawn(JSON.stringify(geoJson));
    setHasDrawn(true);
  };

  const onEdited = (e: any) => {
    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      onBoundaryDrawn(JSON.stringify(layer.toGeoJSON()));
    });
  };

  const onDeleted = () => {
    onBoundaryDrawn("");
    setHasDrawn(false);
  };

  if (!isMounted) return (
    <div className="h-[450px] w-full bg-muted/30 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border animate-pulse">
      <MapIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
      <span className="text-muted-foreground font-medium">Initializing Map Engine...</span>
    </div>
  );

  let geoJsonData = null;
  if (existingBoundary) {
    try {
      geoJsonData = JSON.parse(existingBoundary);
    } catch (e) {
      console.error("Invalid GeoJSON string");
    }
  }

  // Fallback center since we removed mock data
  const center: [number, number] = [21.7645, 78.8718];

  return (
    <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border shadow-sm ring-1 ring-border/50 group">
      
      {/* Floating Instructions Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none transition-opacity duration-300">
        <div className="bg-background/80 backdrop-blur-md border shadow-lg rounded-full px-5 py-2.5 flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <PenTool className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground/90">
            {hasDrawn ? "Edit or delete the current boundary" : "Use the toolbar to draw an area boundary"}
          </span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        
        <FeatureGroup>
          {EditControl && (
            <EditControl
              position="bottomright"
              onCreated={onCreated}
              onEdited={onEdited}
              onDeleted={onDeleted}
              draw={{
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                rectangle: {
                  shapeOptions: {
                    color: "#3b82f6",
                    weight: 3,
                    fillOpacity: 0.2
                  }
                },
                polygon: { 
                  allowIntersection: false, 
                  showArea: true,
                  shapeOptions: {
                    color: "#3b82f6",
                    weight: 3,
                    fillOpacity: 0.2
                  }
                },
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

      {/* Subtle bottom gradient for depth */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent z-[300] pointer-events-none" />
    </div>
  );
}
