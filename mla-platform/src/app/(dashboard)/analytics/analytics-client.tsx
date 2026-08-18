"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { FileBarChart, Download } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsData {
  monthlyActivityData: { month: string; completed: number; pending: number }[];
  issueResolutionData: { month: string; reported: number; resolved: number }[];
}

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const [dateRange, setDateRange] = useState("all-time");

  const handleExportPDF = () => {
    // Simple, browser-native way to generate a PDF report. 
    // Ideally this would use a print stylesheet, which we will assume is partly covered by global CSS.
    window.print();
  };

  // Filter logic (simulated since we only have aggregated monthly data right now)
  const filterData = (chartData: any[]) => {
    if (dateRange === "all-time") return chartData;
    if (dateRange === "last-3-months") return chartData.slice(-3);
    if (dateRange === "this-year") return chartData.slice(-6); // Mock representation
    return chartData;
  };

  const filteredActivityData = filterData(data.monthlyActivityData);
  const filteredIssueData = filterData(data.issueResolutionData);

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Reports & Analytics"
          description="Comprehensive dashboard performance analytics, data metrics, and trends"
          icon={FileBarChart}
          action={{ label: "Export PDF Report", onClick: handleExportPDF, icon: Download }}
        />
        
        <div className="print:hidden mt-4 sm:mt-0">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cumulative performance area chart */}
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Operational Accomplishments</CardTitle>
            <CardDescription className="text-xs">Timeline of completed tasks vs scheduled guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={filteredActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fill="#10b98122" name="Completed" />
                <Area type="monotone" dataKey="pending" stroke="#6366f1" fill="#6366f122" name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue resolution efficiency */}
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Issue Resolution Dynamics</CardTitle>
            <CardDescription className="text-xs">Reported vs resolved issues comparison per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={filteredIssueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="reported" fill="#ef4444" name="Issues Reported" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="Issues Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
