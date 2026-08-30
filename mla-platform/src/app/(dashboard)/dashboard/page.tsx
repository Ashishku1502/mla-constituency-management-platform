"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
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
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden rounded-2xl mb-2
                    bg-gradient-to-br from-primary to-primary/40
                    text-white shadow-2xl shadow-primary/10">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-48 w-48 rounded-full
                      bg-primary/15 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-56 w-56 rounded-full
                      bg-primary/20 blur-3xl animate-float"
           style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
           style={{
             backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
             backgroundSize: "32px 32px",
           }} />

      <div className="relative px-5 py-6 flex flex-col md:flex-row items-start md:items-center gap-5">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                            bg-gradient-to-br from-primary to-primary-foreground/40
                            shadow-lg shadow-primary/50">
              <Landmark className="h-4 w-4 text-white" />
            </div>
            <Badge className="bg-primary/20 text-white border border-primary/30 text-[10px] font-semibold tracking-wider uppercase">
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              {t("Live Overview")}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("Constituency Dashboard")}
          </h1>
          <p className="text-sm text-white/60 mt-1.5 max-w-md">
            {t("Real-time operational insights across your entire constituency network")}
          </p>

          {/* Quick stat pills — wrap gracefully on all sizes */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { icon: Users, label: t("Total Records"), value: stats?.totalRecords?.toLocaleString() ?? "—" },
              { icon: Home, label: t("Households"), value: stats?.totalHouseholds?.toLocaleString() ?? "—" },
              { icon: UserCheck, label: t("Volunteers"), value: stats?.volunteers?.toLocaleString() ?? "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label}
                   className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5
                              bg-white/10 backdrop-blur-sm border border-white/15
                              min-w-0 shrink">
                <Icon className="h-3.5 w-3.5 shrink-0 text-white/80" />
                <span className="text-[11px] text-white/70 whitespace-nowrap">{label}</span>
                <span className="text-[11px] font-bold text-white whitespace-nowrap">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — decorative ring stat, only on md+ to avoid squishing at 640px */}
        <div className="hidden md:flex flex-col items-center justify-center
                        h-24 w-24 rounded-full shrink-0
                        border-2 border-primary/40
                        bg-primary/10
                        shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Star className="h-4 w-4 text-white mb-1" />
          <p className="text-xl font-extrabold text-white">{stats?.householdCoverage ?? "—"}%</p>
          <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{t("Coverage")}</p>
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
  const { t } = useTranslation();
  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <Badge className={`text-xs font-bold ${colorClass}`}>{value}%</Badge>
        </div>
        <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden mb-2">
          <div
            className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${colorClass.includes("primary") ? "from-primary to-primary/60" : colorClass.includes("chart-2") ? "from-chart-2 to-chart-2/60" : "from-chart-3 to-chart-3/60"} transition-all duration-700`}
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
                background: `linear-gradient(90deg, var(--primary), var(--secondary))`,
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
   =======================================================export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

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
    color: ["var(--primary)", "var(--chart-2)", "var(--chart-4)", "var(--chart-3)"][i % 4],
  }));

  return (
    <div className="space-y-5 animate-stagger-1 pb-10">

      {/* Hero Banner */}
      <HeroBanner stats={stats} />

      {/* KPI Cards Row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger-2">
        <StatCard
          title={t("Total Records")}
          value={stats.totalRecords}
          icon={Users}
          trend={{ value: 2.5, label: t("this month") }}
          gradient="from-primary to-primary/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--primary) 35%, transparent)"
          bgLight="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 hover:border-primary/45 transition-colors duration-300"
        />
        <StatCard
          title={t("Households")}
          value={stats.totalHouseholds}
          icon={Home}
          trend={{ value: 5.2, label: t("this month") }}
          gradient="from-chart-2 to-chart-2/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--chart-2) 35%, transparent)"
          bgLight="bg-gradient-to-br from-chart-2/5 to-transparent border-chart-2/20 hover:border-chart-2/45 transition-colors duration-300"
        />
        <StatCard
          title={t("Areas")}
          value={stats.totalAreas}
          icon={Building2}
          gradient="from-chart-3 to-chart-3/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--chart-3) 35%, transparent)"
          bgLight="bg-gradient-to-br from-chart-3/5 to-transparent border-chart-3/20 hover:border-chart-3/45 transition-colors duration-300"
        />
        <StatCard
          title={t("Polling Stations")}
          value={stats.totalPollingStations}
          icon={Vote}
          gradient="from-chart-4 to-chart-4/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--chart-4) 35%, transparent)"
          bgLight="bg-gradient-to-br from-chart-4/5 to-transparent border-chart-4/20 hover:border-chart-4/45 transition-colors duration-300"
        />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger-3">
        <StatCard
          title={t("Active Volunteers")}
          value={stats.volunteers}
          icon={UserCheck}
          trend={{ value: 8.3, label: t("this month") }}
          gradient="from-chart-5 to-chart-5/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--chart-5) 35%, transparent)"
          bgLight="bg-gradient-to-br from-chart-5/5 to-transparent border-chart-5/20 hover:border-chart-5/45 transition-colors duration-300"
        />
        <StatCard
          title={t("Completed Activities")}
          value={stats.completedActivities}
          icon={CheckCircle2}
          trend={{ value: 12.1, label: t("vs last month") }}
          gradient="from-primary to-primary/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--primary) 35%, transparent)"
          bgLight="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 hover:border-primary/45 transition-colors duration-300"
        />
        <StatCard
          title={t("Pending Activities")}
          value={stats.pendingActivities}
          icon={Clock}
          trend={{ value: -3.2, label: t("vs last month") }}
          gradient="from-chart-2 to-chart-2/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--chart-2) 35%, transparent)"
          bgLight="bg-gradient-to-br from-chart-2/5 to-transparent border-chart-2/20 hover:border-chart-2/45 transition-colors duration-300"
        />
        <StatCard
          title={t("Reported Issues")}
          value={stats.reportedIssues}
          icon={AlertTriangle}
          trend={{ value: -5.1, label: t("vs last month") }}
          gradient="from-chart-4 to-chart-4/60"
          glowColor="0 8px 24px color-mix(in srgb, var(--chart-4) 35%, transparent)"
          bgLight="bg-gradient-to-br from-chart-4/5 to-transparent border-chart-4/20 hover:border-chart-4/45 transition-colors duration-300"
        />
      </div>

      {/* Coverage Summary — 1 col on mobile, 3 col from md to avoid cramping at 640px */}
      <div className="grid gap-4 md:grid-cols-3 animate-stagger-4">
        <CoverageCard
          label={t("Household Coverage")}
          value={stats.householdCoverage}
          sublabel={`${Math.round(stats.totalHouseholds * (stats.householdCoverage / 100)).toLocaleString()} ${t("of")} ${stats.totalHouseholds.toLocaleString()} ${t("covered")}`}
          colorClass="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary"
        />
        <CoverageCard
          label={t("Reporting Compliance")}
          value={stats.reportingCompliance}
          sublabel={`${stats.volunteers - Math.round(stats.volunteers * 0.18)} ${t("of")} ${stats.volunteers} ${t("volunteers on time")}`}
          colorClass="bg-chart-2/10 text-chart-2 border-chart-2/20 dark:bg-chart-2/20 dark:text-chart-2"
        />
        <CoverageCard
          label={t("Issue Resolution")}
          value={Math.round((stats.resolvedIssues / stats.reportedIssues) * 100)}
          sublabel={`${stats.resolvedIssues} ${t("of")} ${stats.reportedIssues} ${t("issues resolved")}`}
          colorClass="bg-chart-3/10 text-chart-3 border-chart-3/20 dark:bg-chart-3/20 dark:text-chart-3"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity Status Donut */}
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-primary/60" />
              <CardTitle className="text-base font-bold">{t("Activity Status")}</CardTitle>
            </div>
            <CardDescription className="text-xs">{t("Current distribution of all activities")}</CardDescription>
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
                      <span className="text-muted-foreground font-medium">{t(item.name)}</span>
                    </div>
                    <span className="font-bold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Performance Bar */}
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-chart-2 to-chart-2/60" />
              <CardTitle className="text-base font-bold">{t("Area Performance")}</CardTitle>
            </div>
            <CardDescription className="text-xs">{t("Activity completion & household coverage by area")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.areaPerformanceData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="activities" fill="var(--primary)" radius={[5, 5, 0, 0]} name={t("Activities")} />
                <Bar dataKey="households" fill="var(--chart-2)" radius={[5, 5, 0, 0]} name={t("Coverage")} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Activity Trend */}
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-chart-3 to-chart-3/60" />
              <CardTitle className="text-base font-bold">{t("Monthly Activity Trend")}</CardTitle>
            </div>
            <CardDescription className="text-xs">{t("Completed vs pending vs overdue over time")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={charts.monthlyActivityData}>
                <defs>
                  <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradOverdue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="var(--primary)" strokeWidth={2} fill="url(#gradCompleted)" name={t("Completed")} />
                <Area type="monotone" dataKey="pending" stackId="1" stroke="var(--chart-2)" strokeWidth={2} fill="url(#gradPending)" name={t("Pending")} />
                <Area type="monotone" dataKey="overdue" stackId="1" stroke="var(--chart-4)" strokeWidth={2} fill="url(#gradOverdue)" name={t("Overdue")} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Resolution Trend */}
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-chart-4 to-chart-4/60" />
              <CardTitle className="text-base font-bold">{t("Issue Resolution Trend")}</CardTitle>
            </div>
            <CardDescription className="text-xs">{t("Reported vs resolved issues per month")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={charts.issueResolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="reported" stroke="var(--chart-4)" strokeWidth={2.5} dot={{ r: 3.5, fill: "var(--chart-4)", strokeWidth: 0 }} activeDot={{ r: 5 }} name={t("Reported")} />
                <Line type="monotone" dataKey="resolved" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3.5, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 5 }} name={t("Resolved")} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Household Coverage by Area */}
        <Card className="lg:col-span-1 overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-chart-2" />
              <CardTitle className="text-base font-bold">{t("Coverage by Area")}</CardTitle>
            </div>
            <CardDescription className="text-xs">{t("Household coverage percentage per area")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <AreaCoverageList areas={charts.areaPerformanceData} />
          </CardContent>
        </Card>

        {/* Volunteer Activity */}
        <Card className="lg:col-span-2 overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-chart-3 to-chart-5" />
              <CardTitle className="text-base font-bold">{t("Volunteer Activity")}</CardTitle>
            </div>
            <CardDescription className="text-xs">{t("Active vs inactive volunteers over time")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts.volunteerActivityData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="active" fill="var(--primary)" radius={[5, 5, 0, 0]} name={t("Active")} />
                <Bar dataKey="inactive" fill="var(--muted)" radius={[5, 5, 0, 0]} name={t("Inactive")} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
