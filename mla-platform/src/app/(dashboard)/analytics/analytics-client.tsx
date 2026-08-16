"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { FileBarChart, Download } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Legend } from "recharts";

interface AnalyticsData {
  monthlyActivityData: { month: string; completed: number; pending: number }[];
  issueResolutionData: { month: string; reported: number; resolved: number }[];
}

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive dashboard performance analytics, data metrics, and trends"
        icon={FileBarChart}
        action={{ label: "Export PDF Report", onClick: () => {}, icon: Download }}
      />

      {/* Analytics Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cumulative performance area chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Operational Accomplishments</CardTitle>
            <CardDescription className="text-xs">Timeline of completed tasks vs scheduled guidelines</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data.monthlyActivityData}>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Issue Resolution Dynamics</CardTitle>
            <CardDescription className="text-xs">Reported vs resolved issues comparison per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.issueResolutionData}>
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
