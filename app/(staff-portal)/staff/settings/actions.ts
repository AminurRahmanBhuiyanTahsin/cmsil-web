"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Helper function to log actions
async function logAction(action: string, targetTable: string, details: string) {
  const cookieStore = await cookies();
  const adminEmail = cookieStore.get("userEmail")?.value || "System";
  await db.execute(
    "INSERT INTO system_logs (adminEmail, action, targetTable, details) VALUES (?, ?, ?, ?)",
    [adminEmail, action, targetTable, details]
  );
}

export async function addStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const staffId = formData.get("staffId") as string;
  const role = formData.get("role") as string;
  
  // Create a secure default password: "password123"
  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  await db.execute(
    "INSERT INTO staff (staffId, name, email, role, status, passwordHash) VALUES (?, ?, ?, ?, 'ACTIVE', ?)", 
    [staffId, name, email, role, defaultPasswordHash]
  );
  
  await logAction("INSERT", "staff", `Created new staff account: ${email} as ${role}`);
  revalidatePath("/staff/settings");
}

export async function updateStaffRole(formData: FormData) {
  const id = formData.get("id");
  const newRole = formData.get("role");
  
  await db.execute("UPDATE staff SET role = ? WHERE id = ?", [newRole, id]);
  await logAction("UPDATE", "staff", `Changed staff ID ${id} role to ${newRole}`);
  revalidatePath("/staff/settings");
}

export async function toggleStaffStatus(formData: FormData) {
  const id = formData.get("id");
  const currentStatus = formData.get("currentStatus");
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  
  await db.execute("UPDATE staff SET status = ? WHERE id = ?", [newStatus, id]);
  await logAction("UPDATE", "staff", `Changed staff ID ${id} status to ${newStatus}`);
  revalidatePath("/staff/settings");
}

export async function addTeacher(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const facultyId = formData.get("facultyId") as string;
    const department = formData.get("department") as string;
    const designation = formData.get("designation") as string;
    
    // Same secure default password: "password123"
    const defaultPasswordHash = await bcrypt.hash("password123", 10);
  
    await db.execute(
      "INSERT INTO faculty (facultyId, name, email, department, designation, status, passwordHash) VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)", 
      [facultyId, name, email, department, designation, defaultPasswordHash]
    );
    
    await logAction("INSERT", "faculty", `Created new faculty account: ${facultyId}`);
    revalidatePath("/staff/settings");
  }
  
  export async function updateTeacherDesignation(formData: FormData) {
    const id = formData.get("id");
    const designation = formData.get("designation");
    
    await db.execute("UPDATE faculty SET designation = ? WHERE id = ?", [designation, id]);
    await logAction("UPDATE", "faculty", `Changed faculty ID ${id} designation to ${designation}`);
    revalidatePath("/staff/settings");
  }
  
  export async function toggleTeacherStatus(formData: FormData) {
    const id = formData.get("id");
    const currentStatus = formData.get("currentStatus");
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    await db.execute("UPDATE faculty SET status = ? WHERE id = ?", [newStatus, id]);
    await logAction("UPDATE", "faculty", `Changed faculty ID ${id} status to ${newStatus}`);
    revalidatePath("/staff/settings");
  }

  export async function addStudent(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const institutionalRoll = formData.get("institutionalRoll") as string;
    const department = formData.get("department") as string;
    
    // 1. Grab the custom password the Admin typed in
    const customPassword = formData.get("password") as string;
    
    // 2. Hash their custom password securely
    const passwordHash = await bcrypt.hash(customPassword, 10);
  
    // 3. Save to database
    await db.execute(
      "INSERT INTO enrolledstudent (institutionalRoll, name, email, department, currentSemester, cgpa, status, passwordHash) VALUES (?, ?, ?, ?, '1', 0.00, 'ACTIVE', ?)", 
      [institutionalRoll, name, email, department, passwordHash]
    );
    
    await logAction("INSERT", "enrolledstudent", `Provisioned new student: ${institutionalRoll}`);
    revalidatePath("/staff/settings");
  }
  
  export async function updateStudentDepartment(formData: FormData) {
    const id = formData.get("id");
    const department = formData.get("department");
    
    await db.execute("UPDATE enrolledstudent SET department = ? WHERE id = ?", [department, id]);
    await logAction("UPDATE", "enrolledstudent", `Changed student ID ${id} department to ${department}`);
    revalidatePath("/staff/settings");
  }
  
  export async function toggleStudentStatus(formData: FormData) {
    const id = formData.get("id");
    const currentStatus = formData.get("currentStatus");
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    await db.execute("UPDATE enrolledstudent SET status = ? WHERE id = ?", [newStatus, id]);
    await logAction("UPDATE", "enrolledstudent", `Changed student ID ${id} status to ${newStatus}`);
    revalidatePath("/staff/settings");
  }