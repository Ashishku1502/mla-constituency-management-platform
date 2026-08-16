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

const householdSchema = z.object({
  houseNumber: z.string().min(1, "House number is required"),
  headOfHousehold: z.string().min(2, "Name must be at least 2 characters"),
  contact: z.string().min(10, "Valid contact number is required"),
  address: z.string().min(5, "Address is required"),
  locality: z.string().min(2, "Locality is required"),
  pollingStationId: z.string().min(1, "Please select a polling station"),
  wardId: z.string().min(1, "Please select a ward"),
  familyMembersCount: z.number().min(1, "Must have at least 1 member"),
});

type HouseholdFormValues = z.infer<typeof householdSchema>;

interface HouseholdFormProps {
  pollingStations: { id: string; name: string; number: number }[];
  wards: { id: string; name: string }[];
}

export function HouseholdForm({ pollingStations, wards }: HouseholdFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<HouseholdFormValues>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      houseNumber: "",
      headOfHousehold: "",
      contact: "",
      address: "",
      locality: "",
      pollingStationId: "",
      wardId: "",
      familyMembersCount: 1,
    },
  });

  const pollingStationValue = useWatch({ name: "pollingStationId", control });
  const wardValue = useWatch({ name: "wardId", control });

  const onSubmit = async (data: HouseholdFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/records/households/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Household added successfully!");
        router.push("/records/households");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add household");
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
        <CardTitle className="text-2xl font-bold tracking-tight">Add New Household</CardTitle>
        <CardDescription>
          Register a new household in the constituency database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House / Door Number <span className="text-red-500">*</span></Label>
              <Input id="houseNumber" placeholder="e.g. 12/4A" {...register("houseNumber")} />
              {errors.houseNumber && <p className="text-xs text-red-500">{errors.houseNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headOfHousehold">Head of Household <span className="text-red-500">*</span></Label>
              <Input id="headOfHousehold" placeholder="Full name" {...register("headOfHousehold")} />
              {errors.headOfHousehold && <p className="text-xs text-red-500">{errors.headOfHousehold.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number <span className="text-red-500">*</span></Label>
              <Input id="contact" placeholder="Phone number" {...register("contact")} />
              {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyMembersCount">Total Family Members <span className="text-red-500">*</span></Label>
              <Input id="familyMembersCount" type="number" min="1" {...register("familyMembersCount", { valueAsNumber: true })} />
              {errors.familyMembersCount && <p className="text-xs text-red-500">{errors.familyMembersCount.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Full Street Address <span className="text-red-500">*</span></Label>
              <Input id="address" placeholder="Enter complete address" {...register("address")} />
              {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="locality">Locality / Colony <span className="text-red-500">*</span></Label>
              <Input id="locality" placeholder="Enter locality name" {...register("locality")} />
              {errors.locality && <p className="text-xs text-red-500">{errors.locality.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wardId">Ward / Village <span className="text-red-500">*</span></Label>
              <Select value={wardValue} onValueChange={(val) => setValue("wardId", val || "", { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.wardId && <p className="text-xs text-red-500">{errors.wardId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pollingStationId">Polling Station <span className="text-red-500">*</span></Label>
              <Select value={pollingStationValue} onValueChange={(val) => setValue("pollingStationId", val || "", { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select polling station" />
                </SelectTrigger>
                <SelectContent>
                  {pollingStations.map(ps => <SelectItem key={ps.id} value={ps.id}>PS {ps.number} - {ps.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.pollingStationId && <p className="text-xs text-red-500">{errors.pollingStationId.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Household"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
