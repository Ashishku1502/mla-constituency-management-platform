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
import { MapPin, Users, Calendar, ClipboardList, Activity, MessageSquare, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const FieldIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 peer-focus:text-primary transition-colors">
    <Icon className="h-4 w-4" />
  </div>
);

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
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 overflow-hidden rounded-2xl">
        <div className="h-3 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
        
        <CardHeader className="pb-8 pt-8 px-8 sm:px-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Ground Report
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Record findings and citizen sentiment from your field activities.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-8 sm:px-10 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            {/* Section 1: Event Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold tracking-tight">Event Details</h3>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="activityId" className="font-medium">Associated Activity <span className="text-red-500">*</span></Label>
                  <Select value={activityValue} onValueChange={(val) => setValue("activityId", val || "", { shouldValidate: true })}>
                    <SelectTrigger className={cn("h-12 rounded-xl bg-background shadow-sm border-border/60 transition-all focus:ring-2", errors.activityId && "ring-2 ring-red-500/20 border-red-500")}>
                      <SelectValue placeholder="Select the associated activity" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {activities.map(act => <SelectItem key={act.id} value={act.id} className="rounded-lg my-1">{act.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.activityId && <p className="text-xs text-red-500 font-medium mt-1">{errors.activityId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="font-medium">Date <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input id="date" type="date" className={cn("pl-10 h-12 rounded-xl bg-background shadow-sm peer transition-all focus:ring-2", errors.date && "ring-2 ring-red-500/20 border-red-500")} {...register("date")} />
                    <FieldIcon icon={Calendar} />
                  </div>
                  {errors.date && <p className="text-xs text-red-500 font-medium mt-1">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participantCount" className="font-medium">Participants / Attendees <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input id="participantCount" type="number" className={cn("pl-10 h-12 rounded-xl bg-background shadow-sm peer transition-all focus:ring-2", errors.participantCount && "ring-2 ring-red-500/20 border-red-500")} {...register("participantCount", { valueAsNumber: true })} />
                    <FieldIcon icon={Users} />
                  </div>
                  {errors.participantCount && <p className="text-xs text-red-500 font-medium mt-1">{errors.participantCount.message}</p>}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="location" className="font-medium">Location / Ward <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input id="location" placeholder="e.g. Community Center, Ward 5" className={cn("pl-10 h-12 rounded-xl bg-background shadow-sm peer transition-all focus:ring-2", errors.location && "ring-2 ring-red-500/20 border-red-500")} {...register("location")} />
                    <FieldIcon icon={MapPin} />
                  </div>
                  {errors.location && <p className="text-xs text-red-500 font-medium mt-1">{errors.location.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Observations */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold tracking-tight">Observations & Feedback</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-medium">Field Notes & Citizen Sentiment <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Describe what happened, general mood, key takeaways..." 
                    className={cn("min-h-[120px] resize-y rounded-xl bg-background shadow-sm p-4 transition-all focus:ring-2", errors.notes && "ring-2 ring-red-500/20 border-red-500")}
                    {...register("notes")} 
                  />
                  {errors.notes && <p className="text-xs text-red-500 font-medium mt-1">{errors.notes.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuesRaised" className="font-medium flex items-center gap-2">
                    Issues Raised
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full">Optional</span>
                  </Label>
                  <Textarea 
                    id="issuesRaised" 
                    placeholder="Did citizens raise any specific complaints or requests?" 
                    className="min-h-[100px] resize-y rounded-xl bg-background shadow-sm p-4 transition-all focus:ring-2"
                    {...register("issuesRaised")} 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Status & Resolution */}
            <div className="space-y-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
              <div className="grid gap-6 sm:grid-cols-2 items-center">
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-medium">Report Status <span className="text-red-500">*</span></Label>
                  <Select value={statusValue} onValueChange={(val) => setValue("status", val || "", { shouldValidate: true })}>
                    <SelectTrigger className="h-12 rounded-xl bg-background shadow-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {STATUSES.map(s => <SelectItem key={s} value={s} className="rounded-lg my-1">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-xs text-red-500 font-medium mt-1">{errors.status.message}</p>}
                </div>

                <div className="flex items-center space-x-3 pt-6 sm:pl-4">
                  <Checkbox 
                    id="followupRequired" 
                    className="h-6 w-6 rounded-md data-[state=checked]:bg-amber-500 data-[state=checked]:text-white border-muted-foreground/30"
                    onCheckedChange={(checked) => setValue("followupRequired", checked as boolean)} 
                  />
                  <div className="space-y-1">
                    <Label htmlFor="followupRequired" className="text-base font-semibold cursor-pointer">Requires Follow-up</Label>
                    <p className="text-xs text-muted-foreground">Flag this report for further action</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
              <Button variant="ghost" type="button" onClick={() => router.back()} className="h-12 px-6 rounded-xl hover:bg-muted font-medium">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all gap-2 text-base font-semibold">
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
