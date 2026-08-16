import prisma from "@/lib/prisma";
import { WardsClient } from "./wards-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wards & Villages | MLA Platform",
  description: "Manage wards and villages within constituency areas",
};

export default async function WardsPage() {
  const dbWards = await prisma.ward.findMany({
    include: {
      area: {
        include: {
          pollingStations: true
        }
      }
    },
    orderBy: { name: "asc" }
  });

  const formattedWards = dbWards.map(w => ({
    id: w.id,
    name: w.name,
    type: w.type,
    area: w.area.name,
    population: w.population,
    pollingStations: w.area.pollingStations.length, // approximation for UI
    households: w.households,
  }));

  return <WardsClient initialWards={formattedWards} />;
}
