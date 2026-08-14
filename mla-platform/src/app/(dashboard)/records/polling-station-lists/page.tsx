"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ListChecks, Upload, ShieldAlert, CheckCircle } from "lucide-react";

const mockLists = [
  { id: "lst-001", name: "Anandpur Sahib Urban Part 1", station: "Govt Sr Sec School", records: 520, status: "Validated", dateUploaded: "2024-07-10" },
  { id: "lst-002", name: "Anandpur Sahib Urban Part 2", station: "Primary School Hall", records: 485, status: "Validated", dateUploaded: "2024-07-12" },
  { id: "lst-003", name: "Kiratpur Sahib Rural Part 1", station: "Middle School Hall", records: 445, status: "Pending", dateUploaded: "2024-07-15" },
  { id: "lst-004", name: "Balachaur Town Part 1", station: "Gurudwara Hall", records: 362, status: "Error", dateUploaded: "2024-07-14" },
];

export default function PollingStationListsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Polling Station Lists"
        description="Review uploaded station lists, upload counts, and validation status"
        icon={ListChecks}
        action={{ label: "Upload List", onClick: () => {}, icon: Upload }}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><CheckCircle className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Validated Lists</p><p className="text-lg font-bold">2</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700"><ListChecks className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Pending Review</p><p className="text-lg font-bold">1</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-700"><ShieldAlert className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Error Lists</p><p className="text-lg font-bold">1</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>List Name</TableHead>
                <TableHead>Polling Station</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLists.map((lst) => (
                <TableRow key={lst.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-sm">{lst.name}</TableCell>
                  <TableCell className="text-sm">{lst.station}</TableCell>
                  <TableCell className="font-semibold">{lst.records}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lst.dateUploaded}</TableCell>
                  <TableCell><StatusBadge status={lst.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
