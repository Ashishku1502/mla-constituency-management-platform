import { PrismaClient } from "@prisma/client";
import { CreateBulkClient } from "./create-bulk-client";

const prisma = new PrismaClient();

export default async function CreateBulkActivityPage() {
  // Fetch all areas with their polling stations
  const areas = await prisma.area.findMany({
    where: { status: "Active" },
    include: {
      pollingStations: {
        select: {
          id: true,
          name: true,
          number: true,
        },
        orderBy: {
          number: 'asc'
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return <CreateBulkClient areas={areas} />;
}
