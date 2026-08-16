import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Since this is a demo, if no volunteer exists, we'll try to find one or create a dummy volunteer
    let volunteer = await prisma.volunteer.findFirst();
    if (!volunteer) {
      const user = await prisma.user.create({
        data: {
          name: "Test Volunteer",
          email: "volunteer@example.com",
          mobile: "1234567890",
          passwordHash: "dummy",
        }
      });
      const area = await prisma.area.findFirst();
      if (!area) throw new Error("No area exists to assign volunteer");
      
      volunteer = await prisma.volunteer.create({
        data: {
          userId: user.id,
          areaId: area.id,
        }
      });
    }

    const report = await prisma.groundReport.create({
      data: {
        activityId: data.activityId,
        volunteerId: volunteer.id,
        date: data.date,
        location: data.location,
        participantCount: data.participantCount,
        notes: data.notes || "",
        issuesRaised: data.issuesRaised || "",
        followupRequired: data.followupRequired,
        status: data.status,
      }
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error creating ground report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit ground report" },
      { status: 500 }
    );
  }
}
