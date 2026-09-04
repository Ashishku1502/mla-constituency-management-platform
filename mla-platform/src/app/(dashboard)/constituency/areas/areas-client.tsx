"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building2, Search, MapPin, Users, Vote, Plus, ChevronRight } from "lucide-react";

interface AreaData {
  id: string;
  name: string;
  code: string;
  population: number;
  registeredVoters: number;
  status: string;
  householdCoverage: number;
  psCoverage: number;
  pollingStations: number;
  teamLeaders: number;
  activitiesCount: {
    running: number;
    completed: number;
    pending: number;
  };
  manager: string;
  managerId: string | null;
}

interface ManagerData {
  id: string;
  name: string;
}

export function AreasClient({ initialAreas, managers }: { initialAreas: AreaData[], managers: ManagerData[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = initialAreas.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(search.toLowerCase()) ||
      area.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || area.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Areas"
        description="Manage constituency areas, boundaries, and assignments — click any area to drill down"
        icon={Building2}
        action={{
          label: "Add Area",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/constituency/areas/add";
            }
          },
          icon: Plus,
        }}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5"
          onClick={() => router.push("/activities/create-bulk")}
        >
          <Plus className="h-4 w-4" />
          Create Activity
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Areas</p>
              <p className="text-lg font-bold">{initialAreas.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Areas</p>
              <p className="text-lg font-bold">
                {initialAreas.filter((a) => a.status === "Active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Vote className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Total Polling Stations
              </p>
              <p className="text-lg font-bold">
                {initialAreas.reduce((s, a) => s + a.pollingStations, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
              <Users className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Population</p>
              <p className="text-lg font-bold">
                {initialAreas
                  .reduce((s, a) => s + a.population, 0)
                  .toLocaleString()}
              </p>
            </div>
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
                placeholder="Search areas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(val: string | null) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table — Each row is clickable */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area Name/Code</TableHead>
                <TableHead className="hidden sm:table-cell">Total P/S</TableHead>
                <TableHead className="hidden lg:table-cell">Total T/L</TableHead>
                <TableHead className="hidden lg:table-cell">Activities (R/C/P)</TableHead>
                <TableHead className="hidden lg:table-cell">Manager</TableHead>
                <TableHead className="hidden lg:table-cell">P/S Coverage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    No areas found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((area) => (
                <TableRow
                  key={area.id}
                  className="cursor-pointer hover:bg-muted/60 transition-colors group"
                  onClick={() => router.push(`/constituency/areas/${area.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">{area.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{area.code}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{area.pollingStations}</TableCell>
                  <TableCell className="hidden lg:table-cell">{area.teamLeaders}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-1.5 text-xs">
                      <span className="text-emerald-500 font-medium" title="Running">{area.activitiesCount.running}</span> /
                      <span className="text-primary font-medium" title="Completed">{area.activitiesCount.completed}</span> /
                      <span className="text-amber-500 font-medium" title="Pending">{area.activitiesCount.pending}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={area.managerId ? "" : "text-muted-foreground italic"}>
                      {area.manager}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Progress value={area.psCoverage} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-8">
                        {area.psCoverage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={area.status} />
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
