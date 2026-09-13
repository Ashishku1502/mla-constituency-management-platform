"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Building2, Search, MapPin, Users, Vote, Plus, ChevronRight, ArrowRight, BookOpen, LayoutGrid, List, Sparkles, Check, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PollingStationData {
  id: string;
  name: string;
  number: number;
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
  pollingStationsCount: number;
  pollingStations: PollingStationData[];
  teamLeaders: number;
  activitiesCount: {
    running: number;
    completed: number;
    pending: number;
  };
  manager: string;
  managerId: string | null;
}

interface ManagerData {
  id: string;
  name: string;
}

interface ActivityGroupData {
  id: string;
  name: string;
  status: string;
  areas: string[];
  totalPS: number;
  dates: string[];
  managersCount: number;
  teamLeadersCount: number;
  volunteersCount: number;
}

export interface ActivityTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  usageCount: number;
  estimatedDuration: string;
  captureFields: {
    sentiment: boolean;
    comments: boolean;
    photo: boolean;
  };
}

const DEFAULT_TEMPLATES: ActivityTemplate[] = [
  {
    id: "tpl-1",
    name: "Door-to-door Survey",
    category: "Outreach",
    description: "Standard voter sentiment capture and issue collection.",
    usageCount: 42,
    estimatedDuration: "2-3 hours",
    captureFields: { sentiment: true, comments: true, photo: false }
  },
  {
    id: "tpl-2",
    name: "Poster Distribution",
    category: "Awareness",
    description: "Distribute campaign materials and posters in high-traffic areas.",
    usageCount: 15,
    estimatedDuration: "4 hours",
    captureFields: { sentiment: false, comments: true, photo: true }
  },
  {
    id: "tpl-3",
    name: "Voter Verification Drive",
    category: "Verification",
    description: "Verify voter list details against actual household residents.",
    usageCount: 8,
    estimatedDuration: "Full day",
    captureFields: { sentiment: false, comments: true, photo: false }
  }
];

