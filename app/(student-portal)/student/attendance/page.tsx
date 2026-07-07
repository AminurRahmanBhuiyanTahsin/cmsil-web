import { db } from "@/lib/db";
import { cookies } from "next/headers";

export default async function AttendancePage() {
  const cookieStore = await cookies();
  const studentRoll = cookieStore.get("institutionalRoll")?.value;

  if (!studentRoll) {
    return (
      <div className="p-8 text-red-600 font-bold">
        Session Expired. Please log out and log back in to view attendance.
      </div>
    );
  }

  try {
    // 1. Fetch internal ID
    const [students]: any = await db.execute(
      "SELECT id FROM enrolledstudent WHERE institutionalRoll = ?", 
      [studentRoll]
    );

    if (!students || students.length === 0) {
      return <div className="p-8 text-red-600">Profile data not found for roll: {studentRoll}</div>;
    }

    const studentId = students[0].id;

    // 2. Fetch attendance using LEFT JOIN (Guarantees no missing records or duplicates)
    const [attendance]: any = await db.execute(
      `SELECT al.id, al.date, al.status, al.courseid, c.title as courseName 
       FROM attendancelog al
       LEFT JOIN courses c ON al.courseid = c.id
       WHERE al.studentid = ? 
       ORDER BY al.date DESC`,
      [studentId]
    );

    // 3. Calculate Statistics safely
    const totalClasses = attendance.length;
    const totalPresent = attendance.filter((a: any) => a.status === 'PRESENT').length;
    const totalAbsent = totalClasses - totalPresent;
    const percentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

    // 4. Group by Date securely
    const groupedAttendance = attendance.reduce((acc: any, curr: any) => {
      // Create a safe date string
      const dateObj = new Date(curr.date);
      const dateString = dateObj.toLocaleDateString("en-GB", { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!acc[dateString]) acc[dateString] = [];
      acc[dateString].push(curr);
      return acc;
    }, {});

    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-black text-slate-900">My Attendance Overview</h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attendance %</p>
            <p className={`text-2xl font-black ${percentage < 60 ? 'text-red-600' : percentage < 75 ? 'text-amber-500' : 'text-indigo-600'}`}>
              {percentage}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Classes</p>
            <p className="text-2xl font-black text-slate-700">{totalClasses}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Present</p>
            <p className="text-2xl font-black text-green-600">{totalPresent}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Absent/Late</p>
            <p className="text-2xl font-black text-red-600">{totalAbsent}</p>
          </div>
        </div>

        {/* GROUPED ATTENDANCE LIST */}
        <div className="space-y-6">
          {Object.keys(groupedAttendance).length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              No attendance records found.
            </div>
          ) : (
            Object.entries(groupedAttendance).map(([date, items]: [string, any]) => (
              <div key={date} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-700 text-sm uppercase">
                  {date}
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map((row: any, i: number) => (
                    <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-800">
                          {/* Fallback in case the course name doesn't exist yet */}
                          {row.courseName || `Course ID: ${row.courseid}`}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        row.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 
                        row.status === 'LATE' ? 'bg-orange-100 text-orange-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8 text-red-600">
        <h2 className="font-bold">System Error</h2>
        <p>Could not retrieve attendance data: {String(error)}</p>
      </div>
    );
  }
}