"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { Home, Search, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface WardData {
  id: string;
  name: string;
  type: string;
  area: string;
  population: number;
  pollingStations: number;
  households: number;
}

export function WardsClient({ initialWards }: { initialWards: WardData[] }) {
  const [search, setSearch] = useState("");

  const filtered = initialWards.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.area.toLowerCase().includes(search.toLowerCase())
  );

  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wards & Villages"
        description="Manage wards and villages within constituency areas"
        icon={Home}
        action={{ label: "Add Ward/Village", onClick: () => router.push("/constituency/wards/add"), icon: Plus }}
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wards & villages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
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
                <TableHead>Type</TableHead>
                <TableHead className="hidden sm:table-cell">Area</TableHead>
                <TableHead className="hidden md:table-cell">Population</TableHead>
                <TableHead className="hidden md:table-cell">Area PS</TableHead>
                <TableHead className="hidden lg:table-cell">Households</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((w) => (
                <TableRow key={w.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        w.type === "Ward"
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}
                    >
                      {w.type}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{w.area}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {w.population.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{w.pollingStations}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {w.households.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No wards or villages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
