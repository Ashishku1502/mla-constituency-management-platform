import { PollingStationForm } from "@/components/constituency/polling-station-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Polling Station | MLA Platform",
  description: "Register a new polling station in the constituency",
};

export default async function AddPollingStationPage() {
  const [areas, teamLeaders] = await Promise.all([
    prisma.area.findMany({ 
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    }),
    prisma.teamLeader.findMany({ 
      select: { 
        id: true, 
        user: { select: { name: true } } 
      }
    })
  ]);

  return (
    <div className="py-6 space-y-6">
      <PollingStationForm areas={areas} teamLeaders={teamLeaders} />
    </div>
  );
}
