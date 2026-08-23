import { PollingStationDetailClient } from "./polling-station-detail-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Polling Station Details | MLA Platform",
  description: "View details, wards, volunteers, and activities for a polling station.",
};

export default async function PollingStationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // We'll pass mock data for the UI if the db isn't fully structured yet,
  // matching the new requirements perfectly.
  const mockStation = {
    id,
    number: parseInt(id.replace(/\D/g, "")) || 1,
    name: "Central City Hall",
    address: "100 Main St, Center City",
    area: "Downtown Central",
    teamLeader: "Michael Chang",
    voterCount: 1500,
    performance: 82,
    status: "Active",
    wards: [
      {
        id: "w-1",
        name: "Ward 1A",
        volunteers: ["Alice Smith", "Bob Jones"],
        activities: [
          { name: "Door-to-door campaign", status: "Running", progress: 60 },
          { name: "Voter Registration Drive", status: "Pending", progress: 0 },
        ],
        completedActivities: 4,
        pendingActivities: 2,
      },
      {
        id: "w-2",
        name: "Ward 1B",
        volunteers: ["Charlie Brown"],
        activities: [
          { name: "Local rally", status: "Completed", progress: 100 },
        ],
        completedActivities: 7,
        pendingActivities: 0,
      }
    ],
    overallActivityPerformance: 75,
    overallVolunteerPerformance: 88,
  };

  return <PollingStationDetailClient station={mockStation} />;
}
