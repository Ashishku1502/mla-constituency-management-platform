"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserCheck, Users, Mail, MapPin } from "lucide-react";

const mockAssignments = [
  { id: "asg-001", volunteer: "Amrit Pal", activity: "Door-to-Door Household Survey", area: "Anandpur Sahib Urban", status: "Accepted", dateAssigned: "2024-08-18" },
  { id: "asg-002", volunteer: "Simran Kaur", activity: "Community Meeting - Water Supply", area: "Anandpur Sahib Urban", status: "Accepted", dateAssigned: "2024-08-19" },
  { id: "asg-003", volunteer: "Jagdeep Singh", activity: "Polling Station Verification", area: "Kiratpur Sahib", status: "Assigned", dateAssigned: "2024-08-20" },
  { id: "asg-004", volunteer: "Priya Sharma", activity: "Road Infrastructure Assessment", area: "Balachaur", status: "Pending", dateAssigned: "2024-08-20" },
];

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Assignments"
        description="Monitor volunteer task assignments, statuses, and updates"
        icon={UserCheck}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer</TableHead>
                <TableHead>Assigned Activity</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssignments.map((asg) => (
                <TableRow key={asg.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-semibold text-sm">{asg.volunteer}</TableCell>
                  <TableCell className="text-sm">{asg.activity}</TableCell>
                  <TableCell className="text-sm">{asg.area}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{asg.dateAssigned}</TableCell>
                  <TableCell><StatusBadge status={asg.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
