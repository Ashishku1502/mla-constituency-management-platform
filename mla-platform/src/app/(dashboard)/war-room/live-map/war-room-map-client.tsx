"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Radio } from "lucide-react";
import WarRoomMapDynamic from "@/components/map/WarRoomMapDynamic";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WarRoomMapClient() {
  const [area, setArea] = useState("all");
  const [station, setStation] = useState("all");
  const [board, setBoard] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Live Map"
          description="Real-time map with performance heatmap and ground reports"
          icon={<Radio className="h-5 w-5 text-red-500 animate-pulse" />}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={area} onValueChange={(val) => setArea(val ?? "all")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Entire Constituency</SelectItem>
              <SelectItem value="north">North Zone</SelectItem>
              <SelectItem value="south">South Zone</SelectItem>
            </SelectContent>
          </Select>
          <Select value={station} onValueChange={(val) => setStation(val ?? "all")} disabled={area === "all"}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Polling Station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stations</SelectItem>
              <SelectItem value="ps1">PS 1 - City Hall</SelectItem>
              <SelectItem value="ps2">PS 2 - Library</SelectItem>
            </SelectContent>
          </Select>
          <Select value={board} onValueChange={(val) => setBoard(val ?? "all")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Board/Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              <SelectItem value="activities">Activities</SelectItem>
              <SelectItem value="issues">Critical Issues</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <Card className="border-none shadow-sm h-[calc(100vh-140px)] min-h-[600px] overflow-hidden">
        <div className="h-full w-full">
          {/* We pass the filters so the map can adjust zoom and show heatmaps */}
          <WarRoomMapDynamic filters={{ area, station, board }} />
        </div>
      </Card>
    </div>
  );
}
