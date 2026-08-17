"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Landmark,
  Sparkles,
  Shield,
  Star,
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

/* ================================================================
   Chart colours — Emerald, Gold, Teal, Coral, Amber
   ================================================================ */
const CHART_COLORS = {
  emerald: "#22c55e",
  gold:    "#eab308",
  teal:    "#14b8a6",
  coral:   "#f97316",
  amber:   "#f59e0b",
  rose:    "#f43f5e",
};

/* ================================================================
   Custom Tooltip
   ================================================================ */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm p-3 shadow-xl text-xs">
        <p className="font-semibold text-foreground mb-1.5">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 py-0.5">
            <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/* ================================================================
   Hero Banner
   ================================================================ */
function HeroBanner({ stats }: { stats: any }) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-2
                    bg-gradient-to-br from-[oklch(0.20_0.08_162)] via-[oklch(0.26_0.1_158)] to-[oklch(0.18_0.06_170)]
                    text-white shadow-2xl shadow-[oklch(0.20_0.08_162/0.4)]">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-48 w-48 rounded-full
                      bg-[oklch(0.78_0.16_80/0.15)] blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 rounded-full
                      bg-[oklch(0.6_0.2_155/0.2)] blur-3xl animate-float"
           style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      h-64 w-64 rounded-full bg-[oklch(0.78_0.16_80/0.05)] blur-3xl" />

      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
           style={{
             backgroundImage: "linear-gradient(oklch(0.78_0.16_80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78_0.16_80) 1px, transparent 1px)",
             backgroundSize: "32px 32px",
           }} />

      <div className="relative px-5 py-6 flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                            bg-gradient-to-br from-[oklch(0.78_0.16_80)] to-[oklch(0.72_0.18_55)]
                            shadow-lg shadow-[oklch(0.78_0.16_80/0.5)]">
              <Landmark className="h-4 w-4 text-[oklch(0.14_0.08_75)]" />
            </div>
            <Badge className="bg-[oklch(0.78_0.16_80/0.2)] text-[oklch(0.78_0.16_80)] border border-[oklch(0.78_0.16_80/0.3)] text-[10px] font-semibold tracking-wider uppercase">
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Live Overview
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Constituency{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[oklch(0.78_0.16_80)] to-[oklch(0.72_0.18_55)]">
              Dashboard
            </span>
          </h1>
          <p className="text-sm text-white/60 mt-1.5 max-w-md">
            Real-time operational insights across your entire constituency network
          </p>

          {/* Quick stat pills — wrap gracefully on all sizes */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { icon: Users, label: "Records", value: stats?.totalRecords?.toLocaleString() ?? "—" },
              { icon: Home, label: "Households", value: stats?.totalHouseholds?.toLocaleString() ?? "—" },
              { icon: UserCheck, label: "Volunteers", value: stats?.volunteers?.toLocaleString() ?? "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}
                   className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5
                              bg-white/10 backdrop-blur-sm border border-white/15
                              min-w-0 shrink">
                <Icon className="h-3.5 w-3.5 shrink-0 text-[oklch(0.78_0.16_80)]" />
                <span className="text-[11px] text-white/70 whitespace-nowrap">{label}</span>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — decorative ring stat, only on md+ to avoid squishing at 640px */}
        <div className="hidden md:flex flex-col items-center justify-center
                        h-24 w-24 rounded-full shrink-0
                        border-2 border-[oklch(0.78_0.16_80/0.4)]
                        bg-[oklch(0.78_0.16_80/0.1)]
                        shadow-[0_0_40px_oklch(0.78_0.16_80/0.2)]">
          <Star className="h-4 w-4 text-[oklch(0.78_0.16_80)] mb-1" />
          <p className="text-xl font-extrabold text-white">{stats?.householdCoverage ?? "—"}%</p>
          <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Coverage</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Stat Card
   ================================================================ */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  gradient: string;        // e.g. "from-emerald-500 to-teal-600"
  glowColor: string;       // inline style for box-shadow
  bgLight: string;         // light mode card bg tint class
}

function StatCard({ title, value, icon: Icon, trend, gradient, glowColor, bgLight }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;
  return (
    <div className={`card-premium group p-5 ${bgLight}`}>
      {/* Gradient shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />

      <div className="flex items-start justify-between relative">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            {title}
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {isPositive ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-rose-500" />
              )}
              <span className={isPositive ? "text-emerald-500 font-semibold" : "text-rose-500 font-semibold"}>
                {isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>

        {/* Icon with gradient bg */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                      bg-gradient-to-br ${gradient} text-white shadow-lg
                      transition-all duration-300 group-hover:scale-110`}
          style={{ boxShadow: glowColor }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className={`mt-4 h-0.5 w-full rounded-full bg-gradient-to-r ${gradient} opacity-20 group-hover:opacity-60 transition-opacity duration-300`} />
    </div>
  );
}

/* ================================================================
   Coverage Progress Card
   ================================================================ */
function CoverageCard({
  label, value, sublabel, colorClass,
}: {
  label: string; value: number; sublabel: string; colorClass: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <Badge className={`text-xs font-bold ${colorClass}`}>{value}%</Badge>
        </div>
        <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden mb-2">
          <div
            className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${colorClass.includes("emerald") ? "from-emerald-500 to-teal-500" : colorClass.includes("gold") || colorClass.includes("amber") ? "from-amber-400 to-yellow-500" : "from-[oklch(0.42_0.18_160)] to-[oklch(0.56_0.16_195)]"} transition-all duration-700`}
            style={{ width: `${value}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </CardContent>
    </Card>
  );
}

/* ================================================================
   Area Coverage List
   ================================================================ */
function AreaCoverageList({ areas }: { areas: any[] }) {
  return (
    <div className="space-y-3.5">
      {areas.slice(0, 6).map((area, idx) => (
        <div key={idx} className="space-y-1.5 group">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium truncate max-w-[160px] group-hover:text-primary transition-colors">{area.fullName || area.name}</span>
            <span className="text-xs font-bold text-muted-foreground">{area.households}%</span>
          </div>
          <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
              style={{
                width: `${area.households}%`,
                background: `linear-gradient(90deg, oklch(0.42 0.18 160), oklch(0.78 0.16 80))`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   Dashboard Page
   ================================================================ */
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
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  const { stats, charts } = data;

  /* Richer activity completion colours */
  const enrichedActivityData = charts.activityCompletionData.map((d: any, i: number) => ({
    ...d,
    color: [CHART_COLORS.emerald, CHART_COLORS.gold, CHART_COLORS.coral, CHART_COLORS.teal][i % 4],
  }));

  return (
    <div className="space-y-5 animate-stagger-1 pb-10">

      {/* Hero Banner */}
      <HeroBanner stats={stats} />

      {/* KPI Cards Row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger-2">
        <StatCard
          title="Total Records"
          value={stats.totalRecords}
          icon={Users}
          trend={{ value: 2.5, label: "this month" }}
          gradient="from-emerald-500 to-teal-600"
          glowColor="0 8px 24px oklch(0.42 0.18 160 / 0.35)"
          bgLight="bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/10"
        />
        <StatCard
          title="Households"
          value={stats.totalHouseholds}
          icon={Home}
          trend={{ value: 5.2, label: "this month" }}
          gradient="from-amber-400 to-yellow-500"
          glowColor="0 8px 24px oklch(0.78 0.16 80 / 0.4)"
          bgLight="bg-gradient-to-br from-amber-50/60 to-yellow-50/40 dark:from-amber-950/20 dark:to-yellow-950/10"
        />
        <StatCard
          title="Areas"
          value={stats.totalAreas}
          icon={Building2}
          gradient="from-violet-500 to-purple-600"
          glowColor="0 8px 24px oklch(0.55 0.22 300 / 0.35)"
          bgLight="bg-gradient-to-br from-violet-50/60 to-purple-50/40 dark:from-violet-950/20 dark:to-purple-950/10"
        />
        <StatCard
          title="Polling Stations"
          value={stats.totalPollingStations}
          icon={Vote}
          gradient="from-cyan-500 to-sky-600"
          glowColor="0 8px 24px oklch(0.62 0.18 210 / 0.35)"
          bgLight="bg-gradient-to-br from-cyan-50/60 to-sky-50/40 dark:from-cyan-950/20 dark:to-sky-950/10"
        />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger-3">
        <StatCard
          title="Active Volunteers"
          value={stats.volunteers}
          icon={UserCheck}
          trend={{ value: 8.3, label: "this month" }}
          gradient="from-green-500 to-emerald-600"
          glowColor="0 8px 24px oklch(0.55 0.2 145 / 0.35)"
          bgLight="bg-gradient-to-br from-green-50/60 to-emerald-50/40 dark:from-green-950/20 dark:to-emerald-950/10"
        />
        <StatCard
          title="Completed Activities"
          value={stats.completedActivities}
          icon={CheckCircle2}
          trend={{ value: 12.1, label: "vs last month" }}
          gradient="from-teal-500 to-cyan-600"
          glowColor="0 8px 24px oklch(0.56 0.16 195 / 0.35)"
          bgLight="bg-gradient-to-br from-teal-50/60 to-cyan-50/40 dark:from-teal-950/20 dark:to-cyan-950/10"
        />
        <StatCard
          title="Pending Activities"
          value={stats.pendingActivities}
          icon={Clock}
          trend={{ value: -3.2, label: "vs last month" }}
          gradient="from-orange-400 to-amber-500"
          glowColor="0 8px 24px oklch(0.72 0.18 55 / 0.35)"
          bgLight="bg-gradient-to-br from-orange-50/60 to-amber-50/40 dark:from-orange-950/20 dark:to-amber-950/10"
        />
        <StatCard
          title="Reported Issues"
          value={stats.reportedIssues}
          icon={AlertTriangle}
          trend={{ value: -5.1, label: "vs last month" }}
          gradient="from-rose-500 to-red-600"
          glowColor="0 8px 24px oklch(0.62 0.22 25 / 0.35)"
          bgLight="bg-gradient-to-br from-rose-50/60 to-red-50/40 dark:from-rose-950/20 dark:to-red-950/10"
        />
      </div>

      {/* Coverage Summary — 1 col on mobile, 3 col from md to avoid cramping at 640px */}
      <div className="grid gap-4 md:grid-cols-3 animate-stagger-4">
        <CoverageCard
          label="Household Coverage"
          value={stats.householdCoverage}
          sublabel={`${Math.round(stats.totalHouseholds * (stats.householdCoverage / 100)).toLocaleString()} of ${stats.totalHouseholds.toLocaleString()} covered`}
          colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <CoverageCard
          label="Reporting Compliance"
          value={stats.reportingCompliance}
          sublabel={`${stats.volunteers - Math.round(stats.volunteers * 0.18)} of ${stats.volunteers} volunteers on time`}
          colorClass="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <CoverageCard
          label="Issue Resolution"
          value={Math.round((stats.resolvedIssues / stats.reportedIssues) * 100)}
          sublabel={`${stats.resolvedIssues} of ${stats.reportedIssues} issues resolved`}
          colorClass="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity Status Donut */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
              <CardTitle className="text-base font-bold">Activity Status</CardTitle>
            </div>
            <CardDescription className="text-xs">Current distribution of all activities</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="45%" height={200}>
                <PieChart>
                  <Pie
                    data={enrichedActivityData}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {enrichedActivityData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {enrichedActivityData.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Performance Bar */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-amber-400 to-yellow-500" />
              <CardTitle className="text-base font-bold">Area Performance</CardTitle>
            </div>
            <CardDescription className="text-xs">Activity completion & household coverage by area</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.areaPerformanceData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.025 150 / 0.5)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="activities" fill={CHART_COLORS.emerald} radius={[5, 5, 0, 0]} name="Activities" />
                <Bar dataKey="households" fill={CHART_COLORS.gold} radius={[5, 5, 0, 0]} name="Coverage %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Activity Trend */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-teal-500 to-cyan-600" />
              <CardTitle className="text-base font-bold">Monthly Activity Trend</CardTitle>
            </div>
            <CardDescription className="text-xs">Completed vs pending vs overdue over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={charts.monthlyActivityData}>
                <defs>
                  <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.emerald} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CHART_COLORS.emerald} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.gold} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CHART_COLORS.gold} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradOverdue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.coral} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={CHART_COLORS.coral} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.025 150 / 0.4)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke={CHART_COLORS.emerald} strokeWidth={2} fill="url(#gradCompleted)" name="Completed" />
                <Area type="monotone" dataKey="pending" stackId="1" stroke={CHART_COLORS.gold} strokeWidth={2} fill="url(#gradPending)" name="Pending" />
                <Area type="monotone" dataKey="overdue" stackId="1" stroke={CHART_COLORS.coral} strokeWidth={2} fill="url(#gradOverdue)" name="Overdue" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Resolution Trend */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-rose-500 to-red-600" />
              <CardTitle className="text-base font-bold">Issue Resolution</CardTitle>
            </div>
            <CardDescription className="text-xs">Reported vs resolved issues per month</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={charts.issueResolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.025 150 / 0.4)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="reported" stroke={CHART_COLORS.coral} strokeWidth={2.5} dot={{ r: 3.5, fill: CHART_COLORS.coral, strokeWidth: 0 }} activeDot={{ r: 5 }} name="Reported" />
                <Line type="monotone" dataKey="resolved" stroke={CHART_COLORS.emerald} strokeWidth={2.5} dot={{ r: 3.5, fill: CHART_COLORS.emerald, strokeWidth: 0 }} activeDot={{ r: 5 }} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Household Coverage by Area */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-yellow-500" />
              <CardTitle className="text-base font-bold">Coverage by Area</CardTitle>
            </div>
            <CardDescription className="text-xs">Household coverage percentage per area</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <AreaCoverageList areas={charts.areaPerformanceData} />
          </CardContent>
        </Card>

        {/* Volunteer Activity */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
              <CardTitle className="text-base font-bold">Volunteer Activity</CardTitle>
            </div>
            <CardDescription className="text-xs">Active vs inactive volunteers over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts.volunteerActivityData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.025 150 / 0.4)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.5 0.05 155)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="active" fill={CHART_COLORS.emerald} radius={[5, 5, 0, 0]} name="Active" />
                <Bar dataKey="inactive" fill="oklch(0.85 0.02 150)" radius={[5, 5, 0, 0]} name="Inactive" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
