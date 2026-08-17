"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Home,
  MapPin,
  Vote,
  UserCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color: string;
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    isPositive ? "text-emerald-600" : "text-red-500"
                  }
                >
                  {isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} transition-transform duration-200 group-hover:scale-110`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AreaCoverageList({ areas }: { areas: any[] }) {
  return (
    <div className="space-y-3">
      {areas
        .slice(0, 6)
        .map((area, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium truncate max-w-[180px]">
                {area.fullName || area.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {area.households}%
              </span>
            </div>
            <Progress value={area.households} className="h-1.5" />
          </div>
        ))}
    </div>
  );
}

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const fetchedData = await res.json();
          setData(fetchedData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !data) {
    return <div className="space-y-6"><Skeleton className="h-[200px] w-full" /><Skeleton className="h-[400px] w-full" /></div>;
  }

  const { stats, charts } = data;

  return (
    <div className="space-y-6 animate-stagger-1 pb-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Constituency overview and operational insights
        </p>
      </div>

      {/* KPI Cards — Row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger-2">
        <StatCard
          title="Total Records"
          value={stats.totalRecords}
          icon={Users}
          trend={{ value: 2.5, label: "this month" }}
          color="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <StatCard
          title="Households"
          value={stats.totalHouseholds}
          icon={Home}
          trend={{ value: 5.2, label: "this month" }}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          title="Areas"
          value={stats.totalAreas}
          icon={Building2}
          color="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
        />
        <StatCard
          title="Polling Stations"
          value={stats.totalPollingStations}
          icon={Vote}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        />
      </div>

      {/* KPI Cards — Row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger-3">
        <StatCard
          title="Active Volunteers"
          value={stats.volunteers}
          icon={UserCheck}
          trend={{ value: 8.3, label: "this month" }}
          color="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
        />
        <StatCard
          title="Completed Activities"
          value={stats.completedActivities}
          icon={CheckCircle2}
          trend={{ value: 12.1, label: "vs last month" }}
          color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Pending Activities"
          value={stats.pendingActivities}
          icon={Clock}
          trend={{ value: -3.2, label: "vs last month" }}
          color="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
        />
        <StatCard
          title="Reported Issues"
          value={stats.reportedIssues}
          icon={AlertTriangle}
          trend={{ value: -5.1, label: "vs last month" }}
          color="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        />
      </div>

      {/* Coverage Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-stagger-4">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Household Coverage
              </p>
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              >
                {stats.householdCoverage}%
              </Badge>
            </div>
            <Progress value={stats.householdCoverage} className="h-2 mb-1.5" />
            <p className="text-xs text-muted-foreground">
              {Math.round(
                stats.totalHouseholds * (stats.householdCoverage / 100)
              ).toLocaleString()}{" "}
              of {stats.totalHouseholds.toLocaleString()} households covered
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Reporting Compliance
              </p>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {stats.reportingCompliance}%
              </Badge>
            </div>
            <Progress
              value={stats.reportingCompliance}
              className="h-2 mb-1.5"
            />
            <p className="text-xs text-muted-foreground">
              {stats.volunteers - Math.round(stats.volunteers * 0.18)} of{" "}
              {stats.volunteers} volunteers reporting on time
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Issue Resolution
              </p>
              <Badge
                variant="secondary"
                className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
              >
                {Math.round(
                  (stats.resolvedIssues / stats.reportedIssues) * 100
                )}
                %
              </Badge>
            </div>
            <Progress
              value={(stats.resolvedIssues / stats.reportedIssues) * 100}
              className="h-2 mb-1.5"
            />
            <p className="text-xs text-muted-foreground">
              {stats.resolvedIssues} of {stats.reportedIssues} issues resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity Completion Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Activity Status
            </CardTitle>
            <CardDescription className="text-xs">
              Current distribution of all activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={charts.activityCompletionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {charts.activityCompletionData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 flex-1">
                {charts.activityCompletionData.map((item: any) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Performance Bar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Area Performance
            </CardTitle>
            <CardDescription className="text-xs">
              Activity completion & household coverage by area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.areaPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Bar
                  dataKey="activities"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Activities"
                />
                <Bar
                  dataKey="households"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Coverage %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Activity Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Monthly Activity Trend
            </CardTitle>
            <CardDescription className="text-xs">
              Completed vs pending vs overdue activities over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={charts.monthlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b98133"
                  name="Completed"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke="#6366f1"
                  fill="#6366f133"
                  name="Pending"
                />
                <Area
                  type="monotone"
                  dataKey="overdue"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef444433"
                  name="Overdue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Resolution Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Issue Resolution
            </CardTitle>
            <CardDescription className="text-xs">
              Reported vs resolved issues per month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={charts.issueResolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Line
                  type="monotone"
                  dataKey="reported"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Reported"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Area Household Coverage */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Household Coverage by Area
            </CardTitle>
            <CardDescription className="text-xs">
              Percentage of households covered per area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaCoverageList areas={charts.areaPerformanceData} />
          </CardContent>
        </Card>

        {/* Volunteer Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Volunteer Activity
            </CardTitle>
            <CardDescription className="text-xs">
              Active vs inactive volunteers over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts.volunteerActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Bar
                  dataKey="active"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Active"
                />
                <Bar
                  dataKey="inactive"
                  fill="#e2e8f0"
                  radius={[4, 4, 0, 0]}
                  name="Inactive"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
