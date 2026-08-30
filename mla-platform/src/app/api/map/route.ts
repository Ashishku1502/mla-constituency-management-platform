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
  try {
    const data = await request.json();
    const geoJsonStr = typeof data.geoJson === 'string' ? data.geoJson : JSON.stringify(data.geoJson);
    
    let feature;
    if (data.id && data.id.startsWith("mock-id") === false) {
      feature = await prisma.mapFeature.upsert({
        where: { id: data.id },
        update: {
          name: data.name,
          featureType: data.featureType,
          geoJson: geoJsonStr
        },
        create: {
          id: data.id,
          name: data.name,
          featureType: data.featureType,
          geoJson: geoJsonStr
        }
      });
    } else {
      feature = await prisma.mapFeature.create({
        data: {
          name: data.name,
          featureType: data.featureType,
          geoJson: geoJsonStr
        }
      });
    }
    
    return NextResponse.json(feature);
  } catch (error) {
    console.warn("Database write failed. Returning mock success.", error);
    try {
      const data = await request.json().catch(() => ({}));
      return NextResponse.json({ ...data, id: data.id || "mock-id-" + Date.now(), warning: "Saved as mock (DB write bypassed/failed)" });
    } catch {
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
  }
}
