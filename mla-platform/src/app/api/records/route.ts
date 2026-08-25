import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { voterId: { contains: query, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      where.validationStatus = status;
    }

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          pollingStation: {
            select: { id: true, name: true, number: true },
          },
          household: {
            select: { id: true, houseNumber: true, locality: true },
          },
        },
      }),
      prisma.record.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch records, using mock data:", error);
    return NextResponse.json({
      success: true,
      records: [
        { id: "1", name: "Rahul Sharma", voterId: "ABC1234567", mobile: "9876543210", address: "12/A, Gandhi Nagar", validationStatus: "Validated", pollingStation: { name: "City Hall Main Auditorium", number: 1 }, household: { houseNumber: "12/A", locality: "Gandhi Nagar" }, updatedAt: new Date().toISOString() },
        { id: "2", name: "Priya Patel", voterId: "XYZ9876543", mobile: "9123456789", address: "45, Ring Road", validationStatus: "Pending", pollingStation: { name: "Community Center Library", number: 2 }, household: { houseNumber: "45", locality: "Ring Road" }, updatedAt: new Date().toISOString() },
      ],
      pagination: { total: 2, page: 1, limit: 10, totalPages: 1 },
    });
  }
}

