"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function postNotice(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  
  // Get teacher name from cookie for the 'postedBy' field
  const cookieStore = await cookies();
  const teacherName = cookieStore.get("teacherName")?.value || "Faculty";

  // Force scope to 'PRIVATE' as requested
  await db.execute(
    "INSERT INTO notice (title, content, category, scope, postedBy) VALUES (?, ?, ?, 'PRIVATE', ?)",
    [title, content, category, teacherName]
  );

  revalidatePath("/teacher-portal/teacher/notices");
  return { success: true };
}