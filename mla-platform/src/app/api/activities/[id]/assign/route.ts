import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = params.id;
    const body = await req.json();
    const { wardId, volunteerId } = body;

    if (!wardId || !volunteerId) {
      return NextResponse.json(
        { success: false, error: "Ward ID and Volunteer ID are required" },
        { status: 400 }
      );
    }

    // First update the activity to link it to the ward
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        wardId: wardId,
      }
    });

    // Create the assignment for the volunteer
    const assignment = await prisma.activityAssignment.create({
      data: {
        activityId: activityId,
        volunteerId: volunteerId,
        status: "Assigned"
      }
    });

    return NextResponse.json({ success: true, activity: updatedActivity, assignment });
  } catch (error) {
    console.error("Error assigning activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to assign activity" },
      { status: 500 }
    );
  }
}
