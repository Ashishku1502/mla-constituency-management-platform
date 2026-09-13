import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Find or create default user for the reporter if not passed
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { name: "Demo User", email: "demo@example.com", mobile: "1234567890", passwordHash: "hash" }
      });
    }

    const areaId = formData.get("areaId") as string;
    const category = formData.get("category") as string;
    const priority = formData.get("priority") as string;
    const description = formData.get("description") as string;
    const dateReported = formData.get("dateReported") as string;
    const image = formData.get("image") as File | null;

    if (!areaId) {
      return NextResponse.json({ success: false, error: "Area is required" }, { status: 400 });
    }

    let imageUrl = null;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "issues");

      await fs.mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);

      imageUrl = `/uploads/issues/${filename}`;
    }

    const issue = await prisma.issue.create({
      data: {
        category,
        priority,
        description,
        dateReported,
        reportedById: user.id,
        areaId,
        imageUrl,
      }
    });

    return NextResponse.json({ success: true, issue });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create issue" },
      { status: 500 }
    );
  }
}

