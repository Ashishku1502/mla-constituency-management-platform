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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building2, Search, MapPin, Users, Vote, Plus } from "lucide-react";

interface AreaData {
  id: string;
  name: string;
  code: string;
  population: number;
  status: string;
  householdCoverage: number;
  pollingStations: number;
  manager: string;
  managerId: string | null;
}

interface ManagerData {
  id: string;
  name: string;
}

export function AreasClient({ initialAreas, managers }: { initialAreas: AreaData[], managers: ManagerData[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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
        description="Manage constituency areas, boundaries, and assignments"
        icon={Building2}
        action={{
          label: "Add Area",
          onClick: () => setShowCreateDialog(true),
          icon: Plus,
        }}
      />

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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="hidden md:table-cell">Population</TableHead>
                <TableHead className="hidden sm:table-cell">Polling Stations</TableHead>
                <TableHead className="hidden lg:table-cell">Manager</TableHead>
                <TableHead className="hidden lg:table-cell">Coverage</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((area) => (
                <TableRow key={area.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{area.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        Pop: {area.population.toLocaleString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{area.code}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {area.population.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{area.pollingStations}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={area.managerId ? "" : "text-muted-foreground italic"}>
                      {area.manager}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Progress value={area.householdCoverage} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-8">
                        {area.householdCoverage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={area.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Area Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Area</DialogTitle>
            <DialogDescription>
              Add a new area to the constituency. You can assign a manager and
              polling stations after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="area-name">Area Name</Label>
                <Input id="area-name" placeholder="e.g., Anandpur Sahib North" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="area-code">Area Code</Label>
                <Input id="area-code" placeholder="e.g., ASN-09" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="population">Population</Label>
                <Input id="population" type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="manager">Area Manager</Label>
                <Select>
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {managers.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the area..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateDialog(false)}>
              Create Area
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
