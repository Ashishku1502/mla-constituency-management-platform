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
  const [
    activeUsers,
    totalUsers,
    activeActivities,
    overdueActivities,
    scheduledActivitiesCount,
    criticalIssues,
    unverifiedReportsCount,
    areas
  ] = await Promise.all([
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
