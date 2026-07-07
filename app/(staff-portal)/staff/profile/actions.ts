"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateStaffProfile(formData: FormData) {
  const id = formData.get("id");
  const phone = formData.get("phone");
  const imageUrl = formData.get("imageUrl");

  await db.execute(
    "UPDATE staff SET phone = ?, imageUrl = ? WHERE id = ?", 
    [phone, imageUrl, id]
  );
  
  revalidatePath("/staff/profile");
}