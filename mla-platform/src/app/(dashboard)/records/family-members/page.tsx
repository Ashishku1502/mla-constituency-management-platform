"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Info, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FamilyMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          query: debouncedSearch,
          page: page.toString(),
          limit: "20"
        });
        const res = await fetch(`/api/records/family-members?${params}`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data.members);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error("Error fetching family members:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [debouncedSearch, page]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Members"
        description="Comprehensive details of family members within constituency households"
        icon={Users}
        action={{ label: "Add Member", onClick: () => router.push("/records/family-members/add"), icon: Plus }}
      />

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20">
          <div className="flex items-start gap-3">
            <Info className="h-4.5 w-4.5 mt-0.5" />
            <p className="text-xs max-w-2xl">
              Operational household member database. Data is secured under strict role-based access control. Do not store voter preferences or political persuasion.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 h-9 bg-background/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Relation</TableHead>
                <TableHead>Household ID</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading records...
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No family members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium text-sm">{m.name}</TableCell>
                    <TableCell className="text-sm">{m.age}</TableCell>
                    <TableCell className="text-sm">{m.gender}</TableCell>
                    <TableCell className="text-sm">{m.relation}</TableCell>
                    <TableCell className="font-mono text-xs">{m.household?.houseNumber || m.householdId}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.contact || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="p-4 border-t flex justify-between items-center bg-muted/20">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
