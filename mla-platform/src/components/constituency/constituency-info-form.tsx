"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <Card className="w-full max-w-4xl mx-auto shadow-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Constituency Information</CardTitle>
        <CardDescription>
          Add or update the details of the assembly constituency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assemblyConstituency">Assembly Constituency <span className="text-red-500">*</span></Label>
              <Input id="assemblyConstituency" placeholder="e.g. Koramangala" {...register("assemblyConstituency")} />
              {errors.assemblyConstituency && <p className="text-xs text-red-500">{errors.assemblyConstituency.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="constituencyNumber">Constituency Number <span className="text-red-500">*</span></Label>
              <Input id="constituencyNumber" placeholder="e.g. 175" {...register("constituencyNumber")} />
              {errors.constituencyNumber && <p className="text-xs text-red-500">{errors.constituencyNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District <span className="text-red-500">*</span></Label>
              <Input id="district" placeholder="e.g. Bangalore Urban" {...register("district")} />
              {errors.district && <p className="text-xs text-red-500">{errors.district.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
              <Input id="state" placeholder="e.g. Karnataka" {...register("state")} />
              {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
            </div>
          </div>

          <div className="border-t border-border/40 pt-6">
            <h3 className="text-lg font-semibold mb-4">Demographics & Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="population">Total Population</Label>
                <Input id="population" type="number" {...register("population", { valueAsNumber: true })} />
                {errors.population && <p className="text-xs text-red-500">{errors.population.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registeredVoters">Registered Voters</Label>
                <Input id="registeredVoters" type="number" {...register("registeredVoters", { valueAsNumber: true })} />
                {errors.registeredVoters && <p className="text-xs text-red-500">{errors.registeredVoters.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pollingStations">Polling Stations</Label>
                <Input id="pollingStations" type="number" {...register("pollingStations", { valueAsNumber: true })} />
                {errors.pollingStations && <p className="text-xs text-red-500">{errors.pollingStations.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="wards">Wards</Label>
                <Input id="wards" type="number" {...register("wards", { valueAsNumber: true })} />
                {errors.wards && <p className="text-xs text-red-500">{errors.wards.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="villages">Villages</Label>
                <Input id="villages" type="number" {...register("villages", { valueAsNumber: true })} />
                {errors.villages && <p className="text-xs text-red-500">{errors.villages.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="localities">Localities</Label>
                <Input id="localities" type="number" {...register("localities", { valueAsNumber: true })} />
                {errors.localities && <p className="text-xs text-red-500">{errors.localities.message}</p>}
              </div>

            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button type="button" variant="outline" className="mr-4" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? "Saving..." : (
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
