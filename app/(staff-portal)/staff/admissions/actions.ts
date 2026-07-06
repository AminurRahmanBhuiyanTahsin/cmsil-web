"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// MAKE SURE 'export' is here!
export async function approveAdmission(formData: FormData) {
  const id = formData.get("id");
  
  // 1. Update the status
  await db.execute("UPDATE admission_applications SET status = 'approved' WHERE id = ?", [id]);
  
  // 2. Refresh the page
  revalidatePath("/staff/admissions");
}