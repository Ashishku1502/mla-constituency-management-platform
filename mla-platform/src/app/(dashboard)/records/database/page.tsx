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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-premium glass-card animate-stagger-1 p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary glow-emerald">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Records</p>
            <p className="text-2xl font-black text-gradient">{totalRecords.toLocaleString()}</p>
          </div>
        </div>
        <div className="card-premium glass-card animate-stagger-2 p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 glow-emerald">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Validated</p>
            <p className="text-2xl font-black text-gradient-gold">{validatedRecords.toLocaleString()}</p>
          </div>
        </div>
        <div className="card-premium glass-card animate-stagger-3 p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Needs Review</p>
            <p className="text-2xl font-black">{needsReviewRecords.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <RecordsClient 
        initialRecords={initialData} 
        pagination={{ total: totalRecords, page: 1, limit: 10, totalPages: Math.ceil(totalRecords / 10) }} 
      />
    </div>
  );
}
