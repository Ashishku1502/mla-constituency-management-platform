import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { GitBranch, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Organization Tree | MLA Platform",
  description: "Hierarchical view of the constituency team structure",
};

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

export default async function OrgTreePage() {
  const constituency = await prisma.constituency.findFirst();
  
  if (!constituency) {
    return <div>No constituency configured.</div>;
  }

  const areas = await prisma.area.findMany({
    where: { status: "Active" },
    include: {
      managers: { include: { user: true } },
      teamLeaders: { include: { user: true } },
      volunteers: { include: { user: true } },
      _count: {
        select: { pollingStations: true, volunteers: true }
      }
    },
    take: 4,
    orderBy: { name: "asc" }
  });

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
            {constituency.name} — Organizational Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrgNode label={constituency.name} sublabel="Constituency" level="constituency">
            {areas.map((area) => (
              <OrgNode key={area.id} label={area.name} sublabel={`Area • ${area._count.pollingStations} Polling Stations`} level="area" count={area._count.volunteers}>
                {area.managers.map((manager) => (
                  <OrgNode key={manager.id} label={manager.user.name} sublabel="Area Manager" level="manager">
                    {area.teamLeaders.map((tl) => (
                      <OrgNode key={tl.id} label={tl.user.name} sublabel={`Team Leader • ${tl.pollingStations || "Unassigned"}`} level="leader">
                        {area.volunteers.slice(0, 3).map((v) => (
                          <OrgNode key={v.id} label={v.user.name} sublabel={`Volunteer • ${v.householdsCount} Households`} level="volunteer" />
                        ))}
                      </OrgNode>
                    ))}
                  </OrgNode>
                ))}
              </OrgNode>
            ))}
          </OrgNode>
        </CardContent>
      </Card>
    </div>
  );
}
