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
        pollingStations: {
          include: { teamLeader: true }
        },
        _count: {
          select: { teamLeaders: true, activities: true }
        },
        activities: {
          select: { status: true }
        }
      },
      orderBy: { name: "asc" }
    });

    const formattedAreas = dbAreas.map(area => {
      const manager = area.managers.length > 0 ? area.managers[0].user.name : "Unassigned";
      const managerId = area.managers.length > 0 ? area.managers[0].userId : null;
      
      const runningAct = area.activities.filter(a => a.status === "In Progress").length;
      const completedAct = area.activities.filter(a => a.status === "Completed").length;
      const pendingAct = area.activities.filter(a => a.status === "Pending" || a.status === "Draft" || a.status === "Scheduled").length;

      const totalPS = area.pollingStations.length;
      const assignedPS = area.pollingStations.filter(ps => ps.teamLeader !== null).length;
      const psCoverage = totalPS > 0 ? Math.round((assignedPS / totalPS) * 100) : 0;

      return {
        id: area.id,
        name: area.name,
        code: area.code,
        population: area.population,
        registeredVoters: area.registeredVoters,
        status: area.status,
        householdCoverage: area.householdCoverage,
        psCoverage: psCoverage,
        pollingStations: totalPS,
        teamLeaders: area._count.teamLeaders,
        activitiesCount: { running: runningAct, completed: completedAct, pending: pendingAct },
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
        psCoverage: 67,
        pollingStations: 12,
        teamLeaders: 3,
        activitiesCount: { running: 2, completed: 5, pending: 1 },
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
        psCoverage: 50,
        pollingStations: 18,
        teamLeaders: 4,
        activitiesCount: { running: 1, completed: 8, pending: 2 },
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
        psCoverage: 25,
        pollingStations: 8,
        teamLeaders: 1,
        activitiesCount: { running: 0, completed: 2, pending: 4 },
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
