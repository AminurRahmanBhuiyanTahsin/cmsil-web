// app/(teacher-portal)/teacher/attendance/actions.ts
"use server";
import { db } from "@/lib/db";

type AttendancePayload = {
  studentId: number;
  courseId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
};

// 1. Fetch courses for the dropdown
export async function getCoursesForDropdown(department: string, semester: number) {
  try {
    const query = `SELECT id, course_code, title FROM courses WHERE department = ? AND semester = ? ORDER BY course_code ASC`;
    const [rows] = await db.execute(query, [department, semester]);
    return { success: true, data: rows };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { success: false, data: [] };
  }
}

// 2. Fetch students and their attendance for a specific date
export async function getStudentsForAttendance(department: string, semester: number, courseId: number, date: string) {
  try {
    // Notice the backticks around `date` in the JOIN condition
    const query = `
      SELECT 
        e.id, 
        e.institutionalRoll, 
        e.name, 
        a.status
      FROM enrolledstudent e
      LEFT JOIN attendancelog a ON e.id = a.studentId AND a.courseId = ? AND a.\`date\` = ?
      WHERE e.department = ? AND e.currentSemester = ?
      ORDER BY e.institutionalRoll ASC
    `;
    
    const [rows] = await db.execute(query, [courseId, date, department, semester]);
    return { success: true, data: rows };
  } catch (error) {
    console.error("Error fetching roster:", error);
    return { success: false, message: "Failed to load students." };
  }
}

// 3. Bulk Upsert Attendance
export async function saveBulkAttendance(attendanceData: AttendancePayload[]) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Notice the backticks around `date` here as well
    const query = `
      INSERT INTO attendancelog (studentId, courseId, \`date\`, status)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status)
    `;

    for (const record of attendanceData) {
      await connection.execute(query, [
        record.studentId,
        record.courseId,
        record.date,
        record.status,
      ]);
    }

    await connection.commit();
    return { success: true, message: "Attendance saved successfully!" };
  } catch (error) {
    await connection.rollback();
    console.error("Error saving attendance:", error);
    return { success: false, message: "Failed to save attendance." };
  } finally {
    connection.release();
  }
}