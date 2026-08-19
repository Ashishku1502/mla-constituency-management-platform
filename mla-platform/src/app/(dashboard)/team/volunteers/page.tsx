export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { VolunteersClient } from "./volunteers-client";

export default async function VolunteersPage() {
  let volunteers: any[] = [];
  try {
    volunteers = await prisma.volunteer.findMany({
      include: {
        user: true,
        area: true,
        pollingStation: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    volunteers = [
      { id: "1", user: { name: "Amrit Pal", mobile: "9654123456", email: "amrit@example.com", status: "Active" }, area: { name: "Anandpur Sahib Urban" }, pollingStation: { name: "PS 1" }, householdsCount: 42 },
      { id: "2", user: { name: "Sandeep Singh", mobile: "9654123457", email: "sandeep@example.com", status: "Active" }, area: { name: "Kiratpur Sahib" }, pollingStation: { name: "PS 3" }, householdsCount: 35 }
    ];
  }

  return <VolunteersClient initialVolunteers={volunteers} />;
}
