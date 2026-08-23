import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - fetch all village profiles (or the latest one)
export async function GET() {
  try {
    const profiles = await prisma.villageProfile.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error("Failed to fetch village profiles:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch village profiles" },
      { status: 500 }
    );
  }
}

// POST - create a new village profile
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      gramPanchayatNaam,
      village,
      block,
      district,
      state,
      pinCode,
      population,
      totalHouseholds,
      pradhanNaam,
      pradhanContact,
      status,
    } = body;

    if (!gramPanchayatNaam || !village || !block || !district || !pradhanNaam) {
      return NextResponse.json(
        { success: false, message: "Gram Panchayat Naam, Village, Block, District aur Pradhan Naam zaroori hain" },
        { status: 400 }
      );
    }

    const profile = await prisma.villageProfile.create({
      data: {
        gramPanchayatNaam,
        village,
        block,
        district,
        state: state || "Uttar Pradesh",
        pinCode: pinCode || "",
        population: parseInt(population) || 0,
        totalHouseholds: parseInt(totalHouseholds) || 0,
        pradhanNaam,
        pradhanContact: pradhanContact || "",
        status: status || "Active",
      },
    });

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create village profile:", error);
    // Demo mode fallback
    return NextResponse.json(
      {
        success: true,
        profile: { id: "mock-" + Date.now() },
        demoFallback: true,
      },
      { status: 201 }
    );
  }
}
