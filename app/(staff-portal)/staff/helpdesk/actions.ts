"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto"; 

export async function submitStaffTicket(formData: FormData) {
  const cookieStore = await cookies();
  const email = cookieStore.get("staffEmail")?.value; 

  if (!email) {
    throw new Error("Unauthorized: Not logged in");
  }

  // Fetch the staff member's internal ID from the staff table
  const [staffRows] = await db.execute("SELECT id, email FROM staff WHERE email = ?", [email]);
  const staffMember = (staffRows as any[])[0];

  if (!staffMember) {
    throw new Error("Staff record not found");
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
      VALUES (?, ?, ?, ?, 'OPEN', 'STAFF', ?, ?)
    `, [
      ticketNumber, 
      title, 
      description, 
      priority, 
      staffMember.id, 
      staffMember.email
    ]);
  } catch (error) {
    console.error("Failed to submit ticket:", error);
    throw new Error("Database error while submitting the ticket.");
  }

  // Refresh the staff helpdesk page
  revalidatePath("/staff/helpdesk");
}