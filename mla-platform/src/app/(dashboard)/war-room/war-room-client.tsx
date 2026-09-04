"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Map, Users, Activity, AlertTriangle, Eye, Radio, Zap, Clock, UserCheck } from "lucide-react";
import WarRoomMapDynamic from "@/components/map/WarRoomMapDynamic";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "@/hooks/use-translation";

interface WarRoomProps {
  initialData: any;
  areas: any[];
}

export function WarRoomClient({ initialData, areas }: WarRoomProps) {
  const { t } = useTranslation();
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
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <div className="card-premium glass-card animate-stagger-1 p-4 border-l-4 border-l-emerald-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground tracking-wider">{t("ACTIVE USERS")}</span>
            </div>
            <p className="text-3xl font-black text-gradient">{stats.activeUsers}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t("of")} {stats.totalUsers} {t("total")}</p>
          </div>
        </div>
        <div className="card-premium glass-card animate-stagger-2 p-4 border-l-4 border-l-blue-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-muted-foreground tracking-wider">{t("LIVE ACTIVITIES")}</span>
            </div>
            <p className="text-3xl font-black text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">{stats.activeActivities}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stats.scheduledActivitiesCount} {t("upcoming")}</p>
          </div>
        </div>
        <div className="card-premium glass-card animate-stagger-3 p-4 border-l-4 border-l-amber-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground tracking-wider">{t("OVERDUE")}</span>
            </div>
            <p className="text-3xl font-black text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">{stats.overdueActivities}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t("need attention")}</p>
          </div>
        </div>
        <div className="card-premium glass-card animate-stagger-4 p-4 border-l-4 border-l-red-500 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground tracking-wider">{t("CRITICAL ISSUES")}</span>
            </div>
            <p className="text-3xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">{stats.criticalIssues}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t("unresolved")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map Monitor */}
        <div className="card-premium glass-card animate-stagger-2 lg:col-span-2 flex flex-col min-h-[500px] overflow-hidden">
          <div className="p-4 pb-2 border-b border-border/50 bg-card/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-red-500 animate-pulse glow-emerald" />
                <h3 className="font-semibold text-base">{t("Live Map Monitor")}</h3>
              </div>
              <Badge variant="outline" className="text-[10px] bg-background/50 backdrop-blur-sm border-white/10">{t("Updates every 30s")}</Badge>
            </div>
          </div>
          <div className="flex-1 p-0 rounded-b-lg overflow-hidden bg-muted/10 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent z-10 pointer-events-none" />
            <WarRoomMapDynamic />
          </div>
        </div>

        {/* Alert Center & Live Feed */}
        <div className="card-premium glass-card animate-stagger-3 flex flex-col h-[500px] lg:h-auto overflow-hidden">
          <div className="p-4 pb-2 shrink-0 border-b border-border/50 bg-card/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base">{t("Live Feed")}</h3>
              </div>
            </div>
          </div>
          <div className="flex-1 p-0 overflow-hidden bg-background/30 backdrop-blur-md">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {liveFeed.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center justify-center h-full">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl border-2 border-white/5 glow-amber mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/empty-activity.jpg" alt="No Events" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{t("Quiet on the front")}</h3>
                    <p className="text-xs">{t("No active events found.")}</p>
                  </div>
                ) : (
                  liveFeed.map(item => (
                    <div key={item.id} className="relative pl-4 border-l-2 border-border/50 space-y-1 hover:border-primary/50 transition-colors group">
                      <div className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full shadow-[0_0_8px_currentColor] transition-transform group-hover:scale-125 ${
                        item.priority === 'Critical' ? 'bg-red-500 text-red-500' :
                        item.priority === 'High' ? 'bg-amber-500 text-amber-500' : 'bg-blue-500 text-blue-500'
                      }`} />
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{item.title}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-background/50 px-1.5 rounded">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] h-4 bg-background/50 border-white/5 shadow-inner">
                          {item.type}
                        </Badge>
                        {item.priority !== 'Normal' && (
                          <Badge variant="secondary" className={`text-[9px] h-4 shadow-sm ${
                            item.priority === 'Critical' ? 'text-red-400 bg-red-950/30 border border-red-500/20' : 'text-amber-400 bg-amber-950/30 border border-amber-500/20'
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
          </div>
        </div>
      </div>

      {/* Area Coverage Monitor */}
      <div className="card-premium glass-card animate-stagger-4 overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-card/40">
          <h3 className="font-semibold text-base">{t("Area Coverage Monitor")}</h3>
          <p className="text-xs text-muted-foreground mt-1">{t("Operational status by area")}</p>
        </div>
        <div className="p-4 bg-background/30 backdrop-blur-md">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <div key={area.id} className="p-4 rounded-xl border border-white/10 bg-card/40 shadow-sm space-y-3 hover:border-primary/40 hover:shadow-primary/5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate text-foreground">{area.name}</span>
                  <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 glow-emerald">{t("Live")}</Badge>
                </div>
                <div className="space-y-1.5 p-2 rounded-lg bg-background/50 border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t("Household Coverage")}</span>
                    <span className="font-bold text-primary">{area.householdCoverage}%</span>
                  </div>
                  <Progress value={area.householdCoverage} className="h-1.5 bg-primary/20" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-border/50">
                  <div><p className="font-black text-foreground">{area._count.teamLeaders}</p><p className="text-[9px] text-muted-foreground tracking-wider">{t("TLs")}</p></div>
                  <div className="border-x border-border/50"><p className="font-black text-foreground">{area._count.volunteers}</p><p className="text-[9px] text-muted-foreground tracking-wider">{t("VOLS")}</p></div>
                  <div><p className="font-black text-foreground">{area._count.pollingStations}</p><p className="text-[9px] text-muted-foreground tracking-wider">{t("PS")}</p></div>
                </div>
              </div>
            ))}
            {areas.length === 0 && (
              <div className="col-span-full py-8 text-center text-sm text-muted-foreground bg-card/20 rounded-xl border border-dashed">
                {t("No active areas found.")}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
