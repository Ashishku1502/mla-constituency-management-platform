import { FamilyMemberForm } from "@/components/records/family-member-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Family Member | MLA Platform",
  description: "Register a new family member record",
};

export default async function AddFamilyMemberPage() {
  const households = await prisma.household.findMany({ 
    select: { id: true, houseNumber: true, headOfHousehold: true },
    orderBy: { houseNumber: "asc" }
  });

  return (
    <div className="py-6 space-y-6">
      <FamilyMemberForm households={households} />
    </div>
  );
}
