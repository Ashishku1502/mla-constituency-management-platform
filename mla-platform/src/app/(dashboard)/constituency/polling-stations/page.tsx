import prisma from "@/lib/prisma";
import { PollingStationsClient } from "./polling-stations-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Polling Station Activities | MLA Platform",
  description: "Meeting, Training, Rally aur Community Events — Ward-wise Volunteer assign karke poora record rakhein.",
};

const activityMetrics = {
  totalActivities: 5,
  inProgress: 1,
  completed: 2,
  cancelled: 1,
};

export default async function PollingStationsPage() {
  try {
    const dbStations = await prisma.pollingStation.findMany({
      include: {
        area: true,
        teamLeader: {
          include: { user: true }
        },
        volunteers: {
          include: { user: true }
        },
        activities: {
          select: { status: true }
        },
        households: {
          select: { wardId: true }
        }
      },
      orderBy: { number: "asc" }
    });

    const formattedStations = dbStations.map(ps => {
      const runningAct = ps.activities.filter(a => a.status === "In Progress").length;
      const completedAct = ps.activities.filter(a => a.status === "Completed").length;
      const pendingAct = ps.activities.filter(a => a.status === "Pending" || a.status === "Draft" || a.status === "Scheduled").length;
      const uniqueWards = new Set(ps.households.map(h => h.wardId)).size;
      const volunteerNames = ps.volunteers.map(v => v.user.name).join(", ");

      return {
        id: ps.id,
        number: ps.number,
        name: ps.name,
        address: ps.address,
        location: ps.location || "N/A",
        area: ps.area.name,
        teamLeader: ps.teamLeader?.user?.name || "Unassigned",
        totalWards: uniqueWards,
        volunteersCount: ps.volunteers.length,
        volunteerNames: volunteerNames || "None",
        activitiesCount: { running: runningAct, completed: completedAct, pending: pendingAct },
        recordCount: ps.recordCount,
        voterCount: ps.voterCount,
        voterListStatus: ps.voterListStatus,
        status: ps.status,
      };
    });

    return <PollingStationsClient initialStations={formattedStations} metrics={activityMetrics} />;
  } catch (error) {
    console.warn("Database connection error on PollingStations. Falling back to mock data.");
    const mockStations = [
      { id: "ps-1", number: 1, name: "City Hall Main Auditorium", address: "100 Main St, Center City", location: "31.23, 76.54", area: "Downtown Central", teamLeader: "Michael Chang", totalWards: 3, volunteersCount: 4, volunteerNames: "Amit, Rahul, Neha, Priya", activitiesCount: { running: 1, completed: 2, pending: 0 }, recordCount: 1250, voterCount: 1500, voterListStatus: "Uploaded", status: "Validated" },
      { id: "ps-2", number: 2, name: "Community Center Library", address: "450 Oak Ave, Center City", location: "31.24, 76.55", area: "Downtown Central", teamLeader: "Sarah Jenkins", totalWards: 2, volunteersCount: 2, volunteerNames: "Vijay, Suman", activitiesCount: { running: 0, completed: 5, pending: 1 }, recordCount: 980, voterCount: 1200, voterListStatus: "Pending", status: "Pending" },
      { id: "ps-3", number: 3, name: "Westside High School Gym", address: "1200 School Blvd", location: "31.20, 76.50", area: "Westside Valley", teamLeader: "Unassigned", totalWards: 4, volunteersCount: 0, volunteerNames: "None", activitiesCount: { running: 0, completed: 0, pending: 3 }, recordCount: 1420, voterCount: 1450, voterListStatus: "Error", status: "Error" },
      { id: "ps-4", number: 4, name: "North Hills Primary School", address: "50 Pine Rd, North Hills", location: "31.30, 76.60", area: "North Hills", teamLeader: "Robert Smith", totalWards: 1, volunteersCount: 1, volunteerNames: "Karan", activitiesCount: { running: 1, completed: 1, pending: 0 }, recordCount: 850, voterCount: 900, voterListStatus: "Uploaded", status: "Validated" }
    ];

    return (
      <PollingStationsClient initialStations={mockStations} metrics={activityMetrics} />
    );
  }
}
