import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapCenter } from "@/lib/mock-geo-data"; // [21.7645, 78.8718]

// Helper to generate a slight random offset from the map center
function generateRandomCoordinates() {
  const [baseLat, baseLng] = mapCenter;
  const latOffset = (Math.random() - 0.5) * 0.1; // roughly 10km radius
  const lngOffset = (Math.random() - 0.5) * 0.1;
  return [baseLat + latOffset, baseLng + lngOffset];
}

export async function GET() {
  try {
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
        coordinates: generateRandomCoordinates(), // In production, parse i.location or use dedicated lat/lng fields
        timestamp: i.createdAt
      })),
      ...groundReports.map(gr => ({
        id: gr.id,
        type: "GroundReport",
        title: "Ground Report",
        description: gr.notes,
        priority: "Normal",
        coordinates: generateRandomCoordinates(),
        timestamp: gr.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ success: true, data: mapData });
  } catch (error: any) {
    console.error("Failed to fetch live war room data:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
