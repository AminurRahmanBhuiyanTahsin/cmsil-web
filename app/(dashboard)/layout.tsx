import React from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-6">
          <span className="text-xl font-bold tracking-wider text-emerald-400">
            CMSIL ADMIN
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium transition">
            <span>📊</span> <span>Overview</span>
          </Link>
          <Link href="/dashboard/students" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>👨‍🎓</span> <span>Enrolled Students</span>
          </Link>
          <Link href="/dashboard/faculty" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>🧑‍🏫</span> <span>Faculty Roster</span>
          </Link>
          <Link href="/dashboard/attendance" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>📅</span> <span>Attendance Logs</span>
          </Link>
          <Link href="/dashboard/library" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition">
            <span>📚</span> <span>Digital Library</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          v1.0.0 — MariaDB Active
        </div>
      </aside>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* UPPER STATUS NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-slate-700">Management Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm font-medium bg-slate-100 px-4 py-2 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Local Engine Online</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE ROUTE INNER VIEW */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}