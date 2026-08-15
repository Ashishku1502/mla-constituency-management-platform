import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // In a real app, you would get the userId from the session/token
    // const session = await auth();
    // const userId = session?.user?.id;
    
    // For demonstration, we will just use a hardcoded demo user ID, or create a mock user if one doesn't exist
    let user = await prisma.user.findFirst({ where: { role: "Candidate" } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          mobile: data.phone,
          passwordHash: "demo_hash",
          role: "Candidate",
          status: "Active"
        }
      });
    }

    const userId = user.id;

    // Upsert the candidate profile
    const profile = await prisma.candidateProfile.upsert({
      where: { userId },
      update: {
        name: data.name,
        designation: data.designation,
        politicalInfo: data.politicalInfo || null,
        email: data.email,
        phone: data.phone,
        biography: data.biography || null,
        education: data.education || null,
        experience: data.experience || null,
        publicProfile: data.publicProfile || null,
      },
      create: {
        userId,
        name: data.name,
        designation: data.designation,
        politicalInfo: data.politicalInfo || null,
        email: data.email,
        phone: data.phone,
        biography: data.biography || null,
        education: data.education || null,
        experience: data.experience || null,
        publicProfile: data.publicProfile || null,
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error saving candidate profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save candidate profile" },
      { status: 500 }
    );
  }
}
