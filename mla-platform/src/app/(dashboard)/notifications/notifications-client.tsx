"use client";

import { useState, type ElementType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { Bell, Check, CheckCheck, Activity, FileText, AlertTriangle, Users, Clock, ShieldCheck, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, ElementType> = {
  "Activity Reminder": Clock,
  "Report Submitted": FileText,
  "Issue Escalation": AlertTriangle,
  "Verification Request": ShieldCheck,
  "Assignment Update": Users,
  "Overdue Task": Clock,
  "Approval Request": Check,
};

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationsClient({ initialNotifications }: { initialNotifications: NotificationData[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.filter((n) => !n.read);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const NotificationCard = ({ notif }: { notif: NotificationData }) => {
    const Icon = iconMap[notif.type] || Activity;
    return (
      <Card 
        className={cn(
          "group relative overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-md",
          !notif.read 
            ? "bg-gradient-to-r from-primary/[0.08] to-transparent ring-1 ring-primary/20" 
            : "bg-card ring-1 ring-border/50 hover:ring-primary/20"
        )}
      >
        {!notif.read && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
        )}
        <CardContent className="p-5 flex items-start gap-4">
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105", 
            !notif.read ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <h3 className={cn("text-base tracking-tight", !notif.read ? "font-bold text-foreground" : "font-medium text-foreground/80")}>
                {notif.title}
              </h3>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{notif.time}</span>
              </div>
            </div>
            <p className={cn("text-sm leading-relaxed mb-3", !notif.read ? "text-foreground/90" : "text-muted-foreground")}>
              {notif.message}
            </p>
            <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Badge variant="outline" className={cn("text-[10px] font-semibold tracking-wider uppercase", !notif.read ? "border-primary/20 text-primary" : "")}>
                {notif.type}
              </Badge>
              <div className="flex items-center gap-2">
                {!notif.read && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)} className="h-7 text-xs font-medium text-primary hover:text-primary hover:bg-primary/10">
                    <Check className="h-3.5 w-3.5 mr-1" /> Mark Read
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => deleteNotification(notif.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ isUnreadTab }: { isUnreadTab?: boolean }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full w-32 h-32 m-auto" />
        <div className="relative bg-background ring-1 ring-border shadow-xl h-24 w-24 rounded-3xl flex items-center justify-center mx-auto transform -rotate-6 transition-transform hover:rotate-0 duration-300">
          <Bell className="h-10 w-10 text-primary/40" />
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center shadow-lg border-2 border-background">
            <CheckCheck className="h-4 w-4" />
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2">
        {isUnreadTab ? "All Caught Up!" : "No Notifications Yet"}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {isUnreadTab 
          ? "You've read all your notifications. Take a break and check back later for new updates." 
          : "When there's activity in your constituency, you'll see it right here."}
      </p>
      {isUnreadTab && notifications.length > 0 && (
        <Button variant="outline" className="rounded-full shadow-sm">
          View all notifications <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <PageHeader title="Notifications" description="Stay updated on activities, reports, issues, and assignments" icon={Bell}>
        {unread.length > 0 && (
          <Button variant="default" size="sm" onClick={markAllRead} className="gap-2 shadow-md hover:shadow-lg transition-all rounded-full px-5">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </PageHeader>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1 rounded-full border shadow-sm">
            <TabsTrigger value="all" className="rounded-full px-6 transition-all data-[state=active]:shadow-sm">
              All <Badge variant="secondary" className="ml-2 text-[10px] h-5 rounded-full px-2 font-mono">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-full px-6 transition-all data-[state=active]:shadow-sm">
              Unread 
              <Badge variant={unread.length > 0 ? "default" : "secondary"} className={cn("ml-2 text-[10px] h-5 rounded-full px-2 font-mono", unread.length > 0 && "shadow-sm")}>
                {unread.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-3 outline-none">
          {notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {notifications.map((notif) => (
                <NotificationCard key={notif.id} notif={notif} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3 outline-none">
          {unread.length === 0 ? (
            <EmptyState isUnreadTab />
          ) : (
            <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {unread.map((notif) => (
                <NotificationCard key={notif.id} notif={notif} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
