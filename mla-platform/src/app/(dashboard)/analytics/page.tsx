import prisma from "@/lib/prisma";
import { AnalyticsClient } from "./analytics-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reports & Analytics | MLA Platform",
  description: "Comprehensive dashboard performance analytics, data metrics, and trends",
};

export default async function ReportsAnalyticsPage() {
  const [activities, issues] = await Promise.all([
    prisma.activity.findMany({ select: { date: true, status: true } }),
    prisma.issue.findMany({ select: { dateReported: true, status: true } })
  ]);

  // Aggregate Activities by month
  const activityMonths: Record<string, { completed: number, pending: number }> = {};
  activities.forEach(act => {
    if (!act.date) return;
    const date = new Date(act.date);
    if (isNaN(date.getTime())) return;
    const month = date.toLocaleString('default', { month: 'short' });
    if (!activityMonths[month]) activityMonths[month] = { completed: 0, pending: 0 };
    
    if (act.status === "Completed") {
      activityMonths[month].completed += 1;
    } else {
      activityMonths[month].pending += 1;
    }
  });

  const monthlyActivityData = Object.entries(activityMonths).map(([month, data]) => ({
    month,
    completed: data.completed,
    pending: data.pending
  }));

  // Ensure some fallback data if DB is empty
  if (monthlyActivityData.length === 0) {
    monthlyActivityData.push({ month: "Jan", completed: 0, pending: 0 });
  }

  // Aggregate Issues by month
  const issueMonths: Record<string, { reported: number, resolved: number }> = {};
  issues.forEach(issue => {
    if (!issue.dateReported) return;
    const date = new Date(issue.dateReported);
    if (isNaN(date.getTime())) return;
    const month = date.toLocaleString('default', { month: 'short' });
    if (!issueMonths[month]) issueMonths[month] = { reported: 0, resolved: 0 };
    
    issueMonths[month].reported += 1;
    if (issue.status === "Resolved" || issue.status === "Closed") {
      issueMonths[month].resolved += 1;
    }
  });

  const issueResolutionData = Object.entries(issueMonths).map(([month, data]) => ({
    month,
    reported: data.reported,
    resolved: data.resolved
  }));

  if (issueResolutionData.length === 0) {
    issueResolutionData.push({ month: "Jan", reported: 0, resolved: 0 });
  }

  return (
    <AnalyticsClient data={{ monthlyActivityData, issueResolutionData }} />
  );
}
