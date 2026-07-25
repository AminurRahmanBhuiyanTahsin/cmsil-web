import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { submitFacultyTicket } from "./actions";

export default async function TeacherHelpdeskPage() {
  const cookieStore = await cookies();
  // Again, make sure this matches your actual teacher cookie!
  const email = cookieStore.get("teacherEmail")?.value;

  // Fetch the faculty ID
  let faculty = null;
  if (email) {
    const [facultyRows] = await db.execute("SELECT id FROM faculty WHERE email = ?", [email]);
    faculty = (facultyRows as any[])[0];
  }

  // Fetch their previous tickets, making sure to filter by 'FACULTY'
  let tickets: any[] = [];
  if (faculty) {
    const [ticketRows] = await db.execute(
      "SELECT * FROM tickets WHERE reporterId = ? AND reporterType = 'FACULTY' ORDER BY createdAt DESC",
      [faculty.id]
    );
    tickets = ticketRows as any[];
  }

  return (
    // Added p-8 here so the design matches perfectly!
    <div className="max-w-5xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Faculty IT Helpdesk</h1>
        <p className="text-slate-500 text-sm mt-1">Report portal bugs, request hardware support, or escalate system issues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Ticket Submission Form */}
        <div className="lg:col-span-1">
          <form action={submitFacultyTicket} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Open a New Ticket</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
              <input type="text" name="title" placeholder="e.g. Projector in Room 402 broken" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
              <select name="priority" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" required>
                <option value="LOW">Low (General Inquiry)</option>
                <option value="MEDIUM">Medium (Equipment Issue)</option>
                <option value="HIGH">High (Impacting Lecture)</option>
                <option value="CRITICAL">Critical (System Outage)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea name="description" rows={4} placeholder="Describe the problem in detail..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none" required></textarea>
            </div>

            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors">
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Right Side: Ticket History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-slate-800">My Recent Tickets</h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm font-medium">
                  You haven't submitted any support tickets yet.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mr-2">
                          {ticket.ticketNumber}
                        </span>
                        <span className="font-bold text-slate-800">{ticket.title}</span>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider
                        ${ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 
                          ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-slate-100 text-slate-600'}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{ticket.description}</p>
                    <div className="mt-3 text-xs font-medium text-slate-400">
                      Priority: <span className={ticket.priority === 'CRITICAL' ? 'text-rose-600 font-bold' : ''}>{ticket.priority}</span>
                      {ticket.resolvedAt && ` • Resolved: ${new Date(ticket.resolvedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}