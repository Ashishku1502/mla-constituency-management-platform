import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {


    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const where: Prisma.HouseholdWhereInput = {};

    if (query) {
      where.OR = [
        { headOfHousehold: { contains: query } },
        { houseNumber: { contains: query } },
        { id: { contains: query } },
      ];
    }

    if (status && status !== "all") {
      where.verificationStatus = status;
    }

    const [households, total] = await Promise.all([
      prisma.household.findMany({
        where,
        skip,
        take: limit,
        include: {
          pollingStation: true,
          ward: true,
          assignedVolunteer: {
            include: { user: true }
          }
        },
        orderBy: { lastUpdated: "desc" },
      }),
      prisma.household.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      households,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      }
    });
  } catch (error) {
    console.error("Failed to fetch households:", error);
    return NextResponse.json({ error: "Failed to fetch households" }, { status: 500 });
  }
}
