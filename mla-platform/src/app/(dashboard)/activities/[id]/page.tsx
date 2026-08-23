import { ActivityDetailClient } from "./activity-detail-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activity Details | MLA Platform",
  description: "View details, performance, and feedback for an activity.",
};

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Mock data for the detailed view matching new requirements
  const mockActivity = {
    id,
    name: "Voter Registration Drive",
    category: "Campaign",
    date: "2026-09-15",
    startTime: "09:00",
    endTime: "17:00",
    status: "Completed",
    location: "City Center Square",
    area: { name: "Downtown Central" },
    teamLeader: { user: { name: "Michael Chang", email: "michael@example.com" } },
    volunteers: [
      { name: "Alice Smith", role: "Registration Desk" },
      { name: "Bob Jones", role: "Crowd Control" },
      { name: "Charlie Brown", role: "Information" }
    ],
    participants: 450,
    performance: 92, // percentage
    feedback: [
      { user: "Sarah W.", rating: 5, comment: "Very well organized and quick process." },
      { user: "John D.", rating: 4, comment: "Good setup, but lines were a bit long around noon." }
    ]
  };

  return <ActivityDetailClient activity={mockActivity} />;
}
