"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { GitBranch, ChevronRight } from "lucide-react";
import { mockConstituency, mockAreas, mockTeamMembers } from "@/lib/mock-data";

function OrgNode({ label, sublabel, level, count, children }: { label: string; sublabel?: string; level: string; count?: number; children?: React.ReactNode }) {
  const colors: Record<string, string> = {
    constituency: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    area: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    leader: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    volunteer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className={`text-xs font-semibold ${colors[level] || colors.volunteer}`}>
            {label.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
        </div>
        {count !== undefined && (
          <Badge variant="secondary" className="text-xs">{count}</Badge>
        )}
        {children && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
      {children && <div className="ml-6 pl-4 border-l-2 border-muted space-y-1">{children}</div>}
    </div>
  );
}

export default function OrgTreePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Tree"
        description="Hierarchical view of the constituency team structure"
        icon={GitBranch}
      />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {mockConstituency.name} — Organizational Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrgNode label={mockConstituency.name} sublabel="Constituency" level="constituency">
            {mockAreas.filter(a => a.status === "Active").slice(0, 4).map((area) => (
              <OrgNode key={area.id} label={area.name} sublabel={`Area • ${area.pollingStations} Polling Stations`} level="area" count={area.volunteers}>
                {area.managerId && (
                  <OrgNode label={area.manager} sublabel="Area Manager" level="manager">
                    {mockTeamMembers.teamLeaders
                      .filter((tl) => tl.area === area.name)
                      .map((tl) => (
                        <OrgNode key={tl.id} label={tl.name} sublabel={`Team Leader • ${tl.pollingStations}`} level="leader">
                          {mockTeamMembers.volunteers
                            .filter((v) => v.area === area.name)
                            .slice(0, 2)
                            .map((v) => (
                              <OrgNode key={v.id} label={v.name} sublabel={`Volunteer • ${v.households} Households`} level="volunteer" />
                            ))}
                        </OrgNode>
                      ))}
                  </OrgNode>
                )}
              </OrgNode>
            ))}
          </OrgNode>
        </CardContent>
      </Card>
    </div>
  );
}
