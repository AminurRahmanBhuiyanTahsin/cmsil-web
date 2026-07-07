// app/(teacher-portal)/teacher/routine/actions.ts
"use server";
import { db } from "@/lib/db";

export async function getTeacherRoutine(facultyId: number) {
  try {
    const query = `
      SELECT 
        r.*, 
        c.course_code, 
        c.title 
      FROM class_routine r
      JOIN courses c ON r.course_id = c.id
      WHERE r.faculty_id = ?
      ORDER BY 
        FIELD(r.day_of_week, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        r.start_time ASC
    `;
    
    const [rows] = await db.execute(query, [facultyId]);
    return { success: true, data: rows };
  } catch (error) {
    console.error("Error fetching routine:", error);
    return { success: false, data: [] };
  }
}