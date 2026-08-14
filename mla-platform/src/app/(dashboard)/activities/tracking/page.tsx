"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, MapPin, Navigation, User } from "lucide-react";
import { mockActivities } from "@/lib/mock-data";

export default function TrackingPage() {
  const active = mockActivities.filter(a => a.status === "In Progress" || a.status === "Completed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Activity Tracking"
        description="Monitor active field operations, team locations, and completion updates"
        icon={Activity}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Tracking Map Stub */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Real-Time Map</CardTitle>
            <CardDescription>Visual tracker showing current locations of active volunteer groups</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center border rounded-lg bg-muted/20">
            <div className="text-center space-y-2 text-muted-foreground">
              <Navigation className="h-10 w-10 mx-auto text-primary opacity-60 animate-pulse" />
              <p className="text-sm font-semibold">Live GPS Tracking Map</p>
              <p className="text-xs">Displays active field surveyors, coordinate mappings, and real-time report locations.</p>
            </div>
          </CardContent>
        </Card>

        {/* Live Status feed */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Stream</CardTitle>
            <CardDescription>Live operations updates feed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {active.slice(0, 4).map((act) => (
              <div key={act.id} className="p-3 border rounded-lg space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-xs truncate max-w-[130px]">{act.name}</h4>
                  <StatusBadge status={act.status} />
                </div>
                <div className="text-[11px] text-muted-foreground space-y-0.5">
                  <div className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{act.location}</div>
                  <div className="flex items-center gap-1"><User className="h-3 w-3" />Lead: {act.teamLeader}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
