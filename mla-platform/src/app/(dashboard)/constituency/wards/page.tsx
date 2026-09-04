import prisma from "@/lib/prisma";
import { WardsClient } from "./wards-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ward Management | MLA Platform",
  description: "Central module for Gram Pradhan Registration, Voter List upload, and Ward division.",
};

const mockMetrics = {
  campaignReadinessScore: 40,
  population: 5000,
  voters: 500,
  linkedVoters: 8,
  unlinkedVoters: 492,
  internalWards: 10,
  teamLeaders: 3,
  volunteers: 4,
  familyCards: 2,
  totalActivities: 5,
  pendingActivities: 3,
  completedActivities: 2,
  progress: {
    overall: 33,
    familyCardCoverage: 100,
    voterLinking: 2,
    activityCompletion: 40,
    volunteerReports: 25,
  }
};

export default async function WardsPage() {
  try {
    const dbWards = await prisma.ward.findMany({
      include: {
        area: {
          include: {
            managers: { include: { user: true } }
          }
        },
        householdRefs: {
          include: {
            assignedVolunteer: { include: { user: true } },
            pollingStation: { include: { teamLeader: { include: { user: true } } } },
            records: true
          }
        },
        activities: {
          select: { status: true }
        }
      },
      orderBy: { name: "asc" }
    });

    const formattedWards = dbWards.map(w => {
      const uniqueVolunteers = Array.from(new Set(w.householdRefs.map(h => h.assignedVolunteer?.user.name).filter(Boolean)));
      const uniqueTLs = Array.from(new Set(w.householdRefs.map(h => h.pollingStation?.teamLeader?.user.name).filter(Boolean)));
      const manager = w.area.managers.length > 0 ? w.area.managers[0].user.name : "Unassigned";
      
      const runningAct = w.activities.filter(a => a.status === "In Progress").length;
      const completedAct = w.activities.filter(a => a.status === "Completed").length;
      const pendingAct = w.activities.filter(a => a.status === "Pending" || a.status === "Draft" || a.status === "Scheduled").length;
      const actStatus = runningAct > 0 ? "Running" : (pendingAct > 0 ? "Pending" : "Completed");

      const totalVoters = w.householdRefs.reduce((acc, h) => acc + h.records.length, 0);

      return {
        id: w.id,
        name: w.name,
        type: w.type,
        area: w.area.name,
        population: w.population,
        households: w.households, // Or w.householdRefs.length
        familyCards: w.householdRefs.length, // Placeholder for family card count
        totalVoters: totalVoters,
        volunteerNames: uniqueVolunteers.length > 0 ? uniqueVolunteers.join(", ") : "Unassigned",
        assignedTL: uniqueTLs.length > 0 ? uniqueTLs.join(", ") : "Unassigned",
        reportingManager: manager,
        activityStatus: w.activities.length === 0 ? "None" : actStatus,
      };
    });

    return <WardsClient initialWards={formattedWards} metrics={mockMetrics} />;
  } catch (error) {
    console.warn("Database connection error on Wards. Falling back to mock data.");
    const mockWards = [
      { id: "w-1", name: "Ward 1", type: "Ward", area: "Downtown Central", population: 15000, households: 3200, familyCards: 2800, totalVoters: 12000, volunteerNames: "Amit, Rahul", assignedTL: "Michael Chang", reportingManager: "Sarah Jenkins", activityStatus: "Running" },
      { id: "w-2", name: "Ward 2", type: "Ward", area: "Downtown Central", population: 18000, households: 4100, familyCards: 3900, totalVoters: 14500, volunteerNames: "Priya", assignedTL: "Michael Chang", reportingManager: "Sarah Jenkins", activityStatus: "Pending" },
      { id: "w-3", name: "Oakville", type: "Village", area: "Rural Area 1", population: 4500, households: 850, familyCards: 800, totalVoters: 3500, volunteerNames: "Unassigned", assignedTL: "Unassigned", reportingManager: "Unassigned", activityStatus: "None" },
      { id: "w-4", name: "Pine Valley", type: "Village", area: "Rural Area 1", population: 6200, households: 1200, familyCards: 1100, totalVoters: 4800, volunteerNames: "Karan", assignedTL: "Robert Smith", reportingManager: "Ravi", activityStatus: "Completed" }
    ];

    return (
      <WardsClient initialWards={mockWards} metrics={mockMetrics} />
    );
  }
}
