"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { PageHeader } from "@/components/shared/page-header";
import { Vote, Save, Settings, Users, Hash, Type, MapPin, Navigation, UserCog, Users2, FileCheck2, ActivitySquare } from "lucide-react";

const psSchema = z.object({
  number: z.number().min(1, "Number must be at least 1"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  location: z.string().optional(),
  areaId: z.string().min(1, "Please select an area"),
  teamLeaderId: z.string().optional(),
  voterCount: z.number().min(0, "Must be a positive number").optional(),
  voterListStatus: z.string().optional(),
  status: z.string().optional(),
});

type PSFormValues = z.infer<typeof psSchema>;

interface PollingStationFormProps {
  areas: { id: string; name: string }[];
  teamLeaders: { id: string; user: { name: string } }[];
}

export function PollingStationForm({ areas, teamLeaders }: PollingStationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PSFormValues>({
    resolver: zodResolver(psSchema),
    defaultValues: {
      number: undefined,
      name: "",
      address: "",
      location: "",
      areaId: "",
      teamLeaderId: "",
      voterCount: undefined,
      voterListStatus: "Pending",
      status: "Pending",
    },
  });

  const areaValue = useWatch({ name: "areaId", control });
  const tlValue = useWatch({ name: "teamLeaderId", control });
  const voterListStatusValue = useWatch({ name: "voterListStatus", control });
  const statusValue = useWatch({ name: "status", control });

  const onSubmit = async (data: PSFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/constituency/polling-stations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Polling Station added successfully!");
        router.push("/constituency/polling-stations");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add polling station");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/40 p-8 shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <Vote className="w-64 h-64 text-primary" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Add Polling Station
          </h1>
          <p className="text-lg text-muted-foreground mt-2 leading-relaxed">
            Register a new polling station and assign it to an area.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Basic Details */}
          <Card 
            className={cn(
              "shadow-lg border-border/20 transition-all duration-300 bg-gradient-to-b from-card/80 to-card backdrop-blur-xl",
              activeSection === 'basic' ? "ring-1 ring-primary/50 shadow-primary/5" : "hover:border-border/40"
            )}
            onFocus={() => setActiveSection('basic')}
            onClick={() => setActiveSection('basic')}
          >
            <CardHeader className="pb-6 border-b border-border/40 bg-muted/10 rounded-t-xl">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Settings className="h-5 w-5" />
                </div>
                Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                
                <div className="space-y-2.5">
                  <Label htmlFor="number" className="font-medium">Station Number <span className="text-destructive">*</span></Label>
                  <div className="relative group">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input id="number" type="number" placeholder="e.g. 101" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("number", { valueAsNumber: true })} />
                  </div>
                  {errors.number && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.number.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="name" className="font-medium">Station Name <span className="text-destructive">*</span></Label>
                  <div className="relative group">
                    <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input id="name" placeholder="Primary School Building" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("name")} />
                  </div>
                  {errors.name && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2.5 sm:col-span-2">
                  <Label htmlFor="address" className="font-medium">Full Address <span className="text-destructive">*</span></Label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input id="address" placeholder="Enter complete address" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("address")} />
                  </div>
                  {errors.address && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.address.message}</p>}
                </div>

                <div className="space-y-2.5 sm:col-span-2">
                  <Label htmlFor="location" className="font-medium">Geo-coordinates (Location)</Label>
                  <div className="relative group">
                    <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input id="location" placeholder="e.g. 31.234, 76.543" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("location")} />
                  </div>
                  {errors.location && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.location.message}</p>}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Assignments & Status */}
          <Card 
            className={cn(
              "shadow-lg border-border/20 transition-all duration-300 bg-gradient-to-b from-card/80 to-card backdrop-blur-xl",
              activeSection === 'assignments' ? "ring-1 ring-primary/50 shadow-primary/5" : "hover:border-border/40"
            )}
            onFocus={() => setActiveSection('assignments')}
            onClick={() => setActiveSection('assignments')}
          >
            <CardHeader className="pb-6 border-b border-border/40 bg-muted/10 rounded-t-xl">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <Users className="h-5 w-5" />
                </div>
                Assignments & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                
                <div className="space-y-2.5">
                  <Label htmlFor="areaId" className="font-medium flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Assigned Area <span className="text-destructive">*</span>
                  </Label>
                  <Select value={areaValue} onValueChange={(val) => setValue("areaId", val || "", { shouldValidate: true })}>
                    <SelectTrigger className="transition-all focus:ring-primary/50">
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.areaId && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.areaId.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="teamLeaderId" className="font-medium flex items-center gap-2">
                    <UserCog className="h-3.5 w-3.5 text-muted-foreground" /> Team Leader (Optional)
                  </Label>
                  <Select value={tlValue} onValueChange={(val) => setValue("teamLeaderId", val || "", { shouldValidate: true })}>
                    <SelectTrigger className="transition-all focus:ring-primary/50">
                      <SelectValue placeholder="Select Team Leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamLeaders.map(tl => <SelectItem key={tl.id} value={tl.id}>{tl.user.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.teamLeaderId && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.teamLeaderId.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="voterCount" className="font-medium">Registered Voters</Label>
                  <div className="relative group">
                    <Users2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input id="voterCount" type="number" placeholder="0" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("voterCount", { valueAsNumber: true })} />
                  </div>
                  {errors.voterCount && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.voterCount.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="voterListStatus" className="font-medium flex items-center gap-2">
                    <FileCheck2 className="h-3.5 w-3.5 text-muted-foreground" /> Status of List Upload
                  </Label>
                  <Select value={voterListStatusValue} onValueChange={(val) => setValue("voterListStatus", val || "Pending")}>
                    <SelectTrigger className="transition-all focus:ring-primary/50">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uploaded">Uploaded</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5 sm:col-span-2">
                  <Label htmlFor="status" className="font-medium flex items-center gap-2">
                    <ActivitySquare className="h-3.5 w-3.5 text-muted-foreground" /> Data Status
                  </Label>
                  <Select value={statusValue} onValueChange={(val) => setValue("status", val || "Pending")}>
                    <SelectTrigger className="transition-all focus:ring-primary/50">
                      <SelectValue placeholder="Select Data Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Validated">Validated</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-6">
            <Card className="shadow-xl border-border/20 bg-card/95 backdrop-blur-xl overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-primary/80 to-primary/40" />
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Save className="h-5 w-5" />
                  </div>
                  Publish actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 flex flex-col pt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Double check all station identifiers and assignments before saving this record.
                </p>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={cn(
                    "w-full gap-2 shadow-md transition-all duration-300",
                    isSubmitting ? "opacity-80" : "hover:-translate-y-0.5 hover:shadow-primary/25"
                  )}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Add Station
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => router.back()} 
                  className="w-full hover:bg-muted/50 transition-colors"
                  size="lg"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
