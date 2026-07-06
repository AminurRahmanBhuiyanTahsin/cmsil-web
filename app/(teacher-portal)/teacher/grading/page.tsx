"use client";

import { useState, useEffect } from "react";
// Import all three server actions
import { getCoursesForDropdown, getStudentsForGrading, saveBulkGrades } from "./actions";

// --- Icons (Using standard SVG for zero dependencies) ---
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

const DocumentIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// --- Grading Utility Function (Soft Semantic Colors) ---
function calculateGrade(marks: number | string) {
  if (!marks || isNaN(Number(marks))) return { letter: "-", gpa: 0.0, color: "text-gray-400" };
  const m = Number(marks);
  if (m >= 80) return { letter: "A+", gpa: 4.0, color: "text-emerald-700 bg-emerald-50 ring-emerald-600/20" };
  if (m >= 75) return { letter: "A", gpa: 3.75, color: "text-emerald-600 bg-emerald-50 ring-emerald-500/20" };
  if (m >= 70) return { letter: "A-", gpa: 3.5, color: "text-teal-600 bg-teal-50 ring-teal-500/20" };
  if (m >= 65) return { letter: "B+", gpa: 3.25, color: "text-blue-700 bg-blue-50 ring-blue-600/20" };
  if (m >= 60) return { letter: "B", gpa: 3.0, color: "text-blue-600 bg-blue-50 ring-blue-500/20" };
  if (m >= 55) return { letter: "B-", gpa: 2.75, color: "text-indigo-600 bg-indigo-50 ring-indigo-500/20" };
  if (m >= 50) return { letter: "C+", gpa: 2.5, color: "text-amber-600 bg-amber-50 ring-amber-500/20" };
  if (m >= 45) return { letter: "C", gpa: 2.25, color: "text-orange-600 bg-orange-50 ring-orange-500/20" };
  if (m >= 40) return { letter: "D", gpa: 2.0, color: "text-red-500 bg-red-50 ring-red-500/20" };
  return { letter: "F", gpa: 0.0, color: "text-red-700 bg-red-100 ring-red-600/20" };
}

export default function GradingPage() {
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [courseId, setCourseId] = useState("");

  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [marksState, setMarksState] = useState<Record<number, string>>({});

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  useEffect(() => {
    async function fetchRoster() {
      if (department && semester && courseId) {
        setLoadingStudents(true);
        const res = await getStudentsForGrading(department, parseInt(semester), parseInt(courseId));
        
        if (res.success) {
          const fetchedStudents = res.data as any[];
          setStudents(fetchedStudents);

          const existingMarks: Record<number, string> = {};
          fetchedStudents.forEach(student => {
            if (student.marks_obtained !== null && student.marks_obtained !== undefined) {
              existingMarks[student.id] = String(student.marks_obtained);
            }
          });
          setMarksState(existingMarks);
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
  }, [department, semester, courseId]);

  const handleMarkChange = (studentId: number, value: string) => {
    setMarksState(prev => ({ ...prev, [studentId]: value }));
    setSaveSuccess(false); 
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    
    const payload = students.map(student => {
      const studentMark = marksState[student.id];
      const { letter, gpa } = calculateGrade(studentMark);
      
      return {
        student_id: student.id,
        institutionalRoll: student.institutionalRoll,
        course_id: parseInt(courseId),
        semester: parseInt(semester),
        marks_obtained: Number(studentMark) || 0,
        grade_letter: letter,
        gpa_point: gpa
      };
    });

    const res = await saveBulkGrades(payload);
    
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
          {/* Deep Slate Gradient to match sidebar */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 md:px-10 md:py-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Grade Management</h1>
            <p className="text-slate-300 mt-2 font-medium">Select course parameters to enter or modify student marks.</p>
          </div>
          
          {/* --- Dropdown Controls --- */}
          <div className="px-6 py-6 md:px-10 bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all shadow-sm"
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setCourseId(""); }}
              >
                <option value="" disabled>Select Department</option>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="EEE">Electrical (EEE)</option>
                <option value="CE">Civil (CE)</option>
                <option value="ME">Mechanical (ME)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 top-7 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all shadow-sm"
                value={semester}
                onChange={(e) => { setSemester(e.target.value); setCourseId(""); }}
              >
                <option value="" disabled>Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 top-7 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
              <select 
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-100"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={!department || !semester || loadingCourses}
              >
                <option value="" disabled>
                  {loadingCourses ? "Loading..." : "Select Course"}
                </option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.course_code} - {c.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 top-7 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

          </div>
        </div>

        {/* --- Loading State --- */}
        {loadingStudents && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            {/* Slate colored spinner */}
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Fetching student roster...</p>
          </div>
        )}

        {/* --- Student Grading Table --- */}
        {!loadingStudents && students.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/80 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <DocumentIcon />
                <span className="ml-2">Class Roster</span>
                {/* Clean Slate Badge */}
                <span className="ml-3 bg-slate-100 text-slate-800 text-xs py-1 px-2.5 rounded-full font-semibold">
                  {students.length} Students
                </span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">#</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marks (100)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade Result</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {students.map((student, index) => {
                    const currentMark = marksState[student.id] || "";
                    const gradeInfo = calculateGrade(currentMark);

                    return (
                      // Soft slate hover effect
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                        
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 font-medium">
                          {index + 1}
                        </td>
                        
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                               <UserIcon />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-slate-800 transition-colors">{student.name}</div>
                              <div className="text-sm text-gray-500 font-medium">ID: {student.institutionalRoll}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="---"
                            className="w-24 bg-white border border-gray-300 rounded-lg p-2.5 text-center text-gray-900 font-semibold focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-shadow shadow-sm"
                            value={currentMark}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          />
                        </td>

                        <td className="px-6 py-5 whitespace-nowrap">
                          {currentMark ? (
                             <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold ring-1 ring-inset ${gradeInfo.color}`}>
                                  {gradeInfo.letter}
                                </span>
                                <span className="text-sm font-semibold text-gray-700">
                                  {gradeInfo.gpa.toFixed(2)} GPA
                                </span>
                             </div>
                          ) : (
                             <span className="text-sm text-gray-400 italic">Pending...</span>
                          )}
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
                  <span className="inline-flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 transition-opacity duration-300">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Grades Saved Successfully
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 font-medium hidden md:inline-block">Ensure all marks are correct before saving.</span>
                )}
              </div>

              {/* Slate colored button */}
              <button
                onClick={handleSaveGrades}
                disabled={saving}
                className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Publish Grades
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* --- Empty State --- */}
        {!loadingStudents && courseId && students.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <DocumentIcon />
            <h3 className="mt-4 text-lg font-bold text-gray-900">No Students Found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no students enrolled in this specific batch.</p>
          </div>
        )}

      </div>
    </div>
  );
}