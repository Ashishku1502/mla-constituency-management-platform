import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, areaId, population, households } = body;

    if (!name || !areaId) {
      return NextResponse.json(
        { success: false, message: "Name and Area ID are required" },
        { status: 400 }
      );
    }

    const ward = await prisma.ward.create({
      data: {
        name,
        type: type || "Ward",
        areaId,
        population: population || 0,
        households: households || 0,
      },
    });

    return NextResponse.json({ success: true, ward }, { status: 201 });
  } catch (error) {
    console.error("Failed to create ward:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create ward" },
      { status: 500 }
    );
  }
}
