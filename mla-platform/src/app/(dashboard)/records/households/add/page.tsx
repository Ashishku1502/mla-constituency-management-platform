import { HouseholdForm } from "@/components/records/household-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Household | MLA Platform",
  description: "Register a new household record",
};

export default async function AddHouseholdPage() {
  const [pollingStations, wards] = await Promise.all([
    prisma.pollingStation.findMany({ select: { id: true, name: true, number: true } }),
    prisma.ward.findMany({ select: { id: true, name: true } })
  ]);

  return (
    <div className="py-6 space-y-6">
      <HouseholdForm pollingStations={pollingStations} wards={wards} />
    </div>
  );
}
