import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { Shield, Map, Users, Activity, AlertTriangle, Eye, Radio, Zap, Clock, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Election War Room | MLA Platform",
  description: "Real-time operational command center for constituency monitoring",
};

export default async function WarRoomPage() {
  const [
    activeUsers,
    totalUsers,
    activeActivities,
    overdueActivities,
    scheduledActivitiesCount,
    criticalIssues,
    unverifiedReportsCount,
    areas
  ] = await Promise.all([
    prisma.user.count({ where: { status: "Active" } }),
    prisma.user.count(),
    prisma.activity.findMany({ where: { status: "In Progress" } }),
    prisma.activity.findMany({ where: { status: "Overdue" } }),
    prisma.activity.count({ where: { status: "Scheduled" } }),
    prisma.issue.findMany({ where: { priority: { in: ["Critical", "High"] }, status: { notIn: ["Resolved", "Closed"] } } }),
    prisma.groundReport.count({ where: { status: "Submitted" } }),
    prisma.area.findMany({
      where: { status: "Active" },
      take: 4,
      include: {
        _count: {
          select: { pollingStations: true, teamLeaders: true, volunteers: true }
        }
      }
    })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Election War Room"
        description="Real-time operational command center for constituency monitoring"
        icon={Shield}
      />

      {/* Top Status Bar */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-muted-foreground">ACTIVE USERS</span>
            </div>
            <p className="text-2xl font-bold">{activeUsers}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {totalUsers} total</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-muted-foreground">LIVE ACTIVITIES</span>
            </div>
            <p className="text-2xl font-bold">{activeActivities.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{scheduledActivitiesCount} upcoming</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-muted-foreground">OVERDUE</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{overdueActivities.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">need attention</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-muted-foreground">CRITICAL ISSUES</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{criticalIssues.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">unresolved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map Monitor */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              <CardTitle className="text-base">Live Map Monitor</CardTitle>
            </div>
            <CardDescription>Real-time constituency activity and coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 h-[350px] rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Map className="h-12 w-12 text-primary/40 mx-auto" />
                <p className="text-sm text-muted-foreground">Live constituency map with real-time markers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Center */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">Alert Center</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-400">Critical Issues</span>
              </div>
              <p className="text-xs text-red-600/80 dark:text-red-400/70">{criticalIssues.length} unresolved high/critical priority issues</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Overdue Activities</span>
              </div>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/70">{overdueActivities.length} activities past deadline</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">Inactive Volunteers</span>
              </div>
              <p className="text-xs text-orange-600/80 dark:text-orange-400/70">14 volunteers inactive for 48+ hours (Demo)</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Unverified Reports</span>
              </div>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/70">{unverifiedReportsCount} reports awaiting verification</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Coverage Monitor */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Area Coverage Monitor</CardTitle>
          <CardDescription>Operational status by area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <div key={area.id} className="p-3 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{area.name}</span>
                  <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Live</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Household Coverage</span>
                    <span className="font-medium">{area.householdCoverage}%</span>
                  </div>
                  <Progress value={area.householdCoverage} className="h-1" />
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  <div><p className="font-semibold">{area._count.teamLeaders}</p><p className="text-muted-foreground">TLs</p></div>
                  <div><p className="font-semibold">{area._count.volunteers}</p><p className="text-muted-foreground">Vols</p></div>
                  <div><p className="font-semibold">{area._count.pollingStations}</p><p className="text-muted-foreground">PS</p></div>
                </div>
              </div>
            ))}
            {areas.length === 0 && (
              <div className="col-span-full py-4 text-center text-sm text-muted-foreground">
                No active areas found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
