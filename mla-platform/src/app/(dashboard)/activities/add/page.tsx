import { ActivityForm } from "@/components/activities/activity-form";

export const metadata = {
  title: "Add Activity | MLA Platform",
  description: "Schedule a new activity, event, or survey",
};

export default function AddActivityPage() {
  return (
    <div className="py-6 space-y-6">
      <ActivityForm />
    </div>
  );
}
