import prisma from "@/lib/prisma";
import { AreasClient } from "./areas-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Areas | MLA Platform",
  description: "Manage constituency areas, boundaries, and assignments",
};

export default async function AreasPage() {
  const dbAreas = await prisma.area.findMany({
    include: {
      managers: {
        include: { user: true }
      },
      _count: {
        select: { pollingStations: true }
      }
    },
    orderBy: { name: "asc" }
  });

  const formattedAreas = dbAreas.map(area => {
    const manager = area.managers.length > 0 ? area.managers[0].user.name : "Unassigned";
    const managerId = area.managers.length > 0 ? area.managers[0].userId : null;
    
    return {
      id: area.id,
      name: area.name,
      code: area.code,
      population: area.population,
      registeredVoters: area.registeredVoters,
      status: area.status,
      householdCoverage: area.householdCoverage,
      pollingStations: area._count.pollingStations,
      manager,
      managerId,
    };
  });

  const allManagers = await prisma.user.findMany({
    where: { role: "Area Manager" },
    select: { id: true, name: true }
  });

  return <AreasClient initialAreas={formattedAreas} managers={allManagers} />;
}
