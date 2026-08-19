import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { GitBranch } from "lucide-react";

export const metadata = {
  title: "War Room Organization | MLA Platform",
  description: "View and manage the structural organization of the election war room",
};

export default function WarRoomOrganizationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="War Room Organization"
        description="View and manage the structural organization of the election war room"
        icon={<GitBranch className="h-5 w-5" />}
      />

      <Card className="min-h-[400px] flex items-center justify-center border-dashed">
        <CardContent className="text-center text-muted-foreground flex flex-col items-center gap-2">
          <GitBranch className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-lg font-medium">Organization structure coming soon</p>
          <p className="text-sm max-w-sm">This module will visualize the hierarchy of volunteers, team leaders, and area managers.</p>
        </CardContent>
      </Card>
    </div>
  );
}
