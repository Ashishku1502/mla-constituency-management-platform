import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/records/[id]/sentiment
// Body: { sentiment: "S" | "N" | "A", comments?: string, photoUrl?: string }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { sentiment, comments, photoUrl } = body;

    if (!["S", "N", "A"].includes(sentiment)) {
      return NextResponse.json(
        { error: "Invalid sentiment. Must be S, N, or A." },
        { status: 400 }
      );
    }

    const updated = await prisma.record.update({
      where: { id },
      data: {
        sentiment,
        ...(comments !== undefined && { comments }),
        ...(photoUrl !== undefined && { photoUrl }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        voterId: true,
        sentiment: true,
        comments: true,
        photoUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Voter record not found." }, { status: 404 });
    }
    console.error("Sentiment update error:", error);
    return NextResponse.json({ error: "Failed to update sentiment." }, { status: 500 });
  }
}

// Keep legacy POST support as well
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}

// GET /api/records/[id]/sentiment
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const record = await prisma.record.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        voterId: true,
        sentiment: true,
        comments: true,
        photoUrl: true,
        updatedAt: true,
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Voter record not found." }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("Sentiment fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch sentiment." }, { status: 500 });
  }
}
