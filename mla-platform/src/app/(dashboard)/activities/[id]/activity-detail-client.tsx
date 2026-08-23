"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ClipboardList, Users, Star, MessageSquare, MapPin, User, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ActivityDetailClient({ activity }: { activity: any }) {
  const router = useRouter();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          &larr; Back
        </Button>
        <PageHeader
          title={activity.name}
          description={`${activity.category} • ${activity.status}`}
          icon={ClipboardList}
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
              <h3 className="text-base font-bold line-clamp-1">{activity.teamLeader?.user?.name || "Unassigned"}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Participants</p>
              <h3 className="text-xl font-bold">{activity.participants}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Performance</p>
              <h3 className="text-xl font-bold">{activity.performance}%</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
              <h3 className="text-xl font-bold">4.5 / 5</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">{activity.date}</p>
                  <p className="text-sm text-muted-foreground">{activity.startTime} - {activity.endTime}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">{activity.location}</p>
                  <p className="text-sm text-muted-foreground">{activity.area.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Public Feedback & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.feedback.map((fb: any, i: number) => (
                <div key={i} className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">{fb.user}</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < fb.rating ? 'fill-current' : 'text-muted-foreground opacity-30'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{fb.comment}</p>
                </div>
              ))}
              {activity.feedback.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No feedback received yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Volunteers Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {activity.volunteers.map((vol: any, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {vol.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{vol.name}</p>
                      <p className="text-xs text-muted-foreground">{vol.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
