"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Vote,
  Users,
  Home,
  TrendingUp,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Activity,
  ArrowLeft,
  Phone,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export function PollingStationDetailClient({ station }: { station: any }) {
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
          title={`P/S-${station.number}: ${station.name}`}
          description={`${station.address} • Area: ${station.area}`}
          icon={Vote}
        />
      </div>

      {/* Team Leader Info Banner */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                {station.teamLeader.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team Leader (T/L)</p>
                <p className="font-semibold text-sm">{station.teamLeader}</p>
              </div>
            </div>
            {station.teamLeaderContact && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {station.teamLeaderContact}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Area Manager: <span className="font-medium text-foreground ml-1">{station.areaManager}</span>
            </div>
            <div className="ml-auto">
              <StatusBadge status={station.status} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stat Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-indigo-500" />
              <p className="text-xs text-muted-foreground">Total Votes</p>
            </div>
            <p className="text-2xl font-bold">{station.voterCount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Home className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">Total Wards</p>
            </div>
            <p className="text-2xl font-bold">{station.wards.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground">Volunteers</p>
            </div>
            <p className="text-2xl font-bold">{station.volunteersCount}</p>
            {station.volunteerNames.length > 0 && (
              <p className="text-[10px] text-muted-foreground truncate">
                {station.volunteerNames.slice(0, 2).join(", ")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <PlayCircle className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-muted-foreground">Running</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {station.activitiesCount.running}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {station.activitiesCount.completed}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {station.activitiesCount.pending}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Activity Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2 text-sm">
              <span>Overall Completion</span>
              <span className="font-bold">{station.overallActivityPerformance}%</span>
            </div>
            <Progress value={station.overallActivityPerformance} className="h-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Volunteer Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2 text-sm">
              <span>Overall Efficiency</span>
              <span className="font-bold">{station.overallVolunteerPerformance}%</span>
            </div>
            <Progress value={station.overallVolunteerPerformance} className="h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Wards Table — Clickable rows */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Home className="h-5 w-5 text-amber-500" />
            Wards within this Polling Station
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Click a ward to see voter list
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward Name / Locality</TableHead>
                <TableHead className="hidden sm:table-cell">Population</TableHead>
                <TableHead className="hidden md:table-cell">Households</TableHead>
                <TableHead className="hidden lg:table-cell">Volunteers</TableHead>
                <TableHead>Activities (R/C/P)</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {station.wards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No wards found for this polling station.
                  </TableCell>
                </TableRow>
              )}
              {station.wards.map((ward: any) => (
                <TableRow
                  key={ward.id}
                  className="cursor-pointer hover:bg-muted/60 transition-colors group"
                  onClick={() => router.push(`/constituency/wards/${ward.id}`)}
                >
                  <TableCell>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {ward.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{ward.type}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {ward.population?.toLocaleString() ?? "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {ward.households ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {ward.volunteers?.length > 0 ? (
                      <span className="text-sm">{ward.volunteers.join(", ")}</span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">None assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5 text-xs">
                      <span className="text-emerald-500 font-bold">{ward.runningActivities}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-blue-500 font-bold">{ward.completedActivities}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-amber-500 font-bold">{ward.pendingActivities}</span>
                    </div>
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
