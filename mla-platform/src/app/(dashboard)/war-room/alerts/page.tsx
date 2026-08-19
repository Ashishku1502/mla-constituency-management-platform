import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Zap } from "lucide-react";

export const metadata = {
  title: "War Room Alerts | MLA Platform",
  description: "Manage and respond to critical system alerts and escalations",
};

export default function WarRoomAlertsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="War Room Alerts"
        description="Manage and respond to critical system alerts and escalations"
        icon={<Zap className="h-5 w-5" />}
      />

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center text-muted-foreground flex flex-col items-center gap-2">
          <Zap className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-lg font-medium">Alerts Management coming soon</p>
          <p className="text-sm max-w-sm">This module will serve as a triage center for urgent issues and escalations.</p>
        </CardContent>
      </Card>
    </div>
  );
}
