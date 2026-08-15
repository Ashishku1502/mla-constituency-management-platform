import { IssueForm } from "@/components/issues/issue-form";

export const metadata = {
  title: "Report Issue | MLA Platform",
  description: "File a new ground report or constituent issue",
};

export default function AddIssuePage() {
  return (
    <div className="py-6 space-y-6">
      <IssueForm />
    </div>
  );
}
