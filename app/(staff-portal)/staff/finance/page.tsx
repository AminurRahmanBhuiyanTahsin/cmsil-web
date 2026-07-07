import { db } from "@/lib/db";
import { updatePaymentStatus } from "./actions";

export default async function FinancePage() {
  // Fetch pending fees - Assuming you create a 'student_fees' table
  // Fetch pending fees joined with the student name
const [rows] = await db.execute(`
    SELECT f.*, s.name as studentName 
    FROM StudentFee f
    JOIN enrolledstudent s ON f.studentId = s.id
    WHERE f.status IN ('UNPAID', 'PARTIAL')
`);
  const pendingFees = rows as any[];

  // Calculate total revenue
  const totalOutstanding = pendingFees.reduce((acc, fee) => acc + fee.amount, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-slate-800">Finance & Accounts</h1>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Pending</p>
          <p className="text-3xl font-black text-rose-600">${totalOutstanding.toLocaleString()}</p>
        </div>
        {/* You can add more widgets here like 'Collected This Month' */}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-800">Pending Tuition Payments</div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Fee Category</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pendingFees.map((fee) => (
              <tr key={fee.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{fee.studentName}</td>
                <td className="p-4 text-slate-600">{fee.category}</td>
                <td className="p-4 font-mono font-bold text-slate-700">${fee.amount}</td>
                <td className="p-4">
                  <form action={updatePaymentStatus}>
                    <input type="hidden" name="id" value={fee.id} />
                    <button className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition">
                      Mark Paid
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