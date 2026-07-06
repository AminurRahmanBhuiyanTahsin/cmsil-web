"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function submitApplication(formData: FormData) {
  const studentName = formData.get("studentName") as string;
  const email = formData.get("email") as string;
  const gpa = parseFloat(formData.get("gpa") as string);
  const department = formData.get("department") as string;

  // Insert the application with a default status of 'PENDING'
  await db.execute(
    "INSERT INTO admission_applications (studentName, email, gpa, department, status) VALUES (?, ?, ?, ?, 'PENDING')",
    [studentName, email, gpa, department]
  );

  // Redirect to the success page within the same route group
  redirect("/admission-calculator/success");
}