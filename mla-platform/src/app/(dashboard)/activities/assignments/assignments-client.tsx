"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserCheck, Users, Mail, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AssignmentsClient({ assignments, unassignedActivities, volunteers, wards }: { 
  assignments: any[], 
  unassignedActivities: any[], 
  volunteers: any[],
  wards: any[]
}) {
  const router = useRouter();
  const [assignDialogActivityId, setAssignDialogActivityId] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!assignDialogActivityId || !selectedWard || !selectedVolunteer) return;
    setIsAssigning(true);
    try {
      const res = await fetch(`/api/activities/${assignDialogActivityId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wardId: selectedWard, volunteerId: selectedVolunteer }),
      });
      if (res.ok) {
        toast.success("Activity assigned successfully");
        setAssignDialogActivityId(null);
        setSelectedWard("");
        setSelectedVolunteer("");
        router.refresh();
      } else {
        toast.error("Failed to assign activity");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Assignments"
        description="Monitor volunteer task assignments, statuses, and updates"
        icon={UserCheck}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Pending Tasks to Assign</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unassignedActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">No pending tasks to assign.</p>
          ) : (
            unassignedActivities.map(activity => (
              <Card key={activity.id} className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold line-clamp-1">{activity.name}</CardTitle>
                    <StatusBadge status={activity.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.category}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <p><span className="font-medium text-muted-foreground">Area:</span> {activity.area.name}</p>
                    <p><span className="font-medium text-muted-foreground">Date:</span> {activity.date}</p>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => setAssignDialogActivityId(activity.id)}>
                    <Plus className="h-4 w-4 mr-2" /> Assign to Volunteer
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold tracking-tight">Active Assignments</h3>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volunteer</TableHead>
                  <TableHead>Assigned Activity</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No assignments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((asg) => (
                    <TableRow key={asg.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-semibold text-sm">{asg.volunteer.user.name}</TableCell>
                      <TableCell className="text-sm">{asg.activity.name}</TableCell>
                      <TableCell className="text-sm">{asg.activity.area.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(asg.dateAssigned).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={asg.status} /></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!assignDialogActivityId} onOpenChange={(open) => !open && setAssignDialogActivityId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Activity to Volunteer</DialogTitle>
            <DialogDescription>
              Select a ward and a volunteer to assign this activity to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Ward</Label>
              <Select value={selectedWard} onValueChange={setSelectedWard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Ward" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign to Volunteer</Label>
              <Select value={selectedVolunteer} onValueChange={setSelectedVolunteer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Volunteer" />
                </SelectTrigger>
                <SelectContent>
                  {volunteers.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogActivityId(null)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={isAssigning || !selectedWard || !selectedVolunteer}>
              {isAssigning ? "Assigning..." : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
