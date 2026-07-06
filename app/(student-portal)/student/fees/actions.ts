"use server";

import { db } from "@/lib/db"; 

export async function getStudentFees(studentId: number) {
  try {
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