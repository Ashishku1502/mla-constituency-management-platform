import { NextResponse } from "next/server";
import {
  constituencyGeoJSON,
  wardsGeoJSON,
  villagesGeoJSON,
  localitiesGeoJSON,
  pollingStationsGeoJSON,
} from "@/lib/mock-geo-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json([
    { name: "Constituency Boundary", featureType: "Constituency", geoJson: JSON.stringify(constituencyGeoJSON) },
    { name: "Wards", featureType: "Ward", geoJson: JSON.stringify(wardsGeoJSON) },
    { name: "Villages", featureType: "Village", geoJson: JSON.stringify(villagesGeoJSON) },
    { name: "Localities", featureType: "Locality", geoJson: JSON.stringify(localitiesGeoJSON) },
    { name: "Polling Stations", featureType: "PollingStation", geoJson: JSON.stringify(pollingStationsGeoJSON) }
  ]);
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
