import prisma from "@/lib/prisma";
import { AreasClient } from "./areas-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Areas | MLA Platform",
  description: "Manage constituency areas, boundaries, and assignments",
};

export default async function AreasPage() {
  try {
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
  } catch (error) {
    console.warn("Database connection error. Falling back to mock data for presentation.");
    
    // Mock data for showcase purposes when DB is not connected
    const mockAreas = [
      {
        id: "mock-1",
        name: "Downtown Central",
        code: "DC-01",
        population: 45000,
        registeredVoters: 28500,
        status: "Active",
        householdCoverage: 85,
        pollingStations: 12,
        manager: "Sarah Jenkins",
        managerId: "mock-m1",
      },
      {
        id: "mock-2",
        name: "Westside Valley",
        code: "WV-02",
        population: 62000,
        registeredVoters: 41000,
        status: "Active",
        householdCoverage: 60,
        pollingStations: 18,
        manager: "Marcus Chen",
        managerId: "mock-m2",
      },
      {
        id: "mock-3",
        name: "North Hills",
        code: "NH-03",
        population: 31000,
        registeredVoters: 22000,
        status: "Inactive",
        householdCoverage: 30,
        pollingStations: 8,
        manager: "Unassigned",
        managerId: null,
      }
    ];

    const mockManagers = [
      { id: "mock-m1", name: "Sarah Jenkins" },
      { id: "mock-m2", name: "Marcus Chen" },
    ];

    return (
      <AreasClient initialAreas={mockAreas} managers={mockManagers} />
    );
  }
}
