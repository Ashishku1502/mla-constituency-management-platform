"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Home, Search, Plus, User, MapPin, Phone, Users } from "lucide-react";
import { mockHouseholds } from "@/lib/mock-data";

export default function HouseholdsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockHouseholds.filter((h) => {
    const matchesSearch =
      h.headOfHousehold.toLowerCase().includes(search.toLowerCase()) ||
      h.houseNumber.toLowerCase().includes(search.toLowerCase()) ||
      h.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || h.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Households"
        description="Manage household records, family members, and verification"
        icon={Home}
        action={{ label: "Add Household", onClick: () => {}, icon: Plus }}
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, house number, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={(val: string | null) => val && setStatusFilter(val)}>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((hh) => (
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
                <span>{hh.pollingStation} • {hh.ward}</span>
                <span>Updated: {hh.lastUpdated}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
