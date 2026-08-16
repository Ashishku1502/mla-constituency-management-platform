import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Map } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConstituencyMapPage() {
  const constituency = await prisma.constituency.findFirst();
  const areas = await prisma.area.findMany({
    include: {
      _count: {
        select: { pollingStations: true }
      }
    },
    take: 5
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Constituency Map"
        description="Interactive map of the constituency with areas, polling stations, and activities"
        icon={Map}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Map Area */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0 overflow-hidden rounded-lg border-none">
            <div className="h-[600px] w-full z-0 relative">
              <DynamicMap />
            </div>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                {constituency?.name || "Unknown Constituency"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">State</span>
                <span className="font-medium">{constituency?.state || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Code</span>
                <span className="font-mono text-xs">{constituency?.code || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Population</span>
                <span className="font-medium">
                  {constituency?.population?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Areas</span>
                <span className="font-medium">{constituency?.totalAreas || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Polling Stations</span>
                <span className="font-medium">
                  {constituency?.totalPollingStations || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2"
                >
                  <span className="font-medium truncate max-w-[120px]">
                    {area.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={
                      area.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600"
                    }
                  >
                    {area._count.pollingStations} PS
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
