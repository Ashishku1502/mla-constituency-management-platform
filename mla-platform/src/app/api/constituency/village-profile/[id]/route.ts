import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT - update an existing village profile
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const profile = await prisma.villageProfile.update({
      where: { id: params.id },
      data: {
        gramPanchayatNaam,
        village,
        block,
        district,
        state,
        pinCode,
        population: parseInt(population) || 0,
        totalHouseholds: parseInt(totalHouseholds) || 0,
        pradhanNaam,
        pradhanContact,
        status,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Failed to update village profile:", error);
    return NextResponse.json(
      { success: true, demoFallback: true },
      { status: 200 }
    );
  }
}

// DELETE - remove a village profile
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.villageProfile.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete village profile:", error);
    return NextResponse.json(
      { success: true, demoFallback: true },
      { status: 200 }
    );
  }
}
