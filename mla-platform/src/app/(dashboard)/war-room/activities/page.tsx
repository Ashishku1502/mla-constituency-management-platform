import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Activity } from "lucide-react";

export const metadata = {
  title: "War Room Activities | MLA Platform",
  description: "Track all ongoing election activities centrally from the War Room",
};

export default function WarRoomActivitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="War Room Activities"
        description="Track all ongoing election activities centrally from the War Room"
        icon={<Activity className="h-5 w-5" />}
      />

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center text-muted-foreground flex flex-col items-center gap-2">
          <Activity className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-lg font-medium">Activity Tracking coming soon</p>
          <p className="text-sm max-w-sm">This module will display a centralized list of activities, surveys, and events.</p>
        </CardContent>
      </Card>
    </div>
  );
}
