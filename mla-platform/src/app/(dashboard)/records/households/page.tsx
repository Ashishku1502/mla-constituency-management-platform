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
import { Home, Search, Plus, MapPin, Phone, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

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
    <div className="space-y-6">
      <PageHeader
        title="Households"
        description="Manage household records, family members, and verification"
        icon={Home}
        action={{ label: "Add Household", onClick: () => router.push("/records/households/add"), icon: Plus }}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, house number, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Verification" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 mb-2">
        <p>Showing {households.length} of {totalRecords} households</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4 h-32 flex items-center justify-center"><Skeleton className="h-full w-full" /></CardContent></Card>
          ))
        ) : households.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">No households found.</div>
        ) : (
          households.map((hh) => (
          <Card key={hh.id} className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">{hh.houseNumber}</Badge>
                    <span className="text-[10px] text-muted-foreground">{hh.id}</span>
                  </div>
                  <h3 className="font-semibold text-sm mt-1.5 group-hover:text-primary transition-colors">{hh.headOfHousehold}</h3>
                </div>
                <StatusBadge status={hh.verificationStatus} />
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{hh.contact}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{hh.address}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3 w-3" />{hh.familyMembers} family members</div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                <span>{hh.pollingStation?.name || hh.pollingStationId} • {hh.ward?.name || hh.wardId}</span>
                <span>Updated: {new Date(hh.lastUpdated).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        )))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
