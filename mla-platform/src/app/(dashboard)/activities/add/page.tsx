import { ActivityForm } from "@/components/activities/activity-form";

import prisma from "@/lib/prisma";

export const metadata = {
  title: "Add Activity | MLA Platform",
  description: "Schedule a new activity, event, or survey",
};

export default async function AddActivityPage() {
  const dbAreas = await prisma.area.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="py-6 space-y-6">
      <ActivityForm areas={dbAreas} />
    </div>
  );
}
