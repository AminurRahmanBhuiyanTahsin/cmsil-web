import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "../../components/LogoutButton";
import { 
  GraduationCap, 
  Wallet, 
  Wrench, 
  BookOpen, 
  Settings,
  LifeBuoy // <-- Add this import
} from "lucide-react";

export default async function StaffDashboard() {
  const cookieStore = await cookies();
  const staffRole = cookieStore.get("staffRole")?.value || "NONE";
  const staffName = cookieStore.get("staffName")?.value || "Administrator";

  // 1. Define all available modules and who can see them with premium Lucide icons
const allModules = [
    { 
      title: "Manage Admissions", 
      href: "/staff/admissions", 
      icon: <GraduationCap size={32} className="text-blue-600" />, 
      desc: "Review student applications", 
      roles: ["ADMINISTRATION", "IT_SUPPORT"] 
    },
    { 
      title: "Finance Ledger", 
      href: "/staff/finance", 
      icon: <Wallet size={32} className="text-emerald-600" />, 
      desc: "Track payments & salaries", 
      roles: ["ADMINISTRATION", "ACCOUNTS", "IT_SUPPORT"] 
    },
    { 
      title: "Library Assets", 
      href: "/staff/library", 
      icon: <BookOpen size={32} className="text-purple-600" />, 
      desc: "Book & journal inventory", 
      roles: ["ADMINISTRATION", "LIBRARY", "LOGISTICS", "IT_SUPPORT"] 
    },
    
    // NEW: The ticket submission card for everyone
    { 
      title: "Report IT Issue", 
      href: "/staff/helpdesk", 
      icon: <LifeBuoy size={32} className="text-rose-600" />, 
      desc: "Submit a support ticket to IT", 
      roles: ["ADMINISTRATION", "ACCOUNTS", "LIBRARY", "LOGISTICS", "IT_SUPPORT"] 
    },

    // RENAMED: The ticket resolution card for IT
    { 
      title: "Manage Tickets", 
      href: "/staff/it-desk", 
      icon: <Wrench size={32} className="text-amber-600" />, 
      desc: "Resolve support tickets", 
      roles: ["ADMINISTRATION", "IT_SUPPORT"] 
    },

    { 
      title: "System Control", 
      href: "/staff/settings", 
      icon: <Settings size={32} className="text-slate-600" />, 
      desc: "Database logs & admin controls", 
      roles: ["IT_SUPPORT"] 
    },
  ];

  // 2. Filter modules based on the logged-in role
  const visibleModules = allModules.filter(m => m.roles.includes(staffRole));

  return (
    <div className="space-y-8 p-6">
      {/* Welcome & Stats Row */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-black text-slate-800">Welcome, {staffName}</h1>
          
          {/* Drop the Logout Button here on the right side */}
          <LogoutButton />
        </div>
        {/* Stats Grid here... */}
      </section>

      {/* Control Grid - Now Dynamic */}
      <section>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Core Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleModules.map((card, i) => (
            <Link href={card.href} key={i}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all h-full group flex flex-col">
                
                {/* Premium Icon Container with scale animation on hover */}
                <div className="mb-6 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {card.icon}
                </div>
                
                <h3 className="font-bold text-slate-800 mb-1 text-lg">{card.title}</h3>
                <p className="text-slate-500 text-sm grow">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}