import prisma from "@/lib/prisma";
import { AreaManagersClient } from "./area-managers-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Area Managers | MLA Platform",
  description: "Manage area managers and their geographic assignments",
};

export default async function AreaManagersPage() {
  const dbManagers = await prisma.areaManager.findMany({
    include: {
      user: true,
      area: true,
    },
    orderBy: { createdAt: "desc" }
  });

  const formattedManagers = dbManagers.map(m => ({
    id: m.userId,
    name: m.user.name,
    mobile: m.user.mobile,
    area: m.area.name,
    status: m.user.status,
    joinedDate: new Date(m.user.joinedDate).toLocaleDateString(),
    activityCount: 0, // Placeholder, can be queried if needed
    lastActive: "Recently", // Placeholder
    reportingStatus: "Compliant" // Placeholder
  }));

  return <AreaManagersClient initialManagers={formattedManagers} />;
}
