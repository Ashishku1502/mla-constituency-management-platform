import prisma from "@/lib/prisma";
import { AddAreaForm } from "./add-area-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Area | MLA Platform",
  description: "Create a new constituency area with map boundaries",
};

export default async function AddAreaPage() {
  try {
    // Fetch required reference data for the form
    const constituency = await prisma.constituency.findFirst();
    if (!constituency) {
      redirect("/dashboard");
    }

    const managers = await prisma.user.findMany({
      where: { role: "Area Manager" },
      select: { id: true, name: true }
    });

    const pollingStations = await prisma.pollingStation.findMany({
      where: { areaId: "" }, // Not sure if they can reassign, let's just fetch all or unassigned.
      // For simplicity, fetch all polling stations to allow assignment
      select: { id: true, name: true, number: true, areaId: true }
    });

    const wards = await prisma.ward.findMany({
      select: { id: true, name: true, type: true }
    });

    return (
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <AddAreaForm 
          constituencyId={constituency.id}
          managers={managers}
          pollingStations={pollingStations}
          wards={wards}
        />
      </div>
    );
  } catch (error) {
    console.warn("Database connection error. Falling back to mock data for Add Area presentation.");

    // Mock data for showcase
    const mockManagers = [
      { id: "mock-m1", name: "Sarah Jenkins" },
      { id: "mock-m2", name: "Marcus Chen" },
    ];

    const mockPollingStations = [
      { id: "mock-ps1", name: "PS-01 Community Hall", number: 1, areaId: "" },
      { id: "mock-ps2", name: "PS-02 Primary School", number: 2, areaId: "" },
      { id: "mock-ps3", name: "PS-03 Health Center", number: 3, areaId: "" },
    ];

    const mockWards = [
      { id: "mock-w1", name: "Ward 1", type: "Ward" },
      { id: "mock-w2", name: "Ward 2", type: "Ward" },
      { id: "mock-v1", name: "Oakville Village", type: "Village" },
    ];

    return (
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md shadow-sm dark:bg-amber-900/30 dark:text-amber-400">
          <p className="font-medium">Demo Mode Active</p>
          <p className="text-sm">The production database is not connected yet. Showing sample assignments so you can test the Add Area form.</p>
        </div>
        <AddAreaForm 
          constituencyId="mock-constituency"
          managers={mockManagers}
          pollingStations={mockPollingStations}
          wards={mockWards}
        />
      </div>
    );
  }
}
