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

const familyMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(0, "Age must be a positive number"),
  gender: z.string().min(1, "Gender is required"),
  relation: z.string().min(1, "Relation is required"),
  householdId: z.string().min(1, "Please select a household"),
  contact: z.string().optional(),
});

type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>;

const GENDERS = ["Male", "Female", "Other"];
const RELATIONS = ["Head", "Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"];

interface FamilyMemberFormProps {
  households: { id: string; houseNumber: string; headOfHousehold: string }[];
}

export function FamilyMemberForm({ households }: FamilyMemberFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FamilyMemberFormValues>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      relation: "",
      householdId: "",
      contact: "",
    },
  });

  const genderValue = useWatch({ name: "gender", control });
  const relationValue = useWatch({ name: "relation", control });
  const householdIdValue = useWatch({ name: "householdId", control });

  const onSubmit = async (data: FamilyMemberFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/records/family-members/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Family member added successfully!");
        router.push("/records/family-members");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add family member");
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
        <CardTitle className="text-2xl font-bold tracking-tight">Add Family Member</CardTitle>
        <CardDescription>
          Register a new family member under an existing household.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input id="name" placeholder="e.g. Gurpreet Singh" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
              <Input id="age" type="number" {...register("age", { valueAsNumber: true })} />
              {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select value={genderValue} onValueChange={(val) => setValue("gender", val as string, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relation">Relation to Head <span className="text-red-500">*</span></Label>
              <Select value={relationValue} onValueChange={(val) => setValue("relation", val as string, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Relation" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.relation && <p className="text-xs text-red-500">{errors.relation.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="householdId">Household <span className="text-red-500">*</span></Label>
              <Select value={householdIdValue} onValueChange={(val) => setValue("householdId", val as string, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Household" />
                </SelectTrigger>
                <SelectContent>
                  {households.map(hh => (
                    <SelectItem key={hh.id} value={hh.id}>
                      {hh.houseNumber} - {hh.headOfHousehold}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.householdId && <p className="text-xs text-red-500">{errors.householdId.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contact">Contact Number (Optional)</Label>
              <Input id="contact" placeholder="9876543210" {...register("contact")} />
              {errors.contact && <p className="text-xs text-red-500">{errors.contact.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Family Member"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
