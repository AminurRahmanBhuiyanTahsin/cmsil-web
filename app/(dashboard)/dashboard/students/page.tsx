import React from "react";
import { getStudents, addStudent, deleteStudent } from "./actions";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="space-y-6">
      {/* PANEL TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enrolled Student Directory</h2>
          <p className="text-slate-500 text-sm">Review, update, or remove active college registration profiles.</p>
        </div>
        
        {/* QUICK ADD MODAL FORM COMPONENT */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-xs w-full">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2">Quick Registration</span>
          <form action={addStudent} className="space-y-2">
            <input type="text" name="name" placeholder="Full Name" required className="w-full text-xs px-3 py-2 border rounded-md bg-slate-50" />
            <input type="email" name="email" placeholder="email@cmsil-edu.ac.bd" required className="w-full text-xs px-3 py-2 border rounded-md bg-slate-50" />
            <input type="text" name="phone" placeholder="Phone Number" required className="w-full text-xs px-3 py-2 border rounded-md bg-slate-50" />
            <div className="grid grid-cols-2 gap-2">
              <select name="department" className="text-xs px-2 py-1.5 border rounded-md bg-slate-50">
                <option value="CSE">CSE</option>
                <option value="EEE">EEE</option>
                <option value="CE">CE</option>
                <option value="ME">ME</option>
              </select>
              <input type="number" name="classRoll" placeholder="Roll (1-10)" min="1" max="40" required className="w-full text-xs px-2 py-1.5 border rounded-md bg-slate-50" />
            </div>
            <input type="hidden" name="batchId" value="2" />
            <input type="hidden" name="bloodGroup" value="B+" />
            <input type="hidden" name="presentAddress" value="Dhaka" />
            <input type="hidden" name="permanentAddress" value="Bangladesh" />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-md transition">
              + Add to Roster
            </button>
          </form>
        </div>
      </div>

      {/* THE LIVE ENTERPRISE DATA GRID */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Roll ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 text-xs">
                    {student.institutionalRoll}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{student.name}</div>
                    <div className="text-xs text-slate-400">{student.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 rounded-md border border-slate-200">
                      {student.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">Sem {student.currentSemester}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${student.cgpa >= 3.75 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {student.cgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* FIXED SECURE PRE-BOUND ACTION ROUTE */}
                    <form action={deleteStudent.bind(null, student.id)} className="inline">
                      <button type="submit" className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded transition">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}