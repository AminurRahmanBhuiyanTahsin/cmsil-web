"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. We define the helper here so the file knows what it is!
async function logAction(action: string, targetTable: string, details: string) {
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value || "System";
  await db.execute(
    "INSERT INTO system_logs (adminEmail, action, targetTable, details) VALUES (?, ?, ?, ?)",
    [email, action, targetTable, details]
  );
}

// 2. Updated Password Action
export async function updatePassword(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value;
  
  if (!email) return { success: false, message: "Session expired." };
  
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const [rows]: any = await db.execute("SELECT passwordHash FROM faculty WHERE email = ?", [email]);
  if (rows.length === 0) return { success: false, message: "User not found." };
  
  const user = rows[0];

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) return { success: false, message: "Current password incorrect." };

  const hashedNew = await bcrypt.hash(newPassword, 10);
  await db.execute("UPDATE faculty SET passwordHash = ? WHERE email = ?", [hashedNew, email]);

  await logAction("UPDATE", "faculty", `User ${email} updated their password.`);
  revalidatePath("/teacher/profile");
  return { success: true, message: "Password updated successfully!" };
}

// 3. Updated Profile Action
export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get("userEmail")?.value;
  if (!email) return { success: false, message: "Unauthorized." };

  const highestDegree = formData.get("highestDegree");
  const almaMater = formData.get("almaMater");
  const roomNumber = formData.get("roomNumber");
  const researchInterest = formData.get("researchInterest");

  await db.execute(
    "UPDATE faculty SET highestDegree = ?, almaMater = ?, roomNumber = ?, researchInterest = ? WHERE email = ?",
    [highestDegree, almaMater, roomNumber, researchInterest, email]
  );

  await logAction("UPDATE", "faculty", `Teacher ${email} updated their profile info.`);
  revalidatePath("/teacher/profile");
  return { success: true, message: "Profile updated!" };
}