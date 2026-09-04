import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, description, objective, startTime, endTime, areaMappings } = body;

    // We will collect created activity IDs here
    const createdActivities: string[] = [];

    // Begin a transaction if possible, or just sequential creates
    // Using sequential to handle relations properly
    for (const mapping of areaMappings) {
      const { areaId, pollingStations, date } = mapping;

      for (const psId of pollingStations) {
        // Find the team leader for this PS (if any)
        const pollingStation = await prisma.pollingStation.findUnique({
          where: { id: psId },
          select: { id: true, name: true, teamLeaderId: true }
        });

        // Create the activity for this specific Area + PS + Date
        const activity = await prisma.activity.create({
          data: {
            name,
            category,
            description: description || "",
            objective: objective || "",
            date,
            startTime: startTime || "09:00",
            endTime: endTime || "17:00",
            location: pollingStation?.name || "Multiple Locations",
            areaId,
            pollingStationId: psId,
            status: "Scheduled",
            deadline: date,
            teamLeaderId: pollingStation?.teamLeaderId || null,
          }
        });

        createdActivities.push(activity.id);

        // Fetch Area Manager, Team Leader, and Volunteers for this PS
        const usersToNotify = [];

        // 1. Area Manager
        const areaManager = await prisma.areaManager.findFirst({
          where: { areaId },
          include: { user: true }
        });
        if (areaManager?.userId) usersToNotify.push(areaManager.userId);

        // 2. Team Leader
        if (pollingStation?.teamLeaderId) {
          const teamLeader = await prisma.teamLeader.findUnique({
            where: { id: pollingStation.teamLeaderId },
            include: { user: true }
          });
          if (teamLeader?.userId) usersToNotify.push(teamLeader.userId);
        }

        // 3. Volunteers assigned to this PS
        const volunteers = await prisma.volunteer.findMany({
          where: { areaId, pollingStationId: psId },
          include: { user: true }
        });

        for (const vol of volunteers) {
          if (vol.userId) usersToNotify.push(vol.userId);
          
          // Optionally assign activity to volunteers
          await prisma.activityAssignment.create({
            data: {
              activityId: activity.id,
              volunteerId: vol.id,
              status: "Assigned"
            }
          });
        }

        // Remove duplicate user IDs
        const uniqueUserIds = Array.from(new Set(usersToNotify));

        // Create Notifications
        const notifications = uniqueUserIds.map((userId) => ({
          userId,
          title: "New Activity Assigned",
          message: `You have been assigned to a new activity: ${name} on ${date}.`,
          type: "Activity Assignment",
          time: new Date().toLocaleTimeString(),
          read: false
        }));

        if (notifications.length > 0) {
          await prisma.notification.createMany({
            data: notifications
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bulk activities created successfully.",
      createdCount: createdActivities.length
    });

  } catch (error) {
    console.error("Bulk create activity error:", error);
    return NextResponse.json(
      { error: "Failed to create bulk activities" },
      { status: 500 }
    );
  }
}
