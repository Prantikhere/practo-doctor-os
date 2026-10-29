import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  Clock, 
  Building2, 
  Navigation, 
  CheckCircle2, 
  MapPin, 
  ShieldAlert, 
  Users, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Sliders
} from 'lucide-react';

export const ConflictResolverView: React.FC = () => {
  const { currentDoctor, conflictAlerts, patients, visits, setSelectedPatient, setCurrentView } = useApp();
  const [bufferSetting, setBufferSetting] = useState(30); // 30 min commute buffer
  const [isBufferSaved, setIsBufferSaved] = useState(false);

  // Find patients seen across multiple facilities
  const multiFacilityPatients = patients.filter(patient => {
    const patientVisits = visits.filter(v => v.patientId === patient.id);
    const facilities = new Set(patientVisits.map(v => v.organizationId));
    return facilities.size > 1;
  });

  const handleSaveBuffer = () => {
    setIsBufferSaved(true);
    setTimeout(() => setIsBufferSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Multi-Organization Mobility & Collision Defense</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Schedule Conflict & Cross-Org Travel Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Addressing the biggest pain point of modern physicians: balancing commitments across multiple hospitals, polyclinics, and private chambers without double-booking or commuting burnout.
        </p>
      </div>

      {/* Grid: Active Conflicts Left & Commute Matrix Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Conflicts & Commute Buffer Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Alerts List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">Active Transit & Shift Conflicts ({conflictAlerts.length})</h2>
              </div>
              <span className="text-xs font-mono text-amber-400">Automatic Telemetry</span>
            </div>

            <div className="space-y-4">
              {conflictAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{alert.date} • {alert.timeRange}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {alert.severity} PRIORITY
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-slate-400">Departure Facility:</div>
                      <div className="font-semibold text-slate-200">{alert.orgA.name}</div>
                      <div className="text-slate-400 text-[10px]">{alert.orgA.slot}</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <div className="text-slate-400">Arrival Facility:</div>
                      <div className="font-semibold text-slate-200">{alert.orgB.name}</div>
                      <div className="text-slate-400 text-[10px]">{alert.orgB.slot}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-amber-300 font-mono">
                    <span>Est. Traffic Transit: {alert.commuteEstimate}</span>
                    <span className="text-emerald-400 underline cursor-pointer">Auto-adjust buffer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commute Buffer Setting Simulator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Intelligent Transit Buffer Guard</h2>
            </div>

            <p className="text-xs text-slate-300">
              Configure minimum transition time enforced between different hospital and clinic shifts. The booking engine automatically blocks patients from scheduling within this travel window.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Current Transit Buffer:</span>
                <span className="text-emerald-400 font-mono text-sm">{bufferSetting} Minutes</span>
              </div>

              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={bufferSetting}
                onChange={(e) => setBufferSetting(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>15 min (Same campus)</span>
                <span>30 min (City center)</span>
                <span>45 min (Heavy traffic)</span>
                <span>60 min (Suburban)</span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              {isBufferSaved ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Buffer guard updated & synced across hospital schedulers!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Auto-propagates to all 3 clinic front desks</span>
              )}

              <button
                onClick={handleSaveBuffer}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Save Buffer Policy
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Multi-Facility Patient Care Tracking (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-teal-400" />
                <h2 className="text-base font-bold text-white">Cross-Facility Co-Managed Patients</h2>
              </div>
              <span className="text-xs font-mono text-teal-400">
                {multiFacilityPatients.length} Active Patients
              </span>
            </div>

            <p className="text-xs text-slate-300">
              These patients have received care from you across 2 or more separate institutions. Their longitudinal health journey is automatically linked:
            </p>

            <div className="space-y-3">
              {multiFacilityPatients.map(pat => {
                const patVisits = visits.filter(v => v.patientId === pat.id);
                const uniqueOrgs = Array.from(new Set(patVisits.map(v => v.organizationName)));

                return (
                  <div
                    key={pat.id}
                    onClick={() => {
                      setSelectedPatient(pat);
                      setCurrentView('patients');
                    }}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                          {pat.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {pat.gender}, {pat.age}y • MRN: {pat.mrn}
                        </p>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                        {uniqueOrgs.length} Facilities
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Care Journey:</div>
                      {uniqueOrgs.map((org, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{org}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-teal-400 font-medium">
                      <span>Inspect Unified Medical Records</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commute Distance Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl text-xs space-y-3">
            <div className="font-bold text-white flex items-center space-x-1.5">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Inter-Facility Commute Matrix</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-950 flex justify-between">
                <span>Apollo Grand ➔ St. Jude Vascular</span>
                <span className="font-mono text-emerald-400 font-bold">25 Mins (11.2 km)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 flex justify-between">
                <span>St. Jude Vascular ➔ Chen Private Clinic</span>
                <span className="font-mono text-emerald-400 font-bold">18 Mins (7.4 km)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 flex justify-between">
                <span>Apollo Grand ➔ Chen Private Clinic</span>
                <span className="font-mono text-amber-400 font-bold">38 Mins (18.6 km)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
