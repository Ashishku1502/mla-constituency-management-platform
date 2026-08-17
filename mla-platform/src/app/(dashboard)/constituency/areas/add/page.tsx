import prisma from "@/lib/prisma";
import { AddAreaForm } from "./add-area-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Area | MLA Platform",
  description: "Create a new constituency area with map boundaries",
};

export default async function AddAreaPage() {
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
}
