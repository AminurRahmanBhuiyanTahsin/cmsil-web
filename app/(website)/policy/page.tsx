"use client";

import React, { useState } from 'react';
import { Shield, ShieldAlert, Library, Monitor, HardHat, FileText, CheckCircle2 } from 'lucide-react';

type PolicySection = 'ACADEMIC' | 'ICT_SECURITY' | 'INFRASTRUCTURE' | 'COMPLIANCE';

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<PolicySection>('ACADEMIC');

  const tabs = [
    { id: 'ACADEMIC', label: 'Academic Standing', icon: <Library className="w-4 h-4" /> },
    { id: 'ICT_SECURITY', label: 'ICT & Cybersecurity', icon: <Monitor className="w-4 h-4" /> },
    { id: 'INFRASTRUCTURE', label: 'Lab & Infrastructure', icon: <HardHat className="w-4 h-4" /> },
    { id: 'COMPLIANCE', label: 'Institutional Compliance', icon: <Shield className="w-4 h-4" /> },
  ] as const;

  const policyData = {
    ACADEMIC: {
      title: "Academic Integrity & Attendance Governance",
      effectiveDate: "January 01, 2026",
      overview: "Standard code governing student evaluation pathways, classroom attendance requirements, and quantitative assessment compliance.",
      clauses: [
        { code: "ACA-101", title: "Mandatory Session Attendance Threshold", detail: "Students are strictly required to maintain a minimum of 75% classroom session presence to clear eligibility checks for final semester examinations. Falling below 75% triggers an automatic system lockout for that particular course module." },
        { code: "ACA-102", title: "Library Resource Circulation Liabilities", detail: "Core textbooks are checked out under a strict 7-Day Return Rule handled via our automated tracking triggers. Failure to clear return logs within the specified interval suspends digital token issuance privileges." },
        { code: "ACA-103", title: "Plagiarism & Code Assessment Verification", detail: "All algorithmic script submissions, software projects, and laboratory datasets must undergo automated similarity checks. Plagiarism indices exceeding 15% result in immediate nullification of marks." }
      ]
    },
    ICT_SECURITY: {
      title: "ICT Infrastructure & Digital Identity Security",
      effectiveDate: "March 15, 2026",
      overview: "Operational parameters regarding the use of institutional networks, server arrays, portal access hashes, and security logs.",
      clauses: [
        { code: "SEC-201", title: "Identity Authentication Enforcements", detail: "100% user verification is required for all backend portal interactions. Cryptographic institutional pre-provisioned handles must not be transferred, shared, or linked to unauthorized third-party credentials." },
        { code: "SEC-202", title: "Campus Network & Bandwidth Allocations", detail: "The high-speed fiber backbone network inside engineering sectors is strictly reserved for academic research, repository synchronization, and development compiles. P2P masking patterns or heavy game packet handling will flag traffic logs for firewall restriction." },
        { code: "SEC-203", title: "Database Integrity & API Abuse Limits", detail: "System-level endpoints queried by client hooks are subject to strict rate limits. Any automated data scraping tools hitting institutional routes without explicit administration clearance will trigger a permanent IP blacklist." }
      ]
    },
    INFRASTRUCTURE: {
      title: "Advanced Engineering Laboratory & Safety Protocol",
      effectiveDate: "February 10, 2026",
      overview: "Regulations detailing safe operational metrics across heavy physical machinery, cleanroom sectors, and advanced computation labs.",
      clauses: [
        { code: "LAB-301", title: "Specialized Equipment Operational Clearance", detail: "Students cannot initialize heavy laboratory systems, chemical processes, or microgrid testing stations without direct faculty supervision and certified workspace briefing." },
        { code: "LAB-302", title: "Compute Node Allocation Limits", detail: "High-performance GPU cluster resources are allocated explicitly via faculty-approved project briefs. Idle run processes left running on nodes for over 2 hours without transactional calculations are purged automatically." },
        { code: "LAB-303", title: "Hardware Liability & Asset Auditing", detail: "Any microcontrollers, development boards (FPGA, Arduino, Raspberry Pi), or physical testing tools checked out from the tech pool must be accounted for cleanly during end-of-week inventories." }
      ]
    },
    COMPLIANCE: {
      title: "Institutional Compliance & Grievance Mechanics",
      effectiveDate: "June 01, 2026",
      overview: "Framework for institutional accountability, formal student-faculty dispute resolution, and credit migration tracks.",
      clauses: [
        { code: "CMP-401", title: "Formal Academic Dispute Pipelines", detail: "Any systematic grievances regarding grade distributions, assessment inaccuracies, or library audit flags must be logged through the Help Desk panel within 7 working days of data initialization." },
        { code: "CMP-402", title: "Data Privacy & Academic Record Retentions", detail: "CMSIL complies fully with regional data security standards. Academic records, log states, attendance histories, and transactional identifiers are secured inside encrypted cold data farms." },
        { code: "CMP-403", title: "Tuition & Fee Payment Delinquencies", detail: "Semester registration tokens are verified against the Student Fee Tracking subsystem. Unresolved financial dues block mid-term registration profiles automatically after grace periods expire." }
      ]
    }
  };

  const currentPolicy = policyData[activeTab];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans antialiased">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>Governance & Legal Operations Desk</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight mt-2">
            Institutional Charter & Policies
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-500 max-w-2xl">
            Review the structural parameters, academic codes, and cybersecurity frameworks that maintain data integrity and professional standards across CMSIL Engineering Institute.
          </p>
        </div>
      </div>

      {/* 2. Main Tabbed Layout Container */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Vertical Tab Navigation Sidebar */}
          <div className="flex flex-col gap-1.5 self-start">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-lg border transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200/80 shadow-sm shadow-blue-100/50'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Policy Content Block */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm text-left">
              
              {/* Document Sub-Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                    {currentPolicy.title}
                  </h2>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Document Reference: CMSIL-{activeTab}-2026</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  Effective: {currentPolicy.effectiveDate}
                </span>
              </div>

              {/* Overview Brief */}
              <p className="mt-4 text-slate-600 text-xs md:text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/40 font-medium">
                {currentPolicy.overview}
              </p>

              {/* Segmented Sub-Clauses */}
              <div className="mt-8 space-y-6">
                {currentPolicy.clauses.map((clause, idx) => (
                  <div key={idx} className="group relative pl-4 border-l-2 border-slate-200 hover:border-blue-500 transition-colors">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 tracking-tight bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/60">
                        {clause.code}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base tracking-tight">
                        {clause.title}
                      </h4>
                    </div>
                    <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
                      {clause.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Status Verification Footer */}
              <div className="mt-10 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-medium text-slate-500">Board of Regents Audited</span>
                </div>
                <span>Status: Enforced</span>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}