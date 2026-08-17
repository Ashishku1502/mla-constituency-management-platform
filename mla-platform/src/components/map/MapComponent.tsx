"use client";

import { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  GeoJSON,
  FeatureGroup,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { mapCenter } from "@/lib/mock-geo-data";
import { Search, MapPin, Building2, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Fix missing marker icons in React Leaflet
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

if (typeof window !== "undefined") {
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
}

type MapFeature = {
  id: string;
  name: string;
  featureType: string;
  geoJson: string;
};

// Map controller to handle flyTo functionality
function MapController({ target }: { target: { center?: [number, number], bounds?: any, timestamp: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (!target) return;
    
    if (target.bounds) {
      map.flyToBounds(target.bounds, { duration: 1.5, padding: [50, 50] });
    } else if (target.center) {
      map.flyTo(target.center, 15, { duration: 1.5 });
    }
  }, [target, map]);

  return null;
}

export default function MapComponent() {
  const [features, setFeatures] = useState<MapFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [flyTarget, setFlyTarget] = useState<{ center?: [number, number], bounds?: any, timestamp: number } | null>(null);

  const fetchFeatures = async () => {
    try {
      const res = await fetch("/api/map");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFeatures(data);
      } else {
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
    fetchFeatures();
  }, []);

  const saveFeature = async (geoJson: any, featureType: string, name: string, id?: string) => {
    try {
      const res = await fetch("/api/map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, featureType, geoJson })
      });

      if (res.ok) {
        toast.success(`${featureType} saved successfully!`);
        fetchFeatures();
      } else {
        toast.error("Failed to save map feature");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  const onCreated = (e: any) => saveFeature(e.layer.toGeoJSON(), "Constituency", "New Boundary Area");
  const onEdited = (e: any) => toast.info("Feature edited locally.");
  const onDeleted = (e: any) => toast.info("Feature removed locally.");

  if (loading) return <Skeleton className="w-full h-full rounded-md" />;

  const parseFeature = (type: string) => {
    if (!Array.isArray(features)) return null;
    const feature = features.find(f => f.featureType === type);
    if (!feature) return null;
    try { return JSON.parse(feature.geoJson); } catch (e) { return null; }
  };

  const constituencyGeoJSON = parseFeature("Constituency");
  const wardsGeoJSON = parseFeature("Ward");
  const villagesGeoJSON = parseFeature("Village");
  const localitiesGeoJSON = parseFeature("Locality");
  const pollingStationsGeoJSON = parseFeature("PollingStation");

  // Flatten items for the interactive sidebar
  const sidebarItems = () => {
    const items: any[] = [];
    if (wardsGeoJSON) {
      wardsGeoJSON.features.forEach((f: any) => items.push({ type: "Ward", name: f.properties.name, feature: f }));
    }
    if (villagesGeoJSON) {
      villagesGeoJSON.features.forEach((f: any) => items.push({ type: "Village", name: f.properties.name, feature: f }));
    }
    if (pollingStationsGeoJSON) {
      pollingStationsGeoJSON.features.forEach((f: any) => items.push({ type: "Polling Station", name: f.properties.name, feature: f }));
    }
    return items.filter(item => item.name?.toLowerCase().includes(search.toLowerCase()));
  };

  const handleLocationClick = (item: any) => {
    const feature = item.feature;
    if (feature.geometry.type === "Point") {
      const [lng, lat] = feature.geometry.coordinates;
      setFlyTarget({ center: [lat, lng], timestamp: Date.now() });
    } else {
      const layer = L.geoJSON(feature);
      setFlyTarget({ bounds: layer.getBounds(), timestamp: Date.now() });
    }
  };

  const filteredItems = sidebarItems();

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-background relative z-0">
      {/* Interactive Sidebar */}
      <div className="w-full md:w-80 flex flex-col border-r bg-card shadow-sm z-10 shrink-0">
        <div className="p-4 border-b space-y-4 bg-muted/20">
          <h3 className="font-semibold text-lg flex items-center gap-2 tracking-tight">
            <MapPin className="h-5 w-5 text-primary" />
            Locations
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wards, villages, stations..."
              className="pl-9 bg-background shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1.5">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-primary/10 hover:shadow-sm cursor-pointer transition-all duration-200 group border border-transparent hover:border-primary/20"
                onClick={() => handleLocationClick(item)}
              >
                <div className={`p-2 rounded-md transition-colors ${
                  item.type === "Ward" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/50" :
                  item.type === "Village" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50"
                }`}>
                  {item.type === "Ward" ? <Building2 className="h-4 w-4" /> : item.type === "Village" ? <Home className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{item.type}</p>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">No locations found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={11}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          className="bg-muted/10"
        >
          <MapController target={flyTarget} />
          
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Modern Light">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
            </LayersControl.BaseLayer>
            
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Constituency Boundary">
              <FeatureGroup>
                {constituencyGeoJSON && (
                  <GeoJSON
                    data={constituencyGeoJSON}
                    style={{
                      color: "#3b82f6",
                      weight: 3,
                      fillColor: "#60a5fa",
                      fillOpacity: 0.1,
                      dashArray: "5, 5"
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
                    polygon: { allowIntersection: false, showArea: true },
                  }}
                />
              </FeatureGroup>
            </LayersControl.Overlay>

            {wardsGeoJSON && (
              <LayersControl.Overlay checked name="Wards">
                <GeoJSON
                  data={wardsGeoJSON}
                  style={{
                    color: "#059669",
                    weight: 2,
                    fillColor: "#10b981",
                    fillOpacity: 0.25,
                  }}
                  onEachFeature={(feature, layer) => {
                    layer.on({
                      mouseover: (e) => {
                        const l = e.target;
                        l.setStyle({ fillOpacity: 0.4, weight: 3, color: "#047857" });
                      },
                      mouseout: (e) => {
                        const l = e.target;
                        l.setStyle({ fillOpacity: 0.25, weight: 2, color: "#059669" });
                      }
                    });
                    if (feature.properties && feature.properties.name) {
                      layer.bindPopup(
                        `<div class="font-sans">
                          <p class="font-bold text-base m-0 text-foreground">${feature.properties.name}</p>
                          <p class="text-sm text-muted-foreground m-0 mt-1">Ward Area</p>
                          ${feature.properties.population ? `<div class="mt-2 text-xs bg-muted p-1.5 rounded-md inline-block">Pop: <b>${feature.properties.population}</b></div>` : ''}
                        </div>`,
                        { className: "custom-popup" }
                      );
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
                    fillOpacity: 0.25,
                  }}
                  onEachFeature={(feature, layer) => {
                    layer.on({
                      mouseover: (e) => {
                        const l = e.target;
                        l.setStyle({ fillOpacity: 0.4, weight: 3, color: "#b45309" });
                      },
                      mouseout: (e) => {
                        const l = e.target;
                        l.setStyle({ fillOpacity: 0.25, weight: 2, color: "#d97706" });
                      }
                    });
                    if (feature.properties && feature.properties.name) {
                      layer.bindPopup(
                        `<div class="font-sans">
                          <p class="font-bold text-base m-0 text-foreground">${feature.properties.name}</p>
                          <p class="text-sm text-muted-foreground m-0 mt-1">Village</p>
                          ${feature.properties.population ? `<div class="mt-2 text-xs bg-muted p-1.5 rounded-md inline-block">Pop: <b>${feature.properties.population}</b></div>` : ''}
                        </div>`,
                        { className: "custom-popup" }
                      );
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
                      layer.bindPopup(
                        `<div class="font-sans">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                            <p class="font-bold text-base m-0 text-foreground">${feature.properties.name}</p>
                          </div>
                          <p class="text-sm text-muted-foreground m-0">${feature.properties.address || 'Polling Station'}</p>
                        </div>`,
                        { className: "custom-popup" }
                      );
                    }
                  }}
                />
              </LayersControl.Overlay>
            )}
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
}
