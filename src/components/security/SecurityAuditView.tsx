import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Download, 
  CheckCircle2, 
  Key, 
  Database,
  Activity,
  RefreshCw
} from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Compliance & Patient Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            HIPAA, ABDM & Forensic Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            Patient consent management and audit logging for every medical record viewed across organizations.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center space-x-2 shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-purple-600" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Compliance Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Active</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Strict role-based isolation between hospital databases</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold mb-1">
            <Key className="w-4 h-4" />
            <span>ABDM Consent Gate</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">M1 / M2 / M3</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Ayushman Bharat Digital Mission interoperable network</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-purple-600 text-xs font-bold mb-1">
            <Lock className="w-4 h-4" />
            <span>Data Encryption</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">AES-256</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tamper-evident digital signatures and audit verification</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold mb-1">
            <Database className="w-4 h-4" />
            <span>Data Consistency</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Local Sync</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Offline-ready local state with conflict-free replication</div>
        </div>
      </div>

      {/* Patient Consent Manager */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Patient Consent Registry (ABDM Framework)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Patient-Controlled Access</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {patients.map(p => (
            <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500">{p.mrn}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ABHA: {p.abhaId} • Valid thru: {p.consentExpiresAt}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  p.consentStatus === 'GRANTED_ALL'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {p.consentStatus === 'GRANTED_ALL' ? 'Granted Across All Doctor Clinics' : p.consentStatus}
                </span>

                <select
                  value={p.consentStatus}
                  onChange={(e) => updatePatientConsent(p.id, e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-[11px] text-slate-800 dark:text-slate-200 font-medium"
                >
                  <option value="GRANTED_ALL">Full Cross-Org Access</option>
                  <option value="RESTRICTED_ATTENDING">Attending Clinic Only</option>
                  <option value="EMERGENCY_OVERRIDE">Emergency Break-Glass Override</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forensic Audit Stream */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>Forensic Access Audit Trail ({filteredLogs.length} events)</span>
          </h2>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Filter logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Events</option>
              <option value="VIEW_CROSS_ORG_HISTORY">View Chart</option>
              <option value="CREATE_PRESCRIPTION">Prescription</option>
              <option value="START_CONSULTATION">Start Consult</option>
              <option value="COMPLETE_VISIT">Complete Visit</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <span>{log.timestamp}</span>
                  <span>•</span>
                  <span className="text-sky-700 dark:text-sky-400 font-bold">{log.action}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {log.ipAddress} • {log.device}
                </div>
              </div>

              <div className="mt-1 text-slate-800 dark:text-slate-200 font-sans text-xs">
                {log.details}
              </div>

              <div className="mt-1 text-[10px] text-slate-500 font-sans flex items-center space-x-2">
                <span>Doctor: <strong>{log.doctorName}</strong></span>
                {log.patientName && (
                  <>
                    <span>•</span>
                    <span>Patient: <strong>{log.patientName}</strong></span>
                  </>
                )}
                <span>•</span>
                <span>Facility: <strong>{log.organizationName}</strong></span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Encrypted client-side storage cache active.</span>
          <button
            onClick={resetAllDemoData}
            className="text-rose-600 hover:underline flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Database</span>
          </button>
        </div>
      </div>

    </div>
  );
};
