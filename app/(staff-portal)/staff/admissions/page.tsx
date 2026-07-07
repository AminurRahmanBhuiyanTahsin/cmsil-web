import { db } from "@/lib/db";
import { approveAdmission } from "./actions"; // We'll create this next

export default async function AdmissionsPage() {
  // Fetch pending applications
  const [rows] = await db.execute("SELECT * FROM admission_applications WHERE status = 'pending'");
  const applications = rows as any[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">New Admission Applications</h1>
        <div className="text-sm font-bold text-slate-500">{applications.length} Pending</div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600">Applicant</th>
              <th className="p-4 font-bold text-slate-600">GPA</th>
              <th className="p-4 font-bold text-slate-600">Dept</th>
              <th className="p-4 font-bold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{app.studentName}</p>
                  <p className="text-xs text-slate-500">{app.email}</p>
                </td>
                <td className="p-4 font-mono font-bold text-slate-700">{app.gpa}</td>
                <td className="p-4 text-slate-600">{app.department}</td>
                <td className="p-4 flex gap-2">
                  <form action={approveAdmission}>
                    <input type="hidden" name="id" value={app.id} />
                    <button className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700">
                      Approve
                    </button>
                  </form>
                  <button className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-200">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}