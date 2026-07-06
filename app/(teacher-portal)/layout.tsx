"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "../components/LogoutButton"; // Fixed path (only 1 set of dots needed)
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  PenTool,
  Megaphone,
  User,
  Calendar,
} from "lucide-react";

export default function TeacherPortalLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { title: "Dashboard", href: "/teacher", icon: <LayoutDashboard size={20} /> },
    { title: "My Courses", href: "/teacher/courses", icon: <BookOpen size={20} /> },
    { title: "Attendance", href: "/teacher/attendance", icon: <CheckSquare size={20} /> },
    { title: "Grading", href: "/teacher/grading", icon: <PenTool size={20} /> },
    { title: "Routine", href: "/teacher/routine", icon: <Calendar size={20} /> },
    { title: "Notices", href: "/teacher/notices", icon: <Megaphone size={20} /> },
    { title: "Profile", href: "/teacher/profile", icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. SIDEBAR NAVIGATION CONTAINER */}
      <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="p-6 space-y-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-white">
              CMSIL<span className="text-orange-500">.EDU</span>
            </span>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.title} href={item.href}>
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isActive 
                      ? "bg-orange-500/10 text-orange-500 border-l-4 border-orange-500 pl-3" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}>
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT WINDOW */}
      <div className="flex-grow flex flex-col">
        {/* TOP HEADER STATUS BAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Faculty Portal</h2>
          
          {/* PLACING THE INTERACTIVE LOGOUT BUTTON COMPONENT HERE */}
          <LogoutButton />
        </header>

        {/* COMPONENT SUB-PAGES RENDER INSIDE HERE */}
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}