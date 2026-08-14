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

const mockWards = [
  { id: "w-1", name: "Ward 1", type: "Ward", area: "Anandpur Sahib Urban", population: 7200, pollingStations: 4, households: 1850 },
  { id: "w-2", name: "Ward 2", type: "Ward", area: "Anandpur Sahib Urban", population: 6800, pollingStations: 4, households: 1720 },
  { id: "w-3", name: "Ward 3", type: "Ward", area: "Anandpur Sahib Urban", population: 7500, pollingStations: 4, households: 1900 },
  { id: "w-4", name: "Ward 4", type: "Ward", area: "Kiratpur Sahib", population: 5200, pollingStations: 3, households: 1340 },
  { id: "w-5", name: "Ward 5", type: "Ward", area: "Kiratpur Sahib", population: 4800, pollingStations: 3, households: 1200 },
  { id: "v-1", name: "Mehatpur", type: "Village", area: "Mehatpur", population: 3200, pollingStations: 2, households: 820 },
  { id: "v-2", name: "Takhtupura", type: "Village", area: "Takhtupura", population: 2800, pollingStations: 2, households: 710 },
  { id: "v-3", name: "Ganguwal", type: "Village", area: "Ganguwal", population: 3500, pollingStations: 2, households: 890 },
  { id: "v-4", name: "Nangal Colony", type: "Village", area: "Nangal Township", population: 4100, pollingStations: 3, households: 1050 },
  { id: "v-5", name: "Bhakra Village", type: "Village", area: "Bhakra Dam Area", population: 2100, pollingStations: 1, households: 540 },
];

export default function WardsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockWards.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.area.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wards & Villages"
        description="Manage wards and villages within constituency areas"
        icon={Home}
        action={{ label: "Add Ward/Village", onClick: () => {}, icon: Plus }}
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
                <TableHead className="hidden md:table-cell">Polling Stations</TableHead>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
