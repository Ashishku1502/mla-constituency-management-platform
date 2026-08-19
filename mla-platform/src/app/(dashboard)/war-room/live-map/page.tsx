import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Radio } from "lucide-react";
import WarRoomMapDynamic from "@/components/map/WarRoomMapDynamic";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live War Room Map | MLA Platform",
  description: "Full-screen real-time live map of ground reports and critical issues",
};

export default function LiveMapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Map"
        description="Full-screen view of real-time ground reports and critical issues"
        icon={<Radio className="h-5 w-5 text-red-500 animate-pulse" />}
      />

      <Card className="border-none shadow-sm h-[calc(100vh-140px)] min-h-[600px] overflow-hidden">
        <div className="h-full w-full">
          <WarRoomMapDynamic />
        </div>
      </Card>
    </div>
  );
}
