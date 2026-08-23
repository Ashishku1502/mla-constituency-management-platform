"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Target, Trophy, Info } from "lucide-react";

interface ActivityRecord {
  id: string;
  name: string;
  location: string;
  assignedTo: string;
  status: "running" | "cancelled" | "created" | "completed";
}

interface WarRoomActivitiesClientProps {
  metrics: {
    winningPrediction: number;
    voterSentiment: number;
    activityExecution: number;
    completedActivities: number;
    totalActivitiesTarget: number;
    totalActivities: number;
    completed: number;
    pending: number;
    votersTagged: number;
  };
  activities: ActivityRecord[];
}

export function WarRoomActivitiesClient({ metrics, activities }: WarRoomActivitiesClientProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">Running</span>;
      case "cancelled":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400">Cancelled</span>;
      case "created":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Created</span>;
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Completed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <PageHeader
        title="War Room Activities — War Room"
        description="Sabhi activities ki live tracking, dynamic winning score, aur Ward/Team Leader/Volunteer ke performance scores — sab isi Ward Management/Team data se automatically calculate hote hain."
        icon={Activity}
      />

      {/* TOP DASHBOARD: WINNING PREDICTION & METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Winning Score Card */}
        <Card className="glass-card lg:col-span-1 bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-primary/10">
            <Trophy className="h-40 w-40" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wider z-10 relative">
              Jeetne Ka Anumaan
            </CardTitle>
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-black text-primary drop-shadow-sm">{metrics.winningPrediction}%</span>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-sm font-medium bg-background/50 p-2 rounded-md border border-border/50">
                <span className="text-muted-foreground">Voter Sentiment</span>
                <span className="font-bold text-foreground">{metrics.voterSentiment}%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium bg-background/50 p-2 rounded-md border border-border/50">
                <span className="text-muted-foreground">Activity Execution</span>
                <span className="font-bold text-foreground">{metrics.activityExecution}% ({metrics.completedActivities}/{metrics.totalActivitiesTarget} Completed)</span>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-primary/10 p-3 rounded-lg border border-primary/20">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-primary/90 leading-relaxed font-medium">
                Ye score dynamic hai — jaise-jaise ground activities "Completed" hoti hain (Team → Assign Activity → Volunteer execution → Approval), ye automatically update hota hai. Same data Ward Management aur Team page se bhi live hai.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right Side: 4 Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <Card className="glass shadow-sm flex flex-col justify-center">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Activities</p>
                <Activity className="h-4 w-4 text-muted-foreground/50" />
              </div>
              <h3 className="text-4xl font-black text-foreground">{metrics.totalActivities}</h3>
            </CardContent>
          </Card>
          
          <Card className="glass shadow-sm flex flex-col justify-center border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Completed</p>
                <Activity className="h-4 w-4 text-emerald-500/50" />
              </div>
              <h3 className="text-4xl font-black text-emerald-700 dark:text-emerald-300">{metrics.completed}</h3>
            </CardContent>
          </Card>
          
          <Card className="glass shadow-sm flex flex-col justify-center border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Pending / Running</p>
                <Activity className="h-4 w-4 text-blue-500/50" />
              </div>
              <h3 className="text-4xl font-black text-blue-700 dark:text-blue-300">{metrics.pending}</h3>
            </CardContent>
          </Card>
          
          <Card className="glass shadow-sm flex flex-col justify-center border-purple-500/20 bg-purple-500/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">Voters Tagged <span className="font-normal lowercase text-[10px]">(Sentiment)</span></p>
                <Target className="h-4 w-4 text-purple-500/50" />
              </div>
              <h3 className="text-4xl font-black text-purple-700 dark:text-purple-300">{metrics.votersTagged}</h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ACTIVITIES TRACKING LIST */}
      <Card className="glass-card">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Activities Tracking
          </CardTitle>
          <CardDescription>Live feed of ground activities being executed by your team.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6 py-4 font-semibold text-foreground">Activity Name</TableHead>
                <TableHead className="py-4 font-semibold text-foreground">Location</TableHead>
                <TableHead className="py-4 font-semibold text-foreground">Assigned To</TableHead>
                <TableHead className="pr-6 py-4 font-semibold text-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="pl-6 font-medium text-foreground py-4">
                    {activity.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground py-4">
                    {activity.location}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary uppercase">
                        {activity.assignedTo.substring(0, 1)}
                      </div>
                      <span className="font-medium text-sm">{activity.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 py-4">
                    {getStatusBadge(activity.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
