"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton"; // Ensure this matches your file path
import { 
  LayoutDashboard, 
  CalendarDays, 
  Microscope, 
  GraduationCap, 
  Wallet, 
  Library, 
  User,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck // Add this
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const studentLinks = [
  { name: "Overview", href: "/student", icon: <LayoutDashboard size={20} /> },
  { name: "Routine", href: "/student/routine", icon: <CalendarDays size={20} /> },
  { name: "Labs", href: "/student/labs", icon: <Microscope size={20} /> },
  { name: "Attendance", href: "/student/attendance", icon: <ClipboardCheck size={20} /> }, // New Link
  { name: "Results", href: "/student/results", icon: <GraduationCap size={20} /> },
  { name: "Fees", href: "/student/fees", icon: <Wallet size={20} /> },
  { name: "Library", href: "/student/library", icon: <Library size={20} /> },
  { name: "Profile", href: "/student/profile", icon: <User size={20} /> },
];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* COLLAPSIBLE SIDEBAR */}
      <aside 
        className={`${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out bg-slate-900 text-slate-300 flex flex-col shadow-2xl relative z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {isSidebarOpen && <span className="font-black text-white tracking-widest text-lg">CMSIL<span className="text-indigo-500">.EDU</span></span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-800 rounded-md hover:bg-slate-700 transition"
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {studentLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <div className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition cursor-pointer">
                <span className="shrink-0">{link.icon}</span>
                {isSidebarOpen && <span className="font-semibold text-sm">{link.name}</span>}
              </div>
            </Link>
          ))}
        </nav>
        
        {/* LOGOUT AT BOTTOM */}
        <div className="p-4 border-t border-slate-800">
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-bold text-slate-800">Student Portal</h2>
        </header>
        {children}
      </main>
    </div>
  );
}