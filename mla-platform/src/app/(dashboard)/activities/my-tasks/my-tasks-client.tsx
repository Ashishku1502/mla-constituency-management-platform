"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ClipboardCheck, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MyTasksClient({ assignments }: { assignments: any[] }) {
  const router = useRouter();
  const [startingId, setStartingId] = useState<string | null>(null);

  const handleStartActivity = async (assignmentId: string, activityId: string) => {
    setStartingId(assignmentId);
    try {
      const res = await fetch(`/api/activities/${activityId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId }),
      });
      if (res.ok) {
        toast.success("Activity started successfully! Ground location verified.");
        router.refresh();
      } else {
        toast.error("Failed to start activity");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setStartingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        description="View your assigned field activities and start ground work"
        icon={ClipboardCheck}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full">No tasks assigned to you right now.</p>
        ) : (
          assignments.map((asg) => (
            <Card key={asg.id} className="glass-card flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base font-bold line-clamp-1 flex-1">{asg.activity.name}</CardTitle>
                  <StatusBadge status={asg.status} />
                </div>
                <CardDescription className="text-xs">{asg.activity.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-4">
                <div className="space-y-2 text-sm flex-1">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                    <span>{asg.activity.location}, {asg.activity.ward?.name || asg.activity.area.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0 text-primary" />
                    <span>{asg.activity.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    <span>{asg.activity.startTime} - {asg.activity.endTime}</span>
                  </div>
                </div>
                
                {asg.status === "Assigned" && (
                  <Button 
                    className="w-full mt-auto" 
                    onClick={() => handleStartActivity(asg.id, asg.activity.id)}
                    disabled={startingId === asg.id}
                  >
                    {startingId === asg.id ? "Starting..." : "Start Activity"}
                    {!startingId && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                )}

                {asg.status === "In Progress" && (
                  <Button 
                    variant="secondary"
                    className="w-full mt-auto"
                    onClick={() => router.push("/constituency/records")}
                  >
                    Go to Voter List to Log Reports
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
