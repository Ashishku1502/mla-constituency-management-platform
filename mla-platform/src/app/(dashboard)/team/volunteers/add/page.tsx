import { TeamForm } from "@/components/team/team-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add Volunteer | MLA Platform",
  description: "Register a new volunteer",
};

export default async function AddVolunteerPage() {
  const [areas, pollingStations] = await Promise.all([
    prisma.area.findMany({ 
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    }),
    prisma.pollingStation.findMany({ 
      select: { id: true, name: true, number: true },
      orderBy: { number: "asc" }
    })
  ]);

  return (
    <div className="py-6 space-y-6">
      <TeamForm role="Volunteer" areas={areas} pollingStations={pollingStations} />
    </div>
  );
}
