"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { 
  Home, 
  Search, 
  Plus, 
  Users, 
  UploadCloud, 
  AlertCircle, 
  Trash2,
  FileSpreadsheet,
  Network,
  Activity,
  CheckCircle2,
  ListTodo,
  MapPin,
  TrendingUp,
  History,
  Star
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { VillageProfileTab } from "./village-profile-tab";

interface WardData {
  id: string;
  name: string;
  type: string;
  area: string;
  population: number;
  households: number;
  familyCards: number;
  totalVoters: number;
  volunteerNames: string;
  assignedTL: string;
  reportingManager: string;
  activityStatus: string;
}

interface WardsClientProps {
  initialWards: WardData[];
  metrics: any;
}

export function WardsClient({ initialWards, metrics }: WardsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = initialWards.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.area.toLowerCase().includes(search.toLowerCase())
  );

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward Management"
        description="Poore system ka central module — Gram Pradhan Registration, Voter List upload, aur Village ko Internal Wards mein divide karna. Yehi Wards Team Leader, Volunteer, Family Card aur Activity Management mein istemal hoti hain."
        icon={Network}
      />

      {/* DASHBOARD TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Readiness Score Card */}
        <Card className="glass-card md:col-span-1 border-primary/20 bg-gradient-premium relative overflow-hidden flex flex-col justify-center items-center p-6 min-h-[180px]">
          <div className="absolute -right-4 -top-4 text-primary/10">
            <Activity className="h-32 w-32" />
          </div>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center z-10">
            Campaign Readiness
          </CardTitle>
          <div className="text-6xl font-black text-primary z-10 drop-shadow-md">
            {metrics?.campaignReadinessScore ?? 40}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4 z-10 max-w-[200px]">
            Average of Task, Family Card, Voter Linking, Activities & Reports
          </p>
        </Card>

        {/* Metrics Grid */}
        <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Population</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics?.population?.toLocaleString() ?? 5000}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Total Voters</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics?.voters?.toLocaleString() ?? 500}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Linked Voters</p>
              <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{metrics?.linkedVoters?.toLocaleString() ?? 8}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm border-rose-500/20 bg-rose-500/5">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase">Unlinked Voters</p>
              <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-300">{metrics?.unlinkedVoters?.toLocaleString() ?? 492}</h3>
            </CardContent>
          </Card>

          <Card className="glass shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Internal Wards</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics?.internalWards ?? 10}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Team Leaders</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics?.teamLeaders ?? 3}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Volunteers</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics?.volunteers ?? 4}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-xs text-muted-foreground font-semibold uppercase">Family Cards</p>
              <h3 className="text-2xl font-bold text-foreground">{metrics?.familyCards ?? 2}</h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Bars Section */}
      <Card className="glass-card">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-lg flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            Overall Task Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground/80">Overall Progress</span>
                <span className="text-primary">{metrics?.progress?.overall ?? 33}%</span>
              </div>
              <Progress value={metrics?.progress?.overall ?? 33} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground/80">Family Card</span>
                <span className="text-emerald-600">{metrics?.progress?.familyCardCoverage ?? 100}%</span>
              </div>
              <Progress value={metrics?.progress?.familyCardCoverage ?? 100} className="h-2 [&>div]:bg-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground/80">Voter Linking</span>
                <span className="text-rose-600">{metrics?.progress?.voterLinking ?? 2}%</span>
              </div>
              <Progress value={metrics?.progress?.voterLinking ?? 2} className="h-2 [&>div]:bg-rose-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground/80">Activity Comp.</span>
                <span className="text-blue-600">{metrics?.progress?.activityCompletion ?? 40}%</span>
              </div>
              <Progress value={metrics?.progress?.activityCompletion ?? 40} className="h-2 [&>div]:bg-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground/80">Ground Reports</span>
                <span className="text-purple-600">{metrics?.progress?.volunteerReports ?? 25}%</span>
              </div>
              <Progress value={metrics?.progress?.volunteerReports ?? 25} className="h-2 [&>div]:bg-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABS NAVIGATION SECTION */}
      <Tabs defaultValue="upload-voter-list" className="w-full">
        <TabsList className="grid w-full grid-cols-3 xl:grid-cols-6 h-auto p-1 bg-muted/40 rounded-xl overflow-hidden mb-6">
          <TabsTrigger value="village-profile" className="py-2.5 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background text-xs sm:text-sm">
            Village Profile
          </TabsTrigger>
          <TabsTrigger value="upload-voter-list" className="py-2.5 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background text-xs sm:text-sm">
            Upload Voter List
          </TabsTrigger>
          <TabsTrigger value="create-wards" className="py-2.5 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background text-xs sm:text-sm">
            Create Wards
          </TabsTrigger>
          <TabsTrigger value="ward-list" className="py-2.5 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background text-xs sm:text-sm">
            Ward List ({initialWards?.length ?? 10})
          </TabsTrigger>
          <TabsTrigger value="ward-analytics" className="py-2.5 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background text-xs sm:text-sm">
            Ward Analytics
          </TabsTrigger>
          <TabsTrigger value="ward-matrix" className="py-2.5 rounded-lg data-[state=active]:shadow-sm data-[state=active]:bg-background text-xs sm:text-sm">
            Ward Matrix
          </TabsTrigger>
        </TabsList>

        {/* 1. UPLOAD VOTER LIST TAB */}
        <TabsContent value="upload-voter-list" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          
          {/* Dashboard Overview Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass shadow-sm">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Verification %</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-foreground">0%</h3>
                  <span className="text-xs text-muted-foreground">(0 verified)</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass shadow-sm">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Missing Mobile</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-foreground">500</h3>
                  <span className="text-xs text-muted-foreground">records</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass shadow-sm">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Duplicate Records</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-foreground">0</h3>
                  <span className="text-xs text-muted-foreground">records</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass shadow-sm">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Pending Verification</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-foreground">500</h3>
                  <span className="text-xs text-muted-foreground">records</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Village Data & Rule Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20 shadow-sm flex flex-col justify-center">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Village</p>
                      <p className="text-sm font-bold text-primary leading-tight">Mustafabad<br/>(Demo)</p>
                    </div>
                    <Home className="h-6 w-6 text-primary/40" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20 shadow-sm flex flex-col justify-center">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Total Voters</p>
                      <p className="text-xl font-bold text-primary">500</p>
                    </div>
                    <Users className="h-6 w-6 text-primary/40" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20 shadow-sm flex flex-col justify-center">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Wards/Vans</p>
                      <p className="text-xl font-bold text-primary">10</p>
                    </div>
                    <Network className="h-6 w-6 text-primary/40" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rule Box */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-4 flex gap-3 shadow-sm h-full items-center">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="space-y-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300">Rule:</h4>
                <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                  Ye Official Voter List Election Commission se milti hai. Upload hone ke baad ye <span className="font-semibold">central voter database</span> ban jaata hai. Duplicate Voter ID automatically skip ho jaate hain.
                </p>
              </div>
            </div>
          </div>

          <Card className="glass border-dashed border-2 mt-4">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-3">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">CSV ya Excel Upload Karein</CardTitle>
              <CardDescription className="max-w-md mx-auto text-sm">
                .csv, .xlsx ya .xls chalegi — Election Commission ka asli format (Voter Name, EPIC No., Village, Ward, Age, Gender, Father/Husband Name, wagera) automatically detect ho jaata hai.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, .xlsx, .xls"
              />
              <Button onClick={triggerUpload} className="gap-2 shadow-lg" size="lg">
                <UploadCloud className="h-5 w-5" />
                Choose file
              </Button>
              <p className="text-xs text-muted-foreground mt-3">No file chosen</p>
            </CardContent>
          </Card>

        </TabsContent>

        {/* 2. WARD LIST TAB */}
        <TabsContent value="ward-list" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 bg-muted/10">
              <div>
                <CardTitle className="text-xl">Generated Internal Wards</CardTitle>
                <CardDescription className="mt-1">
                  Breakdown of internal wards created for <span className="font-semibold text-foreground">Mustafabad (Demo)</span>
                </CardDescription>
              </div>
              <Button onClick={() => router.push("/constituency/wards/add")} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Ward
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Ward Name/Locality</TableHead>
                    <TableHead>Total Household</TableHead>
                    <TableHead>Total Family Card</TableHead>
                    <TableHead>Total Voters</TableHead>
                    <TableHead className="hidden md:table-cell">Volunteer's Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Assigned T/L</TableHead>
                    <TableHead className="hidden lg:table-cell">Reporting Manager</TableHead>
                    <TableHead className="pr-6">Activity Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialWards?.map((ward, i) => (
                    <TableRow key={ward.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium pl-6">
                        <div className="flex flex-col">
                          <span>{ward.name}</span>
                          <span className="text-xs text-muted-foreground">{ward.area}</span>
                        </div>
                      </TableCell>
                      <TableCell>{ward.households}</TableCell>
                      <TableCell>{ward.familyCards}</TableCell>
                      <TableCell>{ward.totalVoters}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={ward.volunteerNames === "Unassigned" ? "text-muted-foreground italic" : "font-medium"}>
                          {ward.volunteerNames}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={ward.assignedTL === "Unassigned" ? "text-muted-foreground italic" : ""}>
                          {ward.assignedTL}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {ward.reportingManager}
                      </TableCell>
                      <TableCell className="pr-6">
                        <Badge 
                          variant="outline" 
                          className={
                            ward.activityStatus === "Running" ? "text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-900/20" :
                            ward.activityStatus === "Completed" ? "text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20" :
                            ward.activityStatus === "Pending" ? "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-900/20" :
                            "text-muted-foreground"
                          }
                        >
                          {ward.activityStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Village Profile Tab - Full Implementation */}
        <TabsContent value="village-profile" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <VillageProfileTab />
        </TabsContent>
        <TabsContent value="create-wards" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="glass-card max-w-3xl mx-auto mt-6">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-lg">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Village ko Internal Wards mein Divide Karein</CardTitle>
                  <CardDescription className="mt-1.5 text-sm max-w-xl">
                    Create wards based on population percentage (e.g., 10%) or fixed population size (e.g., 500 voters per ward). Once created, team leaders, volunteers, family cards, and activity management will work based on this structure.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="village-select" className="text-sm font-semibold">Village Select</Label>
                  <Select defaultValue="mustafabad">
                    <SelectTrigger id="village-select" className="bg-background/50 border-border/60 h-11">
                      <SelectValue placeholder="Select Village" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mustafabad">Mustafabad (Demo) (500 voters)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="method-select" className="text-sm font-semibold">Method</Label>
                    <Select defaultValue="percentage">
                      <SelectTrigger id="method-select" className="bg-background/50 border-border/60 h-11">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Population Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Population Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="percentage-input" className="text-sm font-semibold">Percentage Input</Label>
                    <Input 
                      id="percentage-input" 
                      type="number" 
                      defaultValue="10" 
                      className="bg-background/50 border-border/60 h-11" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button className="gap-2 px-6 h-11 shadow-md hover:-translate-y-0.5 transition-all">
                  Wards Banayein
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ward-analytics" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="glass-card mt-6">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <CardTitle className="text-lg">Ward Overview</CardTitle>
              <CardDescription>Detailed performance metrics across all internal wards.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Ward Name</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Total Voters</TableHead>
                    <TableHead>Linked (%)</TableHead>
                    <TableHead>Family Cards</TableHead>
                    <TableHead>Volunteers</TableHead>
                    <TableHead>Activities</TableHead>
                    <TableHead>Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const wardNum = i + 1;
                    let linked = "0%";
                    let familyCards = 0;
                    let volunteers = wardNum <= 2 ? 1 : 0;
                    let activities = 0;
                    let pending = 0;

                    if (wardNum === 1) {
                      linked = "20%";
                      familyCards = 4;
                      activities = 3;
                      pending = 1;
                    } else if (wardNum === 2) {
                      linked = "4%";
                      activities = 2;
                      pending = 2;
                    }

                    return (
                      <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium pl-6">
                          Mustafabad (Demo) - Ward {wardNum}
                        </TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${linked !== "0%" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                            {linked}
                          </span>
                        </TableCell>
                        <TableCell>{familyCards}</TableCell>
                        <TableCell>{volunteers}</TableCell>
                        <TableCell>{activities}</TableCell>
                        <TableCell>
                          {pending > 0 ? (
                            <span className="text-rose-600 font-semibold">{pending}</span>
                          ) : (
                            <span className="text-muted-foreground">{pending}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ward-matrix" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 6 }).map((_, i) => {
              const wardNum = i + 1;
              // Mock details based on ward number
              const teamLeader = wardNum === 1 ? "Rajesh Sharma" : wardNum === 2 ? "Amit Kumar" : "Suresh Kumar";
              const volunteerCount = wardNum <= 2 ? 1 : 0;
              const probScore = wardNum === 1 ? 85 : wardNum === 2 ? 65 : 45;
              const probColor = probScore >= 80 ? "text-emerald-600" : probScore >= 60 ? "text-amber-600" : "text-rose-600";
              
              const wardData = {
                name: `Ward ${wardNum}`,
                landmark: `Near Main Square ${wardNum}`,
                leader: teamLeader,
                volunteers: volunteerCount,
                voters: 50,
                activities: wardNum === 1 ? 3 : wardNum === 2 ? 2 : 0,
                score: probScore,
                color: probColor,
                members: [
                  { name: "Vikram Singh", role: "Active Supporter" },
                  { name: "Rahul Verma", role: "Local Influencer" }
                ],
                support: { strong: 40, neutral: 45, weak: 15 }
              };

              return (
                <Card 
                  key={i} 
                  className="glass-card hover:shadow-md transition-all cursor-pointer border-border/50 hover:border-primary/50 group"
                  onClick={() => setSelectedWard(wardData)}
                >
                  <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {wardData.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                          <MapPin className="h-3 w-3" /> {wardData.landmark}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={`font-bold text-sm ${wardData.color}`}>
                        {wardData.score}% Win Prob.
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Team Leader</p>
                        <p className="font-semibold truncate">{wardData.leader}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Volunteers</p>
                        <p className="font-semibold">{wardData.volunteers}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Total Voters</p>
                        <p className="font-semibold">{wardData.voters}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Activities</p>
                        <p className="font-semibold">{wardData.activities}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Dialog open={!!selectedWard} onOpenChange={(open) => !open && setSelectedWard(null)}>
            <DialogContent className="max-w-2xl">
              {selectedWard && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      {selectedWard.name} Voter List
                      <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                        Read Only
                      </Badge>
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {selectedWard.landmark} • {selectedWard.voters} Voters
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-4 space-y-4">
                    <div className="rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-4 flex gap-3 shadow-sm items-start">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300">Important Rule</h4>
                        <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                          Ye Official Voter List Election Commission se milti hai aur MLA/Admin dwara upload hoti hai. Upload hone ke baad ye poore system ka <span className="font-semibold">central voter database</span> ban jaata hai — <span className="font-semibold">Read Only</span> rehta hai, isi database ka upyog poore system mein hota hai. Duplicate Voter ID automatically skip ho jaate hain.
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead>Voter ID (EPIC)</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Age/Gender</TableHead>
                            <TableHead>Father/Husband Name</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <TableRow key={idx} className="hover:bg-muted/50">
                              <TableCell className="font-medium text-primary">ABC{1234567 + idx}</TableCell>
                              <TableCell>Sample Voter {idx + 1}</TableCell>
                              <TableCell>{30 + idx} / {idx % 2 === 0 ? 'M' : 'F'}</TableCell>
                              <TableCell>Sample Guardian {idx + 1}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
