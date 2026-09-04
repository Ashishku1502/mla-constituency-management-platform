export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { ActivitiesClient } from "./activities-client";

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

  const pollingStations = await prisma.pollingStation.findMany({
    select: { id: true, name: true, number: true },
    orderBy: { number: 'asc' }
  });

  return <ActivitiesClient activities={activities} pollingStations={pollingStations} />;
}
