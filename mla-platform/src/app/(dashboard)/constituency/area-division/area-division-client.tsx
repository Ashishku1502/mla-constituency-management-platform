"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { GitBranch, Plus, PieChart, Users, Save, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function AreaDivisionClient() {
  const [allocationMode, setAllocationMode] = useState("voters"); // "voters" or "population"
  
  // Mock data representing unallocated wards/villages
  const [unallocated, setUnallocated] = useState([
    { id: 1, name: "Ward 1A", voters: 1500, population: 3000 },
    { id: 2, name: "Ward 1B", voters: 2100, population: 4200 },
    { id: 3, name: "Ward 2A", voters: 1800, population: 3600 },
    { id: 4, name: "Village North", voters: 800, population: 1500 },
    { id: 5, name: "Village South", voters: 950, population: 1900 },
  ]);

  const [areas, setAreas] = useState([
    { id: "a1", name: "North Zone", targetVoters: 5000, wards: [] as any[] },
    { id: "a2", name: "South Zone", targetVoters: 5000, wards: [] as any[] }
  ]);

  const handleAllocate = (wardId: number, areaId: string) => {
    const ward = unallocated.find(w => w.id === wardId);
    if (!ward) return;

    setUnallocated(prev => prev.filter(w => w.id !== wardId));
    setAreas(prev => prev.map(a => {
      if (a.id === areaId) {
        return { ...a, wards: [...a.wards, ward] };
      }
      return a;
    }));
  };

  const handleRemove = (wardId: number, areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    if (!area) return;
    
    const ward = area.wards.find((w: any) => w.id === wardId);
    if (!ward) return;

    setAreas(prev => prev.map(a => {
      if (a.id === areaId) {
        return { ...a, wards: a.wards.filter((w: any) => w.id !== wardId) };
      }
      return a;
    }));
    setUnallocated(prev => [...prev, ward]);
  };

  const handleSave = () => {
    toast.success("Area division saved successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Constituency Area Division"
          description="Manually divide the constituency by allocating wards to areas based on population or voter count."
          icon={GitBranch}
        />
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Configuration
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Division Strategy</p>
              <p className="text-sm text-muted-foreground">Select the basis for allocating areas</p>
            </div>
          </div>
          <Select value={allocationMode} onValueChange={(val) => setAllocationMode(val ?? "voters")}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Basis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voters">By Number of Voters</SelectItem>
              <SelectItem value="population">By Population Percentage</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Unallocated List */}
        <Card className="lg:col-span-1 border-dashed bg-muted/10">
          <CardHeader>
            <CardTitle className="text-lg">Unallocated Wards / Villages</CardTitle>
            <CardDescription>{unallocated.length} remaining</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {unallocated.map(ward => (
              <div key={ward.id} className="p-3 bg-background rounded-lg border shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{ward.name}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {allocationMode === "voters" ? `${ward.voters} Voters` : `${ward.population} Pop.`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Select onValueChange={(val) => val && handleAllocate(ward.id, val)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Assign to Area..." />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            {unallocated.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                All wards have been allocated!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Defined Areas */}
        <div className="lg:col-span-2 space-y-6">
          {areas.map(area => {
            const currentTotal = area.wards.reduce((sum, w) => sum + (allocationMode === 'voters' ? w.voters : w.population), 0);
            const target = area.targetVoters; // in a real app, this would change based on mode
            const percent = Math.min(100, Math.round((currentTotal / target) * 100));

            return (
              <Card key={area.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{area.name}</CardTitle>
                    <CardDescription>
                      {area.wards.length} Wards • {currentTotal} / {target} {allocationMode}
                    </CardDescription>
                  </div>
                  <div className="w-32 space-y-1 text-right">
                    <span className="text-xs font-medium">{percent}% of target</span>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${percent > 100 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-muted/10 grid sm:grid-cols-2 gap-3 min-h-[100px]">
                  {area.wards.map((ward: any) => (
                    <div key={ward.id} className="p-3 bg-background rounded-lg border shadow-sm flex justify-between items-center group">
                      <div>
                        <p className="font-medium text-sm">{ward.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {allocationMode === 'voters' ? `${ward.voters} Voters` : `${ward.population} Pop.`}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemove(ward.id, area.id)}
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                  {area.wards.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground py-6">
                      <LayoutGrid className="h-8 w-8 mb-2 opacity-20" />
                      <span className="text-sm">No wards allocated to this area yet</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Button variant="outline" className="w-full border-dashed gap-2" onClick={() => {
            const newId = `a${areas.length + 1}`;
            setAreas([...areas, { id: newId, name: `New Area ${areas.length + 1}`, targetVoters: 5000, wards: [] }]);
          }}>
            <Plus className="h-4 w-4" /> Add New Area
          </Button>
        </div>
      </div>
    </div>
  );
}
