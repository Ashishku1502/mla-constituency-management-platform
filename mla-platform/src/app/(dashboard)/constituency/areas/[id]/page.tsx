import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AreaDetailClient } from "./area-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const area = await prisma.area.findUnique({ where: { id }, select: { name: true } });
    return { title: `${area?.name ?? "Area"} | MLA Platform` };
  } catch {
    return { title: "Area Detail | MLA Platform" };
  }
}

export default async function AreaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        managers: { include: { user: { select: { name: true, mobile: true } } } },
        teamLeaders: { include: { user: { select: { name: true } } } },
        volunteers: { include: { user: { select: { name: true } } } },
        pollingStations: {
          include: {
            teamLeader: { include: { user: { select: { name: true } } } },
            volunteers: { include: { user: { select: { name: true } } } },
            _count: { select: { records: true } },
          },
          orderBy: { number: "asc" },
        },
        activities: { select: { status: true } },
        _count: { select: { teamLeaders: true, volunteers: true, pollingStations: true, wards: true } },
      },
    });

    if (!area) return notFound();

    const managerName = area.managers.length > 0 ? area.managers[0].user.name : "Unassigned";
    const managerContact = area.managers.length > 0 ? area.managers[0].user.mobile : null;

    const runningAct = area.activities.filter((a) => a.status === "In Progress").length;
    const completedAct = area.activities.filter((a) => a.status === "Completed").length;
    const pendingAct = area.activities.filter((a) =>
      ["Pending", "Draft", "Scheduled"].includes(a.status)
    ).length;

    const totalPS = area.pollingStations.length;
    const assignedPS = area.pollingStations.filter((ps) => ps.teamLeader !== null).length;
    const psCoverage = totalPS > 0 ? Math.round((assignedPS / totalPS) * 100) : 0;

    const formattedPS = area.pollingStations.map((ps) => ({
      id: ps.id,
      number: ps.number,
      name: ps.name,
      address: ps.address,
      voterCount: ps.voterCount,
      recordCount: ps._count.records,
      status: ps.status,
      teamLeader: ps.teamLeader?.user.name ?? "Unassigned",
      teamLeaderId: ps.teamLeaderId,
      volunteerCount: ps.volunteers.length,
      volunteerNames: ps.volunteers.slice(0, 2).map((v) => v.user.name),
    }));

    const areaData = {
      id: area.id,
      name: area.name,
      code: area.code,
      population: area.population,
      registeredVoters: area.registeredVoters,
      status: area.status,
      householdCoverage: area.householdCoverage,
      psCoverage,
      description: area.description ?? "",
      managerName,
      managerContact,
      totalPS: area._count.pollingStations,
      totalTL: area._count.teamLeaders,
      totalVolunteers: area._count.volunteers,
      totalWards: area._count.wards,
      activitiesCount: { running: runningAct, completed: completedAct, pending: pendingAct },
      pollingStations: formattedPS,
    };

    return <AreaDetailClient area={areaData} />;
  } catch (error) {
    console.warn("DB error — using mock data for area detail");

    // Mock fallback
    const mockArea = {
      id,
      name: "Downtown Central",
      code: "DC-01",
      population: 45000,
      registeredVoters: 28500,
      status: "Active",
      householdCoverage: 85,
      psCoverage: 67,
      description: "Primary urban area covering central business district",
      managerName: "Sarah Jenkins",
      managerContact: "9876543210",
      totalPS: 5,
      totalTL: 5,
      totalVolunteers: 9,
      totalWards: 18,
      activitiesCount: { running: 2, completed: 5, pending: 1 },
      pollingStations: [
        { id: "ps-1", number: 1, name: "PS-1 Central Hall", address: "Main Bazaar", voterCount: 850, recordCount: 820, status: "Validated", teamLeader: "Amit Kumar", teamLeaderId: "tl-1", volunteerCount: 2, volunteerNames: ["Ravi", "Sunita"] },
        { id: "ps-2", number: 2, name: "PS-2 School Block", address: "School Road", voterCount: 720, recordCount: 700, status: "Validated", teamLeader: "Priya Sharma", teamLeaderId: "tl-2", volunteerCount: 2, volunteerNames: ["Mohan", "Geeta"] },
        { id: "ps-3", number: 3, name: "PS-3 Community Center", address: "Temple Lane", voterCount: 680, recordCount: 650, status: "Pending", teamLeader: "Unassigned", teamLeaderId: null, volunteerCount: 0, volunteerNames: [] },
        { id: "ps-4", number: 4, name: "PS-4 Panchayat Bhawan", address: "Market Road", voterCount: 910, recordCount: 880, status: "Validated", teamLeader: "Deepak Singh", teamLeaderId: "tl-3", volunteerCount: 2, volunteerNames: ["Kavya", "Arun"] },
        { id: "ps-5", number: 5, name: "PS-5 Old Town Hall", address: "Station Road", voterCount: 790, recordCount: 760, status: "Pending", teamLeader: "Unassigned", teamLeaderId: null, volunteerCount: 1, volunteerNames: ["Sita"] },
      ],
    };

    return <AreaDetailClient area={mockArea} />;
  }
}
