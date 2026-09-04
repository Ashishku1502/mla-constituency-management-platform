export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { MyTasksClient } from "./my-tasks-client";

export const metadata = {
  title: "My Tasks | MLA Platform",
  description: "View and manage your assigned activities",
};

export default async function MyTasksPage() {
  // In a real app, we would get the logged-in user's volunteer ID.
  // For this demo, we'll fetch all assignments but simulate a volunteer view.
  const assignments = await prisma.activityAssignment.findMany({
    include: {
      activity: {
        include: { area: true, ward: true }
      }
    },
    orderBy: { dateAssigned: 'desc' }
  });

  return <MyTasksClient assignments={assignments} />;
}
