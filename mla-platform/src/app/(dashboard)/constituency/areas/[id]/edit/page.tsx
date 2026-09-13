import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { EditAreaForm } from "./edit-area-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Area | MLA Platform",
  description: "Edit constituency area details and boundaries",
};

export default async function EditAreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        managers: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!area) {
      return notFound();
    }

    const managers = await prisma.user.findMany({
      where: { role: "Area Manager" },
      select: { id: true, name: true },
    });

    const areaData = {
      id: area.id,
      name: area.name,
      code: area.code,
      population: area.population,
      registeredVoters: area.registeredVoters,
      status: area.status,
      description: area.description,
      geographicBoundary: area.geographicBoundary,
      managerId: area.managers.length > 0 ? area.managers[0].userId : null,
    };

    return (
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <EditAreaForm area={areaData} managers={managers} />
      </div>
    );
  } catch (error) {
    console.warn("Database error fetching area for edit:", error);
    
    // Mock data fallback for showcase purposes
    const mockArea = {
      id,
      name: "Downtown Central",
      code: "DC-01",
      population: 45000,
      registeredVoters: 28500,
      status: "Active",
      description: "Primary urban area covering central business district",
      geographicBoundary: null,
      managerId: "mock-m1",
    };

    const mockManagers = [
      { id: "mock-m1", name: "Sarah Jenkins" },
      { id: "mock-m2", name: "Marcus Chen" },
    ];

    return (
      <div className="max-w-6xl mx-auto py-6 space-y-6">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md shadow-sm dark:bg-amber-900/30 dark:text-amber-400">
          <p className="font-medium">Demo Mode Active</p>
          <p className="text-sm">The production database is not connected. Showing mock data for testing the Edit Area form.</p>
        </div>
        <EditAreaForm area={mockArea} managers={mockManagers} />
      </div>
    );
  }
}
