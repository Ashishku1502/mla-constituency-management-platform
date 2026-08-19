import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Find or create default user for the reporter if not passed
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: "Demo User", email: "demo@example.com", mobile: "1234567890", passwordHash: "hash" }
      });
    }

    if (!data.areaId) {
      return NextResponse.json({ success: false, error: "Area is required" }, { status: 400 });
    }

    const issue = await prisma.issue.create({
      data: {
        category: data.category,
        priority: data.priority,
        description: data.description,
        dateReported: data.dateReported,
        reportedById: user.id,
        areaId: data.areaId,
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
