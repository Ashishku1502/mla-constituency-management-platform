import prisma from "@/lib/prisma";
import { WardsClient } from "./wards-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wards & Villages | MLA Platform",
  description: "Manage wards and villages within constituency areas",
};

export default async function WardsPage() {
  try {
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
      pollingStations: w.area.pollingStations.length,
      households: w.households,
    }));

    return <WardsClient initialWards={formattedWards} />;
  } catch (error) {
    console.warn("Database connection error on Wards. Falling back to mock data.");
    const mockWards = [
      { id: "w-1", name: "Ward 1", type: "Ward", area: "Downtown Central", population: 15000, pollingStations: 4, households: 3200 },
      { id: "w-2", name: "Ward 2", type: "Ward", area: "Downtown Central", population: 18000, pollingStations: 5, households: 4100 },
      { id: "w-3", name: "Oakville", type: "Village", area: "Rural Area 1", population: 4500, pollingStations: 1, households: 850 },
      { id: "w-4", name: "Pine Valley", type: "Village", area: "Rural Area 1", population: 6200, pollingStations: 2, households: 1200 }
    ];

    return (
      <WardsClient initialWards={mockWards} />
    );
  }
}
