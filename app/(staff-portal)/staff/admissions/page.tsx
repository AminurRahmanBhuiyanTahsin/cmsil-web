import { db } from "@/lib/db";
import { rejectAdmission } from "./actions";
import Link from "next/link";

export default async function AdmissionsPage({
  searchParams,
}: {
  // Next.js 15 requires searchParams to be a Promise!
  searchParams: Promise<{ tab?: string }>;
}) {
  // 1. Get the current tab from the URL (default to 'pending')
  const params = await searchParams;
  const tab = params?.tab || "pending";
  
  // Ensure it's a valid status to prevent database errors
  const currentTab = ["pending", "approved", "rejected"].includes(tab) ? tab : "pending";

  // 2. Fetch applications based on the selected tab
  const [rows] = await db.execute(
    "SELECT * FROM admission_applications WHERE status = ? ORDER BY applicationDate DESC", 
    [currentTab]
  );
  const applications = rows as any[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Admission Applications</h1>
        <div className="text-sm font-bold text-slate-500">
          {applications.length} {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
        </div>
      </div>

      {/* 3. The Tab Menu */}
      <div className="flex gap-3 border-b border-slate-200 pb-4">
        <Link 
          href="?tab=pending" 
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentTab === "pending" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Pending
        </Link>
        <Link 
          href="?tab=approved" 
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentTab === "approved" ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Approved
        </Link>
        <Link 
          href="?tab=rejected" 
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${currentTab === "rejected" ? "bg-rose-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          Rejected
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-bold text-slate-600">Applicant</th>
              <th className="p-4 font-bold text-slate-600">GPA</th>
              <th className="p-4 font-bold text-slate-600">Dept</th>
              <th className="p-4 font-bold text-slate-600">Action / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">
                  No {currentTab} applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{app.studentName}</p>
                    <p className="text-xs text-slate-500">{app.email}</p>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-700">{app.gpa}</td>
                  <td className="p-4 text-slate-600">{app.department}</td>
                  <td className="p-4 flex gap-2 items-center">
                    
                    {/* Only show Approve/Reject buttons if the status is pending */}
                    {currentTab === "pending" ? (
                      <>
                        <Link 
                          href={`/staff/admissions/enroll/${app.id}`}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 flex items-center"
                        >
                          Review & Enroll
                        </Link>
                        <form action={rejectAdmission}>
                          <input type="hidden" name="id" value={app.id} />
                          <button className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-200">
                            Reject
                          </button>
                        </form>
                      </>
                    ) : (
                      /* If it's already approved or rejected, just show a nice status badge! */
                      <span className={`px-3 py-1 text-xs font-bold rounded-lg ${currentTab === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {currentTab.toUpperCase()}
                      </span>
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