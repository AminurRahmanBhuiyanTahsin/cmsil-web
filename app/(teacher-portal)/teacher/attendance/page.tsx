"use client";

import { useState, useEffect } from "react";
import { getCoursesForDropdown, getStudentsForAttendance, saveBulkAttendance } from "./actions";

const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

type Status = 'PRESENT' | 'ABSENT' | 'LATE';

export default function AttendancePage() {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState("");
  // Default to today's date in YYYY-MM-DD format
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  // State to hold attendance: { studentId: 'PRESENT' }
  const [attendanceState, setAttendanceState] = useState<Record<number, Status>>({});

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch Courses
  useEffect(() => {
    async function fetchCourses() {
      if (department && semester) {
        setLoadingCourses(true);
        const res = await getCoursesForDropdown(department, parseInt(semester));
        if (res.success) {
          setCourses((res.data as any[]) || []);
        } else {
          setCourses([]);
        }
        setLoadingCourses(false);
      }
    }
    fetchCourses();
  }, [department, semester]);

  // Fetch Students & Existing Attendance
  useEffect(() => {
    async function fetchRoster() {
      if (department && semester && courseId && date) {
        setLoadingStudents(true);
        const res = await getStudentsForAttendance(department, parseInt(semester), parseInt(courseId), date);
        
        if (res.success) {
          const fetchedStudents = res.data as any[];
          setStudents(fetchedStudents);

          // Pre-fill existing attendance or default to PRESENT
          const currentState: Record<number, Status> = {};
          fetchedStudents.forEach(student => {
            currentState[student.id] = student.status || 'PRESENT'; // Default to Present to save teacher time
          });
          setAttendanceState(currentState);
        } else {
          setStudents([]);
        }
        setLoadingStudents(false);
        setSaveSuccess(false); 
      } else {
        setStudents([]);
      }
    }
    fetchRoster();
  }, [department, semester, courseId, date]);

  const handleStatusChange = (studentId: number, status: Status) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
    setSaveSuccess(false);
  };

  // Quick action to mark everyone Present or Absent
  const markAll = (status: Status) => {
    const newState: Record<number, Status> = {};
    students.forEach(s => newState[s.id] = status);
    setAttendanceState(newState);
    setSaveSuccess(false);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    
    const payload = students.map(student => ({
      studentId: student.id,
      courseId: parseInt(courseId),
      date: date,
      status: attendanceState[student.id]
    }));

    const res = await saveBulkAttendance(payload);
    
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      alert("❌ " + res.message);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 md:px-10 md:py-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Daily Attendance</h1>
            <p className="text-slate-300 mt-2 font-medium">Record student attendance for specific lectures.</p>
          </div>
          
          {/* --- Controls --- */}
          <div className="px-6 py-6 md:px-10 bg-white grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-sm"
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setCourseId(""); }}
              >
                <option value="" disabled>Select...</option>
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="CE">CE</option>
                <option value="ME">ME</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-sm"
                value={semester}
                onChange={(e) => { setSemester(e.target.value); setCourseId(""); }}
              >
                <option value="" disabled>Select...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>Sem {num}</option>)}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-sm disabled:opacity-50"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={!department || !semester || loadingCourses}
              >
                <option value="" disabled>{loadingCourses ? "Loading..." : "Select Course"}</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_code}</option>)}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input 
                type="date"
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all shadow-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* --- Loading State --- */}
        {loadingStudents && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading roster for {date}...</p>
          </div>
        )}

        {/* --- Attendance Table --- */}
        {!loadingStudents && students.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/80 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <CalendarIcon />
                <span className="ml-2">Roster</span>
                <span className="ml-3 bg-slate-100 text-slate-800 text-xs py-1 px-2.5 rounded-full font-semibold">
                  {students.length} Students
                </span>
              </h2>
              <div className="flex space-x-2">
                <button onClick={() => markAll('PRESENT')} className="text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 py-1.5 px-3 rounded-lg transition-colors">Mark All Present</button>
                <button onClick={() => markAll('ABSENT')} className="text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 py-1.5 px-3 rounded-lg transition-colors">Mark All Absent</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {students.map((student, index) => {
                    const status = attendanceState[student.id];

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                               <UserIcon />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500 font-medium">ID: {student.institutionalRoll}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="inline-flex bg-gray-100 rounded-lg p-1 space-x-1">
                            <button
                              onClick={() => handleStatusChange(student.id, 'PRESENT')}
                              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'LATE')}
                              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${status === 'LATE' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => handleStatusChange(student.id, 'ABSENT')}
                              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${status === 'ABSENT' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* --- Footer Action Bar --- */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                {saveSuccess ? (
                  <span className="inline-flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Saved Successfully
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 font-medium">Confirm attendance before saving.</span>
                )}
              </div>
              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 disabled:opacity-70"
              >
                {saving ? "Saving..." : <><SaveIcon /> Save Register</>}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}