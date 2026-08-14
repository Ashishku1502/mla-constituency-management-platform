"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Vote, Search, Plus } from "lucide-react";
import { mockPollingStations } from "@/lib/mock-data";

export default function PollingStationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  const areas = [...new Set(mockPollingStations.map((ps) => ps.area))];

  const filtered = mockPollingStations.filter((ps) => {
    const matchesSearch =
      ps.name.toLowerCase().includes(search.toLowerCase()) ||
      ps.number.toString().includes(search);
    const matchesStatus =
      statusFilter === "all" || ps.status === statusFilter;
    const matchesArea = areaFilter === "all" || ps.area === areaFilter;
    return matchesSearch && matchesStatus && matchesArea;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Polling Stations"
        description="Manage polling station information and record assignments"
        icon={Vote}
        action={{
          label: "Add Station",
          onClick: () => {},
          icon: Plus,
        }}
      />

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {mockPollingStations.filter((p) => p.status === "Validated").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Validated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {mockPollingStations.filter((p) => p.status === "Pending").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {mockPollingStations.filter((p) => p.status === "Error").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Error</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search polling stations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={areaFilter} onValueChange={(val: string | null) => val && setAreaFilter(val)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(val: string | null) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Validated">Validated</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead className="hidden sm:table-cell">Area</TableHead>
                <TableHead className="hidden lg:table-cell">Team Leader</TableHead>
                <TableHead className="hidden md:table-cell">Records</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ps) => (
                <TableRow key={ps.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{ps.number}</TableCell>
                  <TableCell>
                    <p className="font-medium">{ps.name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{ps.area}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {ps.address}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{ps.area}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={ps.teamLeader === "Unassigned" ? "text-muted-foreground italic" : ""}>
                      {ps.teamLeader}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">{ps.recordCount}</TableCell>
                  <TableCell>
                    <StatusBadge status={ps.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
