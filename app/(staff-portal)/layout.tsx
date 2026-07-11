import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from '../components/LogoutButton';

export default async function StaffPortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get("staffRole")?.value || "NONE";

  // Define routes with specific role access
  // Define routes with specific role access
  const allNavItems = [
    { label: "Dashboard", href: "/staff", roles: ["ADMINISTRATION", "ACCOUNTS", "LIBRARY", "IT_SUPPORT", "LOGISTICS"] },
    { label: "Admissions", href: "/staff/admissions", roles: ["ADMINISTRATION", "IT_SUPPORT"] },
    { label: "Finance", href: "/staff/finance", roles: ["ADMINISTRATION", "ACCOUNTS", "IT_SUPPORT"] },
    { label: "Inventory", href: "/staff/inventory", roles: ["ADMINISTRATION", "LIBRARY", "LOGISTICS", "IT_SUPPORT"] },
    { label: "Library", href: "/staff/library", roles: ["ADMINISTRATION", "LIBRARY", "LOGISTICS", "IT_SUPPORT"] },
    
    // NEW: Everyone can report an issue
    { label: "Report Issue", href: "/staff/helpdesk", roles: ["ADMINISTRATION", "ACCOUNTS", "LIBRARY", "LOGISTICS", "IT_SUPPORT"] },
    
    // RENAMED: Only Admin/IT can resolve tickets
    { label: "Manage Tickets", href: "/staff/it-desk", roles: ["ADMINISTRATION", "IT_SUPPORT"] },
    
    { label: "System Control", href: "/staff/settings", roles: ["IT_SUPPORT"] },
    { label: "Profile", href: "/staff/profile", roles: ["ADMINISTRATION", "ACCOUNTS", "LIBRARY", "IT_SUPPORT", "LOGISTICS"] },
  ];

  // Filter items based on the logged-in role
  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Dark Slate Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col">
        <div className="p-6 text-xl font-black text-white">
          ADMIN<span className="text-slate-500">.CMSIL</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="p-3 rounded-lg transition block hover:bg-slate-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-slate-800">Admin Control Panel</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-bold">
            Logged in as: <span className="text-indigo-600">{role}</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}