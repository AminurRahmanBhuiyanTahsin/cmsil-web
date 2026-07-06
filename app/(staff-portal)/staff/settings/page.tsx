import { db } from "@/lib/db";
import Link from "next/link";
import { 
  addStaff, updateStaffRole, toggleStaffStatus, 
  addTeacher, updateTeacherDesignation, toggleTeacherStatus,
  addStudent, updateStudentDepartment, toggleStudentStatus
} from "./actions";

export const dynamic = "force-dynamic";

// Added 'q' to searchParams for our search bar!
export default async function SystemSettingsPage(props: { searchParams: Promise<{ tab?: string, q?: string }> }) {
  
  const searchParams = await props.searchParams;
  const activeTab = searchParams?.tab || "staff";
  const searchQuery = searchParams?.q || ""; // Grab the search term

  // 1. Fetch Audit Logs
  const [logRows] = await db.execute("SELECT * FROM system_logs ORDER BY createdAt DESC LIMIT 10");
  const logs = logRows as any[];

  // 2. Fetch Staff & Faculty Directories
  const [staffRows] = await db.execute("SELECT id, staffId, name, email, role, status FROM staff ORDER BY name ASC");
  const staffList = staffRows as any[];

  const [facultyRows] = await db.execute("SELECT id, facultyId, name, email, department, designation, status FROM faculty ORDER BY name ASC");
  const facultyList = facultyRows as any[];

  // 3. Fetch Student Directory (WITH SEARCH LOGIC)
  let studentQuery = "SELECT id, institutionalRoll, name, email, department, currentSemester, status FROM enrolledstudent";
  let studentParams: any[] = [];
  
  if (searchQuery) {
    studentQuery += " WHERE name LIKE ? OR institutionalRoll LIKE ?";
    studentParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
  }
  
  studentQuery += " ORDER BY name ASC";
  
  const [studentRows] = await db.execute(studentQuery, studentParams);
  const studentList = studentRows as any[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800">System Control Panel</h1>
        <p className="text-slate-500 mt-2">Super Admin Infrastructure & User Management</p>
      </div>

      {/* --- MODULE 1: SECURITY AUDIT LOGS --- */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-black text-slate-800 uppercase tracking-wider text-sm">Recent Audit Logs</h2>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-slate-100">
               {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-3 font-bold text-slate-700">{log.adminEmail}</td>
                    <td className="p-3 font-mono text-slate-500">{log.action} {log.targetTable}</td>
                    <td className="p-3 text-slate-600">{log.details}</td>
                  </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <Link href="/staff/settings?tab=staff" className={`font-bold px-6 py-3 rounded-lg transition ${activeTab === 'staff' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
          Staff Management
        </Link>
        <Link href="/staff/settings?tab=teacher" className={`font-bold px-6 py-3 rounded-lg transition ${activeTab === 'teacher' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
          Faculty Management
        </Link>
        <Link href="/staff/settings?tab=student" className={`font-bold px-6 py-3 rounded-lg transition ${activeTab === 'student' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
          Student Management
        </Link>
      </div>

      {/* --- MODULE 2: STAFF TAB --- */}
      {activeTab === "staff" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h2 className="font-black text-slate-800 mb-4">Provision New Staff</h2>
            <form action={addStaff} className="space-y-4">
               <div><label className="text-xs font-bold text-slate-500">Full Name</label><input name="name" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div><label className="text-xs font-bold text-slate-500">Email Address</label><input name="email" type="email" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div><label className="text-xs font-bold text-slate-500">Staff ID</label><input name="staffId" placeholder="CMSIL-ST-XXX" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div>
                 <label className="text-xs font-bold text-slate-500">System Role</label>
                 <select name="role" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required>
                   <option value="ADMINISTRATION">Administration</option>
                   <option value="IT_SUPPORT">IT Support (Super Admin)</option>
                   <option value="ACCOUNTS">Accounts & Finance</option>
                   <option value="LIBRARY">Library & Inventory</option>
                 </select>
               </div>
               <div className="pt-2">
                  <p className="text-[10px] text-slate-400 mb-2">* Default password: <strong>password123</strong></p>
                  <button className="w-full bg-slate-900 text-white font-bold p-3 rounded-lg hover:bg-slate-800 transition">Create Staff Account</button>
               </div>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-100 bg-slate-50"><h2 className="font-black text-slate-800">Staff Access Directory</h2></div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr><th className="p-4">Staff Member</th><th className="p-4">System Role</th><th className="p-4 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {staffList.map((staff: any) => (
                    <tr key={staff.id} className="hover:bg-slate-50 transition">
                      <td className="p-4"><p className="font-bold text-slate-800">{staff.name}</p><p className="text-xs text-slate-500 font-mono">{staff.staffId}</p></td>
                      <td className="p-4">
                        <form action={updateStaffRole} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={staff.id} />
                          <select name="role" defaultValue={staff.role} className="p-1 border border-slate-200 rounded text-xs bg-white">
                             <option value="ADMINISTRATION">ADMINISTRATION</option>
                             <option value="IT_SUPPORT">IT_SUPPORT</option>
                             <option value="ACCOUNTS">ACCOUNTS</option>
                             <option value="LIBRARY">LIBRARY</option>
                          </select>
                          <button className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded hover:bg-indigo-200">Save</button>
                        </form>
                      </td>
                      <td className="p-4 text-right">
                        <form action={toggleStaffStatus}>
                          <input type="hidden" name="id" value={staff.id} />
                          <input type="hidden" name="currentStatus" value={staff.status} />
                          <button className={`text-xs font-bold px-3 py-1 rounded-full ${staff.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}>
                            {staff.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </form>
                      </td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODULE 3: TEACHER TAB --- */}
      {activeTab === "teacher" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h2 className="font-black text-slate-800 mb-4">Provision New Faculty</h2>
            <form action={addTeacher} className="space-y-4">
               <div><label className="text-xs font-bold text-slate-500">Full Name</label><input name="name" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div><label className="text-xs font-bold text-slate-500">Email Address</label><input name="email" type="email" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div><label className="text-xs font-bold text-slate-500">Faculty ID</label><input name="facultyId" placeholder="CMSIL-FC-XXX" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div>
                 <label className="text-xs font-bold text-slate-500">Department</label>
                 <select name="department" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required>
                   <option value="Computer Science">Computer Science</option>
                   <option value="Civil Engineering">Civil Engineering</option>
                   <option value="Electrical Engineering">Electrical Engineering</option>
                   <option value="Mechanical Engineering">Mechanical Engineering</option>
                 </select>
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500">Designation</label>
                 <input name="designation" placeholder="e.g., Assistant Professor" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required />
               </div>
               <div className="pt-2">
                  <p className="text-[10px] text-slate-400 mb-2">* Default password: <strong>password123</strong></p>
                  <button className="w-full bg-slate-900 text-white font-bold p-3 rounded-lg hover:bg-slate-800 transition">Create Faculty Account</button>
               </div>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-100 bg-slate-50"><h2 className="font-black text-slate-800">Faculty Access Directory</h2></div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr><th className="p-4">Faculty Member</th><th className="p-4">Department & Role</th><th className="p-4 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {facultyList.map((teacher: any) => (
                    <tr key={teacher.id} className="hover:bg-slate-50 transition">
                      <td className="p-4"><p className="font-bold text-slate-800">{teacher.name}</p><p className="text-xs text-slate-500 font-mono">{teacher.facultyId}</p></td>
                      <td className="p-4">
                        <p className="text-xs font-bold text-slate-600 mb-1">{teacher.department}</p>
                        <form action={updateTeacherDesignation} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={teacher.id} />
                          <input name="designation" defaultValue={teacher.designation} className="p-1 border border-slate-200 rounded text-xs bg-white w-32" />
                          <button className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded hover:bg-indigo-200">Save</button>
                        </form>
                      </td>
                      <td className="p-4 text-right">
                        <form action={toggleTeacherStatus}>
                          <input type="hidden" name="id" value={teacher.id} />
                          <input type="hidden" name="currentStatus" value={teacher.status} />
                          <button className={`text-xs font-bold px-3 py-1 rounded-full ${teacher.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}>
                            {teacher.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </form>
                      </td>
                    </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODULE 4: STUDENT TAB (NOW WITH SEARCH & CUSTOM PASSWORD) --- */}
      {activeTab === "student" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Student Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h2 className="font-black text-slate-800 mb-4">Provision New Student</h2>
            <form action={addStudent} className="space-y-4">
               <div><label className="text-xs font-bold text-slate-500">Full Name</label><input name="name" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div><label className="text-xs font-bold text-slate-500">Email Address</label><input name="email" type="email" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div><label className="text-xs font-bold text-slate-500">Institutional Roll</label><input name="institutionalRoll" placeholder="e.g., CSE1212201" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required /></div>
               <div>
                 <label className="text-xs font-bold text-slate-500">Department</label>
                 <select name="department" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required>
                   <option value="Computer Science">Computer Science</option>
                   <option value="Civil Engineering">Civil Engineering</option>
                   <option value="Electrical Engineering">Electrical Engineering</option>
                   <option value="Mechanical Engineering">Mechanical Engineering</option>
                 </select>
               </div>
               {/* NEW PASSWORD FIELD */}
               <div>
                 <label className="text-xs font-bold text-slate-500">Initial Account Password</label>
                 <input name="password" type="text" placeholder="e.g., CSE1212201-start" className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50" required />
               </div>
               <div className="pt-2">
                  <button className="w-full bg-slate-900 text-white font-bold p-3 rounded-lg hover:bg-slate-800 transition">Create Student Account</button>
               </div>
            </form>
          </div>

          {/* Student Directory WITH SEARCH */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h2 className="font-black text-slate-800">Student Access Directory</h2>
              
              {/* URL SEARCH FORM */}
              <form method="GET" className="flex shadow-sm">
                <input type="hidden" name="tab" value="student" />
                <input 
                  name="q" 
                  defaultValue={searchQuery} 
                  placeholder="Search Name or Roll..." 
                  className="p-2 text-xs border border-slate-200 rounded-l-lg w-full md:w-48 focus:outline-none focus:border-slate-400" 
                />
                <button type="submit" className="bg-slate-800 text-white px-3 py-2 text-xs font-bold rounded-r-lg hover:bg-slate-900 transition">
                  Search
                </button>
              </form>
            </div>
            
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr><th className="p-4">Student Member</th><th className="p-4">Department & Term</th><th className="p-4 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {studentList.length === 0 ? (
                   <tr><td colSpan={3} className="p-8 text-center text-slate-400 text-xs">No students found matching your search.</td></tr>
                 ) : (
                   studentList.map((student: any) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition">
                        <td className="p-4"><p className="font-bold text-slate-800">{student.name}</p><p className="text-xs text-slate-500 font-mono">{student.institutionalRoll}</p></td>
                        <td className="p-4">
                          <form action={updateStudentDepartment} className="flex items-center gap-2">
                            <input type="hidden" name="id" value={student.id} />
                            <select name="department" defaultValue={student.department} className="p-1 border border-slate-200 rounded text-xs bg-white">
                               <option value="Computer Science">Computer Science</option>
                               <option value="Civil Engineering">Civil Engineering</option>
                               <option value="Electrical Engineering">Electrical Engineering</option>
                               <option value="Mechanical Engineering">Mechanical Engineering</option>
                            </select>
                            <button className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded hover:bg-indigo-200">Save</button>
                          </form>
                          <p className="text-[10px] text-slate-400 mt-1">Semester: {student.currentSemester}</p>
                        </td>
                        <td className="p-4 text-right">
                          <form action={toggleStudentStatus}>
                            <input type="hidden" name="id" value={student.id} />
                            <input type="hidden" name="currentStatus" value={student.status} />
                            <button className={`text-xs font-bold px-3 py-1 rounded-full ${student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}>
                              {student.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                          </form>
                        </td>
                      </tr>
                   ))
                 )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}