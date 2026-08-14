"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { ShieldCheck, Download, AlertTriangle, CheckCircle, Info } from "lucide-react";

const mockErrors = [
  { id: "err-001", type: "Duplicate Mobile", field: "Mobile", value: "98765xxxxx", recordId: "rec-1025", area: "Urban" },
  { id: "err-002", type: "Incorrect PS Mapping", field: "Polling Station", value: "PS 15 (Out of boundary)", recordId: "rec-2044", area: "Rural" },
  { id: "err-003", type: "Missing Mandatory Field", field: "House Number", value: "Empty", recordId: "rec-3081", area: "Urban" },
];

export default function DataValidationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Validation"
        description="Inspect duplicates, mapping mismatches, and data quality check errors"
        icon={ShieldCheck}
        action={{ label: "Download Results", onClick: () => {}, icon: Download }}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">96.4%</p>
          <p className="text-xs text-muted-foreground mt-1">Data Quality Score</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">42</p>
          <p className="text-xs text-muted-foreground mt-1">Duplicate Households</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">18</p>
          <p className="text-xs text-muted-foreground mt-1">Duplicate Mobiles</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">8</p>
          <p className="text-xs text-muted-foreground mt-1">Mapping Errors</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
            Validation Failures
          </CardTitle>
          <CardDescription>Review and correct the identified formatting or geographic mismatches below.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Error Type</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Area</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockErrors.map((err) => (
                <TableRow key={err.id}>
                  <TableCell className="font-mono text-xs font-semibold">{err.recordId}</TableCell>
                  <TableCell className="text-sm font-medium text-red-600">{err.type}</TableCell>
                  <TableCell className="text-sm">{err.field}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{err.value}</TableCell>
                  <TableCell className="text-sm">{err.area}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
