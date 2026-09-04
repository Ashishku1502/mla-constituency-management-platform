import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { auth } from "@/auth";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  return <DashboardLayout user={session?.user}>{children}</DashboardLayout>;
}
