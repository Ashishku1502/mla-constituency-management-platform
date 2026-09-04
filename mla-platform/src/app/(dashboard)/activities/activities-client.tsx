"use client";

import { ClipboardList, Plus, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { PageHeader } from "@/components/shared/page-header";

export function ActivitiesClient({ activities, pollingStations = [] }: { activities: any[], pollingStations?: any[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [forwardDialogId, setForwardDialogId] = useState<string | null>(null);
  const [selectedPS, setSelectedPS] = useState<string>("");
  const [isForwarding, setIsForwarding] = useState(false);

  const handleForward = async () => {
    if (!selectedPS || !forwardDialogId) return;
    setIsForwarding(true);
    try {
      const res = await fetch(`/api/activities/${forwardDialogId}/forward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollingStationId: selectedPS }),
      });
      if (res.ok) {
        toast.success(t("Activity forwarded successfully"));
        setForwardDialogId(null);
        setSelectedPS("");
        router.refresh();
      } else {
        toast.error(t("Failed to forward activity"));
      }
    } catch (e) {
      toast.error(t("An unexpected error occurred"));
    } finally {
      setIsForwarding(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("Activities")}
        description="Plan, assign, and track constituency activities"
        icon={ClipboardList}
        action={{ label: t("Create Activity"), href: "/activities/add", icon: Plus }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border rounded-xl glass-card bg-card/40 border-dashed animate-stagger-1">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center glow-emerald">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-2 text-foreground font-medium">{t("No activities found")}</p>
              <p className="text-sm">{t("Create a new activity to get started.")}</p>
            </div>
          </div>
        ) : (
          activities.map((activity, i) => (
            <Link key={activity.id} href={`/activities/${activity.id}`}>
              <div className={cn(
                "card-premium glass-card overflow-hidden h-full flex flex-col group",
                `animate-stagger-${(i % 5) + 1}`
              )}>
                <div className="p-4 border-b border-border/50 bg-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/20 transition-colors duration-500" />
                  <div className="flex justify-between items-start mb-2 gap-2 relative z-10">
                    <h3 className="font-bold line-clamp-1 flex-1 text-gradient">{activity.name}</h3>
                    <Badge variant={
                      activity.status === 'Completed' || activity.status === 'Verified' ? 'default' : 
                      activity.status === 'Overdue' ? 'destructive' : 'outline'
                    } className="shadow-sm shadow-black/5">
                      {t(activity.status)}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="text-[10px] relative z-10 bg-background/50 backdrop-blur-sm border-white/10">{t(activity.category)}</Badge>
                </div>
                <div className="p-4 flex-1 space-y-4 text-sm bg-card/40">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-white/5">
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Calendar className="h-4 w-4" />
                      <span>{activity.date}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{activity.startTime} - {activity.endTime}</span>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                      {t("Location")}
                    </p>
                    <p className="font-semibold line-clamp-1">{activity.area.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{activity.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                        {t("Team Leader")}
                      </p>
                      <p className="font-medium line-clamp-1">{activity.teamLeader?.user.name || t("Unassigned")}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                        {t("Volunteers")}
                      </p>
                      <div className="flex items-center gap-1.5 bg-primary/5 w-fit px-2 py-0.5 rounded-full border border-primary/10">
                        <Users className="h-3 w-3 text-primary" />
                        <span className="font-semibold text-primary">{activity.volunteersCount} <span className="text-muted-foreground font-normal">/ {activity.capacity}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  {!activity.teamLeaderId && (
                    <div className="pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setForwardDialogId(activity.id);
                        }}
                      >
                        {t("Forward to P/S")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <Dialog open={!!forwardDialogId} onOpenChange={(open) => !open && setForwardDialogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Forward Activity to Polling Station")}</DialogTitle>
            <DialogDescription>
              {t("Select a Polling Station. The Team Leader assigned to this station will receive the activity.")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("Target Polling Station")}</Label>
              <Select value={selectedPS} onValueChange={setSelectedPS}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select a Polling Station")} />
                </SelectTrigger>
                <SelectContent>
                  {pollingStations.map(ps => (
                    <SelectItem key={ps.id} value={ps.id}>
                      {ps.name} (PS-{ps.number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForwardDialogId(null)}>{t("Cancel")}</Button>
            <Button onClick={handleForward} disabled={isForwarding || !selectedPS}>
              {isForwarding ? t("Forwarding...") : t("Forward Activity")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
