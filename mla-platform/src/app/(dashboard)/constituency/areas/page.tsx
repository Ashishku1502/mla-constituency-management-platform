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
        pollingStationsCount: totalPS,
        pollingStations: area.pollingStations.map(ps => ({ id: ps.id, name: ps.name, number: ps.number })),
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

    const dbActivities = await prisma.activity.findMany({
      include: {
        area: { select: { name: true, managers: { select: { userId: true } } } },
        teamLeader: { select: { id: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const groupedActivitiesMap = new Map();
    for (const act of dbActivities) {
      if (!groupedActivitiesMap.has(act.name)) {
        groupedActivitiesMap.set(act.name, {
          id: act.id,
          name: act.name,
          status: act.status,
          areas: [act.area.name],
          totalPS: act.pollingStationId ? 1 : 0,
          dates: [act.date],
          managersCount: act.area.managers.length,
          teamLeadersCount: act.teamLeader ? 1 : 0,
          volunteersCount: act.volunteersCount,
        });
      } else {
        const group = groupedActivitiesMap.get(act.name);
        if (!group.areas.includes(act.area.name)) {
          group.areas.push(act.area.name);
          group.managersCount += act.area.managers.length;
        }
        if (act.pollingStationId) group.totalPS += 1;
        if (!group.dates.includes(act.date)) group.dates.push(act.date);
        if (act.teamLeader) group.teamLeadersCount += 1;
        group.volunteersCount += act.volunteersCount;
      }
    }
    const formattedActivities = Array.from(groupedActivitiesMap.values());

    return <AreasClient initialAreas={formattedAreas} managers={allManagers} initialActivities={formattedActivities} />;
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
        pollingStationsCount: 12,
        pollingStations: Array.from({ length: 12 }).map((_, i) => ({ id: `ps-1-${i}`, name: `Polling Station ${i + 1}`, number: i + 1 })),
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
        pollingStationsCount: 18,
        pollingStations: Array.from({ length: 18 }).map((_, i) => ({ id: `ps-2-${i}`, name: `Polling Station ${i + 1}`, number: i + 1 })),
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
        pollingStationsCount: 8,
        pollingStations: Array.from({ length: 8 }).map((_, i) => ({ id: `ps-3-${i}`, name: `Polling Station ${i + 1}`, number: i + 1 })),
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

    const mockActivities = [
      {
        id: "mock-act-1",
        name: "Door-to-door Survey",
        status: "In Progress",
        areas: ["Downtown Central", "Westside Valley"],
        totalPS: 24,
        dates: ["2026-09-10", "2026-09-12"],
        managersCount: 2,
        teamLeadersCount: 5,
        volunteersCount: 120,
      },
      {
        id: "mock-act-2",
        name: "Voter Registration Drive",
        status: "Pending",
        areas: ["North Hills"],
        totalPS: 8,
        dates: ["2026-09-15"],
        managersCount: 1,
        teamLeadersCount: 2,
        volunteersCount: 30,
      },
      {
        id: "mock-act-3",
        name: "Community Townhall",
        status: "Completed",
        areas: ["Downtown Central", "Westside Valley", "North Hills"],
        totalPS: 38,
        dates: ["2026-08-20"],
        managersCount: 3,
        teamLeadersCount: 8,
        volunteersCount: 45,
      }
    ];

    return (
      <AreasClient initialAreas={mockAreas} managers={mockManagers} initialActivities={mockActivities} />
    );
  }
}
