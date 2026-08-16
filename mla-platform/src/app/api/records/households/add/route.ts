import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // In a real app, you would validate the session/user here
    // For now, we'll just create the household record

    const household = await prisma.household.create({
      data: {
        houseNumber: data.houseNumber,
        headOfHousehold: data.headOfHousehold,
        contact: data.contact,
        address: data.address,
        locality: data.locality,
        pollingStationId: data.pollingStationId,
        wardId: data.wardId,
        familyMembersCount: data.familyMembersCount,
        verificationStatus: "Unverified",
      }
    });

    return NextResponse.json({ success: true, household }, { status: 201 });
  } catch (error) {
    console.error("Error creating household:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add household record" },
      { status: 500 }
    );
  }
}
