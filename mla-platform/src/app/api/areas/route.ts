import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const areaSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional(),
  population: z.coerce.number().int().nonnegative().default(0),
  registeredVoters: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  constituencyId: z.string(),
  description: z.string().optional(),
  geographicBoundary: z.string().optional(),
  managerId: z.string().optional(),
  pollingStationIds: z.array(z.string()).optional(),
  wardIds: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {


    const { searchParams } = new URL(req.url);
    const constituencyId = searchParams.get("constituencyId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (constituencyId) {
      whereClause.constituencyId = constituencyId;
    }
    if (status && status !== "all") {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { code: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const areas = await prisma.area.findMany({
      where: whereClause,
      include: {
        managers: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Formatting for client consumption matching mockAreas
    const formattedAreas = areas.map((area: any) => ({
      id: area.id,
      name: area.name,
      code: area.code,
      population: area.population,
      status: area.status,
      householdCoverage: area.householdCoverage,
      manager: area.managers[0]?.user.name || "Unassigned",
      managerId: area.managers[0]?.user.id || null,
    }));

    return NextResponse.json({ success: true, data: formattedAreas });
  } catch (error: any) {
    console.error("GET areas error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {


    const body = await req.json();
    const result = areaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    let { name, code, population, registeredVoters, status, constituencyId, description, geographicBoundary, managerId, pollingStationIds, wardIds } = result.data;

    // Auto-generate code if missing
    if (!code) {
      code = name.substring(0, 3).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
    }

    // Check code unique
    const existingArea = await prisma.area.findUnique({
      where: { code },
    });

    if (existingArea) {
      return NextResponse.json(
        { success: false, message: "An area with this code already exists." },
        { status: 400 }
      );
    }

    const area = await prisma.area.create({
      data: {
        name,
        code,
        population,
        registeredVoters,
        status,
        constituencyId,
        description,
        geographicBoundary,
        ...(pollingStationIds && pollingStationIds.length > 0 && {
          pollingStations: {
            connect: pollingStationIds.map(id => ({ id }))
          }
        }),
        ...(wardIds && wardIds.length > 0 && {
          wards: {
            connect: wardIds.map(id => ({ id }))
          }
        }),
        ...(managerId && managerId !== "unassigned" && {
          managers: {
            create: {
              userId: managerId
            }
          }
        })
      },
    });

    return NextResponse.json({ success: true, data: area }, { status: 201 });
  } catch (error: any) {
    console.error("POST area error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
