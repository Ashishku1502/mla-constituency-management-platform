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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Vote, Save, Settings, Users } from "lucide-react";

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
    <div className="space-y-6">
      <PageHeader
        title="Add Polling Station"
        description="Register a new polling station and assign it to an area."
        icon={Vote}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" /> Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="number">Station Number <span className="text-red-500">*</span></Label>
                  <Input id="number" type="number" placeholder="e.g. 101" {...register("number", { valueAsNumber: true })} />
                  {errors.number && <p className="text-xs text-red-500">{errors.number.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Station Name <span className="text-red-500">*</span></Label>
                  <Input id="name" placeholder="Primary School Building" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Full Address <span className="text-red-500">*</span></Label>
                  <Input id="address" placeholder="Enter complete address" {...register("address")} />
                  {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="location">Geo-coordinates (Location)</Label>
                  <Input id="location" placeholder="e.g. 31.234, 76.543" {...register("location")} />
                  {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Assignments & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="areaId">Assigned Area <span className="text-red-500">*</span></Label>
                  <Select value={areaValue} onValueChange={(val) => setValue("areaId", val || "", { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.areaId && <p className="text-xs text-red-500">{errors.areaId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamLeaderId">Assigned Team Leader (Optional)</Label>
                  <Select value={tlValue} onValueChange={(val) => setValue("teamLeaderId", val || "", { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Team Leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamLeaders.map(tl => <SelectItem key={tl.id} value={tl.id}>{tl.user.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.teamLeaderId && <p className="text-xs text-red-500">{errors.teamLeaderId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voterCount">Number of Registered Voters</Label>
                  <Input id="voterCount" type="number" placeholder="0" {...register("voterCount", { valueAsNumber: true })} />
                  {errors.voterCount && <p className="text-xs text-red-500">{errors.voterCount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voterListStatus">Status of List Upload</Label>
                  <Select value={voterListStatusValue} onValueChange={(val) => setValue("voterListStatus", val || "Pending")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uploaded">Uploaded</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="status">Data Status</Label>
                  <Select value={statusValue} onValueChange={(val) => setValue("status", val || "Pending")}>
                    <SelectTrigger>
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

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Save className="h-4 w-4 text-primary" /> Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 flex flex-col">
              <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Add Station"}
              </Button>
              <Button variant="outline" type="button" onClick={() => router.back()} className="w-full">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
