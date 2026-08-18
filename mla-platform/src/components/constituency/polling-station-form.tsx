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

const psSchema = z.object({
  number: z.number().min(1, "Number must be at least 1"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  areaId: z.string().min(1, "Please select an area"),
  teamLeaderId: z.string().optional(),
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
      areaId: "",
      teamLeaderId: "",
    },
  });

  const areaValue = useWatch({ name: "areaId", control });
  const tlValue = useWatch({ name: "teamLeaderId", control });

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
    <Card className="max-w-3xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Add Polling Station</CardTitle>
        <CardDescription>
          Register a new polling station and assign it to an area.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
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
              <Label htmlFor="teamLeaderId">Team Leader (Optional)</Label>
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
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Station"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
