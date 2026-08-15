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

const issueSchema = z.object({
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  description: z.string().min(10, "Please provide a more detailed description (min 10 chars)"),
  dateReported: z.string().min(1, "Date is required"),
});

type IssueFormValues = z.infer<typeof issueSchema>;

const CATEGORIES = ["Roads", "Water", "Electricity", "Drainage", "Sanitation", "Education", "Healthcare", "Transport", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export function IssueForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      category: "",
      priority: "Medium",
      dateReported: new Date().toISOString().split("T")[0],
    },
  });

  const categoryValue = useWatch({ name: "category", control });
  const priorityValue = useWatch({ name: "priority", control });

  const onSubmit = async (data: IssueFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/issues/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Issue reported successfully!");
        router.push("/issues");
      } else {
        toast.error(result.error || "Failed to report issue");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Report Issue</CardTitle>
        <CardDescription>
          File a new ground report or constituent issue for the operations team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            
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
              <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
              <Select value={priorityValue} onValueChange={(val) => setValue("priority", val as string, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="dateReported">Date Reported <span className="text-red-500">*</span></Label>
              <Input id="dateReported" type="date" {...register("dateReported")} />
              {errors.dateReported && <p className="text-xs text-red-500">{errors.dateReported.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Detailed Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Describe the issue, location details, and any constituent complaints..." 
                className="min-h-[160px] resize-y"
                {...register("description")} 
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Report Issue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
