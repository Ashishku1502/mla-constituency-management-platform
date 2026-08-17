import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Map } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";

export const dynamic = "force-dynamic";

export default function ConstituencyMapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Constituency Map"
        description="Interactive map of the constituency with areas, polling stations, and activities"
        icon={Map}
      />

      <Card className="border-none shadow-sm h-[calc(100vh-140px)] min-h-[600px] overflow-hidden">
        <DynamicMap />
      </Card>
    </div>
  );
}
