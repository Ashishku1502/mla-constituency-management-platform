"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

const reportSchema = z.object({
  activityId: z.string().min(1, "Please select an activity"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  participantCount: z.number().min(0, "Must be a positive number"),
  notes: z.string().min(5, "Please provide some notes"),
  issuesRaised: z.string().optional(),
  followupRequired: z.boolean(),
  status: z.string().min(1, "Status is required"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const STATUSES = ["Submitted", "Verified", "Rejected"];

interface ReportFormProps {
  activities: { id: string; name: string }[];
}

export function ReportForm({ activities }: ReportFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      activityId: "",
      status: "Submitted",
      participantCount: 0,
      followupRequired: false,
    },
  });

  const activityValue = useWatch({ name: "activityId", control });
  const statusValue = useWatch({ name: "status", control });

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ground-reports/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Ground report submitted successfully!");
        router.push("/ground-reports");
      } else {
        toast.error(result.error || "Failed to submit report");
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
        <CardTitle className="text-2xl font-bold tracking-tight">Submit Ground Report</CardTitle>
        <CardDescription>
          Record your findings and observations from field activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="activityId">Activity <span className="text-red-500">*</span></Label>
              <Select value={activityValue} onValueChange={(val) => setValue("activityId", val || "", { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the associated activity" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map(act => <SelectItem key={act.id} value={act.id}>{act.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.activityId && <p className="text-xs text-red-500">{errors.activityId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="participantCount">Participants / Attendees <span className="text-red-500">*</span></Label>
              <Input id="participantCount" type="number" {...register("participantCount", { valueAsNumber: true })} />
              {errors.participantCount && <p className="text-xs text-red-500">{errors.participantCount.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="location">Location / Ward <span className="text-red-500">*</span></Label>
              <Input id="location" placeholder="Where did this take place?" {...register("location")} />
              {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Field Notes <span className="text-red-500">*</span></Label>
              <Textarea 
                id="notes" 
                placeholder="Describe what happened, citizen sentiment, etc..." 
                className="min-h-[100px]"
                {...register("notes")} 
              />
              {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="issuesRaised">Issues Raised (Optional)</Label>
              <Textarea 
                id="issuesRaised" 
                placeholder="Did citizens raise any specific complaints?" 
                className="min-h-[80px]"
                {...register("issuesRaised")} 
              />
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="status">Report Status <span className="text-red-500">*</span></Label>
              <Select value={statusValue} onValueChange={(val) => setValue("status", val || "", { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-1 flex items-center pt-8">
              <Checkbox 
                id="followupRequired" 
                onCheckedChange={(checked) => setValue("followupRequired", checked as boolean)} 
              />
              <Label htmlFor="followupRequired" className="ml-2 cursor-pointer font-medium">Requires Follow-up?</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
