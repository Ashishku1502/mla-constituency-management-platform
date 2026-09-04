"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { MoreHorizontal, ShieldAlert, UserPlus, CheckCircle2, QrCode } from "lucide-react";
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
  const { t } = useTranslation();
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [selectedWardForQr, setSelectedWardForQr] = useState("");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  const generateQR = () => {
    if (!selectedWardForQr) return;
    const url = `${window.location.origin}/public/report-issue/${selectedWardForQr}`;
    setQrCodeData(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`);
  };

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
    <div className="space-y-6">
      <div className="flex justify-end mb-4 animate-stagger-1">
        <Button onClick={() => setIsQrDialogOpen(true)} variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-primary/10 hover:text-primary transition-all shadow-sm">
          <QrCode className="h-4 w-4" />
          {t("Generate Ward QR Code")}
        </Button>
      </div>
      <div className="card-premium glass-card animate-stagger-2 overflow-hidden">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Category")}</TableHead>
            <TableHead>{t("Description")}</TableHead>
            <TableHead>{t("Reported By")}</TableHead>
            <TableHead>{t("Area")}</TableHead>
            <TableHead>{t("Assigned To")}</TableHead>
            <TableHead>{t("Date Reported")}</TableHead>
            <TableHead>{t("Priority")}</TableHead>
            <TableHead>{t("Status")}</TableHead>
            <TableHead className="text-right">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl border-2 border-white/5 glow-emerald">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/empty-issues.jpg" alt="No Issues" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{t("All Clear!")}</h3>
                    <p className="text-sm">{t("No issues found. Report a new issue to get started.")}</p>
                  </div>
                </div>
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
                    <span className="text-muted-foreground text-xs">{t("Unassigned")}</span>
                  )}
                </TableCell>
                <TableCell>{issue.dateReported}</TableCell>
                <TableCell>
                  <Badge
                    variant={issue.priority === 'Critical' ? 'destructive' : 'secondary'}
                    className={issue.priority === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                  >
                    {t(issue.priority)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={issue.status === 'Resolved' || issue.status === 'Closed' ? 'default' : 'outline'}>
                    {t(issue.status)}
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
                      <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIssue(issue);
                          setNewStatus(issue.status);
                          setIsStatusDialogOpen(true);
                        }}
                      >
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        {t("Update Status")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedIssue(issue);
                          setNewAssignee(issue.assignedToId || "unassigned");
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t("Assign Team Member")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

      {/* Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Update Issue Status")}</DialogTitle>
            <DialogDescription>
              {t("Change the resolution status for this issue.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v || "")}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select Status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">{t("New")}</SelectItem>
                <SelectItem value="In Progress">{t("In Progress")}</SelectItem>
                <SelectItem value="Pending">{t("Pending")}</SelectItem>
                <SelectItem value="Resolved">{t("Resolved")}</SelectItem>
                <SelectItem value="Closed">{t("Closed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={() => handleUpdate("status")} disabled={isUpdating || newStatus === selectedIssue?.status}>
              {isUpdating ? "Saving..." : t("Save Status")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Assign Team Member")}</DialogTitle>
            <DialogDescription>
              {t("Assign this issue to a Team Leader or Volunteer for resolution.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newAssignee} onValueChange={(v) => setNewAssignee(v || "")}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select Team Member")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">{t("-- Unassigned --")}</SelectItem>
                {teamMembers.map(tm => (
                  <SelectItem key={tm.id} value={tm.id}>
                    {tm.name} ({tm.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>{t("Cancel")}</Button>
            <Button onClick={() => handleUpdate("assignee")} disabled={isUpdating || newAssignee === (selectedIssue?.assignedToId || "unassigned")}>
              {isUpdating ? "Saving..." : t("Assign Member")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Generate Issue Reporting QR Code")}</DialogTitle>
            <DialogDescription>
              {t("Select a ward to generate a unique QR code. Print and place this at key locations so the public can report issues directly.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Select value={selectedWardForQr} onValueChange={(v) => { setSelectedWardForQr(v ?? ""); setQrCodeData(null); }}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select Ward / Area")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="w1">Ward 1A - North Zone</SelectItem>
                <SelectItem value="w2">Ward 1B - North Zone</SelectItem>
                <SelectItem value="w3">Ward 2A - South Zone</SelectItem>
              </SelectContent>
            </Select>

            {qrCodeData && (
              <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg space-y-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeData} alt="Ward QR Code" className="w-48 h-48 rounded shadow-sm" />
                <p className="text-xs text-muted-foreground text-center">{t("Scan to report an issue for the selected ward.")}</p>
                <Button variant="outline" className="w-full" onClick={() => {
                  toast.success("QR Code saved for printing");
                  setIsQrDialogOpen(false);
                }}>
                  {t("Save for Printing")}
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            {!qrCodeData ? (
              <Button onClick={generateQR} disabled={!selectedWardForQr} className="w-full">
                {t("Generate QR")}
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setIsQrDialogOpen(false)} className="w-full">{t("Close")}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
