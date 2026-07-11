import { db } from "@/lib/db";
import { resolveTicket } from "./actions";
import Link from "next/link";

export default async function HelpdeskPage({
  searchParams,
}: {
  // Next.js 15 requires searchParams to be a Promise!
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params?.tab || "OPEN";
  
  // Ensure it is a valid status
  const currentTab = ["OPEN", "RESOLVED"].includes(tab.toUpperCase()) ? tab.toUpperCase() : "OPEN";

  // Fetch tickets based on the selected tab
  const [rows] = await db.execute(
    "SELECT * FROM tickets WHERE status = ? ORDER BY createdAt DESC",
    [currentTab]
  );
  const tickets = rows as any[];

  // Helper function for Priority Badge Colors
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "bg-rose-100 text-rose-700 border-rose-200";
      case "HIGH": return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM": return "bg-amber-100 text-amber-700 border-amber-200";
      case "LOW": return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">IT Helpdesk Dashboard</h1>
        <div className="text-sm font-bold text-slate-500">
          {tickets.length} {currentTab === "OPEN" ? "Pending" : "Completed"}
        </div>
      </div>

      {/* The Tab Menu */}
      <div className="flex gap-3 border-b border-slate-200 pb-4">
        <Link 
          href="?tab=OPEN" 
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentTab === "OPEN" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Open Tickets
        </Link>
        <Link 
          href="?tab=RESOLVED" 
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentTab === "RESOLVED" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Resolved History
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs uppercase font-bold text-slate-500">
              <th className="p-4">Ticket #</th>
              <th className="p-4">Issue</th>
              <th className="p-4">Reporter</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Action / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">
                  No {currentTab.toLowerCase()} tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-indigo-600 text-sm">{t.ticketNumber}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-500 truncate max-w-62.5 mt-0.5">{t.description}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">{t.reporterEmail}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-0.5">{t.reporterType}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    {currentTab === "OPEN" ? (
                      <form action={resolveTicket}>
                        <input type="hidden" name="id" value={t.id} />
                        <button className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200">
                          Mark Resolved
                        </button>
                      </form>
                    ) : (
                      <div className="text-xs font-bold text-slate-400">
                        Resolved on:<br/>
                        <span className="text-slate-600">
                          {new Date(t.resolvedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}