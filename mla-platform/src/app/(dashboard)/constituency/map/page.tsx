"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Map, Layers, ZoomIn, Filter } from "lucide-react";
import { mockAreas, mockConstituency } from "@/lib/mock-data";

export default function ConstituencyMapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Constituency Map"
        description="Interactive map of the constituency with areas, polling stations, and activities"
        icon={Map}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Map Area */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 h-[500px] rounded-lg flex items-center justify-center">
              {/* Map placeholder - will be replaced with Leaflet in Phase 4 */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Map className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Interactive Map</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                    {mockConstituency.name} constituency map with area
                    boundaries, polling stations, and activity markers.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Layers
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Zoom
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Filter className="h-3.5 w-3.5" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Map overlay controls */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-sm">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                {mockConstituency.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">State</span>
                <span className="font-medium">{mockConstituency.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Code</span>
                <span className="font-mono text-xs">{mockConstituency.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Population</span>
                <span className="font-medium">
                  {mockConstituency.population.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Areas</span>
                <span className="font-medium">{mockConstituency.totalAreas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Polling Stations</span>
                <span className="font-medium">
                  {mockConstituency.totalPollingStations}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockAreas.slice(0, 5).map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2"
                >
                  <span className="font-medium truncate max-w-[120px]">
                    {area.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={
                      area.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {area.pollingStations} PS
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
