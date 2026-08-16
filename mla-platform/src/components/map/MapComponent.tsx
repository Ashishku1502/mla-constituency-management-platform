"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  GeoJSON,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { mapCenter } from "@/lib/mock-geo-data";

// Fix missing marker icons in React Leaflet
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type MapFeature = {
  id: string;
  name: string;
  featureType: string;
  geoJson: string;
};

export default function MapComponent() {
  const [features, setFeatures] = useState<MapFeature[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    try {
      const res = await fetch("/api/map");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFeatures(data);
      } else {
        console.error("API returned non-array:", data);
        toast.error(data.error || "Failed to fetch map data");
        setFeatures([]);
      }
    } catch (error) {
      toast.error("Failed to fetch map data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeatures();
  }, []);

  const saveFeature = async (geoJson: any, featureType: string, name: string, id?: string) => {
    try {
      const res = await fetch("/api/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          featureType,
          geoJson
        })
      });

      if (res.ok) {
        toast.success(`${featureType} saved successfully!`);
        fetchFeatures(); // Reload data
      } else {
        toast.error("Failed to save map feature");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  const onCreated = (e: any) => {
    const layer = e.layer;
    const geoJson = layer.toGeoJSON();
    
    // Default to adding a new Constituency boundary part, or a generic shape
    saveFeature(geoJson, "Constituency", "New Boundary Area");
  };

  const onEdited = (e: any) => {
    const layers = e.layers;
    // In a real application, you'd want to map the edited Leaflet layer back to its 
    // database ID. For this demo, we'll just save the first edited feature as a new Constituency bounds 
    // or you'd extract the ID if we bound it to the layer.
    
    layers.eachLayer((layer: any) => {
      const geoJson = layer.toGeoJSON();
      // Since we don't have the DB ID bound to the Leaflet layer directly in this basic setup,
      // we'll just log it. In production, you'd bind the ID to layer.feature.properties.id
      toast.info("Feature edited locally. (Full ID tracking required for DB update)");
    });
  };

  const onDeleted = (e: any) => {
    toast.info("Feature removed locally.");
  };

  if (loading) {
    return <Skeleton className="w-full h-full rounded-md" />;
  }

  // Parse GeoJSON strings back to objects
  const parseFeature = (type: string) => {
    if (!Array.isArray(features)) return null;
    const feature = features.find(f => f.featureType === type);
    if (!feature) return null;
    try {
      return JSON.parse(feature.geoJson);
    } catch (e) {
      return null;
    }
  };

  const constituencyGeoJSON = parseFeature("Constituency");
  const wardsGeoJSON = parseFeature("Ward");
  const villagesGeoJSON = parseFeature("Village");
  const localitiesGeoJSON = parseFeature("Locality");
  const pollingStationsGeoJSON = parseFeature("PollingStation");

  return (
    <MapContainer
      center={mapCenter}
      zoom={11}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      className="rounded-lg"
    >
      <LayersControl position="topright">
        {/* Base Map Tiles */}
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          />
        </LayersControl.BaseLayer>

        {/* Overlays */}
        <LayersControl.Overlay checked name="Constituency Boundary">
          <FeatureGroup>
            {constituencyGeoJSON && (
              <GeoJSON
                data={constituencyGeoJSON}
                style={{
                  color: "#2563eb",
                  weight: 3,
                  fillColor: "#3b82f6",
                  fillOpacity: 0.1,
                }}
              />
            )}
            <EditControl
              position="topleft"
              onCreated={onCreated}
              onEdited={onEdited}
              onDeleted={onDeleted}
              draw={{
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                rectangle: false,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                },
              }}
            />
          </FeatureGroup>
        </LayersControl.Overlay>

        {wardsGeoJSON && (
          <LayersControl.Overlay checked name="Wards">
            <GeoJSON
              data={wardsGeoJSON}
              style={{
                color: "#16a34a",
                weight: 2,
                fillColor: "#22c55e",
                fillOpacity: 0.2,
              }}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`<b>${feature.properties.name}</b><br/>Pop: ${feature.properties.population || 'N/A'}`);
                }
              }}
            />
          </LayersControl.Overlay>
        )}

        {villagesGeoJSON && (
          <LayersControl.Overlay name="Villages">
            <GeoJSON
              data={villagesGeoJSON}
              style={{
                color: "#d97706",
                weight: 2,
                fillColor: "#f59e0b",
                fillOpacity: 0.2,
              }}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`<b>${feature.properties.name}</b><br/>Pop: ${feature.properties.population || 'N/A'}`);
                }
              }}
            />
          </LayersControl.Overlay>
        )}

        {localitiesGeoJSON && (
          <LayersControl.Overlay name="Localities">
            <GeoJSON
              data={localitiesGeoJSON}
              pointToLayer={(feature, latlng) => {
                return L.circleMarker(latlng, {
                  radius: 8,
                  fillColor: "#8b5cf6",
                  color: "#fff",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
                });
              }}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`<b>${feature.properties.name}</b> (Locality)`);
                }
              }}
            />
          </LayersControl.Overlay>
        )}

        {pollingStationsGeoJSON && (
          <LayersControl.Overlay checked name="Polling Stations">
            <GeoJSON
              data={pollingStationsGeoJSON}
              pointToLayer={(feature, latlng) => {
                return L.marker(latlng);
              }}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`<b>${feature.properties.name}</b><br/>${feature.properties.address || ''}`);
                }
              }}
            />
          </LayersControl.Overlay>
        )}
      </LayersControl>
    </MapContainer>
  );
}
