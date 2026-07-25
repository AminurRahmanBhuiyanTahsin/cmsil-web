"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto"; 

export async function submitFacultyTicket(formData: FormData) {
  const cookieStore = await cookies();
  // IMPORTANT: Change "teacherEmail" to whatever cookie you actually use for teachers!
  const email = cookieStore.get("teacherEmail")?.value; 

  if (!email) {
    throw new Error("Unauthorized: Not logged in");
  }

  // Fetch the teacher's internal ID from the faculty table
  const [facultyRows] = await db.execute("SELECT id, email FROM faculty WHERE email = ?", [email]);
  const faculty = (facultyRows as any[])[0];

  if (!faculty) {
    throw new Error("Faculty record not found");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  // Generate a random ticket number
  const ticketNumber = `TKT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  try {
    await db.execute(`
      INSERT INTO tickets 
      (ticketNumber, title, description, priority, status, reporterType, reporterId, reporterEmail) 
      VALUES (?, ?, ?, ?, 'OPEN', 'FACULTY', ?, ?)
    `, [
      ticketNumber, 
      title, 
      description, 
      priority, 
      faculty.id, 
      faculty.email
    ]);
  } catch (error) {
    console.error("Failed to submit ticket:", error);
    throw new Error("Database error while submitting the ticket.");
  }

  // Refresh the teacher helpdesk page
  revalidatePath("/teacher/helpdesk");
}