import prisma from "@/lib/prisma";
import { WardDetailClient } from "./ward-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const ward = await prisma.ward.findUnique({ where: { id }, select: { name: true } });
    return { title: `${ward?.name ?? "Ward"} | MLA Platform` };
  } catch {
    return { title: "Ward Detail | MLA Platform" };
  }
}

export default async function WardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const ward = await prisma.ward.findUnique({
      where: { id },
      include: {
        area: {
          include: {
            managers: { include: { user: { select: { name: true } } } },
            pollingStations: {
              include: {
                teamLeader: { include: { user: { select: { name: true, mobile: true } } } },
                volunteers: { include: { user: { select: { name: true } } } },
              },
            },
          },
        },
        activities: { select: { id: true, name: true, status: true, teamLeaderId: true } },
        householdRefs: {
          include: {
            familyMembers: { select: { id: true } },
            records: {
              select: { id: true, name: true, voterId: true, sentiment: true, comments: true, photoUrl: true },
            },
          },
        },
      },
    });

    if (!ward) throw new Error("Not found");

    // Fetch records directly linked to polling stations under this area
    const allRecords = await prisma.record.findMany({
      where: {
        pollingStation: { areaId: ward.areaId },
      },
      select: {
        id: true,
        name: true,
        voterId: true,
        sentiment: true,
        comments: true,
        photoUrl: true,
        address: true,
      },
      take: 100,
    });

    const areaManager = ward.area.managers[0]?.user.name ?? "Unassigned";
    const ps = ward.area.pollingStations[0];
    const teamLeader = ps?.teamLeader?.user.name ?? "Unassigned";
    const teamLeaderContact = ps?.teamLeader?.user.mobile ?? null;
    const volunteers = ps?.volunteers.map((v) => v.user.name) ?? [];

    const totalHouseholds = ward.householdRefs.length || ward.households;
    const totalFamilyCards = ward.householdRefs.reduce(
      (acc, hh) => acc + hh.familyMembers.length,
      0
    );

    const runningAct = ward.activities.filter((a) => a.status === "In Progress").length;
    const completedAct = ward.activities.filter((a) => a.status === "Completed").length;
    const pendingAct = ward.activities.filter((a) =>
      ["Pending", "Draft", "Scheduled"].includes(a.status)
    ).length;

    const activityStatus =
      runningAct > 0 ? "Running" : completedAct > 0 ? "Completed" : "Pending";

    const wardData = {
      id: ward.id,
      name: ward.name,
      type: ward.type,
      population: ward.population,
      totalHouseholds,
      totalFamilyCards,
      totalVoters: allRecords.length || ward.population,
      areaManager,
      teamLeader,
      teamLeaderContact,
      volunteers,
      activityStatus,
      activitiesCount: { running: runningAct, completed: completedAct, pending: pendingAct },
      voters: allRecords.map((r, i) => ({
        id: r.id,
        serial: String.fromCharCode(65 + i), // A, B, C...
        name: r.name,
        voterId: r.voterId,
        address: r.address,
        sentiment: r.sentiment ?? null,
        comments: r.comments ?? "",
        photoUrl: r.photoUrl ?? null,
      })),
    };

    return <WardDetailClient ward={wardData} />;
  } catch (error) {
    console.warn("DB error — using mock data for ward detail");

    // Generate 16 mock voters (A to P)
    const mockVoters = Array.from({ length: 16 }, (_, i) => ({
      id: `voter-${i + 1}`,
      serial: String.fromCharCode(65 + i),
      name: ["Ramesh Kumar", "Sunita Devi", "Manoj Singh", "Priya Sharma", "Anil Yadav", "Kavita Gupta", "Suresh Patel", "Anita Verma", "Vijay Tiwari", "Pooja Rao", "Dinesh Kumar", "Rekha Sinha", "Rajesh Mishra", "Usha Pandey", "Rakesh Dubey", "Shila Joshi"][i],
      voterId: `UP${14 + i}/${100 + i}`,
      address: `House No. ${i + 1}, Main Bazaar, Ward-1`,
      sentiment: i < 5 ? "S" : i < 8 ? "N" : i < 10 ? "A" : null,
      comments: i < 5 ? "Supportive family, will vote." : "",
      photoUrl: null,
    }));

    const mockWard = {
      id,
      name: "Ward-1 (Main Bazaar)",
      type: "Ward",
      population: 1200,
      totalHouseholds: 280,
      totalFamilyCards: 310,
      totalVoters: 16,
      areaManager: "Sarah Jenkins",
      teamLeader: "Amit Kumar",
      teamLeaderContact: "9876543210",
      volunteers: ["Ravi Sharma", "Sunita Devi"],
      activityStatus: "Running",
      activitiesCount: { running: 1, completed: 4, pending: 1 },
      voters: mockVoters,
    };

    return <WardDetailClient ward={mockWard} />;
  }
}
