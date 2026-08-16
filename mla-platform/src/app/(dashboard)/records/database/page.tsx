import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Database, Search, Upload, Download, ShieldCheck, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Record Database | MLA Platform",
  description: "Secure authorized records database with import, validation, and search",
};

export default async function RecordDatabasePage() {
  const [totalRecords, validatedRecords, needsReviewRecords] = await Promise.all([
    prisma.record.count(),
    prisma.record.count({ where: { validationStatus: "Validated" } }),
    prisma.record.count({ where: { validationStatus: "Pending" } })
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Record Database"
        description="Secure authorized records database with import, validation, and search"
        icon={Database}
      >
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button size="sm" className="gap-1.5">
          <Upload className="h-4 w-4" />
          Import Records
        </Button>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Database className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Records</p>
              <p className="text-lg font-bold">{totalRecords.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Validated</p>
              <p className="text-lg font-bold">{validatedRecords.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Needs Review</p>
              <p className="text-lg font-bold">{needsReviewRecords.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search records by ID, name, or polling station..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Records</CardTitle>
          <CardDescription>Authorized records are protected by strict access controls. Only users with appropriate permissions can view, search, or export records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-2xl bg-muted/50 p-5 mb-5">
              <ShieldCheck className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold">Access Controlled</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
              Record data is displayed based on your role and geographic assignment. Use the search bar above to find specific records.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
