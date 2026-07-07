"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, CheckCircle2, XCircle, ChevronRight, Info, AlertTriangle } from 'lucide-react';

export default function AdmissionCalculator() {
  const [sscGpa, setSscGpa] = useState('');
  const [hscGpa, setHscGpa] = useState('');
  const [physics, setPhysics] = useState('');
  const [chemistry, setChemistry] = useState('');
  const [math, setMath] = useState('');

  const [result, setResult] = useState<{ status: 'pass' | 'fail' | 'error' | null; message: string }>({ status: null, message: '' });

  const checkEligibility = () => {
    const ssc = parseFloat(sscGpa);
    const hsc = parseFloat(hscGpa);
    const phy = parseFloat(physics);
    const chem = parseFloat(chemistry);
    const mth = parseFloat(math);

    if (ssc > 5 || hsc > 5 || ssc < 0 || hsc < 0) {
      setResult({ status: 'error', message: 'INVALID GPA: Maximum allowed value is 5.00.' });
      return;
    }
    if (phy > 100 || chem > 100 || mth > 100) {
      setResult({ status: 'error', message: 'INVALID MARKS: Subject scores cannot exceed 100.' });
      return;
    }
    if ([ssc, hsc, phy, chem, mth].some((val) => isNaN(val))) {
      setResult({ status: 'error', message: 'INPUT REQUIRED: Please fill all engineering parameters.' });
      return;
    }

    const avgGpa = (ssc + hsc) / 2;
    const minMarks = 70;

    if (avgGpa >= 4.5 && phy >= minMarks && chem >= minMarks && mth >= minMarks) {
      setResult({ status: 'pass', message: `ELIGIBLE: Average GPA ${(avgGpa).toFixed(2)} meets CMSIL 2026 standards.` });
    } else {
      setResult({ status: 'fail', message: 'NOT ELIGIBLE: Requires Avg GPA 4.50+ and 70+ in all Science subjects.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-3">
            <Calculator className="text-indigo-600" size={32} />
            Eligibility Calculator
          </h1>
          <p className="text-slate-500">Check if you meet the requirements for the B.Sc Engineering program.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">SSC GPA</label>
              <input type="number" value={sscGpa} onChange={e => setSscGpa(e.target.value)} placeholder="e.g. 5.00" className="w-full p-3 border rounded-lg bg-slate-50 mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">HSC GPA</label>
              <input type="number" value={hscGpa} onChange={e => setHscGpa(e.target.value)} placeholder="e.g. 5.00" className="w-full p-3 border rounded-lg bg-slate-50 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">HSC Physics</label>
              <input type="number" value={physics} onChange={e => setPhysics(e.target.value)} placeholder="Out of 100" className="w-full p-3 border rounded-lg bg-slate-50 mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">HSC Chemistry</label>
              <input type="number" value={chemistry} onChange={e => setChemistry(e.target.value)} placeholder="Out of 100" className="w-full p-3 border rounded-lg bg-slate-50 mt-1" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">HSC Higher Math</label>
              <input type="number" value={math} onChange={e => setMath(e.target.value)} placeholder="Out of 100" className="w-full p-3 border rounded-lg bg-slate-50 mt-1" />
            </div>
          </div>

          <button onClick={checkEligibility} className="w-full bg-slate-900 text-white font-bold p-4 rounded-lg hover:bg-slate-800 transition">
            Calculate Eligibility
          </button>
        </div>

        {/* DYNAMIC RESULTS SECTION */}
        {result.status && (
          <div className={`p-6 rounded-2xl border ${
            result.status === 'pass' ? 'bg-emerald-50 border-emerald-200' :
            result.status === 'fail' ? 'bg-rose-50 border-rose-200' :
            'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-4">
              {result.status === 'pass' && <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />}
              {result.status === 'fail' && <XCircle className="text-rose-600 shrink-0" size={24} />}
              {result.status === 'error' && <AlertTriangle className="text-amber-600 shrink-0" size={24} />}
              
              <div className="flex-1">
                <p className={`font-bold ${
                  result.status === 'pass' ? 'text-emerald-800' :
                  result.status === 'fail' ? 'text-rose-800' : 'text-amber-800'
                }`}>
                  {result.message}
                </p>
                
                {/* THE MAGIC LINK TO APPLY (ONLY SHOWS ON PASS) */}
                {result.status === 'pass' && (
                  <div className="mt-4">
                    <Link href="/admission-calculator/apply">
                      <button className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-700 transition">
                        Proceed to Application <ChevronRight size={18} />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}