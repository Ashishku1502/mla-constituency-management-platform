import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Database, Search, Upload, Download, ShieldCheck, AlertTriangle } from "lucide-react";
import { RecordsClient } from "./records-client";

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

  const initialData = await prisma.record.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    include: {
      pollingStation: { select: { id: true, name: true, number: true } },
      household: { select: { id: true, houseNumber: true, locality: true } },
    }
  });

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

      <RecordsClient 
        initialRecords={initialData} 
        pagination={{ total: totalRecords, page: 1, limit: 10, totalPages: Math.ceil(totalRecords / 10) }} 
      />
    </div>
  );
}
