// app/(teacher-portal)/teacher/courses/actions.ts
"use server";
import { db } from "@/lib/db";

export async function getTeacherCourses(facultyId: number) {
  try {
    const query = `
      SELECT c.* 
      FROM courses c
      JOIN course_assignments ca ON c.id = ca.course_id
      WHERE ca.faculty_id = ?
      ORDER BY c.semester ASC, c.course_code ASC
    `;
    
    const [rows] = await db.execute(query, [facultyId]);
    return { success: true, data: rows };
  } catch (error) {
    console.error("Error fetching assigned courses:", error);
    return { success: false, data: [] };
  }
}