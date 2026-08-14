"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { Users, Info } from "lucide-react";

const mockMembers = [
  { id: "mem-001", name: "Mohinder Singh", age: 62, gender: "Male", relation: "Head", household: "H-142", contact: "98765xxxxx" },
  { id: "mem-002", name: "Surjit Kaur", age: 58, gender: "Female", relation: "Wife", household: "H-142", contact: "98765xxxxx" },
  { id: "mem-003", name: "Jasbir Bains", age: 34, gender: "Male", relation: "Son", household: "H-142", contact: "98765xxxxx" },
  { id: "mem-004", name: "Preet Kaur", age: 31, gender: "Female", relation: "Daughter-in-law", household: "H-142", contact: "98764xxxxx" },
];

export default function FamilyMembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Members"
        description="Comprehensive details of family members within constituency households"
        icon={Users}
      />

      <Card>
        <CardContent className="p-4 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20">
          <Info className="h-4.5 w-4.5 mt-0.5" />
          <p className="text-xs">
            Operational household member database. Data is secured under strict role-based access control. Do not store voter preferences or political persuasion.
          </p>
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
              {mockMembers.map((m) => (
                <TableRow key={m.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-sm">{m.name}</TableCell>
                  <TableCell className="text-sm">{m.age}</TableCell>
                  <TableCell className="text-sm">{m.gender}</TableCell>
                  <TableCell className="text-sm">{m.relation}</TableCell>
                  <TableCell className="font-mono text-xs">{m.household}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
