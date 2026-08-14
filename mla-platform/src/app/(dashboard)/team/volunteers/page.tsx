"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Users, Search, Plus } from "lucide-react";
import { mockTeamMembers } from "@/lib/mock-data";

export default function VolunteersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockTeamMembers.volunteers.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Volunteers"
        description="Manage volunteers and their household assignments"
        icon={Users}
        action={{ label: "Add Volunteer", onClick: () => {}, icon: Plus }}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{mockTeamMembers.volunteers.filter(v => v.status === "Active").length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Volunteers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{mockTeamMembers.volunteers.reduce((s, v) => s + v.households, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Households Assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{mockTeamMembers.volunteers.reduce((s, v) => s + v.activityCount, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Activities</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search volunteers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={(val: string | null) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer</TableHead>
                <TableHead className="hidden sm:table-cell">Area</TableHead>
                <TableHead className="hidden md:table-cell">Polling Station</TableHead>
                <TableHead className="hidden md:table-cell">Households</TableHead>
                <TableHead className="hidden lg:table-cell">Activities</TableHead>
                <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((vol) => (
                <TableRow key={vol.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 font-semibold">
                          {vol.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{vol.name}</p>
                        <p className="text-xs text-muted-foreground">{vol.mobile}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{vol.area}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{vol.pollingStation}</TableCell>
                  <TableCell className="hidden md:table-cell font-medium">{vol.households}</TableCell>
                  <TableCell className="hidden lg:table-cell">{vol.activityCount}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{vol.lastActive}</TableCell>
                  <TableCell><StatusBadge status={vol.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
