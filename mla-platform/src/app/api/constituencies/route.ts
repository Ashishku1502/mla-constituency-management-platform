import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const constituencySchema = z.object({
  name: z.string().min(2),
  state: z.string().min(2),
  code: z.string().min(2),
  population: z.number().int().positive(),
  totalAreas: z.number().int().nonnegative().optional(),
  totalPollingStations: z.number().int().nonnegative().optional(),
  totalHouseholds: z.number().int().nonnegative().optional(),
});

export async function GET() {
  try {


    const constituencies = await prisma.constituency.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: constituencies });
  } catch (error: any) {
    console.error("GET constituencies error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {


    const body = await req.json();
    const result = constituencySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const constituency = await prisma.constituency.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: constituency }, { status: 201 });
  } catch (error: any) {
    console.error("POST constituency error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
