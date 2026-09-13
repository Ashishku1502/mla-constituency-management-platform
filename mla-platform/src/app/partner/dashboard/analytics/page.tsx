"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, PieChart, TrendingUp, Download, Users, Target, Activity } from "lucide-react";

export default function PartnerAnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Deep dive into your territory's performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[150px] h-10">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 3 Months</SelectItem>
              <SelectItem value="365">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-10">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-indigo-500" />
              Voter Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6 relative">
              {/* CSS Only Mock Donut Chart */}
              <div className="w-40 h-40 rounded-full border-[16px] border-slate-100 dark:border-slate-800 relative">
                <div className="absolute inset-0 rounded-full border-[16px] border-green-500" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 50%)" }}></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-blue-500" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 50% 50%)" }}></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-orange-500" style={{ clipPath: "polygon(0 100%, 0 0, 100% 0, 50% 50%)" }}></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">8.2k</span>
                  <span className="text-xs text-slate-500">Voters</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div>
                <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1"></div>
                <p className="text-xs text-slate-500">Positive</p>
                <p className="font-semibold text-sm">45%</p>
              </div>
              <div>
                <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1"></div>
                <p className="text-xs text-slate-500">Neutral</p>
                <p className="font-semibold text-sm">35%</p>
              </div>
              <div>
                <div className="w-3 h-3 rounded-full bg-orange-500 mx-auto mb-1"></div>
                <p className="text-xs text-slate-500">Negative</p>
                <p className="font-semibold text-sm">20%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Conversion Funnel */}
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2 text-indigo-500" />
              Lead Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Contacts</span>
                <span className="font-medium">10,000</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 dark:bg-slate-600 w-full"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Engaged Leads</span>
                <span className="font-medium">4,500 (45%)</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-10/12 mx-auto">
                <div className="h-full bg-indigo-300 w-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Supporters Identified</span>
                <span className="font-medium">2,100 (21%)</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-8/12 mx-auto">
                <div className="h-full bg-indigo-500 w-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Confirmed Voters</span>
                <span className="font-medium">850 (8.5%)</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-5/12 mx-auto">
                <div className="h-full bg-indigo-700 w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-indigo-500" />
              Team Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">92<span className="text-2xl text-slate-400">%</span></div>
              <p className="text-sm text-slate-500">Average task completion rate</p>
              
              <div className="flex items-center gap-2 mt-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" /> +5% from last month
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Top Zone</span>
                <span className="font-medium">Zone Alpha (98%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Bar Chart Mock */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-indigo-500" />
            Voter Outreach Trend
          </CardTitle>
          <CardDescription>Daily contacts made across all zones over the last 14 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 relative p-4 flex items-end justify-between">
            <Activity className="absolute inset-0 m-auto w-24 h-24 text-slate-200 dark:text-slate-800 opacity-50 pointer-events-none" />
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full border-b border-slate-200 dark:border-slate-700/50 flex-1"></div>
              ))}
            </div>
            
            {/* Bars */}
            {[
              30, 45, 25, 60, 80, 55, 90, 100, 75, 40, 65, 85, 70, 95
            ].map((height, i) => (
              <div key={i} className="w-[5%] relative group z-10 flex flex-col justify-end h-full">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity">
                  {height * 5} contacts
                </div>
                <div 
                  className="w-full bg-indigo-500 hover:bg-indigo-400 rounded-t-sm transition-all cursor-pointer" 
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 px-4">
            <span>2 Weeks Ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
