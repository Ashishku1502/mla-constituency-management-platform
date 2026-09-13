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
  Star,
  Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VillageProfileTab } from "./village-profile-tab";
import { uploadVoterListAction, createInternalWardsAction } from "@/app/actions/ward-actions";

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
  linkedPercent?: number;
  totalActivities?: number;
  pendingActivities?: number;
  probScore?: number;
  probColor?: string;
}

interface WardsClientProps {
  initialWards: WardData[];
  metrics: any;
}

export function WardsClient({ initialWards, metrics }: WardsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedWard, setSelectedWard] = useState<any>(null);
  
  // Upload States
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Create Ward States
  const [villageSelect, setVillageSelect] = useState("Mustafabad");
  const [methodSelect, setMethodSelect] = useState("percentage");
  const [methodValue, setMethodValue] = useState("10");
  const [isCreatingWard, setIsCreatingWard] = useState(false);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setUploadState("uploading");
    setUploadProgress(10);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const csvText = event.target?.result as string;
            const lines = csvText.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            const records = [];
            for(let i = 1; i < lines.length; i++) {
                if(!lines[i].trim()) continue;
                const values = lines[i].split(',').map(v => v.trim());
                const record: any = {};
                headers.forEach((h, idx) => {
                    record[h] = values[idx];
                });
                records.push(record);
            }
            
            setUploadProgress(50);
            const result = await uploadVoterListAction(records);
            if(result.success) {
                setUploadProgress(100);
                setTimeout(() => setUploadState("success"), 500);
            } else {
                alert("Upload failed: " + result.error);
                setUploadState("idle");
            }
        } catch (error) {
            console.error(error);
            setUploadState("idle");
        }
    };
    reader.readAsText(file);
  };

  const resetUpload = () => {
    setUploadState("idle");
    setUploadProgress(0);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateWards = async () => {
    setIsCreatingWard(true);
    const result = await createInternalWardsAction(villageSelect, methodSelect, parseInt(methodValue) || 10);
    setIsCreatingWard(false);
    if (result.success) {
      alert("Wards successfully generated and synced with database!");
    } else {
      alert("Failed to create wards: " + result.error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ward Management"
        icon={Network}
      />

      {/* DASHBOARD TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Readiness Score Card */}
        <Card className="md:col-span-1 border-0 shadow-lg relative overflow-hidden flex flex-col justify-center items-center p-6 min-h-[180px] bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 dark:from-indigo-900 dark:via-purple-900 dark:to-fuchsia-900 text-white rounded-2xl transition-transform hover:scale-[1.02] duration-300 group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="h-32 w-32" />
          </div>

          <div className="relative flex items-center justify-center mb-3 mt-2">
            <svg className="w-24 h-24 transform -rotate-90 drop-shadow-md">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (metrics?.campaignReadinessScore ?? 40)) / 100} className="text-white transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute text-2xl font-black">{metrics?.campaignReadinessScore ?? 40}%</div>
          </div>

          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-center z-10 text-white/90">
            Campaign Readiness
          </CardTitle>
          <p className="text-xs text-center text-white/70 mt-1.5 z-10 max-w-[200px]">
            Average of Task, Family Card, Voter Linking & Reports
          </p>
        </Card>

        {/* Metrics Grid */}
        <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 group">
            <CardContent className="p-4 flex flex-col justify-center h-full relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="h-16 w-16" />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Population</p>
              <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{metrics?.population?.toLocaleString() ?? 5000}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 group">
            <CardContent className="p-4 flex flex-col justify-center h-full relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="h-16 w-16" />
              </div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Voters</p>
              <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{metrics?.voters?.toLocaleString() ?? 500}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:shadow-emerald-500/10 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">Linked Voters</p>
              <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-300 group-hover:scale-105 transition-transform origin-left">{metrics?.linkedVoters?.toLocaleString() ?? 8}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:shadow-rose-500/10 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider mb-1">Unlinked Voters</p>
              <h3 className="text-3xl font-black text-rose-700 dark:text-rose-300 group-hover:scale-105 transition-transform origin-left">{metrics?.unlinkedVoters?.toLocaleString() ?? 492}</h3>
            </CardContent>
          </Card>

          <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 group">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Internal Wards</p>
              <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{metrics?.internalWards ?? 10}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 group">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Team Leaders</p>
              <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{metrics?.teamLeaders ?? 3}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 group">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Volunteers</p>
              <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{metrics?.volunteers ?? 4}</h3>
            </CardContent>
          </Card>
          <Card className="glass shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 group">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Family Cards</p>
              <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{metrics?.familyCards ?? 2}</h3>
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
        <div className="relative mb-8">
          <div className="absolute inset-x-0 bottom-0 h-px bg-border/50" />
          <TabsList className="flex w-full justify-start md:justify-center overflow-x-auto bg-transparent border-0 p-1 space-x-2 no-scrollbar">
            <TabsTrigger value="village-profile" className="rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-sm transition-all duration-300 shrink-0">
              Village Profile
            </TabsTrigger>
            <TabsTrigger value="upload-voter-list" className="rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-sm transition-all duration-300 shrink-0">
              Upload Voter List
            </TabsTrigger>
            <TabsTrigger value="create-wards" className="rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-sm transition-all duration-300 shrink-0">
              Create Wards
            </TabsTrigger>
            <TabsTrigger value="ward-list" className="rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-sm transition-all duration-300 shrink-0">
              Ward List ({initialWards?.length ?? 10})
            </TabsTrigger>
            <TabsTrigger value="ward-analytics" className="rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-sm transition-all duration-300 shrink-0">
              Ward Analytics
            </TabsTrigger>
            <TabsTrigger value="ward-matrix" className="rounded-full px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-sm transition-all duration-300 shrink-0">
              Ward Matrix
            </TabsTrigger>
          </TabsList>
        </div>

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
                      <p className="text-sm font-bold text-primary leading-tight">Mustafabad<br />(Demo)</p>
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

          {uploadState === "idle" && (
            <Card className="glass border-dashed border-2 mt-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group" onClick={triggerUpload}>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 p-5 rounded-full w-fit mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 relative">
                  <FileSpreadsheet className="h-10 w-10 text-primary relative z-10" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">CSV ya Excel Upload Karein</CardTitle>
                <CardDescription className="max-w-md mx-auto text-sm mt-2">
                  .csv, .xlsx ya .xls chalegi — Election Commission ka asli format (Voter Name, EPIC No., Village, Ward, Age, Gender) automatically detect ho jaata hai.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileChange}
                />
                <Button onClick={(e) => { e.stopPropagation(); triggerUpload(); }} className="gap-2 shadow-lg h-12 px-8 rounded-full" size="lg">
                  <UploadCloud className="h-5 w-5" />
                  Choose file
                </Button>
                <p className="text-xs text-muted-foreground mt-4 group-hover:text-primary/70 transition-colors">Drag and drop file here, or click to browse</p>
              </CardContent>
            </Card>
          )}

          {uploadState === "uploading" && (
            <Card className="glass border-primary/20 bg-primary/5 mt-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <div className="bg-background rounded-full p-4 shadow-md relative z-10">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                </div>
                <div className="text-center space-y-3 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-foreground">Analyzing {selectedFile?.name}...</h3>
                  <Progress value={uploadProgress} className="h-2.5" />
                  <p className="text-sm text-muted-foreground font-medium">{uploadProgress >= 100 ? 100 : uploadProgress}% processing records</p>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadState === "success" && (
            <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="glass border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/40 p-4 rounded-full mb-1">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">Upload Successful!</h3>
                    <p className="text-emerald-800/80 dark:text-emerald-300/80 text-sm mt-2 max-w-md mx-auto">
                      Successfully imported <span className="font-bold">500 records</span> from {selectedFile?.name}. Duplicate EPIC numbers were ignored.
                    </p>
                  </div>
                  <Button variant="outline" onClick={resetUpload} className="mt-4 gap-2 border-emerald-200 hover:bg-emerald-100 dark:border-emerald-800 dark:hover:bg-emerald-900/50">
                    <UploadCloud className="h-4 w-4" /> Upload Another List
                  </Button>
                </CardContent>
              </Card>

              {/* MOCK PREVIEW TABLE */}
              <Card className="glass shadow-sm">
                <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ListTodo className="h-4 w-4 text-primary" />
                    Data Preview (First 5 Rows)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="pl-6">Voter ID (EPIC)</TableHead>
                        <TableHead>Voter Name</TableHead>
                        <TableHead>Age / Gender</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium text-primary pl-6">UP/21/00{idx + 1}/123456</TableCell>
                          <TableCell className="font-medium">Voter {idx + 1}</TableCell>
                          <TableCell>{30 + idx} / {idx % 2 === 0 ? 'M' : 'F'}</TableCell>
                          <TableCell className="text-muted-foreground">Ward {idx + 1}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

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
                  <Select value={villageSelect} onValueChange={(val) => setVillageSelect(val || "Mustafabad")}>
                    <SelectTrigger id="village-select" className="bg-background/50 border-border/60 h-11">
                      <SelectValue placeholder="Select Village" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mustafabad">Mustafabad (Demo) (500 voters)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="method-select" className="text-sm font-semibold">Method</Label>
                    <Select value={methodSelect} onValueChange={(val) => setMethodSelect(val || "percentage")}>
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
                      value={methodValue}
                      onChange={(e) => setMethodValue(e.target.value)}
                      className="bg-background/50 border-border/60 h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50">
                <Button onClick={handleCreateWards} disabled={isCreatingWard} className="gap-2 px-6 h-11 shadow-md hover:-translate-y-0.5 transition-all">
                  {isCreatingWard ? <Loader2 className="h-4 w-4 animate-spin" /> : "Wards Banayein"}
                  {!isCreatingWard && <Plus className="h-4 w-4" />}
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
                  {initialWards?.map((ward, i) => (
                    <TableRow key={ward.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium pl-6">{ward.name}</TableCell>
                      <TableCell>{ward.population}</TableCell>
                      <TableCell>{ward.totalVoters}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${(ward.linkedPercent ?? 0) > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                          {ward.linkedPercent ?? 0}%
                        </span>
                      </TableCell>
                      <TableCell>{ward.familyCards}</TableCell>
                      <TableCell>{ward.volunteerNames !== "Unassigned" ? ward.volunteerNames.split(',').length : 0}</TableCell>
                      <TableCell>{ward.totalActivities ?? 0}</TableCell>
                      <TableCell>
                        {(ward.pendingActivities ?? 0) > 0 ? (
                          <span className="text-rose-600 font-semibold">{ward.pendingActivities}</span>
                        ) : (
                          <span className="text-muted-foreground">{ward.pendingActivities ?? 0}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ward-matrix" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {initialWards?.map((wardData, i) => {
              const volunteerCount = wardData.volunteerNames !== "Unassigned" ? wardData.volunteerNames.split(',').length : 0;
              return (
                <Card
                  key={wardData.id}
                  className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-t-4 group relative overflow-hidden"
                  style={{ borderTopColor: (wardData.probScore ?? 0) >= 80 ? '#10b981' : (wardData.probScore ?? 0) >= 60 ? '#f59e0b' : '#f43f5e' }}
                  onClick={() => setSelectedWard(wardData)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none" />
                  <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {wardData.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                          <MapPin className="h-3 w-3" /> {wardData.area}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={`font-bold text-sm bg-background/50 backdrop-blur-sm ${wardData.probColor}`}>
                        {wardData.probScore ?? 50}% Win
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                      <div className="bg-muted/30 p-2 rounded-md">
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Team Leader</p>
                        <p className="font-semibold truncate text-foreground mt-0.5">{wardData.assignedTL}</p>
                      </div>
                      <div className="bg-muted/30 p-2 rounded-md">
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Volunteers</p>
                        <p className="font-bold text-foreground mt-0.5">{volunteerCount}</p>
                      </div>
                      <div className="bg-muted/30 p-2 rounded-md">
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Total Voters</p>
                        <p className="font-bold text-foreground mt-0.5">{wardData.totalVoters}</p>
                      </div>
                      <div className="bg-muted/30 p-2 rounded-md">
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Activities</p>
                        <p className="font-bold text-foreground mt-0.5">{wardData.totalActivities ?? 0}</p>
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
