"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddWardFormProps {
  areas: { id: string; name: string; code: string }[];
}

export function AddWardForm({ areas }: AddWardFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Ward",
    areaId: "",
    population: "",
    households: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/constituency/wards/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          areaId: formData.areaId,
          population: parseInt(formData.population) || 0,
          households: parseInt(formData.households) || 0,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Ward/Village has been added successfully.");
        router.push("/constituency/wards");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to add ward/village");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-xl">Add New Ward / Village</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
              <Input
                placeholder="e.g. Ward 12 or Oakville Village"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type <span className="text-destructive">*</span></label>
              <Select value={formData.type} onValueChange={(v) => handleChange("type", v || "Ward")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ward">Ward</SelectItem>
                  <SelectItem value="Village">Village</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Area <span className="text-destructive">*</span></label>
              <Select value={formData.areaId} onValueChange={(v) => handleChange("areaId", v || "")} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an Area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name} ({area.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Population <span className="text-destructive">*</span></label>
              <Input
                type="number"
                placeholder="0"
                required
                value={formData.population}
                onChange={(e) => handleChange("population", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Households <span className="text-destructive">*</span></label>
              <Input
                type="number"
                placeholder="0"
                required
                value={formData.households}
                onChange={(e) => handleChange("households", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.areaId}>
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Ward/Village
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
