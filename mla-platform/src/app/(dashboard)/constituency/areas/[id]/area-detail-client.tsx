"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";

import {
  Building2,
  Users,
  Vote,
  Activity,
  ChevronRight,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  PlayCircle,
  Home,
  Edit,
} from "lucide-react";

interface PSData {
  id: string;
  number: number;
  name: string;
  address: string;
  voterCount: number;
  recordCount: number;
  status: string;
  teamLeader: string;
  teamLeaderId: string | null;
  volunteerCount: number;
  volunteerNames: string[];
  totalWards: number;
  activitiesCount: {
    running: number;
    completed: number;
    pending: number;
  };
}

interface AreaData {
  id: string;
  name: string;
  code: string;
  population: number;
  registeredVoters: number;
  status: string;
  householdCoverage: number;
  psCoverage: number;
  description: string;
  managerName: string;
  managerContact: string | null;
  totalPS: number;
  totalTL: number;
  totalVolunteers: number;
  totalWards: number;
  activitiesCount: { running: number; completed: number; pending: number };
  pollingStations: PSData[];
}

export function AreaDetailClient({ area }: { area: AreaData }) {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <PageHeader
          title={area.name}
          description={`Area Code: ${area.code} • ${area.description || "Constituency Area"}`}
          icon={Building2}
          action={{
            label: "Edit Area",
            onClick: () => router.push(`/constituency/areas/${area.id}/edit`),
            icon: Edit,
          }}
        />
      </div>

      {/* Area Manager Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {area.managerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Area Manager</p>
                <p className="font-semibold text-sm">{area.managerName}</p>
              </div>
            </div>
            {area.managerContact && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {area.managerContact}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {area.code}
            </div>
            <div className="ml-auto">
              <StatusBadge status={area.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Vote className="h-4 w-4 text-indigo-500" />
              <p className="text-xs text-muted-foreground">Total P/S</p>
            </div>
            <p className="text-2xl font-bold">{area.totalPS}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">Total T/L</p>
            </div>
            <p className="text-2xl font-bold">{area.totalTL}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground">Volunteers</p>
            </div>
            <p className="text-2xl font-bold">{area.totalVolunteers}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Home className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">Total Wards</p>
            </div>
            <p className="text-2xl font-bold">{area.totalWards}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-cyan-500" />
              <p className="text-xs text-muted-foreground">Voters</p>
            </div>
            <p className="text-2xl font-bold">{area.registeredVoters.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-rose-500" />
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
            <div className="flex gap-1.5 text-sm">
              <span className="text-emerald-500 font-bold">{area.activitiesCount.running}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-primary font-bold">{area.activitiesCount.completed}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-amber-500 font-bold">{area.activitiesCount.pending}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Running / Done / Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* P/S Coverage Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-sm">P/S Coverage</p>
              <p className="text-xs text-muted-foreground">
                {area.pollingStations.filter((ps) => ps.teamLeaderId).length} of {area.totalPS} Polling Stations have an assigned Team Leader
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">{area.psCoverage}%</span>
          </div>
          <Progress value={area.psCoverage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>100% Covered</span>
          </div>
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <div className="grid gap-3 grid-cols-3">
        <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800">
          <CardContent className="p-4 flex items-center gap-3">
            <PlayCircle className="h-8 w-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Running</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{area.activitiesCount.running}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{area.activitiesCount.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{area.activitiesCount.pending}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Polling Stations Cards Grid */}
      <div className="mb-4 mt-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Vote className="h-5 w-5 text-indigo-500" />
          Polling Stations in {area.name}
        </h3>
      </div>
      
      {area.pollingStations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Vote className="h-12 w-12 mb-4 opacity-20" />
            <p>No polling stations found for this area.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {area.pollingStations.map((ps) => (
            <Card 
              key={ps.id}
              className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group flex flex-col h-full"
              onClick={() => router.push(`/constituency/polling-stations/${ps.id}`)}
            >
              <CardContent className="p-5 flex flex-col flex-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1" title={ps.name}>
                      P/S-{ps.number}: {ps.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate" title={ps.address}>{ps.address}</p>
                  </div>
                  <StatusBadge status={ps.status} />
                </div>

                {/* Team Leader */}
                <div className="flex items-center gap-2 mb-4 p-2.5 rounded-md bg-muted/50 border border-muted">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {ps.teamLeader !== "Unassigned" ? ps.teamLeader.charAt(0) : "?"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Team Leader</p>
                    <p className={`text-sm truncate ${ps.teamLeader === "Unassigned" ? "text-muted-foreground italic" : "font-medium"}`}>
                      {ps.teamLeader}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                  <div className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Home className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs">Total Wards</span>
                    </div>
                    <span className="font-bold text-xl leading-none">{ps.totalWards}</span>
                  </div>
                  <div className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Users className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs">Volunteers</span>
                    </div>
                    <span className="font-bold text-xl leading-none">{ps.volunteerCount}</span>
                  </div>
                </div>

                {/* Activities */}
                <div className="mb-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Activities (Running / Done / Pending)</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-1 items-center bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-1 rounded-md flex-1 justify-center border border-emerald-100 dark:border-emerald-900/50">
                      <span className="font-bold">{ps.activitiesCount.running}</span>
                    </div>
                    <span className="text-muted-foreground/30 px-1">/</span>
                    <div className="flex gap-1 items-center bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 px-2 py-1 rounded-md flex-1 justify-center border border-blue-100 dark:border-blue-900/50">
                      <span className="font-bold">{ps.activitiesCount.completed}</span>
                    </div>
                    <span className="text-muted-foreground/30 px-1">/</span>
                    <div className="flex gap-1 items-center bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 px-2 py-1 rounded-md flex-1 justify-center border border-amber-100 dark:border-amber-900/50">
                      <span className="font-bold">{ps.activitiesCount.pending}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
