"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserCheck, Search, Plus, Phone, MapPin, Calendar, Activity } from "lucide-react";

export interface AreaManagerData {
  id: string;
  name: string;
  mobile: string;
  area: string;
  status: string;
  joinedDate: string;
  activityCount: number;
  lastActive: string;
  reportingStatus: string;
}

function TeamMemberCard({ member }: { member: AreaManagerData }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID: {member.id.substring(0, 8)}
                </p>
              </div>
              <StatusBadge status={member.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                <span>{member.mobile}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{member.area}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>{member.joinedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-3 w-3" />
                <span>{member.activityCount} activities</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <span className="text-xs text-muted-foreground">
                Last active: {member.lastActive}
              </span>
              <StatusBadge status={member.reportingStatus} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AreaManagersClient({ initialManagers }: { initialManagers: AreaManagerData[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = initialManagers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Area Managers"
        description="Manage area managers and their geographic assignments"
        icon={UserCheck}
        action={{ label: "Add Manager", onClick: () => {}, icon: Plus }}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search area managers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(val: string | null) => val && setStatusFilter(val)}>
              <SelectTrigger className="w-full sm:w-36">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
