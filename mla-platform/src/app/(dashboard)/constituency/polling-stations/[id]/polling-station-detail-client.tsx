"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Vote, Users, Home, TrendingUp, CheckCircle, Clock, MapPin, User, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function PollingStationDetailClient({ station }: { station: any }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          &larr; Back
        </Button>
        <PageHeader
          title={`Polling Station: ${station.name}`}
          description={`PS No. ${station.number} • ${station.area}`}
          icon={Vote}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Leader</p>
              <h3 className="text-lg font-bold">{station.teamLeader}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Voters</p>
              <h3 className="text-lg font-bold">{station.voterCount}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wards Covered</p>
              <h3 className="text-lg font-bold">{station.wards.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">PS Performance</p>
              <h3 className="text-lg font-bold">{station.performance}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Activity Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Overall Completion</span>
                  <span className="font-bold">{station.overallActivityPerformance}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${station.overallActivityPerformance}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Volunteer Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Overall Efficiency</span>
                  <span className="font-bold">{station.overallVolunteerPerformance}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all" style={{ width: `${station.overallVolunteerPerformance}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2 mt-8 mb-4">
          <Home className="h-5 w-5" />
          Wards within this Polling Station
        </h2>
        {station.wards.map((ward: any) => (
          <Card key={ward.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>{ward.name}</CardTitle>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-4 w-4" /> {ward.completedActivities} Completed
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Clock className="h-4 w-4" /> {ward.pendingActivities} Pending
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                <div className="p-6">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">Assigned Volunteers</h4>
                  <ul className="space-y-2">
                    {ward.volunteers.map((vol: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {vol.charAt(0)}
                        </div>
                        {vol}
                      </li>
                    ))}
                    {ward.volunteers.length === 0 && (
                      <li className="text-sm text-muted-foreground italic">No volunteers assigned</li>
                    )}
                  </ul>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wider">Activities</h4>
                  <ul className="space-y-4">
                    {ward.activities.map((act: any, i: number) => (
                      <li key={i} className="text-sm border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{act.name}</span>
                          <StatusBadge status={act.status} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{act.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${act.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                              style={{ width: `${act.progress}%` }} 
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                    {ward.activities.length === 0 && (
                      <li className="text-sm text-muted-foreground italic">No activities recorded</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
