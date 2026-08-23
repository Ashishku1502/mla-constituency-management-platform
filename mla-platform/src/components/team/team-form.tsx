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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

const teamSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  areaId: z.string().min(1, "Please select an area"),
  pollingStationId: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamFormProps {
  role: "Team Leader" | "Volunteer" | "Area Manager";
  areas: { id: string; name: string }[];
  pollingStations?: { id: string; name: string; number: number }[];
}

export function TeamForm({ role, areas, pollingStations = [] }: TeamFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      areaId: "",
      pollingStationId: "",
    },
  });

  const areaValue = useWatch({ name: "areaId", control });
  const psValue = useWatch({ name: "pollingStationId", control });

  const onSubmit = async (data: TeamFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        role,
      };

      const response = await fetch("/api/team/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`${role} added successfully!`);
        setCredentials({ email: data.email, password: data.password });
      } else {
        toast.error(result.error || `Failed to add ${role}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    if (role === "Area Manager") {
      router.push("/team/area-managers");
    } else if (role === "Team Leader") {
      router.push("/team/team-leaders");
    } else {
      router.push("/team/volunteers");
    }
    router.refresh();
  };

  const copyCredentials = () => {
    if (credentials) {
      navigator.clipboard.writeText(`Login ID: ${credentials.email}\nPassword: ${credentials.password}`);
      toast.success("Credentials copied to clipboard");
    }
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Add {role}</CardTitle>
          <CardDescription>
            Register a new {role.toLowerCase()} and assign them to an area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input id="name" placeholder="John Doe" {...register("name")} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Login ID) <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number <span className="text-red-500">*</span></Label>
                <Input id="mobile" placeholder="9876543210" {...register("mobile")} />
                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password <span className="text-red-500">*</span></Label>
                <Input id="password" type="password" placeholder="Min 6 characters" {...register("password")} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
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

              {role === "Volunteer" && (
                <div className="space-y-2">
                  <Label htmlFor="pollingStationId">Polling Station (Optional)</Label>
                  <Select value={psValue} onValueChange={(val) => setValue("pollingStationId", val || "", { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Polling Station" />
                    </SelectTrigger>
                    <SelectContent>
                      {pollingStations.map(ps => <SelectItem key={ps.id} value={ps.id}>PS {ps.number} - {ps.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.pollingStationId && <p className="text-xs text-red-500">{errors.pollingStationId.message}</p>}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : `Add ${role}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={!!credentials} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Team Member Created</DialogTitle>
            <DialogDescription>
              Please share these credentials securely. The user will use these to log into their dashboard.
            </DialogDescription>
          </DialogHeader>
          {credentials && (
            <div className="bg-muted p-4 rounded-lg space-y-3 font-mono text-sm relative">
              <div>
                <span className="text-muted-foreground">Login ID:</span> 
                <span className="ml-2 font-bold">{credentials.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Password:</span> 
                <span className="ml-2 font-bold">{credentials.password}</span>
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={copyCredentials}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="default" onClick={handleCloseDialog} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
