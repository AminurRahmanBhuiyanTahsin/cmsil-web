"use client";

import { useEffect, useState } from "react";
import { getStudentResults } from "./actions";
import { GraduationCap, Award, BookOpen, Calculator } from "lucide-react";

export default function StudentResultsPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      const res = await getStudentResults();
      
      if (res.success && res.grades) {
        setGrades(res.grades);
        setStudentInfo(res.student);
      }
      setLoading(false);
    }
    fetchResults();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold animate-pulse">Loading Academic Records...</div>;
  }

  if (!studentInfo) {
    return <div className="p-8 text-rose-500 font-bold">Error: Student records not found.</div>;
  }

  // Group grades by semester (e.g., { "8": [...courses], "7": [...courses] })
  const groupedGrades = grades.reduce((acc: any, curr: any) => {
    if (!acc[curr.semester]) acc[curr.semester] = [];
    acc[curr.semester].push(curr);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
            {studentInfo.department} • Official Transcript
          </span>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <GraduationCap size={36} className="text-emerald-500" />
            Academic Results
          </h1>
          <p className="text-slate-400 font-medium text-lg">
            {studentInfo.name} • ID: {studentInfo.institutionalRoll}
          </p>
        </div>
        
        {/* OVERALL CGPA BADGE */}
        <div className="relative z-10 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center min-w-40">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Overall CGPA</p>
          <p className="text-4xl font-black text-emerald-400">
            {Number(studentInfo.cgpa).toFixed(2)}
          </p>
        </div>
      </section>

      {/* SEMESTER RESULTS LOOP */}
      <div className="space-y-10">
        {Object.keys(groupedGrades).length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-bold text-lg">No exam results published yet.</p>
          </div>
        ) : (
          Object.keys(groupedGrades).sort((a, b) => Number(b) - Number(a)).map((semester) => {
            const semesterGrades = groupedGrades[semester];
            
            // Calculate SGPA (Semester GPA) dynamically
            let totalCredits = 0;
            let totalPoints = 0;
            semesterGrades.forEach((g: any) => {
              const credits = Number(g.credits) || 0; // Fallback to 0 if credits are missing
              totalCredits += credits;
              totalPoints += (Number(g.gpa_point) * credits);
            });
            const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "N/A";

            return (
              <section key={semester} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <BookOpen className="text-emerald-500" size={24}/>
                    Semester {semester}
                  </h2>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100">
                    <Calculator size={18} />
                    <span className="font-bold text-sm uppercase tracking-wider">SGPA: {sgpa}</span>
                  </div>
                </div>
                
                {/* GRADES TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                        <th className="pb-3 pr-4">Course Code</th>
                        <th className="pb-3 pr-4">Course Title</th>
                        <th className="pb-3 px-4 text-center">Credits</th>
                        <th className="pb-3 px-4 text-center">Marks</th>
                        <th className="pb-3 px-4 text-center">Grade</th>
                        <th className="pb-3 pl-4 text-right">GPA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {semesterGrades.map((grade: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                          <td className="py-4 pr-4 font-bold text-slate-600">{grade.course_code || 'N/A'}</td>
                          <td className="py-4 pr-4 font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                            {grade.course_title || 'Unknown Course'}
                          </td>
                          <td className="py-4 px-4 text-center text-slate-500 font-medium">{grade.credits || '-'}</td>
                          <td className="py-4 px-4 text-center text-slate-500 font-medium">{grade.marks_obtained}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center justify-center font-black text-sm w-8 h-8 rounded-full ${
                              grade.grade_letter === 'F' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {grade.grade_letter}
                            </span>
                          </td>
                          <td className="py-4 pl-4 text-right font-black text-slate-700">
                            {Number(grade.gpa_point).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}