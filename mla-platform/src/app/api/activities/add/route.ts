import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // In a real app, we would use the authenticated user's area or let them select one.
    // For now, we find or create a default area.
    let area = await prisma.area.findFirst();
    if (!area) {
      let constituency = await prisma.constituency.findFirst();
      if (!constituency) {
        constituency = await prisma.constituency.create({
          data: { name: "Default Constituency", code: "DEF-01", state: "State", population: 100000 }
        });
      }
      area = await prisma.area.create({
        data: { name: "Central Area", code: "CA-01", population: 50000, constituencyId: constituency.id }
      });
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
        areaId: area.id,
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
