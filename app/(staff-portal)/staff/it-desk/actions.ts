"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function resolveTicket(formData: FormData) {
  const id = formData.get("id");
  
  try {
    // Updates the status and records the resolution time
    await db.execute(
      "UPDATE tickets SET status = 'RESOLVED', resolvedAt = NOW() WHERE id = ?", 
      [id]
    );
  } catch (error) {
    console.error("Failed to resolve ticket:", error);
    throw new Error("Failed to update ticket status.");
  }
  
  revalidatePath("/staff/it-desk");
}