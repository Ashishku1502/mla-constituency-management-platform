import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.areaId) {
      return NextResponse.json(
        { success: false, error: "Target Area is required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description || "",
        objective: data.objective || "",
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        capacity: data.capacity,
        status: data.status,
        areaId: data.areaId,
        deadline: data.date, // Simplifying deadline to date for this form
      }
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
