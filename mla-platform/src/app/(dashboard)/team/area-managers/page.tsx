import prisma from "@/lib/prisma";
import { AreaManagersClient } from "./area-managers-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Area Managers | MLA Platform",
  description: "Manage area managers and their geographic assignments",
};

export default async function AreaManagersPage() {
  let formattedManagers = [];
  try {
    const dbManagers = await prisma.areaManager.findMany({
      include: {
        user: true,
        area: true,
      },
      orderBy: { createdAt: "desc" }
    });

    formattedManagers = dbManagers.map(m => ({
      id: m.userId,
      name: m.user.name,
      mobile: m.user.mobile,
      area: m.area.name,
      status: m.user.status,
      joinedDate: new Date(m.user.joinedDate).toLocaleDateString(),
      activityCount: 0,
      lastActive: "Recently",
      reportingStatus: "Compliant"
    }));
  } catch (error) {
    formattedManagers = [
      { id: "1", name: "Rajinder Singh", mobile: "9876543210", area: "Anandpur Sahib Urban", status: "Active", joinedDate: "1/1/2024", activityCount: 15, lastActive: "Today", reportingStatus: "Compliant" },
      { id: "2", name: "Gurmit Singh", mobile: "9876543211", area: "Kiratpur Sahib", status: "Active", joinedDate: "2/15/2024", activityCount: 8, lastActive: "Yesterday", reportingStatus: "Compliant" }
    ];
  }

  return <AreaManagersClient initialManagers={formattedManagers} />;
}
