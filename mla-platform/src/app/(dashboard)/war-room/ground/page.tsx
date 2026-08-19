import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Eye } from "lucide-react";

export const metadata = {
  title: "Ground Monitoring | MLA Platform",
  description: "Monitor ground reports and volunteer feedback",
};

export default function GroundMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ground Monitoring"
        description="Monitor ground reports and volunteer feedback"
        icon={<Eye className="h-5 w-5" />}
      />

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center text-muted-foreground flex flex-col items-center gap-2">
          <Eye className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-lg font-medium">Ground Monitoring coming soon</p>
          <p className="text-sm max-w-sm">This module will provide a detailed dashboard for analyzing daily reports from the field.</p>
        </CardContent>
      </Card>
    </div>
  );
}
