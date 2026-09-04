import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activityId = params.id;
    const body = await req.json();
    const { pollingStationId } = body;

    if (!pollingStationId) {
      return NextResponse.json(
        { success: false, error: "Polling Station ID is required" },
        { status: 400 }
      );
    }

    // Get the Team Leader for this Polling Station
    const pollingStation = await prisma.pollingStation.findUnique({
      where: { id: pollingStationId },
      select: { teamLeaderId: true }
    });

    if (!pollingStation) {
      return NextResponse.json(
        { success: false, error: "Polling Station not found" },
        { status: 404 }
      );
    }

    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        pollingStationId: pollingStationId,
        teamLeaderId: pollingStation.teamLeaderId,
        status: "Scheduled" // Update status once forwarded
      }
    });

    return NextResponse.json({ success: true, activity: updatedActivity });
  } catch (error) {
    console.error("Error forwarding activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to forward activity" },
      { status: 500 }
    );
  }
}
