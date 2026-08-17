import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define the validation schema using Zod
const householdSchema = z.object({
  houseNumber: z.string().min(1, "House number is required"),
  headOfHousehold: z.string().min(2, "Head of household name must be at least 2 characters"),
  contact: z.string().min(10, "Contact number must be at least 10 characters"),
  address: z.string().optional(),
  locality: z.string().optional(),
  pollingStationId: z.string().optional(),
  wardId: z.string().optional(),
  familyMembersCount: z.coerce.number().int().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();

    // Validate the incoming data against our schema
    const validationResult = householdSchema.safeParse(rawData);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // TODO: In a real app with NextAuth fully configured, validate the session/user here
    // import { auth } from "@/auth";
    // const session = await auth();
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const household = await prisma.household.create({
      data: {
        houseNumber: data.houseNumber,
        headOfHousehold: data.headOfHousehold,
        contact: data.contact,
        address: data.address ?? "",
        locality: data.locality ?? "",
        pollingStationId: data.pollingStationId ?? "",
        wardId: data.wardId ?? "",
        familyMembersCount: data.familyMembersCount,
        verificationStatus: "Unverified",
      }
    });

    return NextResponse.json({ success: true, household }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating household:", error);

    // Handle Prisma specific unique constraint errors or foreign key errors
    if (error.code === 'P2002') {
       return NextResponse.json(
         { success: false, error: "A household with this information already exists." },
         { status: 409 }
       );
    }
    if (error.code === 'P2003') {
       return NextResponse.json(
         { success: false, error: "Referenced record (like Polling Station or Ward) does not exist." },
         { status: 400 }
       );
    }

    return NextResponse.json(
      { success: false, error: "Failed to add household record. An internal error occurred." },
      { status: 500 }
    );
  }
}
