import prisma from "@/lib/prisma";
import { AddWardForm } from "./add-ward-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Ward/Village | MLA Platform",
  description: "Create a new ward or village",
};

export default async function AddWardPage() {
  try {
    // Fetch areas so the user can assign the ward to an area
    const areas = await prisma.area.findMany({
      select: { id: true, name: true, code: true }
    });

    return (
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <AddWardForm areas={areas} />
      </div>
    );
  } catch (error) {
    console.warn("Database connection error. Falling back to mock data for Add Ward presentation.");

    // Mock data for showcase
    const mockAreas = [
      { id: "mock-area-1", name: "Downtown Central", code: "DTC" },
      { id: "mock-area-2", name: "Westside Valley", code: "WSV" },
    ];

    return (
      <div className="max-w-4xl mx-auto py-6 space-y-6">
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md shadow-sm dark:bg-amber-900/30 dark:text-amber-400">
          <p className="font-medium">Demo Mode Active</p>
          <p className="text-sm">The database is not connected. Showing mock areas so you can preview the form.</p>
        </div>
        <AddWardForm areas={mockAreas} />
      </div>
    );
  }
}
