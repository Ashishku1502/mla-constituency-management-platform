import { AreaDivisionClient } from "./area-division-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Area Division | MLA Platform",
  description: "Manually divide constituency areas based on population or voter count.",
};

export default function AreaDivisionPage() {
  return <AreaDivisionClient />;
}
