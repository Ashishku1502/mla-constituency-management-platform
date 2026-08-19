import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, status, assignedToId } = data;

    if (!id) {
      return NextResponse.json({ success: false, error: "Issue ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId === "unassigned" ? null : assignedToId;

    const issue = await prisma.issue.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, issue });
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update issue" },
      { status: 500 }
    );
  }
}
