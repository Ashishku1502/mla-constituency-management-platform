"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ClipboardList, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Area {
  id: string;
  name: string;
  pollingStations: {
    id: string;
    name: string;
    number: number;
  }[];
}

interface CreateBulkClientProps {
  areas: Area[];
}

export function CreateBulkClient({ areas }: CreateBulkClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [activityType, setActivityType] = useState("Survey");
  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  
  // Mapping of areaId -> { date, psIds }
  const [areaMappings, setAreaMappings] = useState<Record<string, { date: string; psIds: string[] }>>({});

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreaIds((prev) => {
      if (prev.includes(areaId)) {
        const next = prev.filter((id) => id !== areaId);
        const newMappings = { ...areaMappings };
        delete newMappings[areaId];
        setAreaMappings(newMappings);
        return next;
      }
      return [...prev, areaId];
    });
  };

  const handlePsToggle = (areaId: string, psId: string) => {
    setAreaMappings((prev) => {
      const current = prev[areaId] || { date: "", psIds: [] };
      const psIds = current.psIds.includes(psId)
        ? current.psIds.filter((id) => id !== psId)
        : [...current.psIds, psId];
      return { ...prev, [areaId]: { ...current, psIds } };
    });
  };

  const handleDateChange = (areaId: string, date: string) => {
    setAreaMappings((prev) => {
      const current = prev[areaId] || { date: "", psIds: [] };
      return { ...prev, [areaId]: { ...current, date } };
    });
  };

  const handleSubmit = async () => {
    // Validation
    const mappingsList = selectedAreaIds.map(areaId => ({
      areaId,
      pollingStations: areaMappings[areaId]?.psIds || [],
      date: areaMappings[areaId]?.date || ""
    }));

    if (mappingsList.some(m => m.pollingStations.length === 0 || !m.date)) {
      toast.error("Please select at least one Polling Station and a Date for all selected Areas.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/activities/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activityName,
          category: activityType,
          description,
          areaMappings: mappingsList,
        }),
      });

      if (!response.ok) throw new Error("Failed to create activities");

      const data = await response.json();
      toast.success(`Successfully created ${data.createdCount} activities and dispatched notifications!`);
      router.push("/activities");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create activities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAreas = areas.filter(a => selectedAreaIds.includes(a.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <PageHeader
        title="Create Bulk Activity"
        description="Schedule activities across multiple areas and polling stations"
        icon={ClipboardList}
      />

      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step >= i ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground text-muted-foreground'}`}>
              {i}
            </div>
            {i < 4 && (
              <div className={`flex-1 h-1 mx-2 ${step > i ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Activity Details</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Activity Type</Label>
                  <Select value={activityType} onValueChange={setActivityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Survey">Survey</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                      <SelectItem value="Verification">Verification</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Audit">Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Activity Name</Label>
                  <Input 
                    placeholder="e.g. Door to Door Campaign" 
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Provide details for the volunteers..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Areas</h3>
              <p className="text-sm text-muted-foreground mb-4">Choose the areas where this activity will take place.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
                {areas.map((area) => (
                  <div key={area.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => handleAreaToggle(area.id)}>
                    <Checkbox id={area.id} checked={selectedAreaIds.includes(area.id)} onCheckedChange={() => handleAreaToggle(area.id)} />
                    <Label htmlFor={area.id} className="flex-1 cursor-pointer font-medium">{area.name}</Label>
                    <span className="text-xs text-muted-foreground">{area.pollingStations.length} P/S</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Map Polling Stations & Dates</h3>
              <p className="text-sm text-muted-foreground mb-4">For each selected area, choose the target polling stations and the scheduled date.</p>
              
              <Accordion type="multiple" className="w-full" defaultValue={selectedAreaIds}>
                {selectedAreas.map((area) => (
                  <AccordionItem key={area.id} value={area.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{area.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {areaMappings[area.id]?.psIds?.length || 0} P/S Selected
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Date for {area.name}</Label>
                        <Input 
                          type="date" 
                          className="w-[200px]"
                          value={areaMappings[area.id]?.date || ""}
                          onChange={(e) => handleDateChange(area.id, e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Select Polling Stations</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            className="w-full mb-2 col-span-full"
                            onClick={() => {
                              const allPsIds = area.pollingStations.map(ps => ps.id);
                              setAreaMappings(prev => ({
                                ...prev,
                                [area.id]: { ...prev[area.id], psIds: allPsIds }
                              }));
                            }}
                          >
                            Select All
                          </Button>
                          {area.pollingStations.map((ps) => (
                            <div key={ps.id} className="flex items-center space-x-2 border p-2 rounded-md">
                              <Checkbox 
                                id={`ps-${ps.id}`} 
                                checked={areaMappings[area.id]?.psIds?.includes(ps.id) || false}
                                onCheckedChange={() => handlePsToggle(area.id, ps.id)}
                              />
                              <Label htmlFor={`ps-${ps.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {ps.number} - {ps.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-6 w-6" />
                <h3 className="text-lg font-medium">Review & Create</h3>
              </div>
              <Card>
                <CardHeader className="bg-muted/50 pb-4">
                  <CardTitle className="text-base">{activityType}: {activityName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <h4 className="font-medium text-sm">Deployment Plan</h4>
                  <div className="space-y-3">
                    {selectedAreas.map(area => {
                      const mapping = areaMappings[area.id];
                      return (
                        <div key={area.id} className="flex justify-between items-center text-sm border-b pb-2">
                          <div>
                            <p className="font-semibold">{area.name}</p>
                            <p className="text-muted-foreground">{mapping?.psIds.length || 0} Polling Stations</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{mapping?.date || "No date set"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-3 rounded-md text-sm mt-4">
                    <strong>Note:</strong> Notifications will be automatically sent to the Area Managers, Team Leaders, and Volunteers associated with the selected Polling Stations.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || isLoading}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        {step < 4 ? (
          <Button 
            onClick={handleNext}
            className="gap-2"
            disabled={
              (step === 1 && (!activityName || !activityType)) ||
              (step === 2 && selectedAreaIds.length === 0)
            }
          >
            Next Step <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
            {isLoading ? "Creating..." : "Create Bulk Activities"} 
            {!isLoading && <CheckCircle2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
