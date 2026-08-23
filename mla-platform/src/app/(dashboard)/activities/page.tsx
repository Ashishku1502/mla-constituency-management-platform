export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { ClipboardList, Plus, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Activities | MLA Platform",
  description: "Plan, assign, and track constituency activities",
};

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    include: {
      area: true,
      teamLeader: {
        include: { user: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activities"
        description="Plan, assign, and track constituency activities"
        icon={ClipboardList}
        action={{ label: "Create Activity", href: "/activities/add", icon: Plus }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border rounded-xl bg-card border-dashed">
            No activities found. Create a new activity to get started.
          </div>
        ) : (
          activities.map((activity) => (
            <Link key={activity.id} href={`/activities/${activity.id}`}>
              <div className="border rounded-xl bg-card hover:shadow-md hover:border-primary/40 transition-all overflow-hidden h-full flex flex-col">
                <div className="p-4 border-b bg-muted/20">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold line-clamp-1 flex-1 text-primary">{activity.name}</h3>
                    <Badge variant={
                      activity.status === 'Completed' || activity.status === 'Verified' ? 'default' : 
                      activity.status === 'Overdue' ? 'destructive' : 'outline'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{activity.category}</Badge>
                </div>
                <div className="p-4 flex-1 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{activity.date}</span>
                    </div>
                    <span className="text-xs">{activity.startTime} - {activity.endTime}</span>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Location</p>
                    <p className="font-medium line-clamp-1">{activity.area.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{activity.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Team Leader</p>
                      <p className="font-medium line-clamp-1">{activity.teamLeader?.user.name || "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Volunteers</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-primary" />
                        <span className="font-medium">{activity.volunteersCount} / {activity.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
