import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ActivityDetailClient } from "./activity-detail-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activity Details | MLA Platform",
  description: "View activity specifications and details",
};

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const resolvedParams = await params;
  
  const activity = await prisma.activity.findUnique({
    where: { id: resolvedParams.id },
    include: {
      teamLeader: { include: { user: true } },
      area: {
        include: {
          managers: { include: { user: true } }
        }
      }
    }
  });

  if (!activity) {
    notFound();
  }

  // Format data for client component
  const formattedActivity = {
    id: activity.id,
    name: activity.name,
    description: activity.description,
    objective: activity.objective,
    status: activity.status,
    deadline: activity.deadline,
    date: activity.date,
    startTime: activity.startTime,
    endTime: activity.endTime,
    location: activity.location,
    volunteers: activity.volunteersCount,
    capacity: activity.capacity,
    teamLeader: activity.teamLeader?.user.name || "Unassigned",
    areaManager: activity.area?.managers[0]?.user.name || "Unassigned",
  };

  return <ActivityDetailClient activity={formattedActivity} />;
}
