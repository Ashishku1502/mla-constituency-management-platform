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
// EditControl needs to be required after window.L is set
// so we don't import it at the top level
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

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { mapCenter } from "@/lib/mock-geo-data";
import { Search, MapPin, Building2, Home, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  if (loading) return <Skeleton className="w-full h-full rounded-2xl" />;

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
  const divisionsGeoJSON = parseFeature("Division");

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
    if (localitiesGeoJSON) {
      localitiesGeoJSON.features.forEach((f: any) => items.push({ type: "Locality", name: f.properties.name, feature: f }));
    }
    if (divisionsGeoJSON) {
      divisionsGeoJSON.features.forEach((f: any) => items.push({ type: "Division", name: f.properties.name, feature: f }));
    }
    return items.filter(item => item.name?.toLowerCase().includes(search.toLowerCase()));
  };

  const handleLocationClick = (item: any) => {
    const feature = item.feature;
    if (feature.geometry.type === "Point") {
      const [lng, lat] = feature.geometry.coordinates;
      // eslint-disable-next-line react-hooks/purity
      setFlyTarget({ center: [lat, lng], timestamp: Date.now() });
    } else {
      const layer = L.geoJSON(feature);
      // eslint-disable-next-line react-hooks/purity
      setFlyTarget({ bounds: layer.getBounds(), timestamp: Date.now() });
    }
  };

  const filteredItems = sidebarItems();

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-background relative z-0 rounded-xl overflow-hidden">
      
      {/* Floating Interactive Sidebar */}
      <div className="absolute top-4 left-4 bottom-4 w-[340px] hidden md:flex flex-col z-[1000] rounded-2xl shadow-2xl border border-white/20 bg-background/85 backdrop-blur-xl overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-border/40 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight tracking-tight text-foreground">
                Constituency Map
              </h3>
              <p className="text-xs text-muted-foreground font-medium">Explore locations & boundaries</p>
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search wards, villages, stations..."
              className="pl-10 h-10 bg-background/60 backdrop-blur border-border/50 focus-visible:ring-primary focus-visible:border-primary shadow-inner rounded-xl transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 hover:shadow-sm cursor-pointer transition-all duration-300 group border border-transparent hover:border-primary/20 bg-card/40"
                onClick={() => handleLocationClick(item)}
              >
                <div className={`p-2.5 rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${
                  item.type === "Ward" ? "bg-green-500/15 text-green-600 dark:text-green-400" :
                  item.type === "Village" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                  item.type === "Locality" ? "bg-purple-500/15 text-purple-600 dark:text-purple-400" :
                  item.type === "Division" ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400" :
                  "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                }`}>
                  {item.type === "Ward" ? <Building2 className="h-4 w-4" /> : item.type === "Village" ? <Home className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{item.type}</p>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="p-10 text-center flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center border border-border/50 shadow-inner">
                  <Search className="h-6 w-6 text-muted-foreground/60" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">No matching locations found.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Mobile Sidebar Fallback */}
      <div className="w-full md:hidden flex flex-col border-b bg-card shadow-sm z-10 shrink-0">
         <div className="p-4 border-b space-y-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0 h-full w-full">
        <MapContainer
          center={mapCenter}
          zoom={11}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          className="bg-muted/10"
          zoomControl={false}
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
                {EditControl && (
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
                )}
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
                        `<div class="font-sans px-2 py-1">
                          <p class="font-bold text-lg m-0 text-foreground">${feature.properties.name}</p>
                          <p class="text-xs text-muted-foreground uppercase tracking-wider m-0 mt-1 font-semibold">Ward Area</p>
                          ${feature.properties.population ? `<div class="mt-3 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg inline-block border border-primary/20">Population: <b>${feature.properties.population}</b></div>` : ''}
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
                        `<div class="font-sans px-2 py-1">
                          <p class="font-bold text-lg m-0 text-foreground">${feature.properties.name}</p>
                          <p class="text-xs text-muted-foreground uppercase tracking-wider m-0 mt-1 font-semibold">Village</p>
                          ${feature.properties.population ? `<div class="mt-3 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg inline-block border border-primary/20">Population: <b>${feature.properties.population}</b></div>` : ''}
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
                        `<div class="font-sans px-2 py-1">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                            <p class="font-bold text-lg m-0 text-foreground">${feature.properties.name}</p>
                          </div>
                          <p class="text-sm text-muted-foreground m-0 mt-1">${feature.properties.address || 'Polling Station'}</p>
                        </div>`,
                        { className: "custom-popup" }
                      );
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
                      weight: 2,
                      opacity: 1,
                      fillOpacity: 0.9
                    });
                  }}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties && feature.properties.name) {
                      layer.bindPopup(
                        `<div class="font-sans px-2 py-1">
                          <p class="font-bold text-lg m-0 text-foreground">${feature.properties.name}</p>
                          <p class="text-xs text-muted-foreground uppercase tracking-wider m-0 mt-1 font-semibold">Locality</p>
                        </div>`,
                        { className: "custom-popup" }
                      );
                    }
                  }}
                />
              </LayersControl.Overlay>
            )}

            {divisionsGeoJSON && (
              <LayersControl.Overlay name="Geographical Divisions">
                <GeoJSON
                  data={divisionsGeoJSON}
                  style={{
                    color: "#0891b2",
                    weight: 2,
                    fillColor: "#06b6d4",
                    fillOpacity: 0.25,
                    dashArray: "4, 4"
                  }}
                  onEachFeature={(feature, layer) => {
                    layer.on({
                      mouseover: (e) => {
                        const l = e.target;
                        l.setStyle({ fillOpacity: 0.4, weight: 3, color: "#164e63" });
                      },
                      mouseout: (e) => {
                        const l = e.target;
                        l.setStyle({ fillOpacity: 0.25, weight: 2, color: "#0891b2" });
                      }
                    });
                    if (feature.properties && feature.properties.name) {
                      layer.bindPopup(
                        `<div class="font-sans px-2 py-1">
                          <p class="font-bold text-lg m-0 text-foreground">${feature.properties.name}</p>
                          <p class="text-xs text-muted-foreground uppercase tracking-wider m-0 mt-1 font-semibold">Geographical Division</p>
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
