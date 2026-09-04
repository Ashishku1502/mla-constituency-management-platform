"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Building2, Save, Map as MapIcon, Users, Settings } from "lucide-react";
import AreaDrawMapDynamic from "@/components/map/AreaDrawMapDynamic";

interface AddAreaFormProps {
  constituencyId: string;
  managers: { id: string; name: string }[];
  pollingStations: { id: string; name: string; number: number; areaId: string }[];
  wards: { id: string; name: string; type: string }[];
}

export function AddAreaForm({ constituencyId, managers, pollingStations, wards }: AddAreaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    population: "",
    registeredVoters: "",
    status: "Active",
    description: "",
    managerId: "unassigned"
  });

  const [geographicBoundary, setGeographicBoundary] = useState("");
  // Additional state for multiple selection of Polling Stations and Wards could be added here
  // For simplicity, we just submit the arrays empty or with selected IDs if implemented

  const generateCode = () => {
    if (!formData.name) {
      toast.error("Please enter an Area Name first");
      return;
    }
    const prefix = formData.name.substring(0, 3).toUpperCase();
    const num = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, code: `${prefix}-${num}` }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Area Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        code: formData.code || undefined, // Allow backend to generate if empty
        population: parseInt(formData.population || "0", 10),
        registeredVoters: parseInt(formData.registeredVoters || "0", 10),
        status: formData.status,
        description: formData.description,
        constituencyId,
        geographicBoundary,
        managerId: formData.managerId === "unassigned" ? undefined : formData.managerId,
        pollingStationIds: [], // Placeholder for actual selection logic
        wardIds: [], // Placeholder for actual selection logic
      };

      const res = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success("Area created successfully!");
        router.push("/constituency/areas");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to create area");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Area"
        description="Define a new geographical area within the constituency, draw boundaries, and assign records."
        icon={Building2}
      />

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" /> Basic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Area Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Muzaffarnagar North" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="code">Area Code</Label>
                <div className="flex gap-2">
                  <Input 
                    id="code" 
                    placeholder="Auto-generated if empty" 
                    value={formData.code}
                    onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  />
                  <Button type="button" variant="outline" onClick={generateCode}>Generate</Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData(prev => ({ ...prev, status: v || "Active" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Additional context about this area..."
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Demographics & Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="population">Estimated Population</Label>
                <Input 
                  id="population" 
                  type="number" 
                  min="0"
                  value={formData.population}
                  onChange={e => setFormData(prev => ({ ...prev, population: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="voters">Registered Voters</Label>
                <Input 
                  id="voters" 
                  type="number" 
                  min="0"
                  value={formData.registeredVoters}
                  onChange={e => setFormData(prev => ({ ...prev, registeredVoters: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="manager">Assigned Area Manager</Label>
                <Select value={formData.managerId} onValueChange={v => setFormData(prev => ({ ...prev, managerId: v || "unassigned" }))}>
                  <SelectTrigger><SelectValue placeholder="Select Area Manager" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned (Assign Later)</SelectItem>
                    {managers.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map and Boundaries */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-3 border-b shrink-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapIcon className="h-4 w-4 text-primary" /> Geographic Boundary
                </CardTitle>
                <CardDescription className="mt-1">
                  Use the map tools to draw the exact boundaries for this Area.
                </CardDescription>
              </div>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Area"}
              </Button>
            </CardHeader>
            <CardContent className="p-4 flex-1 min-h-[500px]">
              <AreaDrawMapDynamic 
                onBoundaryDrawn={(geoJson) => setGeographicBoundary(geoJson)} 
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
