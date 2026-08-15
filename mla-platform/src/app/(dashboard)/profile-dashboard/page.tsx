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
  CheckSquare 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Profile Dashboard | MLA Platform",
  description: "Overview of key metrics and statistics for the constituency.",
};

export default function ProfileDashboardPage() {
  // In a real application, these values would be fetched from the database
  const metrics = [
    { title: "Total Areas", value: "24", icon: Map, color: "text-blue-500" },
    { title: "Total Team Leaders", value: "48", icon: Users, color: "text-indigo-500" },
    { title: "Total Volunteers", value: "342", icon: UserCheck, color: "text-green-500" },
    { title: "Total Polling Stations", value: "120", icon: MapPin, color: "text-red-500" },
    { title: "Total Households", value: "45,000", icon: Home, color: "text-orange-500" },
  ];

  const activityMetrics = [
    { title: "Total Activities", value: "156", icon: Activity, color: "text-blue-500" },
    { title: "Completed Activities", value: "98", icon: CheckCircle2, color: "text-green-500" },
    { title: "Pending Activities", value: "58", icon: Clock, color: "text-amber-500" },
  ];

  const issueMetrics = [
    { title: "Reported Issues", value: "312", icon: AlertTriangle, color: "text-red-500" },
    { title: "Resolved Issues", value: "245", icon: CheckSquare, color: "text-emerald-500" },
  ];

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          High-level overview of constituency resources, activities, and issues.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Constituency Resources</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {metrics.map((metric) => (
              <Card key={metric.title} className="shadow-sm border-border/40 hover:bg-muted/10 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Activities Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activityMetrics.map((metric) => (
                <Card key={metric.title} className="shadow-sm border-border/40 hover:bg-muted/10 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Issues Tracking</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {issueMetrics.map((metric) => (
                <Card key={metric.title} className="shadow-sm border-border/40 hover:bg-muted/10 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
