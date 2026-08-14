"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { mockActivities } from "@/lib/mock-data";

export default function ActivityCalendarPage() {
  // Sort activities by date
  const sorted = [...mockActivities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Calendar"
        description="Schedule and time view of all planned activities"
        icon={CalendarIcon}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Calendar View Stub */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Schedule Planner</CardTitle>
            <CardDescription>Calendar view showing dates of key operational field tasks</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
            <div className="text-center space-y-2 text-muted-foreground">
              <CalendarIcon className="h-10 w-10 mx-auto opacity-50" />
              <p className="text-sm font-medium">Interactive Calendar Schedule</p>
              <p className="text-xs max-w-xs mx-auto">This calendar shows daily field operations, assignments, meetings, and reviews scheduled across areas.</p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>chronological list of upcoming activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
            {sorted.slice(0, 5).map((act) => (
              <div key={act.id} className="p-3 border rounded-lg space-y-1.5 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-semibold text-xs truncate max-w-[150px]">{act.name}</h4>
                  <Badge variant="outline" className="text-[10px] uppercase shrink-0">{act.category}</Badge>
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{act.date}</div>
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{act.startTime} - {act.endTime}</div>
                  <div className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{act.location}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
