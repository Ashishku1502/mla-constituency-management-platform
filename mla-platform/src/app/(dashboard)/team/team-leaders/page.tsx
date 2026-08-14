"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserPlus, Search, Plus, Phone, MapPin, Calendar, Activity } from "lucide-react";
import { mockTeamMembers } from "@/lib/mock-data";

export default function TeamLeadersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockTeamMembers.teamLeaders.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Leaders"
        description="Manage team leaders and their polling station assignments"
        icon={UserPlus}
        action={{ label: "Add Team Leader", onClick: () => {}, icon: Plus }}
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search team leaders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-sm font-semibold">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm">{member.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">ID: {member.id}</p>
                    </div>
                    <StatusBadge status={member.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /><span>{member.mobile}</span></div>
                    <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /><span className="truncate">{member.area}</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /><span>{member.joinedDate}</span></div>
                    <div className="flex items-center gap-1.5"><Activity className="h-3 w-3" /><span>{member.activityCount} activities</span></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Stations:</span> {member.pollingStations}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Last active: {member.lastActive}</span>
                    <StatusBadge status={member.reportingStatus} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
