"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadVoterListAction(records: any[]) {
  try {
    // Find a default polling station to attach records to for the demo
    const ps = await prisma.pollingStation.findFirst();
    if (!ps) {
        return { success: false, error: "No Polling Station found to attach records to." };
    }

    const formattedRecords = records.map((r, index) => ({
      voterId: r.EPIC || r.voterId || `EPIC-${Date.now()}-${index}`,
      name: r.Name || r.name || "Unknown Voter",
      address: r.Address || r.Location || r.address || "Unknown Address",
      mobile: r.Mobile || null,
      pollingStationId: ps.id,
      validationStatus: "Pending",
    }));

    let successCount = 0;
    for (const record of formattedRecords) {
        try {
            await prisma.record.upsert({
                where: { voterId: record.voterId },
                update: {}, // ignore duplicates
                create: record
            });
            successCount++;
        } catch (e) {
            console.error("Duplicate or invalid record", e);
        }
    }

    revalidatePath("/constituency/wards");
    return { success: true, count: successCount };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload voter list" };
  }
}

export async function createInternalWardsAction(villageName: string, method: string, value: number) {
  try {
    const area = await prisma.area.findFirst();
    if (!area) {
        return { success: false, error: "No Area found to attach Wards to." };
    }

    const newWardName = `${villageName} - Auto Ward ${Math.floor(Math.random() * 100)}`;
    
    await prisma.ward.create({
        data: {
            name: newWardName,
            type: "Ward",
            areaId: area.id,
            population: method === 'fixed' ? value : 500, // Simulated population distribution
            households: method === 'fixed' ? Math.floor(value / 5) : 100
        }
    });

    revalidatePath("/constituency/wards");
    return { success: true };
  } catch (error) {
    console.error("Create wards error:", error);
    return { success: false, error: "Failed to create wards" };
  }
}
