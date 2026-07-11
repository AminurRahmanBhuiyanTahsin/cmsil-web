"use server";

import { db } from "@/lib/db"; 
import { cookies } from "next/headers"; // Added cookie import!

export async function getStudentFees() { // Removed the studentId parameter
  try {
    // 1. Get the dynamic student ID from the cookie
    const cookieStore = await cookies();
    const studentIdString = cookieStore.get("studentId")?.value;
    
    if (!studentIdString) {
      return { success: false, message: "Unauthorized: No session found." };
    }
    
    const studentId = parseInt(studentIdString, 10);

    const [feeRows]: any = await db.execute(
      `SELECT 
        id, 
        invoiceNumber, 
        amountDue, 
        amountPaid, 
        feeType, 
        semester, 
        dueDate, 
        paymentDate, 
        status
       FROM studentfee
       WHERE studentId = ?
       ORDER BY dueDate DESC`,
      [studentId]
    );

    // Serialize dates for Next.js Client Component
    const serializedFees = feeRows.map((row: any) => ({
      ...row,
      dueDate: row.dueDate ? new Date(row.dueDate).toISOString() : null,
      paymentDate: row.paymentDate ? new Date(row.paymentDate).toISOString() : null,
    }));

    return { success: true, data: serializedFees };
  } catch (error) {
    console.error("Error fetching fees:", error);
    return { success: false, message: "Failed to load fee information" };
  }
}