"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";

// 1. Reject Application
export async function rejectAdmission(formData: FormData) {
  const id = formData.get("id");
  
  await db.execute("UPDATE admission_applications SET status = 'rejected' WHERE id = ?", [id]);
  revalidatePath("/staff/admissions");
}

// 2. Complete Enrollment & Approve
export async function enrollStudent(formData: FormData) {
  const applicationId = formData.get("applicationId");
  
  const name = formData.get("name");
  const email = formData.get("email");
  const department = formData.get("department");
  const institutionalRoll = formData.get("institutionalRoll");
  const classRoll = formData.get("classRoll");
  const phone = formData.get("phone");
  const bloodGroup = formData.get("bloodGroup");
  const presentAddress = formData.get("presentAddress");
  const permanentAddress = formData.get("permanentAddress");
  const batchId = formData.get("batchId");
  const rawPassword = formData.get("password") as string;

  const passwordHash = crypto.createHash("sha256").update(rawPassword).digest("hex");

  try {
    // Insert into the enrolledstudent table
    await db.execute(`
      INSERT INTO enrolledstudent 
      (institutionalRoll, classRoll, name, email, imageUrl, phone, department, bloodGroup, presentAddress, permanentAddress, batchId, passwordHash) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      institutionalRoll, 
      classRoll, 
      name, 
      email, 
      "/default-avatar.png", 
      phone, 
      department, 
      bloodGroup, 
      presentAddress, 
      permanentAddress, 
      batchId, 
      passwordHash
    ]);

    // Update the original admission application status to 'approved'
    await db.execute("UPDATE admission_applications SET status = 'approved' WHERE id = ?", [applicationId]);

  } catch (error) {
    console.error("Failed to enroll student:", error);
    throw new Error("Failed to enroll student. Check if the Institutional Roll or Email already exists.");
  }

  // Refresh the admissions page and send the staff member back
  revalidatePath("/staff/admissions");
  redirect("/staff/admissions");
}