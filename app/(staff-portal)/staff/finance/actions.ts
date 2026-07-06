"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// MAKE SURE 'export' is here!
export async function updatePaymentStatus(formData: FormData) {
  const id = formData.get("id");
  await db.execute("UPDATE StudentFee SET status = 'PAID' WHERE id = ?", [id]);
  revalidatePath("/staff/finance");
}