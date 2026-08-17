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
import { STATUS_COLORS } from "@/lib/constants";

export function RecordsClient({ initialRecords, pagination: initialPagination }: { initialRecords: any[], pagination: any }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [records, setRecords] = useState(initialRecords);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.total);

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
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by voter name or ID..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9" 
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Validated">Validated</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2 px-1">
        <p>Showing {records.length} of {totalItems} records</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voter Details</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Address</TableHead>
                <TableHead>Polling Station</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading records...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="h-8 w-8 opacity-20" />
                      <p>No records found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
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
                        <span className="text-muted-foreground text-xs italic">No mobile</span>
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
                          {record.pollingStation?.name || "Unassigned"}
                        </p>
                        {record.pollingStation?.number && (
                          <p className="text-xs text-muted-foreground">PS {record.pollingStation.number}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`text-[10px] font-medium border-0 ${STATUS_COLORS[record.validationStatus] || "bg-gray-100 text-gray-800"}`}
                      >
                        {record.validationStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 pb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages || loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
