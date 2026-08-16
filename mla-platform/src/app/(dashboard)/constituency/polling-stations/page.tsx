import prisma from "@/lib/prisma";
import { PollingStationsClient } from "./polling-stations-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Polling Stations | MLA Platform",
  description: "Manage polling station information and record assignments",
};

export default async function PollingStationsPage() {
  const dbStations = await prisma.pollingStation.findMany({
    include: {
      area: true,
      teamLeader: {
        include: { user: true }
      }
    },
    orderBy: { number: "asc" }
  });

  const formattedStations = dbStations.map(ps => ({
    id: ps.id,
    number: ps.number,
    name: ps.name,
    address: ps.address,
    area: ps.area.name,
    teamLeader: ps.teamLeader?.user?.name || "Unassigned",
    recordCount: ps.recordCount,
    status: ps.status,
  }));

  return <PollingStationsClient initialStations={formattedStations} />;
}
