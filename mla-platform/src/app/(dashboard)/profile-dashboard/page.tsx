export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Map, 
  Users, 
  UserCheck, 
  MapPin, 
  Home, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CheckSquare,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profile Dashboard | MLA Platform",
  description: "Overview of key metrics and statistics for the constituency.",
};

const formatDate = (dateValue: any) => {
  if (!dateValue) return "N/A";
  try {
    const date = new Date(dateValue);
    // Check if the date is valid
    if (isNaN(date.getTime())) return String(dateValue);
    
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return String(dateValue);
  }
};

export default async function ProfileDashboardPage() {
  let totalAreas = 15;
  let totalTeamLeaders = 8;
  let totalVolunteers = 120;
  let totalPollingStations = 45;
  let totalHouseholds = 3240;
  let totalActivities = 47;
  let completedActivities = 35;
  let totalIssues = 58;
  let resolvedIssues = 45;

  let recentActivities: any[] = [];
  let recentIssues: any[] = [];
  let recentTeamLeaders: any[] = [];
  let recentPollingStations: any[] = [];

  try {
    const counts = await Promise.all([
      prisma.area.count(),
      prisma.teamLeader.count(),
      prisma.volunteer.count(),
      prisma.pollingStation.count(),
      prisma.household.count(),
      prisma.activity.count(),
      prisma.activity.count({ where: { status: "Completed" } }),
      prisma.issue.count(),
      prisma.issue.count({ where: { status: { in: ["Resolved", "Closed"] } } }),
    ]);
    
    [
      totalAreas,
      totalTeamLeaders,
      totalVolunteers,
      totalPollingStations,
      totalHouseholds,
      totalActivities,
      completedActivities,
      totalIssues,
      resolvedIssues
    ] = counts;

    recentActivities = await prisma.activity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    recentIssues = await prisma.issue.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { reportedBy: true }
    });

    recentTeamLeaders = await prisma.teamLeader.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true, area: true }
    });

    recentPollingStations = await prisma.pollingStation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { area: true }
    });

  } catch (error) {
    console.error("Database connection failed, using mock data:", error);
    recentActivities = [
      { id: "1", name: "Voter Registration Drive", category: "Event", status: "In Progress", date: "2023-10-12" },
      { id: "2", name: "Community Townhall", category: "Meeting", status: "Completed", date: "2023-10-10" },
      { id: "3", name: "Area Survey", category: "Survey", status: "Scheduled", date: "2023-10-15" }
    ];
    recentIssues = [
      { id: "1", category: "Water", status: "New", priority: "High", dateReported: "2023-10-12", reportedBy: { name: "John Doe" } },
      { id: "2", category: "Electricity", status: "In Progress", priority: "Medium", dateReported: "2023-10-11", reportedBy: { name: "Jane Smith" } },
    ];
    recentTeamLeaders = [
      { id: "1", user: { name: "Rajesh Kumar", mobile: "9876543210" }, area: { name: "North Zone" } },
      { id: "2", user: { name: "Sunita Devi", mobile: "9123456780" }, area: { name: "South Block" } }
    ];
    recentPollingStations = [
      { id: "1", number: 101, name: "Govt School Block A", area: { name: "North Zone" }, status: "Validated" },
      { id: "2", number: 102, name: "Community Center", area: { name: "South Block" }, status: "Pending" }
    ];
  }

  const pendingActivities = totalActivities - completedActivities;

  const metrics = [
    { title: "Total Areas", value: totalAreas.toString(), icon: Map, color: "text-blue-500", bgColor: "bg-blue-500/10", borderHover: "hover:border-blue-500/50" },
    { title: "Team Leaders", value: totalTeamLeaders.toString(), icon: Users, color: "text-indigo-500", bgColor: "bg-indigo-500/10", borderHover: "hover:border-indigo-500/50" },
    { title: "Volunteers", value: totalVolunteers.toString(), icon: UserCheck, color: "text-green-500", bgColor: "bg-green-500/10", borderHover: "hover:border-green-500/50" },
    { title: "Polling Stations", value: totalPollingStations.toString(), icon: MapPin, color: "text-red-500", bgColor: "bg-red-500/10", borderHover: "hover:border-red-500/50" },
    { title: "Households", value: totalHouseholds.toLocaleString(), icon: Home, color: "text-orange-500", bgColor: "bg-orange-500/10", borderHover: "hover:border-orange-500/50" },
  ];

  const activityMetrics = [
    { title: "Total Activities", value: totalActivities.toString(), icon: Activity, color: "text-blue-500", bgColor: "bg-blue-500/10", borderHover: "hover:border-blue-500/50" },
    { title: "Completed Activities", value: completedActivities.toString(), icon: CheckCircle2, color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderHover: "hover:border-emerald-500/50" },
    { title: "Pending Activities", value: pendingActivities.toString(), icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500/10", borderHover: "hover:border-amber-500/50" },
  ];

  const issueMetrics = [
    { title: "Reported Issues", value: totalIssues.toString(), icon: AlertTriangle, color: "text-rose-500", bgColor: "bg-rose-500/10", borderHover: "hover:border-rose-500/50" },
    { title: "Resolved Issues", value: resolvedIssues.toString(), icon: CheckSquare, color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderHover: "hover:border-emerald-500/50" },
  ];

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/40 p-8 md:p-12 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <LayoutDashboard className="w-64 h-64 text-primary" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" /> Live Constituency Data
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Profile Dashboard
          </h1>
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            A comprehensive, high-level overview of your constituency's resources, active campaigns, and reported community issues.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Resources Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Constituency Resources</h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {metrics.map((metric, i) => (
              <Card 
                key={metric.title} 
                className={cn(
                  "group relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md",
                  "border-border/40 hover:-translate-y-1 bg-card/60 backdrop-blur-sm",
                  metric.borderHover
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-transparent to-black/5 dark:to-white/5")} />
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    {metric.title}
                  </CardTitle>
                  <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", metric.bgColor)}>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Activities Section */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Activities Overview</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activityMetrics.map((metric) => (
                <Card 
                  key={metric.title} 
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md",
                    "border-border/40 hover:-translate-y-1 bg-card/60 backdrop-blur-sm",
                    metric.borderHover
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {metric.title}
                    </CardTitle>
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", metric.bgColor)}>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/40 shadow-sm bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-md">
                      <tr>
                        <th className="px-4 py-3 font-medium rounded-l-md">Name</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium rounded-r-md">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity: any) => (
                        <tr key={activity.id} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{activity.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{activity.category}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDate(activity.createdAt || activity.date)}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              activity.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : 
                              activity.status === "Scheduled" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                            )}>
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {recentActivities.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No recent activities found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Issues Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Issues Tracking</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {issueMetrics.map((metric) => (
                <Card 
                  key={metric.title} 
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md",
                    "border-border/40 hover:-translate-y-1 bg-card/60 backdrop-blur-sm",
                    metric.borderHover
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {metric.title}
                    </CardTitle>
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", metric.bgColor)}>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/40 shadow-sm bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Recent Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIssues.map((issue: any) => (
                    <div key={issue.id} className="flex flex-col gap-2 p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{issue.category} Issue</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                          issue.priority === "High" || issue.priority === "Critical" ? "bg-rose-500/10 text-rose-500" :
                          issue.priority === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          {issue.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(issue.createdAt || issue.dateReported)}</span>
                        <span className={cn(
                          "flex items-center gap-1",
                          issue.status === "Resolved" || issue.status === "Closed" ? "text-emerald-500" : "text-amber-500"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            issue.status === "Resolved" || issue.status === "Closed" ? "bg-emerald-500" : "bg-amber-500"
                          )} />
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentIssues.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No recent issues reported.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Recent Additions Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Team Leaders */}
          <section className="space-y-6">
            <Card className="border-border/40 shadow-sm bg-card/60 backdrop-blur-sm h-full">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  New Team Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTeamLeaders.map((tl: any) => (
                    <div key={tl.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                        {tl.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{tl.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{tl.user?.mobile}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          {tl.area?.name || 'Unassigned'}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70">Joined {formatDate(tl.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                  {recentTeamLeaders.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No team leaders registered recently.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Polling Stations */}
          <section className="space-y-6">
            <Card className="border-border/40 shadow-sm bg-card/60 backdrop-blur-sm h-full">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  Latest Polling Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPollingStations.map((ps: any) => (
                    <div key={ps.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold truncate">
                          <span className="text-muted-foreground mr-1">#{ps.number}</span>
                          {ps.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{ps.area?.name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider",
                          ps.status === "Validated" ? "bg-emerald-500/10 text-emerald-500" :
                          ps.status === "Error" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                        )}>
                          {ps.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70">Added {formatDate(ps.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  {recentPollingStations.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No polling stations added recently.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
