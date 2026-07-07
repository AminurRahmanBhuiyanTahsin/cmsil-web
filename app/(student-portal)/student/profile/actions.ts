"use server";

import { db } from "@/lib/db"; 
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Helper function to securely get the logged-in student's ID
async function getSessionStudentId() {
  const cookieStore = await cookies();
  
  // 🚀 SMARTER CHECK: It will look for any of these common cookie names
  const id = cookieStore.get("studentId")?.value 
          || cookieStore.get("userId")?.value 
          || cookieStore.get("id")?.value
          || cookieStore.get("user_id")?.value;
          
  return id ? parseInt(id, 10) : null;
}

// 1. Fetch Profile Data
export async function getStudentProfile() {
  try {
    const studentId = await getSessionStudentId();
    if (!studentId) return { success: false, message: "Unauthorized: No session found." };

    const [rows]: any = await db.execute(
      `SELECT id, name, institutionalRoll, classRoll, email, imageUrl, phone, department, currentSemester, cgpa, bloodGroup, presentAddress 
       FROM enrolledstudent WHERE id = ?`,
      [studentId]
    );

    if (rows.length === 0) return { success: false, message: "Profile not found" };
    
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, message: "Failed to load profile" };
  }
}

// 2. Update Personal Info
export async function updateProfileInfo(formData: { phone: string, presentAddress: string, bloodGroup: string }) {
  try {
    const studentId = await getSessionStudentId();
    if (!studentId) return { success: false, message: "Unauthorized." };

    await db.execute(
      `UPDATE enrolledstudent SET phone = ?, presentAddress = ?, bloodGroup = ? WHERE id = ?`,
      [formData.phone, formData.presentAddress, formData.bloodGroup, studentId]
    );
    
    revalidatePath('/student/profile'); 
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

// 3. Update Password
export async function updatePassword(newPassword: string) {
  try {
    const studentId = await getSessionStudentId();
    if (!studentId) return { success: false, message: "Unauthorized." };

    await db.execute(
      `UPDATE enrolledstudent SET password = ? WHERE id = ?`,
      [newPassword, studentId]
    );
    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, message: "Failed to update password" };
  }
}