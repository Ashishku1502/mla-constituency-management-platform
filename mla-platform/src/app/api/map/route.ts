import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import {
  constituencyGeoJSON,
  wardsGeoJSON,
  villagesGeoJSON,
  localitiesGeoJSON,
  pollingStationsGeoJSON,
} from "@/lib/mock-geo-data";

export async function GET() {
  try {
    let mapFeatures = await prisma.mapFeature.findMany();

    // Seed data if empty
    if (mapFeatures.length === 0) {
      const initialFeatures = [
        {
          name: "Constituency Boundary",
          featureType: "Constituency",
          geoJson: JSON.stringify(constituencyGeoJSON),
        },
        {
          name: "Wards",
          featureType: "Ward",
          geoJson: JSON.stringify(wardsGeoJSON),
        },
        {
          name: "Villages",
          featureType: "Village",
          geoJson: JSON.stringify(villagesGeoJSON),
        },
        {
          name: "Localities",
          featureType: "Locality",
          geoJson: JSON.stringify(localitiesGeoJSON),
        },
        {
          name: "Polling Stations",
          featureType: "PollingStation",
          geoJson: JSON.stringify(pollingStationsGeoJSON),
        }
      ];

      for (const feature of initialFeatures) {
        await prisma.mapFeature.create({
          data: feature,
        });
      }

      mapFeatures = await prisma.mapFeature.findMany();
    }

    return NextResponse.json(mapFeatures);
  } catch (error) {
    console.error("Failed to fetch map features:", error);
    return NextResponse.json({ error: "Failed to fetch map features" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, name, featureType, geoJson } = data;

    if (!featureType || !geoJson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let mapFeature;

    if (id) {
      // Update existing
      mapFeature = await prisma.mapFeature.update({
        where: { id },
        data: {
          name,
          geoJson: typeof geoJson === 'string' ? geoJson : JSON.stringify(geoJson),
        },
      });
    } else {
      // Create new
      mapFeature = await prisma.mapFeature.create({
        data: {
          name: name || "New Feature",
          featureType,
          geoJson: typeof geoJson === 'string' ? geoJson : JSON.stringify(geoJson),
        },
      });
    }

    return NextResponse.json(mapFeature);
  } catch (error) {
    console.error("Failed to save map feature:", error);
    return NextResponse.json({ error: "Failed to save map feature" }, { status: 500 });
  }
}
