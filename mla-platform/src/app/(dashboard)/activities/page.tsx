export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { ClipboardList, Plus, Calendar, Users } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Area / Location</TableHead>
              <TableHead>Team Leader</TableHead>
              <TableHead>Volunteers Needed</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No activities found. Create a new activity to get started.
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <p className="font-medium text-sm">{activity.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{activity.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center gap-1"><Calendar className="h-3 w-3" /> {activity.date}</div>
                    <div className="text-xs text-muted-foreground">{activity.startTime} - {activity.endTime}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{activity.area.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">{activity.location}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {activity.teamLeader?.user.name || "Unassigned"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {activity.volunteersCount} / {activity.capacity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      activity.status === 'Completed' || activity.status === 'Verified' ? 'default' : 
                      activity.status === 'Overdue' ? 'destructive' : 'outline'
                    }>
                      {activity.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
