import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = params.id;
    const body = await req.json();
    const { assignmentId } = body;

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    // Update assignment status
    const updatedAssignment = await prisma.activityAssignment.update({
      where: { id: assignmentId },
      data: { status: "In Progress" }
    });

    // Update activity status
    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: { status: "In Progress" }
    });

    return NextResponse.json({ success: true, activity: updatedActivity, assignment: updatedAssignment });
  } catch (error) {
    console.error("Error starting activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start activity" },
      { status: 500 }
    );
  }
}
