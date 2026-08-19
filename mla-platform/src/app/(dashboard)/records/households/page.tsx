"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Home, Search, Plus, MapPin, Phone, Users, ChevronLeft, ChevronRight, Fingerprint, Activity, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HouseholdsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [households, setHouseholds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when status filter changes
  const handleStatusChange = (val: string | null) => {
    if (val) setStatusFilter(val);
    setPage(1);
  };

  useEffect(() => {
    async function fetchHouseholds() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          query: debouncedSearch,
          status: statusFilter,
          page: page.toString(),
          limit: "12"
        });
        const res = await fetch(`/api/records/households?${params}`);
        if (res.ok) {
          const data = await res.json();
          setHouseholds(data.households);
          setTotalPages(data.pagination.totalPages);
          setTotalRecords(data.pagination.total);
        }
      } catch (error) {
        console.error("Error fetching households:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHouseholds();
  }, [debouncedSearch, statusFilter, page]);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Household Records"
        description="Manage constituent households, family members, and verification statuses."
        icon={Home}
        action={{ label: "Add Household", onClick: () => router.push("/records/households/add"), icon: Plus }}
      />

      {/* Modern Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-card/60 backdrop-blur-md p-4 rounded-2xl border shadow-sm ring-1 ring-border/50">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, house number, or ID..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10 h-11 bg-background/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-all rounded-xl"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl bg-background/50 border-transparent focus:ring-primary focus:bg-background transition-all">
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            {totalRecords} Total
          </Badge>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-none shadow-sm overflow-hidden">
              <CardContent className="p-0 h-48 flex items-center justify-center bg-muted/20">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          ))
        ) : households.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-card/40 rounded-3xl border border-dashed shadow-sm backdrop-blur-sm">
            <div className="h-20 w-20 bg-muted/80 rounded-full flex items-center justify-center mb-5">
              <Home className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-2">No households found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              We couldn't find any household records matching your current filters.
            </p>
            <Button variant="outline" className="rounded-xl h-11 px-6 shadow-sm" onClick={() => { setSearch(""); setStatusFilter("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          households.map((hh) => (
            <Card key={hh.id} className="group overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ring-1 ring-border/50 hover:ring-primary/20 bg-card/60 backdrop-blur-sm flex flex-col">
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10 group-hover:scale-105 transition-transform">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">{hh.headOfHousehold}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Fingerprint className="h-3 w-3" />
                        <span className="font-mono">{hh.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={hh.verificationStatus} className="shadow-sm rounded-md" />
                </div>

                <div className="space-y-2.5 mt-auto bg-muted/40 p-3 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2.5 text-sm font-medium">
                    <Badge variant="outline" className="font-mono bg-background shadow-sm px-2 py-0.5 border-primary/20 text-primary">
                      {hh.houseNumber}
                    </Badge>
                    <span className="text-muted-foreground line-clamp-1 flex-1 text-xs" title={hh.address}>{hh.address}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5 bg-background/60 p-1.5 rounded-lg border border-border/40">
                      <Phone className="h-3.5 w-3.5 text-blue-500" />
                      <span className="truncate">{hh.contact}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-background/60 p-1.5 rounded-lg border border-border/40">
                      <Users className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{hh.familyMembers} Members</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-muted/30 border-t flex items-center justify-between text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{hh.pollingStation?.name || hh.pollingStationId} • {hh.ward?.name || hh.wardId}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" title={`Last updated: ${new Date(hh.lastUpdated).toLocaleString()}`}>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(hh.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl h-10 px-4 shadow-sm hover:bg-muted font-medium"
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" /> Prev
          </Button>
          <div className="bg-muted/50 px-4 py-2 rounded-xl text-sm font-semibold border border-border/50 shadow-sm">
            Page <span className="text-primary">{page}</span> of {totalPages}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-xl h-10 px-4 shadow-sm hover:bg-muted font-medium" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages || loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
