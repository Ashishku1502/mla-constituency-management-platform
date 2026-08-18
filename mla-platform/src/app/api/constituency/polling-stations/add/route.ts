import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { number, name, address, areaId, teamLeaderId } = body;

    if (!number || !name || !address || !areaId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if PS number already exists in this area
    const existingPS = await prisma.pollingStation.findFirst({
      where: {
        number: parseInt(number),
        areaId,
      },
    });

    if (existingPS) {
      return NextResponse.json(
        { success: false, error: "Polling Station number already exists in this area" },
        { status: 400 }
      );
    }

    const pollingStation = await prisma.pollingStation.create({
      data: {
        number: parseInt(number),
        name,
        address,
        areaId,
        teamLeaderId: teamLeaderId || null,
        status: "Pending",
      },
    });

    return NextResponse.json({ success: true, data: pollingStation });
  } catch (error: any) {
    console.error("Failed to add polling station:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
