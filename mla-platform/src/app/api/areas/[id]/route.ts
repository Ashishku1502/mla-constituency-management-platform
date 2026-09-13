import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const areaSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional(),
  population: z.coerce.number().int().nonnegative().default(0),
  registeredVoters: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  description: z.string().optional(),
  geographicBoundary: z.string().optional(),
  managerId: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = areaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      name,
      code,
      population,
      registeredVoters,
      status,
      description,
      geographicBoundary,
      managerId,
    } = result.data;

    // Check code unique if changed
    if (code) {
      const existingArea = await prisma.area.findFirst({
        where: { code, id: { not: id } },
      });
      if (existingArea) {
        return NextResponse.json(
          { success: false, message: "An area with this code already exists." },
          { status: 400 }
        );
      }
    }

    // Delete existing managers for this area to easily handle reassignment
    await prisma.areaManager.deleteMany({
      where: { areaId: id },
    });

    let area;
    try {
      area = await prisma.area.update({
        where: { id },
        data: {
          name,
          ...(code && { code }),
          population,
          registeredVoters,
          status,
          description,
          geographicBoundary,
          ...(managerId && managerId !== "unassigned" && {
            managers: {
              create: {
                userId: managerId,
              },
            },
          }),
        },
      });
    } catch (dbError) {
      console.warn("Database write failed during Area update.", dbError);
      return NextResponse.json(
        { success: false, message: "Database error occurred during update." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: area });
  } catch (error) {
    console.error("PUT area error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.area.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE area error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred while deleting the area." },
      { status: 500 }
    );
  }
}
