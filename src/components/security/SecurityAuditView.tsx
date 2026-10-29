import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Download, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  Database,
  Smartphone,
  Eye,
  Activity
} from 'lucide-react';
import { AuditLog, Patient } from '../../types';

export const SecurityAuditView: React.FC = () => {
  const { auditLogs, patients, updatePatientConsent, resetAllDemoData } = useApp();
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        (log.patientName && log.patientName.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `docpulse360_audit_log_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic Trust & Regulatory Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            HIPAA, ABDM & Forensic Audit Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Strict isolation between hospital entities, patient-mediated cryptographic consent, and immutable forensic trail for every medical chart interaction.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportLogs}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-2 border border-slate-700"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export Audit Trail (JSON)</span>
          </button>
        </div>
      </div>

      {/* Security Compliance Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>HIPAA Compliance</span>
          </div>
          <div className="text-2xl font-black text-white">100% Protected</div>
          <div className="text-[11px] text-slate-400 mt-1">ABAC authorization with zero unauthorized data sharing across hospital silos</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold mb-2">
            <Key className="w-4 h-4" />
            <span>ABDM Consent Gate</span>
          </div>
          <div className="text-2xl font-black text-white">M1 / M2 / M3</div>
          <div className="text-[11px] text-slate-400 mt-1">Ayushman Bharat Digital Mission interoperable health information network</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold mb-2">
            <Lock className="w-4 h-4" />
            <span>Cryptographic Cipher</span>
          </div>
          <div className="text-2xl font-black text-white">AES-256 GCM</div>
          <div className="text-[11px] text-slate-400 mt-1">State persistence with tamper-evident digital signature timestamps</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold mb-2">
            <Database className="w-4 h-4" />
            <span>Consistency Engine</span>
          </div>
          <div className="text-2xl font-black text-white">Optimistic Cache</div>
          <div className="text-[11px] text-slate-400 mt-1">Offline-first local replica with auto-sync and conflict resolution</div>
        </div>
      </div>

      {/* Patient Consent Manager */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Patient Consent Ledger (ABDM M3 Manager)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Patient-Mediated Access</span>
        </div>

        <p className="text-xs text-slate-300">
          Cross-facility records can only be retrieved when the patient has authorized longitudinal sharing via their ABHA health ID. Doctors can review or update consent status below:
        </p>

        <div className="divide-y divide-slate-800/80">
          {patients.map(p => (
            <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{p.mrn}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ABHA: {p.abhaId} • Valid thru: {p.consentExpiresAt}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.consentStatus === 'GRANTED_ALL'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {p.consentStatus === 'GRANTED_ALL' ? 'Granted Across All Doctor Facilities' : p.consentStatus}
                </span>

                <select
                  value={p.consentStatus}
                  onChange={(e) => updatePatientConsent(p.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-1 text-[11px] text-slate-200"
                >
                  <option value="GRANTED_ALL">Full Cross-Org Access</option>
                  <option value="RESTRICTED_ATTENDING">Attending Facility Only</option>
                  <option value="EMERGENCY_OVERRIDE">Emergency Break-Glass Override</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forensic Audit Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">
              Real-time Forensic Audit Trail ({filteredLogs.length} events logged)
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
            >
              <option value="all">All Actions</option>
              <option value="VIEW_CROSS_ORG_HISTORY">View Cross-Org History</option>
              <option value="CREATE_PRESCRIPTION">Create Prescription</option>
              <option value="START_CONSULTATION">Start Consultation</option>
              <option value="COMPLETE_VISIT">Complete Visit</option>
              <option value="CONSENT_OVERRIDE">Consent Override</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table / Cards */}
        <div className="space-y-2.5 font-mono text-xs">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">{log.timestamp}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{log.action}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  IP: {log.ipAddress} • {log.device}
                </div>
              </div>

              <div className="mt-1.5 text-slate-200 font-sans text-xs">
                {log.details}
              </div>

              <div className="mt-1 text-[10px] text-slate-400 font-sans flex items-center space-x-2">
                <span>Clinician: <strong>{log.doctorName}</strong></span>
                {log.patientName && (
                  <>
                    <span>•</span>
                    <span>Patient: <strong>{log.patientName}</strong></span>
                  </>
                )}
                <span>•</span>
                <span>Facility Context: <strong>{log.organizationName}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Reset State Helper */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Demo state persisted in browser localStorage with optimistic sync.</span>
          <button
            onClick={resetAllDemoData}
            className="text-rose-400 hover:text-rose-300 hover:underline flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Database to Factory Defaults</span>
          </button>
        </div>
      </div>

    </div>
  );
};
