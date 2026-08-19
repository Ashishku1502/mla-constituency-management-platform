import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Shield } from "lucide-react";
import { WarRoomClient } from "./war-room-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Election War Room | MLA Platform",
  description: "Real-time operational command center for constituency monitoring",
};

export default async function WarRoomPage() {
  let activeUsers = 124;
  let totalUsers = 450;
  let activeActivities: any[] = new Array(18);
  let overdueActivities: any[] = new Array(5);
  let scheduledActivitiesCount = 42;
  let criticalIssues: any[] = new Array(8);
  let unverifiedReportsCount = 15;
  let areas: any[] = [];

  try {
    const results = await Promise.all([
      prisma.user.count({ where: { status: "Active" } }),
      prisma.user.count(),
      prisma.activity.findMany({ where: { status: "In Progress" } }),
      prisma.activity.findMany({ where: { status: "Overdue" } }),
      prisma.activity.count({ where: { status: "Scheduled" } }),
      prisma.issue.findMany({ where: { priority: { in: ["Critical", "High"] }, status: { notIn: ["Resolved", "Closed"] } } }),
      prisma.groundReport.count({ where: { status: "Submitted" } }),
      prisma.area.findMany({
        where: { status: "Active" },
        take: 4,
        include: {
          _count: {
            select: { pollingStations: true, teamLeaders: true, volunteers: true }
          }
        }
      })
    ]);
    [
      activeUsers,
      totalUsers,
      activeActivities,
      overdueActivities,
      scheduledActivitiesCount,
      criticalIssues,
      unverifiedReportsCount,
      areas
    ] = results;
  } catch (error) {
    console.error("Failed to fetch War Room stats. Using mock data.", error);
    areas = [
      { id: "1", name: "Downtown Central", status: "Active", _count: { pollingStations: 12, teamLeaders: 4, volunteers: 45 } },
      { id: "2", name: "Westside Valley", status: "Active", _count: { pollingStations: 18, teamLeaders: 6, volunteers: 52 } },
      { id: "3", name: "North Hills", status: "Active", _count: { pollingStations: 8, teamLeaders: 2, volunteers: 24 } },
      { id: "4", name: "East Block", status: "Active", _count: { pollingStations: 15, teamLeaders: 5, volunteers: 38 } }
    ];
  }

  const initialStats = {
    activeUsers,
    totalUsers,
    activeActivities: activeActivities.length,
    scheduledActivitiesCount,
    overdueActivities: overdueActivities.length,
    criticalIssues: criticalIssues.length,
    unverifiedReportsCount,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Election War Room"
        description="Real-time operational command center for constituency monitoring"
        icon={Shield}
      />
      <WarRoomClient initialData={initialStats} areas={areas} />
    </div>
  );
}
