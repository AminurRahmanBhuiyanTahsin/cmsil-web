import { db } from "@/lib/db";
import { resolveTicket } from "./actions";

export default async function HelpdeskPage() {
  // Fetch tickets where status is not RESOLVED
  const [rows] = await db.execute("SELECT * FROM tickets WHERE status != 'RESOLVED'");
  const tickets = rows as any[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">IT Helpdesk Dashboard</h1>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs uppercase font-bold text-slate-500">
              <th className="p-4">Ticket #</th>
              <th className="p-4">Issue</th>
              <th className="p-4">Reporter</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono font-bold text-slate-600">#{t.ticketNumber}</td>
                <td className="p-4">
                  <p className="font-bold text-slate-800">{t.title}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{t.description}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-bold text-slate-700">{t.reporterEmail}</p>
                  <p className="text-[10px] uppercase text-slate-400">{t.reporterType}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                    t.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.priority}
                  </span>
                </td>
                <td className="p-4">
                  <form action={resolveTicket}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="text-emerald-600 font-bold text-xs hover:underline">
                      Mark Resolved
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}