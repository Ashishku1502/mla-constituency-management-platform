export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { AssignmentsClient } from "./assignments-client";

export const metadata = {
  title: "Activity Assignments | MLA Platform",
  description: "Monitor volunteer task assignments, statuses, and updates",
};

export default async function AssignmentsPage() {
  const unassignedActivities = await prisma.activity.findMany({
    where: { status: "Scheduled" },
    include: { area: true }
  });

  const assignments = await prisma.activityAssignment.findMany({
    include: {
      activity: { include: { area: true } },
      volunteer: { include: { user: true } }
    },
    orderBy: { dateAssigned: 'desc' }
  });

  const volunteers = await prisma.volunteer.findMany({
    include: { user: true }
  });

  const wards = await prisma.ward.findMany();

  return (
    <AssignmentsClient 
      assignments={assignments} 
      unassignedActivities={unassignedActivities} 
      volunteers={volunteers}
      wards={wards}
    />
  );
}
