"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Map, MapPin, Hash, Building2, Users, FileSignature, MapPinned, LayoutGrid, Home, Tent, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const constituencyInfoSchema = z.object({
  assemblyConstituency: z.string().min(2, "Constituency name is required"),
  constituencyNumber: z.string().min(1, "Constituency number is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  population: z.number().min(0, "Must be a positive number"),
  registeredVoters: z.number().min(0, "Must be a positive number"),
  pollingStations: z.number().min(0, "Must be a positive number"),
  wards: z.number().min(0, "Must be a positive number"),
  villages: z.number().min(0, "Must be a positive number"),
  localities: z.number().min(0, "Must be a positive number"),
});

type ConstituencyInfoFormValues = z.infer<typeof constituencyInfoSchema>;

export function ConstituencyInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ConstituencyInfoFormValues>({
    resolver: zodResolver(constituencyInfoSchema),
    defaultValues: {
      assemblyConstituency: "",
      constituencyNumber: "",
      district: "",
      state: "",
      population: 0,
      registeredVoters: 0,
      pollingStations: 0,
      wards: 0,
      villages: 0,
      localities: 0,
    },
  });

  const onSubmit = async (data: ConstituencyInfoFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/constituency/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Constituency information saved successfully!");
      } else {
        toast.error(result.error || "Failed to save constituency info");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl border-border/20 bg-gradient-to-b from-card/80 to-card backdrop-blur-xl">
      <CardHeader className="pb-8 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Constituency Information
            </CardTitle>
            <CardDescription className="text-base mt-1.5">
              Define the geographical, administrative, and demographic details of your constituency.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8 px-6 md:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          
          {/* Basic Info Section */}
          <section 
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300",
              activeSection === 'basic' ? "border-primary/50 shadow-md bg-primary/5" : "border-border/40 hover:border-border"
            )}
            onFocus={() => setActiveSection('basic')}
            onClick={() => setActiveSection('basic')}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Core Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="assemblyConstituency" className="text-sm font-medium">Assembly Constituency <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <MapPinned className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="assemblyConstituency" placeholder="e.g. Koramangala" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("assemblyConstituency")} />
                </div>
                {errors.assemblyConstituency && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.assemblyConstituency.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="constituencyNumber" className="text-sm font-medium">Constituency Number <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="constituencyNumber" placeholder="e.g. 175" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("constituencyNumber")} />
                </div>
                {errors.constituencyNumber && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.constituencyNumber.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="district" className="text-sm font-medium">District <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="district" placeholder="e.g. Bangalore Urban" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("district")} />
                </div>
                {errors.district && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.district.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="state" className="text-sm font-medium">State <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <LocateFixed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="state" placeholder="e.g. Karnataka" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("state")} />
                </div>
                {errors.state && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.state.message}</p>}
              </div>
            </div>
          </section>

          {/* Demographics & Logistics Section */}
          <section 
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300",
              activeSection === 'demographics' ? "border-primary/50 shadow-md bg-primary/5" : "border-border/40 hover:border-border"
            )}
            onFocus={() => setActiveSection('demographics')}
            onClick={() => setActiveSection('demographics')}
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Demographics & Infrastructure
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="population" className="text-sm font-medium">Total Population</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="population" type="number" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("population", { valueAsNumber: true })} />
                </div>
                {errors.population && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.population.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="registeredVoters" className="text-sm font-medium">Registered Voters</Label>
                <div className="relative">
                  <FileSignature className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="registeredVoters" type="number" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("registeredVoters", { valueAsNumber: true })} />
                </div>
                {errors.registeredVoters && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.registeredVoters.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="pollingStations" className="text-sm font-medium">Polling Stations</Label>
                <div className="relative">
                  <LayoutGrid className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="pollingStations" type="number" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("pollingStations", { valueAsNumber: true })} />
                </div>
                {errors.pollingStations && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.pollingStations.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="wards" className="text-sm font-medium">Number of Wards</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="wards" type="number" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("wards", { valueAsNumber: true })} />
                </div>
                {errors.wards && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.wards.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="villages" className="text-sm font-medium">Villages</Label>
                <div className="relative">
                  <Tent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="villages" type="number" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("villages", { valueAsNumber: true })} />
                </div>
                {errors.villages && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.villages.message}</p>}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="localities" className="text-sm font-medium">Localities / Areas</Label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="localities" type="number" className="pl-10 transition-all focus-visible:ring-primary/50" {...register("localities", { valueAsNumber: true })} />
                </div>
                {errors.localities && <p className="text-xs text-destructive animate-in slide-in-from-top-1">{errors.localities.message}</p>}
              </div>
            </div>
          </section>
          
          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/40 sticky bottom-0 bg-card/95 backdrop-blur py-4 z-10 rounded-b-xl -mx-6 px-6 md:-mx-10 md:px-10">
            {isDirty && (
              <span className="text-sm text-muted-foreground animate-pulse mr-auto hidden sm:inline-block">
                You have unsaved changes
              </span>
            )}
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => reset()}
              className="hover:bg-muted/50"
            >
              Reset Changes
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className={cn(
                "min-w-[140px] shadow-lg transition-all duration-300",
                isSubmitting ? "opacity-80" : "hover:-translate-y-0.5 hover:shadow-primary/25"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </div>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Save Details
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
