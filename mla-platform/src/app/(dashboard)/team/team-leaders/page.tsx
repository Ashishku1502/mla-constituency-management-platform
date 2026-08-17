export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { UserPlus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function TeamLeadersPage() {
  let teamLeaders: any[] = [];
  try {
    teamLeaders = await prisma.teamLeader.findMany({
      include: {
        user: true,
        area: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    teamLeaders = [
      { id: "1", user: { name: "Balwinder Singh", mobile: "9876543212", email: "balwinder@example.com", status: "Active" }, area: { name: "Anandpur Sahib Urban" }, pollingStations: "PS 1, PS 2" },
      { id: "2", user: { name: "Harpreet Kaur", mobile: "9876543213", email: "harpreet@example.com", status: "Active" }, area: { name: "Kiratpur Sahib" }, pollingStations: "PS 3, PS 4" }
    ];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Leaders"
        description="Manage team leaders and their polling station assignments"
        icon={UserPlus}
        action={{ label: "Add Team Leader", href: "/team/team-leaders/add", icon: Plus }}
      />

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Polling Stations</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamLeaders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No team leaders found. Add your first team leader to get started.
                </TableCell>
              </TableRow>
            ) : (
              teamLeaders.map((leader) => (
                <TableRow key={leader.id}>
                  <TableCell className="font-medium">{leader.user.name}</TableCell>
                  <TableCell>{leader.area.name}</TableCell>
                  <TableCell>{leader.user.mobile}</TableCell>
                  <TableCell>{leader.user.email}</TableCell>
                  <TableCell>{leader.pollingStations || "None assigned"}</TableCell>
                  <TableCell>
                    <Badge variant={leader.user.status === 'Active' ? 'default' : 'secondary'}>
                      {leader.user.status}
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
