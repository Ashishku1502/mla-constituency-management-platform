"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Map, Users, Activity, AlertTriangle, Eye, Radio, Zap, Clock, UserCheck } from "lucide-react";
import WarRoomMapDynamic from "@/components/map/WarRoomMapDynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface WarRoomProps {
  initialData: any;
  areas: any[];
}

export function WarRoomClient({ initialData, areas }: WarRoomProps) {
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [stats, setStats] = useState(initialData);

  useEffect(() => {
    const fetchLiveData = () => {
      fetch("/api/war-room/live")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLiveFeed(data.data);
          }
        })
        .catch(console.error);
      
      // We could also poll stats here if there was a stats endpoint,
      // but for now we rely on the map/feed polling.
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top Status Bar */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-muted-foreground">ACTIVE USERS</span>
            </div>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {stats.totalUsers} total</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-muted-foreground">LIVE ACTIVITIES</span>
            </div>
            <p className="text-2xl font-bold">{stats.activeActivities}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.scheduledActivitiesCount} upcoming</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-muted-foreground">OVERDUE</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.overdueActivities}</p>
            <p className="text-xs text-muted-foreground mt-0.5">need attention</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-muted-foreground">CRITICAL ISSUES</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.criticalIssues}</p>
            <p className="text-xs text-muted-foreground mt-0.5">unresolved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map Monitor */}
        <Card className="lg:col-span-2 flex flex-col min-h-[500px]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                <CardTitle className="text-base">Live Map Monitor</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs bg-muted">Updates every 30s</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 rounded-b-lg overflow-hidden">
            <WarRoomMapDynamic />
          </CardContent>
        </Card>

        {/* Alert Center & Live Feed */}
        <Card className="flex flex-col h-[500px] lg:h-auto">
          <CardHeader className="pb-2 shrink-0 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Live Feed</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {liveFeed.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No active events found.
                  </div>
                ) : (
                  liveFeed.map(item => (
                    <div key={item.id} className="relative pl-4 border-l-2 border-muted space-y-1">
                      <div className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ${
                        item.priority === 'Critical' ? 'bg-red-500' :
                        item.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-none">{item.title}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] h-4">
                          {item.type}
                        </Badge>
                        {item.priority !== 'Normal' && (
                          <Badge variant="secondary" className={`text-[9px] h-4 ${
                            item.priority === 'Critical' ? 'text-red-500 bg-red-50' : 'text-amber-500 bg-amber-50'
                          }`}>
                            {item.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Area Coverage Monitor */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Area Coverage Monitor</CardTitle>
          <CardDescription>Operational status by area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <div key={area.id} className="p-3 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{area.name}</span>
                  <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Live</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Household Coverage</span>
                    <span className="font-medium">{area.householdCoverage}%</span>
                  </div>
                  <Progress value={area.householdCoverage} className="h-1" />
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  <div><p className="font-semibold">{area._count.teamLeaders}</p><p className="text-muted-foreground">TLs</p></div>
                  <div><p className="font-semibold">{area._count.volunteers}</p><p className="text-muted-foreground">Vols</p></div>
                  <div><p className="font-semibold">{area._count.pollingStations}</p><p className="text-muted-foreground">PS</p></div>
                </div>
              </div>
            ))}
            {areas.length === 0 && (
              <div className="col-span-full py-4 text-center text-sm text-muted-foreground">
                No active areas found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
