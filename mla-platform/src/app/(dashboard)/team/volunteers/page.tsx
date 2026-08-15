export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Users, Plus } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function VolunteersPage() {
  const volunteers = await prisma.volunteer.findMany({
    include: {
      user: true,
      area: true,
      pollingStation: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteers"
        description="Manage volunteers and their household assignments"
        icon={Users}
        action={{ label: "Add Volunteer", href: "/team/volunteers/add", icon: Plus }}
      />

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Volunteer Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Polling Station</TableHead>
              <TableHead>Households Assigned</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No volunteers found. Add your first volunteer to get started.
                </TableCell>
              </TableRow>
            ) : (
              volunteers.map((vol) => (
                <TableRow key={vol.id}>
                  <TableCell className="font-medium">{vol.user.name}</TableCell>
                  <TableCell>{vol.user.mobile}</TableCell>
                  <TableCell>{vol.user.email}</TableCell>
                  <TableCell>{vol.area.name}</TableCell>
                  <TableCell>{vol.pollingStation?.name || "None assigned"}</TableCell>
                  <TableCell>{vol.householdsCount}</TableCell>
                  <TableCell>
                    <Badge variant={vol.user.status === 'Active' ? 'default' : 'secondary'}>
                      {vol.user.status}
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
