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
        }
      },
      orderBy: { number: "asc" }
    });

    const formattedStations = dbStations.map(ps => ({
      id: ps.id,
      number: ps.number,
      name: ps.name,
      address: ps.address,
      location: ps.location || "N/A",
      area: ps.area.name,
      teamLeader: ps.teamLeader?.user?.name || "Unassigned",
      recordCount: ps.recordCount,
      voterCount: ps.voterCount,
      voterListStatus: ps.voterListStatus,
      status: ps.status,
    }));

    return <PollingStationsClient initialStations={formattedStations} metrics={activityMetrics} />;
  } catch (error) {
    console.warn("Database connection error on PollingStations. Falling back to mock data.");
    const mockStations = [
      { id: "ps-1", number: 1, name: "City Hall Main Auditorium", address: "100 Main St, Center City", location: "31.23, 76.54", area: "Downtown Central", teamLeader: "Michael Chang", recordCount: 1250, voterCount: 1500, voterListStatus: "Uploaded", status: "Validated" },
      { id: "ps-2", number: 2, name: "Community Center Library", address: "450 Oak Ave, Center City", location: "31.24, 76.55", area: "Downtown Central", teamLeader: "Sarah Jenkins", recordCount: 980, voterCount: 1200, voterListStatus: "Pending", status: "Pending" },
      { id: "ps-3", number: 3, name: "Westside High School Gym", address: "1200 School Blvd", location: "31.20, 76.50", area: "Westside Valley", teamLeader: "Unassigned", recordCount: 1420, voterCount: 1450, voterListStatus: "Error", status: "Error" },
      { id: "ps-4", number: 4, name: "North Hills Primary School", address: "50 Pine Rd, North Hills", location: "31.30, 76.60", area: "North Hills", teamLeader: "Robert Smith", recordCount: 850, voterCount: 900, voterListStatus: "Uploaded", status: "Validated" }
    ];

    return (
      <PollingStationsClient initialStations={mockStations} metrics={activityMetrics} />
    );
  }
}
