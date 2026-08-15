"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const activitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  objective: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().min(0, "Capacity must be a positive number"),
  status: z.string().min(1, "Status is required"),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

const CATEGORIES = ["Survey", "Meeting", "Verification", "Event", "Audit"];
const STATUSES = ["Draft", "Scheduled", "In Progress"];

export function ActivityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      category: "",
      status: "Scheduled",
      capacity: 0,
    },
  });

  const categoryValue = useWatch({ name: "category", control });
  const statusValue = useWatch({ name: "status", control });

  const onSubmit = async (data: ActivityFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/activities/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Activity created successfully!");
        router.push("/activities");
      } else {
        toast.error(result.error || "Failed to create activity");
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
        <CardTitle className="text-2xl font-bold tracking-tight">Create Activity</CardTitle>
        <CardDescription>
          Schedule a new activity, event, or survey for the constituency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Activity Name <span className="text-red-500">*</span></Label>
              <Input id="name" placeholder="e.g. Door-to-Door Voter Survey" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select value={categoryValue} onValueChange={(val) => setValue("category", val as string, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
              <Select value={statusValue} onValueChange={(val) => setValue("status", val as string, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="capacity">Volunteer Capacity <span className="text-red-500">*</span></Label>
              <Input id="capacity" type="number" {...register("capacity", { valueAsNumber: true })} />
              {errors.capacity && <p className="text-xs text-red-500">{errors.capacity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
              <Input id="startTime" type="time" {...register("startTime")} />
              {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
              <Input id="endTime" type="time" {...register("endTime")} />
              {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="location">Location / Address <span className="text-red-500">*</span></Label>
              <Input id="location" placeholder="Full address or landmark" {...register("location")} />
              {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="objective">Objective</Label>
              <Input id="objective" placeholder="What is the main goal?" {...register("objective")} />
              {errors.objective && <p className="text-xs text-red-500">{errors.objective.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide additional details about the activity..." 
                className="min-h-[120px] resize-y"
                {...register("description")} 
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Activity"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
