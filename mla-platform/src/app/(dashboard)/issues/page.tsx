"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { AlertTriangle, Search, Plus } from "lucide-react";
import { mockIssues } from "@/lib/mock-data";

export default function IssuesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(mockIssues.map((i) => i.category))];

  const filtered = mockIssues.filter((issue) => {
    const matchesSearch = issue.description.toLowerCase().includes(search.toLowerCase()) || issue.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issues"
        description="Track and resolve constituency issues reported by the field team"
        icon={AlertTriangle}
        action={{ label: "Report Issue", onClick: () => {}, icon: Plus }}
      />

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {["New", "Assigned", "In Progress", "Pending", "Resolved", "Closed"].map((status) => (
          <Card key={status}>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold">{mockIssues.filter((i) => i.status === status).length}</p>
              <StatusBadge status={status} className="mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search issues..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={(val: string | null) => val && setCategoryFilter(val)}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(val: string | null) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
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
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Area</TableHead>
                <TableHead className="hidden lg:table-cell">Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((issue) => (
                <TableRow key={issue.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{issue.id}</TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2">{issue.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">{issue.category} • {issue.area}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><StatusBadge status={issue.category} /></TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{issue.area}</TableCell>
                  <TableCell className="hidden lg:table-cell"><StatusBadge status={issue.priority} /></TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{issue.assignedTo}</TableCell>
                  <TableCell><StatusBadge status={issue.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
