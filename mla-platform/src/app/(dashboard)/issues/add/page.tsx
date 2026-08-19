import { IssueForm } from "@/components/issues/issue-form";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Report Issue | MLA Platform",
  description: "File a new ground report or constituent issue",
};

export const dynamic = "force-dynamic";

export default async function AddIssuePage() {
  const areas = await prisma.area.findMany({
    select: { id: true, name: true, code: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="py-6 space-y-6">
      <IssueForm areas={areas} />
    </div>
  );
}
