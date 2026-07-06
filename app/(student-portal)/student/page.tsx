// This is your content ONLY. No sidebar code here!
import Link from "next/link";
import { cookies } from "next/headers";
import { 
  CalendarDays, 
  Microscope, 
  GraduationCap, 
  Wallet, 
  User, 
  Library,
  Bell
} from "lucide-react";

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const studentName = cookieStore.get("studentName")?.value || "Student";
  const studentDepartment = cookieStore.get("studentDepartment")?.value || "Engineering";
  const studentCgpa = cookieStore.get("studentCgpa")?.value || "0.00";
  const studentSemester = cookieStore.get("studentSemester")?.value || "1";

  const quickLinks = [
    { title: "Course & Routine", href: "/student/routine", icon: <CalendarDays />, desc: "View your weekly schedule" },
    { title: "Labs & Assignments", href: "/student/labs", icon: <Microscope />, desc: "Project deadlines & vivas" },
    { title: "Academic Results", href: "/student/results", icon: <GraduationCap />, desc: "Check CGPA & past grades" },
    { title: "Financial Ledger", href: "/student/fees", icon: <Wallet />, desc: "Pay tuition & lab fees" },
    { title: "My Profile", href: "/student/profile", icon: <User />, desc: "Update personal info" },
    { title: "Digital Library", href: "/student/library", icon: <Library />, desc: "E-journals & textbooks" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* WELCOME BANNER */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800">
        <div className="relative z-10 space-y-3">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30">
            Active Semester: Summer 2026
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-100">
            Welcome back, {studentName}
          </h1>
          <p className="text-slate-400 font-medium">
            B.Sc. in {studentDepartment} • Semester {studentSemester}
          </p>
        </div>
        <div className="relative z-10 text-left md:text-right bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current CGPA</p>
          <p className="text-4xl font-black text-indigo-400">{studentCgpa}</p>
        </div>
      </section>

      {/* INTERACTIVE GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link, i) => (
          <Link href={link.href} key={i}>
            <div className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 h-full">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-50 transition-colors">
                {link.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                {link.title}
              </h3>
              <p className="text-slate-500 text-sm">{link.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}