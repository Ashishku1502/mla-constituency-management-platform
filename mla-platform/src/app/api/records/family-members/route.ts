import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: query } },
        { contact: { contains: query } },
        { household: { houseNumber: { contains: query } } },
      ],
    };

    const [members, total] = await Promise.all([
      prisma.familyMember.findMany({
        where,
        include: {
          household: {
            select: {
              houseNumber: true,
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.familyMember.count({ where }),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch family members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
