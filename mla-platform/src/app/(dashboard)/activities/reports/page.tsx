"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { FileBarChart, Download, Calendar, Users, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockReports = [
  { id: "rep-001", title: "Ward 1 Survey Summary", date: "2024-08-15", author: "Suresh Kumar", completion: "98%", status: "Approved" },
  { id: "rep-002", title: "Nangal Township Audit", date: "2024-08-18", author: "Harpreet Gill", completion: "92%", status: "Pending" },
  { id: "rep-003", title: "Water Infrastructure Meet", date: "2024-08-20", author: "Gurpreet Kaur", completion: "100%", status: "Approved" },
];

export default function ActivityReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Performance Reports"
        description="View completed field summaries, auditing logs, and statistics summaries"
        icon={FileBarChart}
        action={{ label: "Export All", onClick: () => {}, icon: Download }}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700"><Calendar className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Reports Compiled</p><p className="text-lg font-bold">12</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Percent className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Avg. Completion Rate</p><p className="text-lg font-bold">95.4%</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700"><Users className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Audited Volunteers</p><p className="text-lg font-bold">68</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Compiled Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Completion %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-semibold text-sm">{rep.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{rep.date}</TableCell>
                  <TableCell className="text-sm">{rep.author}</TableCell>
                  <TableCell className="text-sm font-semibold">{rep.completion}</TableCell>
                  <TableCell className="text-sm font-medium text-emerald-600">{rep.status}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
