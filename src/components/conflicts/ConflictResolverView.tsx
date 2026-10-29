import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Clock, 
  Building2, 
  Navigation, 
  CheckCircle2, 
  ShieldAlert, 
  Users, 
  ArrowRight,
  Sliders
} from 'lucide-react';

export const ConflictResolverView: React.FC = () => {
  const { currentDoctor, conflictAlerts, doctorPatients, visits, setSelectedPatient, setCurrentView } = useApp();
  const [bufferSetting, setBufferSetting] = useState(30);
  const [isBufferSaved, setIsBufferSaved] = useState(false);

  // Find co-managed patients for this doctor seen across multiple facilities
  const multiFacilityPatients = doctorPatients.filter(patient => {
    const patientVisits = visits.filter(v => v.patientId === patient.id && v.doctorId === currentDoctor.id);
    const facilities = new Set(patientVisits.map(v => v.organizationId));
    return facilities.size > 1;
  });

  const handleSaveBuffer = () => {
    setIsBufferSaved(true);
    setTimeout(() => setIsBufferSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Multi-Clinic Mobility & Buffer Guard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
          Transit Conflicts & Cross-Clinic Care
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Coordinate shifts across hospitals and outpatient clinics without double-booking or tight commute windows.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Conflicts and Buffer Setting */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Alerts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Detected Transit Collisions ({conflictAlerts.length})</span>
              </h2>
              <span className="text-xs font-mono font-bold text-amber-600">Active Warning</span>
            </div>

            <div className="space-y-3">
              {conflictAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{alert.date} • {alert.timeRange}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                      {alert.severity} PRIORITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-900 text-[11px]">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                      <div className="text-slate-400 font-semibold">Departure:</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{alert.orgA.name}</div>
                      <div className="text-slate-500 text-[10px]">{alert.orgA.slot}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                      <div className="text-slate-400 font-semibold">Arrival:</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{alert.orgB.name}</div>
                      <div className="text-slate-500 text-[10px]">{alert.orgB.slot}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-amber-800 dark:text-amber-300 font-mono">
                    <span>Estimated Transit: {alert.commuteEstimate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buffer Simulator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Sliders className="w-4 h-4 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Inter-Clinic Transit Buffer Guard</h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Set the minimum travel buffer automatically reserved between your different hospital duty and clinic schedules. The booking desk will lock slots during this transit period.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Transit Buffer Guard:</span>
                <span className="text-sky-600 font-mono text-sm font-bold">{bufferSetting} Minutes</span>
              </div>

              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={bufferSetting}
                onChange={(e) => setBufferSetting(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>15 min</span>
                <span>30 min (Recommended)</span>
                <span>45 min (Heavy traffic)</span>
                <span>60 min</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isBufferSaved ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Buffer guard updated and synced to all clinic desks!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Protects booking calendar from overlap</span>
              )}

              <button
                onClick={handleSaveBuffer}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                Save Buffer Policy
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Co-Managed Patients */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Cross-Facility Co-Managed Patients</span>
              </h2>
              <span className="text-xs font-mono font-bold text-sky-600">
                {multiFacilityPatients.length} Active
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Patients you attend across two or more separate medical organizations:
            </p>

            <div className="space-y-3">
              {multiFacilityPatients.map(pat => {
                const patVisits = visits.filter(v => v.patientId === pat.id && v.doctorId === currentDoctor.id);
                const uniqueOrgs = Array.from(new Set(patVisits.map(v => v.organizationName)));

                return (
                  <div
                    key={pat.id}
                    onClick={() => {
                      setSelectedPatient(pat);
                      setCurrentView('patients');
                    }}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-sky-500/80 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                          {pat.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {pat.gender}, {pat.age}y • MRN: {pat.mrn}
                        </p>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300">
                        {uniqueOrgs.length} Facilities
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Care Facilities:</div>
                      {uniqueOrgs.map((org, i) => (
                        <div key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                          <span>{org}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] text-sky-600 font-semibold">
                      <span>View Unified Medical Records</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
