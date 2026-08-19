"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldAlert, UserPlus, CheckCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function IssuesClient({ issues, teamMembers }: { issues: any[]; teamMembers: any[] }) {
  const router = useRouter();
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (type: "status" | "assignee") => {
    if (!selectedIssue) return;
    setIsUpdating(true);

    const payload: any = { id: selectedIssue.id };
    if (type === "status") payload.status = newStatus;
    if (type === "assignee") payload.assignedToId = newAssignee;

    try {
      const res = await fetch("/api/issues/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Issue ${type === "status" ? "status updated" : "assigned"} successfully`);
        router.refresh();
        setIsStatusDialogOpen(false);
        setIsAssignDialogOpen(false);
      } else {
        toast.error("Failed to update issue");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Date Reported</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                No issues found. Report a new issue to get started.
              </TableCell>
            </TableRow>
          ) : (
            issues.map((issue) => (
              <TableRow key={issue.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{issue.category}</TableCell>
                <TableCell>
                  <p className="text-sm line-clamp-2 max-w-xs" title={issue.description}>
                    {issue.description}
                  </p>
                </TableCell>
                <TableCell>{issue.reportedBy?.name || "Unknown"}</TableCell>
                <TableCell>{issue.area?.name || "Unknown"}</TableCell>
                <TableCell>
                  {issue.assignedTo ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                      {issue.assignedTo.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>{issue.dateReported}</TableCell>
                <TableCell>
                  <Badge
                    variant={issue.priority === 'Critical' ? 'destructive' : 'secondary'}
                    className={issue.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                  >
                    {issue.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={issue.status === 'Resolved' || issue.status === 'Closed' ? 'default' : 'outline'}>
                    {issue.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    {/* @ts-expect-error DropdownMenuTrigger asChild typing issue */}
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIssue(issue);
                          setNewStatus(issue.status);
                          setIsStatusDialogOpen(true);
                        }}
                      >
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIssue(issue);
                          setNewAssignee(issue.assignedToId || "unassigned");
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign Team Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Issue Status</DialogTitle>
            <DialogDescription>
              Change the resolution status for this issue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => handleUpdate("status")} disabled={isUpdating || newStatus === selectedIssue?.status}>
              {isUpdating ? "Saving..." : "Save Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Team Member</DialogTitle>
            <DialogDescription>
              Assign this issue to a Team Leader or Volunteer for resolution.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newAssignee} onValueChange={(v) => setNewAssignee(v || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Team Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                {teamMembers.map(tm => (
                  <SelectItem key={tm.id} value={tm.id}>
                    {tm.name} ({tm.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => handleUpdate("assignee")} disabled={isUpdating || newAssignee === (selectedIssue?.assignedToId || "unassigned")}>
              {isUpdating ? "Saving..." : "Assign Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
