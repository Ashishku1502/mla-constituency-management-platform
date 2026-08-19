export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { AlertTriangle, Plus } from "lucide-react";
import { IssuesClient } from "./issues-client";

export const metadata = {
  title: "Issues | MLA Platform",
  description: "Track and resolve constituency issues",
};

export default async function IssuesPage() {
  const [issues, teamMembers] = await Promise.all([
    prisma.issue.findMany({
      include: {
        reportedBy: true,
        area: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.findMany({
      where: {
        role: { in: ["Team Leader", "Volunteer", "Area Manager"] },
        status: "Active"
      },
      select: {
        id: true,
        name: true,
        role: true,
      },
      orderBy: {
        name: 'asc'
      }
    })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issues"
        description="Track and resolve constituency issues reported by the field team"
        icon={<AlertTriangle className="h-5 w-5" />}
        action={{ label: "Report Issue", href: "/issues/add", icon: Plus }}
      />

      <IssuesClient issues={issues} teamMembers={teamMembers} />
    </div>
  );
}