export function AreasClient({ 
  initialAreas, 
  managers, 
  initialActivities = [] 
}: { 
  initialAreas: AreaData[], 
  managers: ManagerData[],
  initialActivities?: ActivityGroupData[]
}) {
  const router = useRouter();
  
  // Tab 1: Areas List State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Tab 2: Create Activity State
  const [activityTypeMode, setActivityTypeMode] = useState<"existing" | "new">("existing");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [newActivity, setNewActivity] = useState("");
  
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [areaConfigs, setAreaConfigs] = useState<Record<string, { ps: string[], date: string }>>({});
  const [expandedArea, setExpandedArea] = useState<string | null>(null);

  // Tab 4: Library State
  const [templates, setTemplates] = useState<ActivityTemplate[]>(DEFAULT_TEMPLATES);
  const [libSearch, setLibSearch] = useState("");
  const [libCategory, setLibCategory] = useState("all");
  const [libSort, setLibSort] = useState("most-used");
  const [activeTab, setActiveTab] = useState("areas");

  const filtered = initialAreas.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(search.toLowerCase()) ||
      area.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || area.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev => {
      if (prev.includes(areaId)) {
        const newConfigs = { ...areaConfigs };
        delete newConfigs[areaId];
        setAreaConfigs(newConfigs);
        if (expandedArea === areaId) setExpandedArea(null);
        return prev.filter(id => id !== areaId);
      } else {
        setAreaConfigs(prev => ({ ...prev, [areaId]: { ps: [], date: "" } }));
        setExpandedArea(areaId);
        return [...prev, areaId];
      }
    });
  };

  const handlePSToggle = (areaId: string, psId: string) => {
    setAreaConfigs(prev => {
      const config = prev[areaId] || { ps: [], date: "" };
      const newPs = config.ps.includes(psId) 
        ? config.ps.filter(id => id !== psId)
        : [...config.ps, psId];
      return { ...prev, [areaId]: { ...config, ps: newPs } };
    });
  };

  const handleSelectAllPS = (areaId: string, allPsIds: string[]) => {
    setAreaConfigs(prev => {
      const config = prev[areaId] || { ps: [], date: "" };
      const isAllSelected = config.ps.length === allPsIds.length;
      return { ...prev, [areaId]: { ...config, ps: isAllSelected ? [] : allPsIds } };
    });
  };

  const handleDateChange = (areaId: string, date: string) => {
    setAreaConfigs(prev => {
      const config = prev[areaId] || { ps: [], date: "" };
      return { ...prev, [areaId]: { ...config, date } };
    });
  };

  const handleCreateActivity = () => {
    if (activityTypeMode === "existing" && !selectedActivity) return toast.error("Please select an existing activity");
    if (activityTypeMode === "new" && !newActivity.trim()) return toast.error("Please enter a new activity name");
    if (selectedAreas.length === 0) return toast.error("Please select at least one area");
    
    for (const areaId of selectedAreas) {
      const config = areaConfigs[areaId];
      const area = initialAreas.find(a => a.id === areaId);
      if (!config || config.ps.length === 0) return toast.error(`Select at least one polling station for ${area?.name}`);
      if (!config.date) return toast.error(`Select a date for ${area?.name}`);
    }

    toast.success("Activity Created Successfully!", {
      description: "Auto-assigned to Area Managers and Team Leaders. Notifications sent."
    });
    
    // Reset form
    setSelectedAreas([]);
    setAreaConfigs({});
    setNewActivity("");
    setSelectedActivity("");
    setExpandedArea(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <PageHeader
        title="Areas & Activities"
        description="Comprehensive overview of constituency areas and activity management hub."
        icon={Building2}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 pt-2 border-b border-border/40">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted/50 p-1.5 text-muted-foreground shadow-inner">
            <TabsTrigger 
              value="areas" 
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <List className="h-4 w-4" />
              Areas Directory
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              <Plus className="h-4 w-4" />
               Nayi Activity Banayein
            </TabsTrigger>
            <TabsTrigger 
              value="cards" 
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <LayoutGrid className="h-4 w-4" />
              Activity Cards ({initialActivities.length})
            </TabsTrigger>
            <TabsTrigger 
              value="library" 
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              Activity Library 
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="areas" className="space-y-8 mt-6 animate-in slide-in-from-right-4 duration-500">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent dark:from-indigo-900/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-inner">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Areas</p>
                  <p className="text-3xl font-bold tracking-tight">{initialAreas.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-900/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-inner">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Areas</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {initialAreas.filter((a) => a.status === "Active").length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-900/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-inner">
                  <Vote className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Polling Stations</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {initialAreas.reduce((s, a) => s + a.pollingStationsCount, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent dark:from-cyan-900/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-inner">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Population</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {initialAreas
                      .reduce((s, a) => s + a.population, 0)
                      .toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-2 rounded-xl shadow-sm border border-border/50">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search areas by name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-none bg-muted/50 h-12 rounded-lg focus-visible:ring-1"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(val: string | null) => val && setStatusFilter(val)}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 bg-muted/50 border-none rounded-lg">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Card className="border-border/50 shadow-sm overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="py-4 text-xs uppercase tracking-wider font-semibold">Area Identity</TableHead>
                    <TableHead className="hidden sm:table-cell py-4 text-xs uppercase tracking-wider font-semibold">P/S Count</TableHead>
                    <TableHead className="hidden lg:table-cell py-4 text-xs uppercase tracking-wider font-semibold">Team</TableHead>
                    <TableHead className="hidden lg:table-cell py-4 text-xs uppercase tracking-wider font-semibold">Activities (R/C/P)</TableHead>
                    <TableHead className="hidden lg:table-cell py-4 text-xs uppercase tracking-wider font-semibold">Manager</TableHead>
                    <TableHead className="hidden lg:table-cell py-4 text-xs uppercase tracking-wider font-semibold">Coverage</TableHead>
                    <TableHead className="py-4 text-xs uppercase tracking-wider font-semibold">Status</TableHead>
                    <TableHead className="w-12 py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-[300px] text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Building2 className="h-12 w-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium">No areas found</p>
                          <p className="text-sm opacity-70">Try adjusting your filters or search term.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((area) => (
                    <TableRow
                      key={area.id}
                      className="cursor-pointer group hover:bg-muted/40 transition-all duration-200"
                      onClick={() => router.push(`/constituency/areas/${area.id}`)}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary font-bold text-sm">{area.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{area.name}</p>
                            <p className="font-mono text-xs text-muted-foreground mt-0.5">{area.code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Vote className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{area.pollingStationsCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{area.teamLeaders}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-full w-fit">
                          <span className="text-emerald-500 font-bold" title="Running">{area.activitiesCount.running}</span>
                          <span className="text-muted-foreground/30">/</span>
                          <span className="text-blue-500 font-bold" title="Completed">{area.activitiesCount.completed}</span>
                          <span className="text-muted-foreground/30">/</span>
                          <span className="text-amber-500 font-bold" title="Pending">{area.activitiesCount.pending}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col">
                          <span className={`text-sm ${area.managerId ? "font-medium" : "text-muted-foreground italic"}`}>
                            {area.manager}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-1.5 w-[120px]">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">P/S</span>
                            <span className="text-primary">{area.psCoverage}%</span>
                          </div>
                          <Progress value={area.psCoverage} className="h-1.5 bg-muted" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={area.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="max-w-4xl mx-auto mt-10 animate-in zoom-in-95 duration-500">
          <Card className="border-border/50 shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/40 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Create New Activity
                  </CardTitle>
                  <CardDescription className="text-base mt-1">Configure your activity, select areas and polling stations, and assign schedules.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              
              {/* 1. Activity Type Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                  <h3 className="text-lg font-semibold">Activity Type</h3>
                </div>
                
                <div className="grid grid-cols-2 p-1 bg-muted rounded-xl gap-1 w-full max-w-md ml-10">
                  <Button 
                    variant={activityTypeMode === "existing" ? "default" : "ghost"} 
                    className={`rounded-lg ${activityTypeMode === "existing" ? "shadow-sm" : ""}`}
                    onClick={() => setActivityTypeMode("existing")}
                  >
                    Choose Existing
                  </Button>
                  <Button 
                    variant={activityTypeMode === "new" ? "default" : "ghost"} 
                    className={`rounded-lg ${activityTypeMode === "new" ? "shadow-sm" : ""}`}
                    onClick={() => setActivityTypeMode("new")}
                  >
                    Create New
                  </Button>
                </div>

                <div className="ml-10 max-w-md pt-2">
                  {activityTypeMode === "existing" ? (
                    <div className="space-y-2 animate-in fade-in">
                      <Label>Select Saved Template</Label>
                      <Select value={selectedActivity} onValueChange={(val: string | null) => val && setSelectedActivity(val)}>
                        <SelectTrigger className="h-12 bg-background border-border">
                          <SelectValue placeholder="Select Template (e.g. Ghar Ghar Sampark)" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map(tpl => (
                            <SelectItem key={tpl.id} value={tpl.id}>{tpl.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-in fade-in">
                      <Label>New Activity Name</Label>
                      <Input 
                        placeholder="e.g. Blood Donation Camp" 
                        className="h-12 bg-background border-border"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-border/50 w-full" />

              {/* 2 & 3 & 4. Area, PS, Date Selection */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                  <h3 className="text-lg font-semibold">Target Areas & Polling Stations</h3>
                </div>

                <div className="ml-10 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {initialAreas.map(area => {
                      const isSelected = selectedAreas.includes(area.id);
                      return (
                        <div 
                          key={area.id}
                          onClick={() => handleAreaToggle(area.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all border ${
                            isSelected 
                              ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                              : 'bg-background border-border hover:border-primary/50 hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          <Checkbox checked={isSelected} className="pointer-events-none" />
                          <span className="font-medium text-sm">{area.name}</span>
                        </div>
                      )
                    })}
                  </div>

                  {selectedAreas.length > 0 && (
                    <div className="mt-6 space-y-4 border-l-2 border-primary/20 pl-4 ml-2">
                      {selectedAreas.map(areaId => {
                        const area = initialAreas.find(a => a.id === areaId);
                        if (!area) return null;
                        
                        const isExpanded = expandedArea === areaId;
                        const config = areaConfigs[areaId];
                        const psList = area.pollingStations;
                        
                        return (
                          <Card key={areaId} className="overflow-hidden border-border/50 shadow-sm animate-in slide-in-from-left-2">
                            <div 
                              className="bg-muted/30 p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setExpandedArea(isExpanded ? null : areaId)}
                            >
                              <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <div>
                                  <h4 className="font-semibold">{area.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {config.ps.length} of {psList.length} Polling Stations selected
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                  <Label className="text-xs text-muted-foreground whitespace-nowrap">Schedule:</Label>
                                  <Input 
                                    type="date" 
                                    className="h-9 w-[150px] text-sm bg-background" 
                                    value={config.date}
                                    onChange={(e) => handleDateChange(areaId, e.target.value)}
                                  />
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </Button>
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="p-4 border-t border-border/50 bg-background">
                                <div className="flex items-center justify-between mb-3">
                                  <Label className="text-sm font-semibold">Select Polling Stations</Label>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 text-xs"
                                    onClick={() => handleSelectAllPS(areaId, psList.map(p => p.id))}
                                  >
                                    {config.ps.length === psList.length ? "Deselect All" : "Select All"}
                                  </Button>
                                </div>
                                
                                {psList.length === 0 ? (
                                  <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-lg">
                                    No polling stations available for this area.
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {psList.map(ps => {
                                      const isPsSelected = config.ps.includes(ps.id);
                                      return (
                                        <div 
                                          key={ps.id}
                                          onClick={() => handlePSToggle(areaId, ps.id)}
                                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                            isPsSelected 
                                              ? 'border-primary bg-primary/5 shadow-sm' 
                                              : 'border-border hover:bg-muted'
                                          }`}
                                        >
                                          <Checkbox checked={isPsSelected} className="pointer-events-none" />
                                          <div className="flex flex-col">
                                            <span className="font-medium text-sm leading-none">{ps.name}</span>
                                            <span className="text-xs text-muted-foreground mt-1">P/S No. {ps.number}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

            </CardContent>
            
            <CardFooter className="bg-muted/10 border-t border-border/40 px-8 py-6 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                This will automatically assign tasks and send notifications to respective Team Leaders.
              </p>
              <Button onClick={handleCreateActivity} size="lg" className="h-12 px-8 font-semibold shadow-md">
                Create & Assign Activity
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards" className="mt-6">
          {initialActivities.length === 0 ? (
            <Card className="border-dashed border-2 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <LayoutGrid className="h-10 w-10 opacity-50" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Activity Cards</h3>
                <p className="max-w-sm text-center">Activity cards will appear here once you've created them using the "+ Nayi Activity Banayein" tab.</p>
                <Button variant="outline" className="mt-6 rounded-full" onClick={() => {
                  const tabs = document.querySelector('[value="create"]') as HTMLButtonElement;
                  if (tabs) tabs.click();
                }}>
                  Create First Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {initialActivities.map(activity => {
                // Calculate pseudo-completion for demo purposes based on status
                const isCompleted = activity.status === "Completed";
                const isRunning = activity.status === "In Progress";
                const progress = isCompleted ? 100 : isRunning ? 65 : 0;
                
                return (
                  <Card key={activity.id} className="overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all group flex flex-col h-full">
                    <CardHeader className="bg-muted/10 pb-4 border-b border-border/40">
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                          <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
                            {activity.name}
                          </CardTitle>
                          <p className="text-xs font-mono text-muted-foreground">ID: {activity.id.split('-')[0].toUpperCase()}</p>
                        </div>
                        <StatusBadge status={activity.status} />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-5 flex-grow space-y-5">
                      {/* Scope Summary */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Scope Summary</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium truncate max-w-[200px]">
                            {activity.areas.slice(0, 2).join(", ")}
                          </span>
                          {activity.areas.length > 2 && (
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full font-medium">+{activity.areas.length - 2} more</span>
                          )}
                        </div>
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Vote className="w-3.5 h-3.5" />
                            <span>{activity.totalPS} P/S</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{Math.max(1, Math.floor(activity.totalPS / 3))} Wards</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Schedule</h4>
                        <div className="flex items-center gap-2 text-sm bg-muted/40 p-2 rounded-md">
                          <span className="font-medium">
                            {activity.dates.length === 1 ? activity.dates[0] : `${activity.dates.length} Multiple Dates`}
                          </span>
                          {activity.dates.length > 1 && (
                            <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                          )}
                        </div>
                      </div>

                      {/* Assignment Info */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assignment</h4>
                        <div className="flex gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-foreground">{activity.managersCount}</span>
                            <span className="text-[10px] uppercase text-muted-foreground">Managers</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-foreground">{activity.teamLeadersCount}</span>
                            <span className="text-[10px] uppercase text-muted-foreground">TLs</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-foreground">{activity.volunteersCount}</span>
                            <span className="text-[10px] uppercase text-muted-foreground">Vols</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="space-y-2 pt-2 border-t border-border/40">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Completion Progress</span>
                          <span className="text-primary">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-muted" />
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 bg-muted/5 flex gap-2 justify-between">
                      <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                        View Details
                      </Button>
                      {(activity.status === "Pending" || activity.status === "Draft") && (
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground px-2">
                          Edit
                        </Button>
                      )}
                      {(activity.status === "Pending" || activity.status === "In Progress") && (
                        <Button variant="ghost" size="sm" className="text-xs text-primary px-2 hover:text-primary hover:bg-primary/10">
                          Notify
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="library" className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Library Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-2 rounded-xl shadow-sm border border-border/50 mb-6">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search templates by name..."
                value={libSearch}
                onChange={(e) => setLibSearch(e.target.value)}
                className="pl-10 border-none bg-muted/50 h-12 rounded-lg focus-visible:ring-1"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={libCategory} onValueChange={(val: string | null) => val && setLibCategory(val)}>
                <SelectTrigger className="w-full sm:w-[150px] h-12 bg-muted/50 border-none rounded-lg">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Outreach">Outreach</SelectItem>
                  <SelectItem value="Awareness">Awareness</SelectItem>
                  <SelectItem value="Verification">Verification</SelectItem>
                </SelectContent>
              </Select>
              <Select value={libSort} onValueChange={(val: string | null) => val && setLibSort(val)}>
                <SelectTrigger className="w-full sm:w-[150px] h-12 bg-muted/50 border-none rounded-lg">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-used">Most Used</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button className="h-12 rounded-lg shrink-0 shadow-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Template
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Template</DialogTitle>
                    <DialogDescription>
                      Create a reusable framework for activities. Note: Only Admins can publish templates to the global library.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Template Name</Label>
                      <Input placeholder="e.g. Health Camp Setup" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select defaultValue="Outreach">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Outreach">Outreach</SelectItem>
                          <SelectItem value="Awareness">Awareness</SelectItem>
                          <SelectItem value="Verification">Verification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Default Description / Instructions</Label>
                      <Textarea placeholder="Explain what the volunteer should do on the ground..." className="h-24" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label>Required Capture Fields</Label>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="req-sentiment" defaultChecked />
                          <Label htmlFor="req-sentiment" className="font-normal cursor-pointer">Voter Sentiment & Issues</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="req-comments" defaultChecked />
                          <Label htmlFor="req-comments" className="font-normal cursor-pointer">General Comments</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="req-photo" />
                          <Label htmlFor="req-photo" className="font-normal cursor-pointer">Geotagged Photo Proof</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="mr-auto">Cancel</Button>
                    <Button onClick={() => toast.success("Template proposed!", { description: "It will be added to the library once approved."})}>
                      Save Template
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter(t => (libCategory === "all" || t.category === libCategory) && t.name.toLowerCase().includes(libSearch.toLowerCase()))
              .sort((a, b) => libSort === "a-z" ? a.name.localeCompare(b.name) : b.usageCount - a.usageCount)
              .map(tpl => (
              <Card key={tpl.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                <CardHeader className="bg-muted/10 pb-4 border-b border-border/40">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {tpl.name}
                        </CardTitle>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">{tpl.category}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-5 flex-grow space-y-4">
                  <p className="text-sm text-foreground line-clamp-2 min-h-[40px]">
                    {tpl.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capture Fields</h4>
                    <div className="flex flex-wrap gap-2">
                      {tpl.captureFields.sentiment && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Sentiment</span>}
                      {tpl.captureFields.comments && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Comments</span>}
                      {tpl.captureFields.photo && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Photo</span>}
                      {(!tpl.captureFields.sentiment && !tpl.captureFields.comments && !tpl.captureFields.photo) && (
                        <span className="text-xs text-muted-foreground italic">None required</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <span>Est: {tpl.estimatedDuration}</span>
                    <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md font-medium">Used {tpl.usageCount} times</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 bg-muted/5 flex gap-2 justify-between">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full text-xs font-semibold shadow-sm"
                    onClick={() => {
                      setSelectedActivity(tpl.id);
                      setActivityTypeMode("existing");
                      setActiveTab("create");
                    }}
                  >
                    Use This <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground px-2">
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
