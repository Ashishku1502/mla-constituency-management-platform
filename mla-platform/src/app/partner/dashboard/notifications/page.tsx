"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, Megaphone, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function PartnerNotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Campaign Completed", desc: "Your 'Voter Registration Drive 2026' has successfully reached 10,000 candidates.", type: "success", date: "2 hours ago", read: false },
    { id: 2, title: "New Lead Assigned", desc: "A high-intent lead 'Vikram Singh' has been routed to Zone Alpha.", type: "info", date: "5 hours ago", read: false },
    { id: 3, title: "Payout Processed", desc: "₹15,000 has been transferred to your registered HDFC bank account.", type: "success", date: "1 day ago", read: true },
    { id: 4, title: "Territory Alert", desc: "Zone Beta is showing 15% lower engagement than the weekly average.", type: "warning", date: "2 days ago", read: true },
    { id: 5, title: "System Maintenance", desc: "The partner portal will undergo scheduled maintenance on Oct 15th at 2:00 AM IST.", type: "alert", date: "3 days ago", read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Megaphone className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">Stay updated on your territory activities and alerts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" /> Mark All Read
          </Button>
          <Button variant="ghost" className="h-10 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={clearAll}>
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={`p-4 sm:p-6 flex gap-4 transition-colors ${notification.read ? 'bg-white dark:bg-slate-900 opacity-70' : 'bg-slate-50/80 dark:bg-slate-800/50'}`}>
                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  notification.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/30' :
                  notification.type === 'alert' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium text-slate-900 dark:text-white ${!notification.read ? 'font-bold' : ''}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{notification.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{notification.desc}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
