"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { ShieldAlert, Users, Database, ShieldCheck, Activity, Award } from "lucide-react";

const mockLogs = [
  { id: "log-1", user: "Admin", action: "User Creation", date: "2024-08-20", time: "11:32 AM", details: "Created user 'Rajinder Singh' with Role 'Area Manager'" },
  { id: "log-2", user: "Admin", action: "Import Records", date: "2024-08-20", time: "10:15 AM", details: "Imported 12,430 household listings" },
  { id: "log-3", user: "Admin", action: "Permission Change", date: "2024-08-19", time: "04:45 PM", details: "Assigned Nangal Township Area mapping to 'Harpreet Gill'" },
];

export default function AdminPanelPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        description="Global system configurations, roles assignment, permissions mapping, and audit logging logs"
        icon={ShieldAlert}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700"><Users className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">System Roles</p><p className="text-lg font-bold">5 Roles</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><ShieldCheck className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Geographic Access Control</p><p className="text-lg font-bold">Enabled</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><Database className="h-4.5 w-4.5" /></div>
          <div><p className="text-xs text-muted-foreground">Audit Log Records</p><p className="text-lg font-bold">2,485 entries</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-primary" />
            Audit Logs
          </CardTitle>
          <CardDescription>Secure audit history showing critical database creations, updates, imports, and administrative actions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLogs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-semibold text-sm">{l.user}</TableCell>
                  <TableCell className="text-sm font-semibold">{l.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.date} • {l.time}</TableCell>
                  <TableCell className="text-sm">{l.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
