import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function AdmissionSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Application Received!</h1>
        <p className="text-slate-500 mb-8">
          Thank you for applying to CMSIL Engineering Institute. Our admissions office will review your profile and contact you via email shortly.
        </p>
        <Link href="/">
          <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition w-full">
            Return to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}