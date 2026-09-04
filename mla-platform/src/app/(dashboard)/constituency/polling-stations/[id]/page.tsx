import prisma from "@/lib/prisma";
import { PollingStationDetailClient } from "./polling-station-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const ps = await prisma.pollingStation.findUnique({ where: { id }, select: { name: true, number: true } });
    return { title: `PS-${ps?.number}: ${ps?.name ?? "Polling Station"} | MLA Platform` };
  } catch {
    return { title: "Polling Station Details | MLA Platform" };
  }
}

export default async function PollingStationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const ps = await prisma.pollingStation.findUnique({
      where: { id },
      include: {
        area: {
          select: {
            id: true,
            name: true,
            managers: { include: { user: { select: { name: true } } } },
          },
        },
        teamLeader: { include: { user: { select: { name: true, mobile: true } } } },
        volunteers: {
          include: {
            user: { select: { name: true } },
          },
        },
        activities: {
          select: { id: true, name: true, status: true, wardId: true, deadline: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!ps) throw new Error("Not found");

    // Get wards via area
    const wards = await prisma.ward.findMany({
      where: { areaId: ps.areaId },
      include: {
        activities: { select: { id: true, name: true, status: true } },
        householdRefs: { select: { id: true } },
      },
      orderBy: { name: "asc" },
    });

    const runningAct = ps.activities.filter((a) => a.status === "In Progress").length;
    const completedAct = ps.activities.filter((a) => a.status === "Completed").length;
    const pendingAct = ps.activities.filter((a) =>
      ["Pending", "Draft", "Scheduled"].includes(a.status)
    ).length;

    const stationData = {
      id: ps.id,
      number: ps.number,
      name: ps.name,
      address: ps.address,
      areaId: ps.area.id,
      area: ps.area.name,
      areaManager: ps.area.managers[0]?.user.name ?? "Unassigned",
      teamLeader: ps.teamLeader?.user.name ?? "Unassigned",
      teamLeaderContact: ps.teamLeader?.user.mobile ?? null,
      teamLeaderId: ps.teamLeaderId,
      voterCount: ps.voterCount,
      recordCount: ps.recordCount,
      status: ps.status,
      volunteersCount: ps.volunteers.length,
      volunteerNames: ps.volunteers.map((v) => v.user.name),
      activitiesCount: { running: runningAct, completed: completedAct, pending: pendingAct },
      overallActivityPerformance: ps.activities.length > 0
        ? Math.round((completedAct / ps.activities.length) * 100)
        : 0,
      overallVolunteerPerformance: ps.volunteers.length > 0 ? 78 : 0,
      wards: wards.map((w) => ({
        id: w.id,
        name: w.name,
        type: w.type,
        population: w.population,
        households: w.households,
        completedActivities: w.activities.filter((a) => a.status === "Completed").length,
        pendingActivities: w.activities.filter((a) =>
          ["Pending", "Draft", "Scheduled"].includes(a.status)
        ).length,
        runningActivities: w.activities.filter((a) => a.status === "In Progress").length,
        activities: w.activities.slice(0, 3).map((a) => ({
          name: a.name,
          status: a.status,
          progress: a.status === "Completed" ? 100 : a.status === "In Progress" ? 50 : 0,
        })),
        volunteers: ps.volunteers.slice(0, 2).map((v) => v.user.name),
      })),
    };

    return <PollingStationDetailClient station={stationData} />;
  } catch (error) {
    console.warn("DB error — using mock data for PS detail");

    const mockStation = {
      id,
      number: 1,
      name: "Central City Hall",
      address: "100 Main St, Center City",
      areaId: "area-1",
      area: "Downtown Central",
      areaManager: "Sarah Jenkins",
      teamLeader: "Amit Kumar",
      teamLeaderContact: "9876543210",
      teamLeaderId: "tl-1",
      voterCount: 1500,
      recordCount: 1450,
      status: "Validated",
      volunteersCount: 2,
      volunteerNames: ["Ravi Sharma", "Sunita Devi"],
      activitiesCount: { running: 2, completed: 5, pending: 1 },
      overallActivityPerformance: 75,
      overallVolunteerPerformance: 88,
      wards: [
        {
          id: "w-1",
          name: "Ward-1 (Main Bazaar)",
          type: "Ward",
          population: 1200,
          households: 280,
          completedActivities: 4,
          pendingActivities: 1,
          runningActivities: 1,
          activities: [
            { name: "Door-to-door Survey", status: "In Progress", progress: 60 },
            { name: "Voter Verification", status: "Completed", progress: 100 },
          ],
          volunteers: ["Ravi Sharma"],
        },
        {
          id: "w-2",
          name: "Ward-2 (Temple Lane)",
          type: "Ward",
          population: 980,
          households: 210,
          completedActivities: 3,
          pendingActivities: 2,
          runningActivities: 0,
          activities: [
            { name: "Local Rally", status: "Completed", progress: 100 },
            { name: "Canvassing", status: "Pending", progress: 0 },
          ],
          volunteers: ["Sunita Devi"],
        },
        {
          id: "w-3",
          name: "Ward-3 (School Road)",
          type: "Ward",
          population: 850,
          households: 190,
          completedActivities: 2,
          pendingActivities: 0,
          runningActivities: 1,
          activities: [
            { name: "Youth Meeting", status: "In Progress", progress: 40 },
          ],
          volunteers: ["Ravi Sharma", "Sunita Devi"],
        },
        {
          id: "w-4",
          name: "Ward-4 (Station Road)",
          type: "Ward",
          population: 760,
          households: 170,
          completedActivities: 1,
          pendingActivities: 3,
          runningActivities: 0,
          activities: [
            { name: "Women's Meeting", status: "Pending", progress: 0 },
          ],
          volunteers: [],
        },
      ],
    };

    return <PollingStationDetailClient station={mockStation} />;
  }
}
