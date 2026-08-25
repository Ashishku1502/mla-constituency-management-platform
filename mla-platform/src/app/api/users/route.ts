import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(["Candidate", "Admin", "Area Manager", "Team Leader", "Volunteer"]),
  status: z.enum(["Active", "Inactive", "Pending"]).default("Active"),
  areaId: z.string().optional(),
  pollingStationId: z.string().optional(),
});

export async function GET(req: Request) {
  try {


    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (role && role !== "all") {
      whereClause.role = role;
    }
    if (status && status !== "all") {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { mobile: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        status: true,
        joinedDate: true,
        areaManager: {
          select: { area: { select: { id: true, name: true } } },
        },
        teamLeader: {
          select: { area: { select: { id: true, name: true } } },
        },
        volunteer: {
          select: {
            area: { select: { id: true, name: true } },
            pollingStation: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { joinedDate: "desc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {


    const body = await req.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, mobile, password, role, status, areaId, pollingStationId } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "A user with this email or mobile number already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        passwordHash,
        role,
        status,
      },
    });

    // Create custom role profile maps
    if (role === "Area Manager" && areaId) {
      await prisma.areaManager.create({
        data: { userId: user.id, areaId },
      });
    } else if (role === "Team Leader" && areaId) {
      await prisma.teamLeader.create({
        data: { userId: user.id, areaId },
      });
    } else if (role === "Volunteer" && areaId) {
      await prisma.volunteer.create({
        data: { userId: user.id, areaId, pollingStationId: pollingStationId || null },
      });
    }

    return NextResponse.json({ success: true, data: { id: user.id, name: user.name, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error("POST user error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

