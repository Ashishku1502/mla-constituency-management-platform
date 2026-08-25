import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, gender, relation, householdId, contact } = body;

    if (!name || age === undefined || !gender || !relation || !householdId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const familyMember = await prisma.familyMember.create({
      data: {
        name,
        age,
        gender,
        relation,
        householdId,
        contact: contact || null,
      },
    });

    // Update the household family members count
    await prisma.household.update({
      where: { id: householdId },
      data: {
        familyMembersCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true, data: familyMember });
  } catch (error) {
    console.error("Failed to add family member:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

