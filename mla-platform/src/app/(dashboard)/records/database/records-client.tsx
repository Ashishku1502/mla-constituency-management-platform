"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, User, Phone, MapPin, Inbox } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Camera, Send } from "lucide-react";
import { STATUS_COLORS } from "@/lib/constants";
import { useTranslation } from "@/hooks/use-translation";

export function RecordsClient({ initialRecords, pagination: initialPagination }: { initialRecords: any[], pagination: any }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [records, setRecords] = useState(initialRecords);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.total);
  
  // Sentiment Form State
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [sentiment, setSentiment] = useState("");
  const [comments, setComments] = useState("");
  const [photoRef, setPhotoRef] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setSentiment(record.sentiment || "");
    setComments(record.comments || "");
  };

  const handleSentimentSubmit = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      // API call to update sentiment
      const res = await fetch(`/api/records/${selectedRecord.id}/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentiment, comments })
      });
      if (res.ok) {
        setRecords(prev => prev.map(r => r.id === selectedRecord.id ? { ...r, sentiment, comments } : r));
        setSelectedRecord(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when status filter changes
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  useEffect(() => {
    // Skip fetching on initial render since we have initialData
    if (page === initialPagination.page && debouncedSearch === "" && statusFilter === "all" && records.length > 0) {
      return;
    }

    async function fetchRecords() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          query: debouncedSearch,
          status: statusFilter,
          page: page.toString(),
          limit: "10"
        });
        const res = await fetch(`/api/records?${params}`);
        if (res.ok) {
          const data = await res.json();
          setRecords(data.records);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total);
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, [debouncedSearch, statusFilter, page, initialPagination.page, records.length]);

  return (
    <div className="space-y-4">
      <div className="card-premium glass-card animate-stagger-4 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-card/40">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t("Search by voter name or ID...")}
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-10 bg-background/50 backdrop-blur-sm border-white/10 focus-visible:ring-primary/40 focus-visible:border-primary/40 h-10 shadow-inner" 
              />
            </div>
            <Select value={statusFilter} onValueChange={(val) => handleStatusChange(val || "all")}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50 backdrop-blur-sm border-white/10 h-10 shadow-inner">
                <SelectValue placeholder={t("All Status")} />
              </SelectTrigger>
              <SelectContent className="glass-card shadow-2xl">
                <SelectItem value="all">{t("All Status")}</SelectItem>
                <SelectItem value="Validated">{t("Validated")}</SelectItem>
                <SelectItem value="Pending">{t("Pending")}</SelectItem>
                <SelectItem value="Error">{t("Error")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 px-1">
        <p>{t("Showing")} {records.length} {t("of")} {totalItems} {t("records")}</p>
      </div>

      <div className="card-premium glass-card animate-stagger-5 overflow-hidden">
        <div className="overflow-x-auto bg-card/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Voter Details")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("Contact")}</TableHead>
                <TableHead className="hidden lg:table-cell">{t("Address")}</TableHead>
                <TableHead>{t("Polling Station")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {t("Loading records...")}
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                      <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl border-2 border-white/5 glow-blue">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/empty-records.jpg" alt="No Records" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{t("Database Empty")}</h3>
                        <p className="text-sm">{t("No records found matching your filters.")}</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow 
                    key={record.id} 
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(record)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {record.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="font-mono text-[10px] bg-background">
                            {record.voterId}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.mobile ? (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {record.mobile}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">{t("No mobile")}</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate" title={record.address}>{record.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium truncate max-w-[150px]" title={record.pollingStation?.name}>
                          {record.pollingStation?.name || t("Unassigned")}
                        </p>
                        {record.pollingStation?.number && (
                          <p className="text-xs text-muted-foreground">PS {record.pollingStation.number}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant="secondary" 
                          className={`text-[10px] font-medium border-0 w-fit ${STATUS_COLORS[record.validationStatus] || "bg-gray-100 text-gray-800"}`}
                        >
                          {t(record.validationStatus)}
                        </Badge>
                        {record.sentiment && (
                          <Badge variant="outline" className={`text-[10px] font-bold w-fit ${record.sentiment === 'S' ? 'text-emerald-500 border-emerald-200' : record.sentiment === 'A' ? 'text-rose-500 border-rose-200' : 'text-amber-500 border-amber-200'}`}>
                            Sentiment: {record.sentiment}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 pb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage((p: number) => Math.max(1, p - 1))} 
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> {t("Previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("Page")} {page} {t("of")} {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages || loading}
          >
            {t("Next")} <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Sentiment Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-[425px] glass-card">
          <DialogHeader>
            <DialogTitle className="text-xl">Voter Ground Report</DialogTitle>
            <DialogDescription>
              Mark sentiment and add ground notes for <span className="font-semibold text-foreground">{selectedRecord?.name}</span> (EPIC: {selectedRecord?.voterId}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Voter Sentiment</Label>
              <RadioGroup value={sentiment} onValueChange={setSentiment} className="flex gap-4">
                <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 hover:bg-emerald-50 cursor-pointer transition-colors border-emerald-100 dark:hover:bg-emerald-950/30">
                  <RadioGroupItem value="S" id="s-supp" className="text-emerald-500 border-emerald-500" />
                  <Label htmlFor="s-supp" className="font-semibold text-emerald-600 cursor-pointer">Supportive (S)</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 hover:bg-amber-50 cursor-pointer transition-colors border-amber-100 dark:hover:bg-amber-950/30">
                  <RadioGroupItem value="N" id="n-neut" className="text-amber-500 border-amber-500" />
                  <Label htmlFor="n-neut" className="font-semibold text-amber-600 cursor-pointer">Neutral (N)</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 hover:bg-rose-50 cursor-pointer transition-colors border-rose-100 dark:hover:bg-rose-950/30">
                  <RadioGroupItem value="A" id="a-anti" className="text-rose-500 border-rose-500" />
                  <Label htmlFor="a-anti" className="font-semibold text-rose-600 cursor-pointer">Anti (A)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="comments" className="text-sm font-semibold">Comments / Notes</Label>
              <Textarea 
                id="comments" 
                placeholder="Enter any specific requests, issues raised, or general notes..." 
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="resize-none h-24 bg-background/50 border-white/10 shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Photo Proof (Optional)</Label>
              <div className="border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                <Camera className="h-8 w-8 text-muted-foreground/60" />
                <span className="text-sm text-muted-foreground">Tap to take photo or upload</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>Cancel</Button>
            <Button onClick={handleSentimentSubmit} disabled={isSubmitting || !sentiment} className="gap-2 shadow-md">
              <Send className="h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
