import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  Plus, 
  AlertCircle, 
  FileText, 
  Video, 
  UserCheck, 
  Navigation,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ClinicalVisit, Patient } from '../../types';

export const DoctorDashboard: React.FC = () => {
  const { 
    currentDoctor, 
    selectedOrgId, 
    setSelectedOrgId, 
    todayQueue, 
    patients, 
    startConsultation, 
    activeConsultation, 
    setSelectedPatient, 
    setCurrentView,
    conflictAlerts,
    addNewVisit,
    addNewPatient
  } = useApp();

  const [queueFilter, setQueueFilter] = useState<'ALL' | 'WAITING' | 'IN_CONSULT' | 'COMPLETED'>('ALL');
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);

  // Filtered queue items
  const filteredQueue = todayQueue.filter(visit => {
    if (queueFilter === 'WAITING') return visit.status === 'Waiting';
    if (queueFilter === 'IN_CONSULT') return visit.status === 'In-Consultation';
    if (queueFilter === 'COMPLETED') return visit.status === 'Completed';
    return true;
  });

  const waitingCount = todayQueue.filter(v => v.status === 'Waiting').length;
  const inConsultCount = todayQueue.filter(v => v.status === 'In-Consultation').length;
  const completedCount = todayQueue.filter(v => v.status === 'Completed').length;
  const scheduledCount = todayQueue.filter(v => v.status === 'Scheduled').length;

  const totalFeeCollected = todayQueue
    .filter(v => v.isPaid)
    .reduce((sum, v) => sum + v.fee, 0);

  const getPatientForVisit = (patientId: string): Patient | undefined => {
    return patients.find(p => p.id === patientId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Greeting, Multi-Org Scope Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Multi-Facility Clinical Cockpit • Today: Thursday, Oct 29, 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Good evening, {currentDoctor.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {currentDoctor.title} • {currentDoctor.specialty}
            </p>
          </div>

          {/* Quick Org Scope Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">View Scope:</span>
            
            <button
              onClick={() => setSelectedOrgId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedOrgId === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Unified (All Facilities)
            </button>

            {currentDoctor.organizations.map(org => (
              <button
                key={org.id}
                onClick={() => setSelectedOrgId(org.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedOrgId === org.id
                    ? 'bg-slate-100 text-slate-900 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: org.color }}
                />
                <span>{org.shortName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Queue Load */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Today's OPD Queue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{todayQueue.length}</div>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <span className="text-amber-400 font-semibold">{waitingCount} Waiting</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">{inConsultCount} In-Room</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{completedCount} Done</span>
          </div>
        </div>

        {/* Stat 2: Active Facility & Next Shift */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Active Location</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {selectedOrgId === 'all' ? 'Chen Advanced Clinic' : currentDoctor.organizations.find(o => o.id === selectedOrgId)?.shortName}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>Evening Chamber (07:00 - 09:30 PM)</span>
          </div>
        </div>

        {/* Stat 3: Travel Buffer Conflicts */}
        <div 
          onClick={() => setCurrentView('conflicts')}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Transit Conflicts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{conflictAlerts.length}</div>
          <div className="text-xs text-slate-400 mt-2 flex items-center space-x-1 group-hover:text-amber-300">
            <span>Tight transit window detected</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Stat 4: Multi-Clinic Billing */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">Today's Collections</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">₹{totalFeeCollected.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-2">
            Consolidated across 3 consultancy accounts
          </div>
        </div>

      </div>

      {/* Main Content Layout: Left Queue & Right Clinical Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Live Consultation Queue */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            
            {/* Queue Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h2 className="text-lg font-bold text-white">Live OPD Consultation Queue</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time triage and patient progression across active sessions
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setQueueFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    queueFilter === 'ALL' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({todayQueue.length})
                </button>
                <button
                  onClick={() => setQueueFilter('WAITING')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    queueFilter === 'WAITING' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Waiting ({waitingCount})
                </button>
                <button
                  onClick={() => setQueueFilter('IN_CONSULT')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    queueFilter === 'IN_CONSULT' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  In-Room ({inConsultCount})
                </button>
                <button
                  onClick={() => setQueueFilter('COMPLETED')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    queueFilter === 'COMPLETED' ? 'bg-slate-800 text-slate-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Done ({completedCount})
                </button>
              </div>
            </div>

            {/* Queue List */}
            <div className="divide-y divide-slate-800/80 mt-2">
              {filteredQueue.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No patients found matching this filter.
                </div>
              ) : (
                filteredQueue.map((visit) => {
                  const pat = getPatientForVisit(visit.patientId);
                  const isCurrentActive = activeConsultation?.id === visit.id;

                  return (
                    <div 
                      key={visit.id}
                      className={`py-4 transition-all ${
                        isCurrentActive ? 'bg-emerald-500/5 -mx-6 px-6 border-l-4 border-emerald-400' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Token & Patient Demographics */}
                        <div className="flex items-start space-x-3.5">
                          {/* Token Badge */}
                          <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold text-sm flex-shrink-0 shadow-md ${
                            visit.status === 'In-Consultation'
                              ? 'bg-emerald-500 text-slate-950 animate-pulse'
                              : visit.status === 'Waiting'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : visit.status === 'Completed'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-slate-800/60 text-slate-300'
                          }`}>
                            <span className="text-[9px] uppercase tracking-tighter leading-none text-slate-400">Token</span>
                            <span className="text-base leading-none">#{visit.tokenNumber}</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 
                                onClick={() => {
                                  setSelectedPatient(pat || null);
                                  setCurrentView('patients');
                                }}
                                className="font-bold text-white text-sm hover:text-emerald-400 cursor-pointer transition-colors"
                              >
                                {pat?.name || 'Unknown Patient'}
                              </h3>
                              <span className="text-xs text-slate-400">
                                ({pat?.gender}, {pat?.age}y)
                              </span>
                              
                              {/* Status Pill */}
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                visit.status === 'In-Consultation'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : visit.status === 'Waiting'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : visit.status === 'Completed'
                                  ? 'bg-slate-800 text-slate-400'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {visit.status}
                              </span>
                            </div>

                            {/* MRN & Facility Tag */}
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                              <span className="font-mono">{pat?.mrn}</span>
                              <span>•</span>
                              <span className="text-slate-300 font-medium">{visit.organizationName}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{visit.time}</span>
                              </span>
                            </div>

                            {/* Chief Complaint */}
                            <p className="text-xs text-slate-300 mt-1.5 line-clamp-1">
                              <strong>Complaint:</strong> {visit.chiefComplaint}
                            </p>

                            {/* Allergy Warning Pill if any! */}
                            {pat && pat.allergies.length > 0 && (
                              <div className="mt-2 inline-flex items-center space-x-1 text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md">
                                <AlertCircle className="w-3 h-3 text-rose-400" />
                                <span>Allergy Alert: {pat.allergies.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          {/* View Cross-Org History button */}
                          <button
                            onClick={() => {
                              setSelectedPatient(pat || null);
                              setCurrentView('patients');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                            title="Open Cross-Facility History"
                          >
                            Cross-Org EHR
                          </button>

                          {visit.status === 'Waiting' && (
                            <button
                              onClick={() => startConsultation(visit.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
                            >
                              <span>Call Patient</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {visit.status === 'In-Consultation' && (
                            <button
                              onClick={() => setCurrentView('consultation')}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 animate-pulse transition-all flex items-center space-x-1.5"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>Resume Consult</span>
                            </button>
                          )}

                          {visit.status === 'Completed' && (
                            <button
                              onClick={() => {
                                setSelectedPatient(pat || null);
                                setCurrentView('patients');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-medium"
                            >
                              View Summary
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Right 1 Column: Active Patient Widget & Travel Buffer */}
        <div className="space-y-6">
          
          {/* Active In-Room Patient Box */}
          {activeConsultation ? (
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Currently In Consultation
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Token #{activeConsultation.tokenNumber}
                </span>
              </div>

              {(() => {
                const pat = getPatientForVisit(activeConsultation.patientId);
                return (
                  <div>
                    <h3 className="text-lg font-bold text-white">{pat?.name}</h3>
                    <p className="text-xs text-slate-300">
                      {pat?.gender}, {pat?.age} years • MRN: {pat?.mrn}
                    </p>

                    {/* Vitals Summary Strip */}
                    <div className="grid grid-cols-3 gap-2 my-3 text-center">
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Blood Pressure</div>
                        <div className="text-xs font-bold text-emerald-400">{activeConsultation.vitals.bp}</div>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Heart Rate</div>
                        <div className="text-xs font-bold text-emerald-400">{activeConsultation.vitals.pulse} bpm</div>
                      </div>
                      <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">SpO2</div>
                        <div className="text-xs font-bold text-emerald-400">{activeConsultation.vitals.spO2}%</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 italic mb-4">
                      "{activeConsultation.chiefComplaint}"
                    </p>

                    <button
                      onClick={() => setCurrentView('consultation')}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Open Rx & Clinical Note Workspace</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center text-slate-400">
              <Stethoscope className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-300">No Patient in Room</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Click "Call Patient" on any waiting token to initiate active consultation.
              </p>
            </div>
          )}

          {/* Today's Multi-Clinic Schedule & Commute Tracker */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Today's Multi-Clinic Transit
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">3 Shifts</span>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Shift 1 */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 mt-1" />
                  <div className="w-0.5 h-8 bg-slate-800" />
                </div>
                <div>
                  <div className="font-semibold text-slate-300">Apollo Grand Multispeciality</div>
                  <div className="text-[11px] text-slate-500">08:30 AM - 01:30 PM • 14 Patients (Completed)</div>
                </div>
              </div>

              {/* Transit Buffer */}
              <div className="flex items-start space-x-3 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-200">
                  <strong>Transit Alert:</strong> Outer Ring Road commute took 38 mins. Next schedule buffer recommended: +15 mins.
                </div>
              </div>

              {/* Shift 2 */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 mt-1" />
                  <div className="w-0.5 h-8 bg-slate-800" />
                </div>
                <div>
                  <div className="font-semibold text-slate-300">St. Jude Vascular Institute</div>
                  <div className="text-[11px] text-slate-500">02:00 PM - 06:30 PM • Cath-Lab Consults</div>
                </div>
              </div>

              {/* Shift 3 (Active) */}
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping mt-1" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center space-x-1.5">
                    <span>Chen Advanced Heart Clinic</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Active Now</span>
                  </div>
                  <div className="text-[11px] text-emerald-400/80">07:00 PM - 09:30 PM • OPD Consultation</div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Security Reassurance */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">ABDM & HIPAA Secured:</span>
              <p className="text-[11px] text-slate-400">
                All records accessed in this session are encrypted and cryptographically bound to Patient Consent Token #91-4820.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
