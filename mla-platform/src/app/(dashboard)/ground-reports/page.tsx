"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { FileText, Plus, Users, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { mockGroundReports } from "@/lib/mock-data";

export default function GroundReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ground Reports"
        description="Field activity reports submitted by volunteers"
        icon={FileText}
        action={{ label: "Submit Report", onClick: () => {}, icon: Plus }}
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-cyan-600">{mockGroundReports.length}</p><p className="text-xs text-muted-foreground mt-1">Total Reports</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{mockGroundReports.filter(r => r.status === "Verified").length}</p><p className="text-xs text-muted-foreground mt-1">Verified</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{mockGroundReports.filter(r => r.status === "Submitted").length}</p><p className="text-xs text-muted-foreground mt-1">Pending Review</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">{mockGroundReports.filter(r => r.status === "Rejected").length}</p><p className="text-xs text-muted-foreground mt-1">Rejected</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Volunteer</TableHead>
                <TableHead className="hidden md:table-cell">Participants</TableHead>
                <TableHead className="hidden lg:table-cell">Follow-up</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGroundReports.map((report) => (
                <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <p className="font-medium text-sm">{report.activity}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{report.location}
                    </p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{report.date}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{report.volunteer}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm"><Users className="h-3.5 w-3.5 text-muted-foreground" />{report.participantCount}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {report.followupRequired ? (
                      <span className="flex items-center gap-1 text-xs text-amber-600"><AlertCircle className="h-3 w-3" />Required</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3 w-3" />None</span>
                    )}
                  </TableCell>
                  <TableCell><StatusBadge status={report.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
