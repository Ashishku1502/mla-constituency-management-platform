"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClipboardList, Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export interface ActivityDetailData {
  id: string;
  name: string;
  description: string;
  objective: string;
  status: string;
  deadline: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  volunteers: number;
  capacity: number;
  teamLeader: string;
  areaManager: string;
}

export function ActivityDetailClient({ activity }: { activity: ActivityDetailData }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">Back to activities</span>
      </div>

      <PageHeader
        title={activity.name}
        description={`Details for activity ID: ${activity.id.substring(0, 8)}`}
        icon={ClipboardList}
      >
        <Button size="sm" variant="outline" className="gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Verify Completion
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Core Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activity Specifications</CardTitle>
              <StatusBadge status={activity.status} />
            </div>
            <CardDescription>{activity.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-3 rounded-lg border space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Objective</p>
                <p className="text-sm font-medium">{activity.objective}</p>
              </div>
              <div className="p-3 rounded-lg border space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold">Deadline</p>
                <p className="text-sm font-medium flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-amber-500" />{activity.deadline}</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <h3 className="font-bold text-sm">Schedule & Resources</h3>
              <div className="grid gap-3.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary/60" /><span>Date Scheduled: {activity.date}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary/60" /><span>Timing: {activity.startTime} - {activity.endTime}</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary/60" /><span>Location: {activity.location}</span></div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary/60" /><span>Required Volunteers: {activity.volunteers} assigned / {activity.capacity} maximum capacity</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Assigned Leaders</CardTitle>
            <CardDescription>Campaign team leaders assigned to this task</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 border rounded-lg space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-sm">TL</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Team Leader</p>
                  <p className="text-sm font-medium">{activity.teamLeader || "Unassigned"}</p>
                </div>
              </div>
            </div>
            <div className="p-3.5 border rounded-lg space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 font-bold text-sm">AM</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Area Manager</p>
                  <p className="text-sm font-medium">{activity.areaManager || "Unassigned"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
