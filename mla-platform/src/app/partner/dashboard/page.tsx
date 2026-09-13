"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, IndianRupee, MapPin, TrendingUp, ChevronRight, Activity, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function PartnerDashboardOverviewPage() {
  const stats = [
    { title: "Total Leads", value: "2,450", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Candidates Reached", value: "845", change: "+5%", icon: Target, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    { title: "Earnings (₹)", value: "1,24,000", change: "+24%", icon: IndianRupee, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
    { title: "Active Territories", value: "14", change: "+2", icon: MapPin, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening in your territory today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10">
            <MessageSquare className="w-4 h-4 mr-2" /> Support
          </Button>
          <Link href="/partner/dashboard/campaigns">
            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700">
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" /> {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Candidate outreach vs target over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
              <Activity className="w-16 h-16 text-slate-200 dark:text-slate-800 absolute" />
              <div className="absolute inset-0 flex items-end justify-between px-6 pb-6 pt-10">
                {/* Mock Chart Bars */}
                {[40, 65, 30, 80, 55, 90, 70, 45, 85, 60, 95, 75].map((h, i) => (
                  <div key={i} className="w-[6%] bg-indigo-500/80 hover:bg-indigo-600 rounded-t-sm transition-all cursor-pointer group relative" style={{ height: `${h}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity">
                      {h * 12}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity List */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions from your ground team.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {[
                { name: "Rahul Verma", action: "added 12 new leads", time: "2 hours ago", color: "bg-blue-500" },
                { name: "Priya Singh", action: "completed door-to-door in Sector 4", time: "4 hours ago", color: "bg-green-500" },
                { name: "Amit Kumar", action: "distributed 500 pamphlets", time: "5 hours ago", color: "bg-orange-500" },
                { name: "Neha Sharma", action: "updated candidate status", time: "Yesterday", color: "bg-purple-500" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative mt-1">
                    <div className={`w-2 h-2 ${item.color} rounded-full z-10 relative`} />
                    {i !== 3 && <div className="absolute top-2 left-[3px] w-[2px] h-10 bg-slate-100 dark:bg-slate-800" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{item.name} <span className="font-normal text-slate-500">{item.action}</span></p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              View All Activity <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
