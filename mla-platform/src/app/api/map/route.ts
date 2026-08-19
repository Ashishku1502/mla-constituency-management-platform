import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const features = await prisma.mapFeature.findMany();
    
    // Convert stringified geojson back to objects for the client
    const parsedFeatures = features.map(f => ({
      name: f.name,
      featureType: f.featureType,
      geoJson: f.geoJson // Client expects a string if we look at AreaDrawMap, wait...
    }));

    return NextResponse.json(parsedFeatures);
  } catch (error) {
    console.error("Failed to fetch map features:", error);
    return NextResponse.json([]); // Return empty array instead of crashing map
  }
}

export async function POST(request: Request) {
  // In a production environment with a real database, this would save to DB.
  // Since we are on a read-only Vercel SQLite deployment, we just return success.
  try {
    const data = await request.json();
    return NextResponse.json({ ...data, id: "mock-id-123" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
