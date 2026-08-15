import { Metadata } from "next";
import { PersonalInfoForm } from "@/components/candidate/personal-info-form";

export const metadata: Metadata = {
  title: "Candidate Personal Information | MLA Platform",
  description: "Update the personal information and profile details of the candidate.",
};

export default function CandidatePersonalInfoPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Candidate Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage the public profile and contact details of the candidate.
        </p>
      </div>
      
      <PersonalInfoForm />
    </div>
  );
}
