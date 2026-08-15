export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { AlertTriangle, Plus } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Issues | MLA Platform",
  description: "Track and resolve constituency issues",
};

export default async function IssuesPage() {
  const issues = await prisma.issue.findMany({
    include: {
      reportedBy: true,
      area: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issues"
        description="Track and resolve constituency issues reported by the field team"
        icon={AlertTriangle}
        action={{ label: "Report Issue", href: "/issues/add", icon: Plus }}
      />

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Date Reported</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No issues found. Report a new issue to get started.
                </TableCell>
              </TableRow>
            ) : (
              issues.map((issue) => (
                <TableRow key={issue.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{issue.category}</TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-md">{issue.description}</p>
                  </TableCell>
                  <TableCell>{issue.reportedBy.name}</TableCell>
                  <TableCell>{issue.area.name}</TableCell>
                  <TableCell>{issue.dateReported}</TableCell>
                  <TableCell>
                    <Badge variant={issue.priority === 'Critical' ? 'destructive' : issue.priority === 'High' ? 'destructive' : 'secondary'}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.status === 'Resolved' || issue.status === 'Closed' ? 'default' : 'outline'}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
