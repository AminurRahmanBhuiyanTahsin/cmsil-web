"use client";

import { useEffect, useState } from "react";
import { getStudentFees } from "./actions";
import { Wallet, Receipt, CheckCircle, AlertTriangle, Clock, CreditCard } from "lucide-react";

export default function StudentFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFees() {
      const res = await getStudentFees(); 
      if (res.success && res.data) {
        setFees(res.data);
      }
      setLoading(false);
    }
    fetchFees();
  }, []);

  // Calculate totals
  const totalOutstanding = fees.reduce((sum, fee) => sum + (parseFloat(fee.amountDue) - parseFloat(fee.amountPaid)), 0);
  const totalPaid = fees.reduce((sum, fee) => sum + parseFloat(fee.amountPaid), 0);

  if (loading) {
    return <div className="p-8 text-slate-500 font-bold animate-pulse">Loading Financial Data...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
            Accounts & Billing
          </span>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Wallet size={36} className="text-emerald-500" />
            Financial Dashboard
          </h1>
          <p className="text-slate-400 font-medium text-lg">Manage your tuition, invoices, and payment history.</p>
        </div>
        
        {/* Outstanding Balance Highlight */}
        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shrink-0 text-center md:text-right backdrop-blur-sm">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Outstanding</p>
          <p className={`text-4xl font-black ${totalOutstanding > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ৳{totalOutstanding.toLocaleString()}
          </p>
          {totalOutstanding > 0 && (
            <button className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg w-full transition-colors flex items-center justify-center gap-2">
              <CreditCard size={18} /> Pay Now
            </button>
          )}
        </div>
      </section>

      {/* INVOICE LIST */}
      <section>
        <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2 border-b border-slate-200 pb-4">
          <Receipt className="text-slate-500" /> Transaction History
        </h2>
        
        {fees.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 font-bold text-lg">No financial records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fees.map((fee: any, i: number) => {
              
              // Determine status styles
              let statusStyle = "";
              let StatusIcon = Clock;
              
              if (fee.status === 'PAID') {
                statusStyle = "bg-emerald-100 text-emerald-700 border-emerald-200";
                StatusIcon = CheckCircle;
              } else if (fee.status === 'OVERDUE') {
                statusStyle = "bg-rose-100 text-rose-700 border-rose-200";
                StatusIcon = AlertTriangle;
              } else {
                statusStyle = "bg-amber-100 text-amber-700 border-amber-200";
                StatusIcon = Clock;
              }

              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                  
                  {/* Left: Invoice Info */}
                  <div className="grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border ${statusStyle} flex items-center gap-1`}>
                        <StatusIcon size={12} /> {fee.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        {fee.invoiceNumber}
                      </span>
                    </div>
                    <h3 className="font-black text-slate-800 text-xl leading-tight">
                      {fee.feeType}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Semester {fee.semester}</p>
                  </div>

                  {/* Middle: Dates */}
                  <div className="shrink-0 text-sm">
                    <p className="text-slate-500"><span className="font-bold text-slate-400">Due:</span> {new Date(fee.dueDate).toLocaleDateString()}</p>
                    {fee.paymentDate && (
                      <p className="text-emerald-600 font-medium mt-1"><span className="font-bold text-slate-400">Paid:</span> {new Date(fee.paymentDate).toLocaleDateString()}</p>
                    )}
                  </div>

                  {/* Right: Amounts */}
                  <div className="shrink-0 text-right md:w-48 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                    <p className="text-2xl font-black text-slate-800">৳{parseFloat(fee.amountDue).toLocaleString()}</p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}