import { ReportForm } from "@/components/ground-reports/report-form";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Submit Ground Report | MLA Platform",
  description: "Record findings and observations from field activities",
};

export default async function AddReportPage() {
  const activities = await prisma.activity.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="py-6 space-y-6">
      <ReportForm activities={activities} />
    </div>
  );
}
