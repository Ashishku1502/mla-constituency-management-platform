"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CalendarDays,
  PlusCircle, 
  Library, 
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
  PlayCircle
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActivityMetrics {
  totalActivities: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

interface PollingStationsClientProps {
  initialStations?: any[];
  metrics: ActivityMetrics;
}

export function PollingStationsClient({ metrics }: PollingStationsClientProps) {
  const [newActivityName, setNewActivityName] = useState("");
  const [selectedExistingActivity, setSelectedExistingActivity] = useState("");
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <PageHeader
        title="Polling Station Activities & Events"
        description="Meeting, Training, Rally aur Community Events — Ward-wise Volunteer assign karke poora record rakhein."
        icon={CalendarDays}
      />

      {/* DASHBOARD METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Total Activities</p>
              <h3 className="text-3xl font-bold text-foreground">{metrics?.totalActivities ?? 5}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase mb-1">In Progress</p>
              <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-300">{metrics?.inProgress ?? 1}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400">
              <PlayCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase mb-1">Completed</p>
              <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{metrics?.completed ?? 2}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card bg-rose-500/5 border-rose-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase mb-1">Cancelled</p>
              <h3 className="text-3xl font-bold text-rose-700 dark:text-rose-300">{metrics?.cancelled ?? 1}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-full text-rose-600 dark:text-rose-400">
              <XCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NAVIGATION TABS */}
      <Tabs defaultValue="new-activity" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1 bg-muted/40 rounded-xl mb-6">
          <TabsTrigger value="new-activity" className="py-3 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background flex gap-2">
            <PlusCircle className="h-4 w-4" />
            + Nayi Activity Banayein
          </TabsTrigger>
          <TabsTrigger value="activity-cards" className="py-3 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background flex gap-2">
            <Activity className="h-4 w-4" />
            Activity Cards (5)
          </TabsTrigger>
          <TabsTrigger value="activity-library" className="py-3 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background flex gap-2">
            <Library className="h-4 w-4" />
            Activity Library (2)
          </TabsTrigger>
        </TabsList>

        {/* 1. NAYI ACTIVITY BANAYEIN TAB */}
        <TabsContent value="new-activity" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="glass-card max-w-4xl mx-auto border-t-4 border-t-primary shadow-lg shadow-primary/5">
            <CardHeader className="bg-muted/10 border-b border-border/50 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  1
                </span>
                <CardTitle className="text-2xl text-primary">Step 1 – Activity Chunein</CardTitle>
              </div>
              <CardDescription className="text-base ml-11">
                Pehle se bani activity chunein (Framework/Checklist/SOP attached), ya ek nayi activity type banayein.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Option A: Existing Activity */}
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  Option A
                </div>
                <h3 className="text-lg font-semibold text-foreground">Existing Activity (Library se)</h3>
                <p className="text-sm text-muted-foreground">Pehle se configured framework ka upyog karein.</p>
                
                <div className="space-y-3 pt-2">
                  <Select value={selectedExistingActivity} onValueChange={(val) => setSelectedExistingActivity(val ?? "")}>
                    <SelectTrigger className="w-full h-12 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Vraksharopan (Tree Plantation)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vraksharopan">Vraksharopan (Tree Plantation)</SelectItem>
                      <SelectItem value="swachhata">Swachhata Abhiyan</SelectItem>
                      <SelectItem value="health_camp">Health Camp</SelectItem>
                      <SelectItem value="voter_awareness">Voter Awareness Rally</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="w-full gap-2 h-11" variant={selectedExistingActivity ? "default" : "secondary"}>
                    Ye Activity Chunein
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Option B: New Activity */}
              <div className="space-y-4 relative">
                {/* Visual Separator for Desktop */}
                <div className="hidden md:block absolute -left-5 top-0 bottom-0 w-px bg-border/60" />
                <div className="hidden md:flex absolute -left-[30px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background border border-border items-center justify-center text-xs text-muted-foreground font-bold">
                  OR
                </div>

                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  Option B
                </div>
                <h3 className="text-lg font-semibold text-foreground">Ya Nayi Activity Type Banayein</h3>
                <p className="text-sm text-muted-foreground">Bilkul naya event framework setup karein.</p>
                
                <div className="space-y-3 pt-2">
                  <Input 
                    placeholder="Jaise: Rakt Daan Camp" 
                    className="h-12 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors"
                    value={newActivityName}
                    onChange={(e) => setNewActivityName(e.target.value)}
                  />
                  
                  <Button 
                    className="w-full gap-2 h-11 shadow-md shadow-primary/20" 
                    variant={newActivityName ? "default" : "secondary"}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Banayein aur Aage
                  </Button>
                </div>
              </div>

            </CardContent>

            <CardFooter className="bg-muted/20 border-t border-border/50 p-6 flex justify-center">
              <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                <Library className="h-4 w-4" />
                Activity Library Dekhein / Framework-Checklist-SOP Edit Karein
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 2. ACTIVITY CARDS TAB */}
        <TabsContent value="activity-cards" className="p-12 text-center border-2 border-dashed border-border/60 rounded-xl bg-card/30">
          <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Activity Cards</h3>
          <p className="text-muted-foreground">View and manage your 5 active polling station events.</p>
        </TabsContent>

        {/* 3. ACTIVITY LIBRARY TAB */}
        <TabsContent value="activity-library" className="p-12 text-center border-2 border-dashed border-border/60 rounded-xl bg-card/30">
          <Library className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Activity Library</h3>
          <p className="text-muted-foreground">Manage your event templates, checklists, and SOPs.</p>
        </TabsContent>

      </Tabs>
    </div>
  );
}
