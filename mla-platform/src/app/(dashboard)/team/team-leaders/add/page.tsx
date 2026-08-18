import { TeamForm } from "@/components/team/team-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Team Leader | MLA Platform",
  description: "Register a new team leader",
};

export default async function AddTeamLeaderPage() {
  const areas = await prisma.area.findMany({ 
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="py-6 space-y-6">
      <TeamForm role="Team Leader" areas={areas} />
    </div>
  );
}
