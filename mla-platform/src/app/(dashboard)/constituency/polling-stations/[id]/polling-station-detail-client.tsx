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
  Calendar,
  ListTodo,
  FileDown,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";

export function PollingStationDetailClient({ station }: { station: any }) {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Back + Header + Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
        
        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/activities/add?category=Meeting&psId=${station.id}`)}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button size="sm" onClick={() => router.push(`/activities/add?psId=${station.id}`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
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

      {/* Tabs Layout */}
      <Tabs defaultValue="wards" className="w-full mt-8">
        <TabsList className="mb-6 h-12 w-full justify-start overflow-x-auto bg-transparent border-b rounded-none p-0">
          <TabsTrigger 
            value="wards" 
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <Home className="h-4 w-4" />
            Wards ({station.wards?.length || 0})
          </TabsTrigger>
          <TabsTrigger 
            value="activities" 
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <ListTodo className="h-4 w-4" />
            Activities ({station.allActivities?.length || 0})
          </TabsTrigger>
          <TabsTrigger 
            value="meetings" 
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <Calendar className="h-4 w-4" />
            Events / Meetings ({station.allMeetings?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* WARDS TAB */}
        <TabsContent value="wards" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-amber-500" />
              Wards within this Polling Station
            </h3>
          </div>
      
      {station.wards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Home className="h-12 w-12 mb-4 opacity-20" />
            <p>No wards found for this polling station.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {station.wards.map((ward: any) => {
            const totalActivities = ward.runningActivities + ward.completedActivities + ward.pendingActivities;
            const healthScore = totalActivities > 0 ? Math.round((ward.completedActivities / totalActivities) * 100) : 0;
            
            return (
              <Card 
                key={ward.id}
                className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group flex flex-col h-full"
                onClick={() => router.push(`/constituency/wards/${ward.id}`)}
              >
                <CardContent className="p-5 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1" title={ward.name}>
                        {ward.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{ward.type}</p>
                    </div>
                  </div>

                  {/* Volunteers */}
                  <div className="flex items-center gap-2 mb-4 p-2.5 rounded-md bg-muted/50 border border-muted">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {ward.volunteers?.length > 0 ? ward.volunteers.length : "0"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Volunteers</p>
                      <p className={`text-sm truncate ${ward.volunteers?.length > 0 ? "font-medium" : "text-muted-foreground italic"}`}>
                        {ward.volunteers?.length > 0 ? ward.volunteers.join(", ") : "None assigned"}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                    <div className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Home className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs">Households</span>
                      </div>
                      <span className="font-bold text-xl leading-none">{ward.households ?? "—"}</span>
                    </div>
                    <div className="flex flex-col bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Users className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-xs">Total Voters</span>
                      </div>
                      <span className="font-bold text-xl leading-none">{ward.population?.toLocaleString() ?? "—"}</span>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="mb-5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Activities (Running / Done / Pending)</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-1 items-center bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-1 rounded-md flex-1 justify-center border border-emerald-100 dark:border-emerald-900/50">
                        <span className="font-bold">{ward.runningActivities}</span>
                      </div>
                      <span className="text-muted-foreground/30 px-1">/</span>
                      <div className="flex gap-1 items-center bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 px-2 py-1 rounded-md flex-1 justify-center border border-blue-100 dark:border-blue-900/50">
                        <span className="font-bold">{ward.completedActivities}</span>
                      </div>
                      <span className="text-muted-foreground/30 px-1">/</span>
                      <div className="flex gap-1 items-center bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 px-2 py-1 rounded-md flex-1 justify-center border border-amber-100 dark:border-amber-900/50">
                        <span className="font-bold">{ward.pendingActivities}</span>
                      </div>
                    </div>
                  </div>

                  {/* Health Indicator Footer */}
                  <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-muted-foreground">Ward Health</span>
                      <span className="text-primary font-bold">{healthScore}%</span>
                    </div>
                    <Progress value={healthScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
        </TabsContent>

        {/* ACTIVITIES TAB */}
        <TabsContent value="activities" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-blue-500" />
              Assigned Activities
            </h3>
          </div>
          
          {(!station.allActivities || station.allActivities.length === 0) ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <ListTodo className="h-12 w-12 mb-4 opacity-20" />
                <p>No activities found for this polling station.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push(`/activities/add?psId=${station.id}`)}>
                  Create Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {station.allActivities.map((activity: any) => (
                <Card 
                  key={activity.id} 
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                  onClick={() => router.push(`/activities/${activity.id}`)}
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg line-clamp-1" title={activity.name}>{activity.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {activity.category}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={activity.status} />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4" />
                      {activity.date ? new Date(activity.date).toLocaleDateString() : 'No date set'}
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span className="truncate">{activity.wardName || 'All Wards'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* MEETINGS TAB */}
        <TabsContent value="meetings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Events & Meetings
            </h3>
          </div>
          
          {(!station.allMeetings || station.allMeetings.length === 0) ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Calendar className="h-12 w-12 mb-4 opacity-20" />
                <p>No events or meetings scheduled for this polling station.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push(`/activities/add?category=Meeting&psId=${station.id}`)}>
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {station.allMeetings.map((meeting: any) => (
                <Card 
                  key={meeting.id} 
                  className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                  onClick={() => router.push(`/activities/${meeting.id}`)}
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg line-clamp-1" title={meeting.title}>{meeting.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            {meeting.category}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={meeting.status} />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {meeting.date ? new Date(meeting.date).toLocaleDateString() : 'No date'}
                        {meeting.time && ` • ${meeting.time}`}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{meeting.location || 'No location set'}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{meeting.attendeesCount} Attendees</span>
                        </div>
                      </div>
                      {meeting.attendeeNames && meeting.attendeeNames.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2 truncate">
                          {meeting.attendeeNames.join(", ")}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
