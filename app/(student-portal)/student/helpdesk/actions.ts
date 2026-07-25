"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto"; 

export async function submitTicket(formData: FormData) {
  const cookieStore = await cookies();
  const roll = cookieStore.get("institutionalRoll")?.value;

  if (!roll) {
    throw new Error("Unauthorized: Not logged in");
  }

  // Securely get the student's internal ID and email
  const [studentRows] = await db.execute("SELECT id, email FROM enrolledstudent WHERE institutionalRoll = ?", [roll]);
  const student = (studentRows as any[])[0];

  if (!student) {
    throw new Error("Student record not found");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  // Generate a random ticket number (e.g., TKT-8F3A2)
  const ticketNumber = `TKT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  try {
    await db.execute(`
      INSERT INTO tickets 
      (ticketNumber, title, description, priority, status, reporterType, reporterId, reporterEmail) 
      VALUES (?, ?, ?, ?, 'OPEN', 'STUDENT', ?, ?)
    `, [
      ticketNumber, 
      title, 
      description, 
      priority, 
      student.id, 
      student.email
    ]);
  } catch (error) {
    console.error("Failed to submit ticket:", error);
    throw new Error("Database error while submitting the ticket.");
  }

  // Refresh the helpdesk page so the new ticket appears instantly
  revalidatePath("/student/helpdesk");
}