import { TeamForm } from "@/components/team/team-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Area Manager | MLA Platform",
  description: "Register a new Area Manager",
};

export default async function AddAreaManagerPage() {
  const areas = await prisma.area.findMany({ 
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="py-6 space-y-6">
      <TeamForm role="Area Manager" areas={areas} />
    </div>
  );
}
