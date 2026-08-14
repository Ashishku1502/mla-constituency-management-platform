"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { Bell, Check, CheckCheck, Activity, FileText, AlertTriangle, Users, Clock, ShieldCheck } from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "Activity Reminder": Clock,
  "Report Submitted": FileText,
  "Issue Escalation": AlertTriangle,
  "Verification Request": ShieldCheck,
  "Assignment Update": Users,
  "Overdue Task": Clock,
  "Approval Request": Check,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unread = notifications.filter((n) => !n.read);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Stay updated on activities, reports, issues, and assignments" icon={Bell}>
        {unread.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </PageHeader>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All <Badge variant="secondary" className="ml-1.5 text-[10px] h-5">{notifications.length}</Badge></TabsTrigger>
          <TabsTrigger value="unread">Unread <Badge variant="secondary" className="ml-1.5 text-[10px] h-5 bg-primary/10 text-primary">{unread.length}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-2">
          {notifications.map((notif) => {
            const Icon = iconMap[notif.type] || Activity;
            return (
              <Card key={notif.id} className={cn("cursor-pointer hover:shadow-sm transition-all", !notif.read && "border-l-4 border-l-primary bg-primary/[0.02]")}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", !notif.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={cn("text-sm", !notif.read ? "font-semibold" : "font-medium")}>{notif.title}</h3>
                      <span className="text-xs text-muted-foreground shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <Badge variant="secondary" className="text-[10px] mt-2">{notif.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="unread" className="mt-4 space-y-2">
          {unread.length === 0 ? (
            <div className="text-center py-12">
              <CheckCheck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">All caught up! No unread notifications.</p>
            </div>
          ) : (
            unread.map((notif) => {
              const Icon = iconMap[notif.type] || Activity;
              return (
                <Card key={notif.id} className="cursor-pointer hover:shadow-sm transition-all border-l-4 border-l-primary bg-primary/[0.02]">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold">{notif.title}</h3>
                        <span className="text-xs text-muted-foreground shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
