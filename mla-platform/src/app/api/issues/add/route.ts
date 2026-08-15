import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Find or create default user and area for the demo
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

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: "Demo User", email: "demo@example.com", mobile: "1234567890", passwordHash: "hash" }
      });
    }

    const issue = await prisma.issue.create({
      data: {
        category: data.category,
        priority: data.priority,
        description: data.description,
        dateReported: data.dateReported,
        reportedById: user.id,
        areaId: area.id,
      }
    });

    return NextResponse.json({ success: true, issue });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create issue" },
      { status: 500 }
    );
  }
}
