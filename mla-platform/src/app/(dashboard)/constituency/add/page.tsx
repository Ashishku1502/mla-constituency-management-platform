import { Metadata } from "next";
import { ConstituencyInfoForm } from "@/components/constituency/constituency-info-form";

export const metadata: Metadata = {
  title: "Add Constituency Information | MLA Platform",
  description: "Add and manage the information of the assembly constituency.",
};

export default function AddConstituencyInfoPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Constituency Details</h1>
        <p className="text-muted-foreground mt-2">
          Update the demographics and logistical information for the constituency.
        </p>
      </div>
      
      <ConstituencyInfoForm />
    </div>
  );
}
