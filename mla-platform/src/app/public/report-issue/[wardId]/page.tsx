import { PublicIssueReportClient } from "./public-issue-report-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Report an Issue",
  description: "Public portal to report local issues in your ward",
};

export default async function PublicIssueReportPage({
  params,
}: {
  params: Promise<{ wardId: string }>;
}) {
  const { wardId } = await params;
  
  // In a real scenario, fetch ward details to show to the user
  const wardName = wardId === "w1" ? "Ward 1A - North Zone" : 
                   wardId === "w2" ? "Ward 1B - North Zone" : "Ward 2A - South Zone";

  return <PublicIssueReportClient wardId={wardId} wardName={wardName} />;
}
