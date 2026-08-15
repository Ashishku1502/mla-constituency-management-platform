import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Since this platform generally manages a single constituency, we'll try to find the first one
    // or create it if none exists
    let constituency = await prisma.constituency.findFirst();

    if (constituency) {
      // Update existing
      constituency = await prisma.constituency.update({
        where: { id: constituency.id },
        data: {
          name: data.assemblyConstituency,
          constituencyNumber: data.constituencyNumber,
          district: data.district,
          state: data.state,
          population: data.population,
          registeredVoters: data.registeredVoters,
          totalPollingStations: data.pollingStations,
          wards: data.wards,
          villages: data.villages,
          localities: data.localities,
        }
      });
    } else {
      // Create new
      constituency = await prisma.constituency.create({
        data: {
          name: data.assemblyConstituency,
          code: data.assemblyConstituency.toUpperCase().substring(0, 3) + "-" + data.constituencyNumber,
          constituencyNumber: data.constituencyNumber,
          district: data.district,
          state: data.state,
          population: data.population,
          registeredVoters: data.registeredVoters,
          totalPollingStations: data.pollingStations,
          wards: data.wards,
          villages: data.villages,
          localities: data.localities,
        }
      });
    }

    return NextResponse.json({ success: true, constituency });
  } catch (error) {
    console.error("Error saving constituency info:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save constituency info" },
      { status: 500 }
    );
  }
}
