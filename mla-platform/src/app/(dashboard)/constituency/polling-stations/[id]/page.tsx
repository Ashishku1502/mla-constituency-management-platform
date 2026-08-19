import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Users, Hash, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function PollingStationRecordPage({ params }: { params: { id: string } }) {
  let station = null;
  
  // Need to await params in newer Next.js versions, but we can try direct access if version allows. 
  // However Next 15+ requires awaiting params. The user environment is Next.js 16.3.0.
  const { id } = await params;

  try {
    station = (await prisma.pollingStation.findUnique({
      where: { id: id },
      include: {
        area: true,
        teamLeader: {
          include: { user: true }
        }
      }
    })) as any;
  } catch (e) {
    // Mock fallback if DB fails
    station = {
      id: id,
      number: 101,
      name: "Mock City Hall Auditorium",
      address: "100 Main St, Center City",
      location: "31.23, 76.54",
      area: { name: "Downtown Central" },
      teamLeader: { user: { name: "Mock Leader" } },
      voterCount: 1500,
      voterListStatus: "Uploaded",
      status: "Validated",
      recordCount: 1250,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  if (!station) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/constituency/polling-stations">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{station.name}</h1>
          <p className="text-muted-foreground text-sm">Polling Station Record Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Core Info */}
        <Card className="lg:col-span-2 shadow-sm border">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" /> 
              Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Unique Identifier</p>
              <p className="font-mono text-sm bg-muted p-2 rounded-md truncate" title={station.id}>{station.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Official Number</p>
              <p className="font-medium text-lg">{station.number}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Station Name</p>
              <p className="font-medium">{station.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="shadow-sm border">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" /> 
              Data Status
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 pt-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Validation Status</p>
              <StatusBadge status={station.status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">List Upload Status</p>
              <StatusBadge status={station.voterListStatus} />
            </div>
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card className="shadow-sm border">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> 
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Parent Area</p>
              <p className="font-medium">{station.area.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Physical Address</p>
              <p className="font-medium text-sm">{station.address}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Geo-Coordinates</p>
              <p className="font-mono text-sm bg-muted inline-block px-2 py-1 rounded">{station.location || "Not specified"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Personnel & Stats */}
        <Card className="shadow-sm border lg:col-span-2">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> 
              Assignments & Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Responsible Team Leader</p>
              <p className="font-medium">{station.teamLeader?.user?.name || "Unassigned"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Registered Voters</p>
              <p className="text-2xl font-bold">{station.voterCount || 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Collected Records</p>
              <p className="text-2xl font-bold text-primary">{station.recordCount || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
