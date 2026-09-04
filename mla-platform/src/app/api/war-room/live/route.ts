import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to generate a slight random offset from a given center
function generateRandomCoordinates(centerLat: number, centerLng: number) {
  const latOffset = (Math.random() - 0.5) * 0.1; // roughly 10km radius
  const lngOffset = (Math.random() - 0.5) * 0.1;
  return [centerLat + latOffset, centerLng + lngOffset];
}

export async function GET() {
  try {
    // Default fallback center (Muzaffarnagar)
    const centerLat = 29.4727;
    const centerLng = 77.7085;

    // Try to get constituency center from DB if we had coordinates, but we don't in schema
    // We will just use the fallback for now as it represents the center of the demo map.
    const issues = await prisma.issue.findMany({
      where: {
        status: { notIn: ["Resolved", "Closed"] }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const groundReports = await prisma.groundReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 20
    });

    const mapData = [
      ...issues.map(i => ({
        id: i.id,
        type: "Issue",
        title: i.category,
        description: i.description,
        priority: i.priority,
        coordinates: generateRandomCoordinates(centerLat, centerLng), // In production, parse i.location or use dedicated lat/lng fields
        timestamp: i.createdAt
      })),
      ...groundReports.map(gr => ({
        id: gr.id,
        type: "GroundReport",
        title: "Ground Report",
        description: gr.notes,
        priority: "Normal",
        coordinates: generateRandomCoordinates(centerLat, centerLng),
        timestamp: gr.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ success: true, data: mapData });
  } catch (error) {
    console.error("Failed to fetch live war room data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

