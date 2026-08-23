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
  ListTodo
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
  pollingStations: number;
  households: number;
}

interface WardsClientProps {
  initialWards: WardData[];
  metrics: any;
}

export function WardsClient({ initialWards, metrics }: WardsClientProps) {
  const [search, setSearch] = useState("");
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
          {/* Rule Box */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-4 flex gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300">Rule:</h4>
              <p className="text-sm text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                Ye Official Voter List Election Commission se milti hai aur Pradhan/Admin dwara upload hoti hai. 
                Upload hone ke baad ye poore system ka <span className="font-semibold">central voter database</span> ban jaata hai — 
                <span className="font-semibold"> Read Only </span> rehta hai, isi database ka upyog poore system mein hota hai. 
                Duplicate Voter ID automatically skip ho jaate hain.
              </p>
            </div>
          </div>

          <Card className="glass border-dashed border-2">
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

          <div className="flex justify-end pt-4">
            <Button variant="destructive" className="gap-2 bg-destructive/90 hover:bg-destructive shadow-sm">
              <Trash2 className="h-4 w-4" />
              Poora Voter Database Reset Karein
            </Button>
          </div>
        </TabsContent>

        {/* 2. WARD LIST TAB */}
        <TabsContent value="ward-list" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 bg-muted/10">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search wards & villages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background/50 border-border/60"
                />
              </div>
              <Button onClick={() => router.push("/constituency/wards/add")} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Ward
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-6">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Area</TableHead>
                    <TableHead className="hidden md:table-cell">Population</TableHead>
                    <TableHead className="hidden md:table-cell">Area PS</TableHead>
                    <TableHead className="hidden lg:table-cell pr-6">Households</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((w) => (
                    <TableRow key={w.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium pl-6">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                            <Home className="h-4 w-4" />
                          </div>
                          {w.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            w.type === "Ward"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                          }`}
                        >
                          {w.type}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{w.area}</TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
                        {w.population.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{w.pollingStations}</TableCell>
                      <TableCell className="hidden lg:table-cell pr-6 text-muted-foreground">
                        {w.households.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-muted-foreground/30" />
                          <p>No wards or villages found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Village Profile Tab - Full Implementation */}
        <TabsContent value="village-profile" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <VillageProfileTab />
        </TabsContent>
        <TabsContent value="create-wards" className="p-12 text-center border-2 border-dashed border-border/60 rounded-xl bg-card/30">
          <Plus className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Create Internal Wards</h3>
          <p className="text-muted-foreground">Divide your village into actionable internal wards.</p>
        </TabsContent>
        <TabsContent value="ward-analytics" className="p-12 text-center border-2 border-dashed border-border/60 rounded-xl bg-card/30">
          <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Ward-wise Analytics</h3>
          <p className="text-muted-foreground">Detailed performance metrics across all internal wards.</p>
        </TabsContent>
        <TabsContent value="ward-matrix" className="p-12 text-center border-2 border-dashed border-border/60 rounded-xl bg-card/30">
          <Network className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Ward Matrix</h3>
          <p className="text-muted-foreground">Cross-reference data between wards, activities, and volunteers.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
