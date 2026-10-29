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
  AlertCircle, 
  FileText, 
  Navigation,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Patient } from '../../types';

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
    conflictAlerts
  } = useApp();

  const [queueFilter, setQueueFilter] = useState<'ALL' | 'WAITING' | 'IN_CONSULT' | 'COMPLETED'>('ALL');

  const filteredQueue = todayQueue.filter(visit => {
    if (queueFilter === 'WAITING') return visit.status === 'Waiting';
    if (queueFilter === 'IN_CONSULT') return visit.status === 'In-Consultation';
    if (queueFilter === 'COMPLETED') return visit.status === 'Completed';
    return true;
  });

  const waitingCount = todayQueue.filter(v => v.status === 'Waiting').length;
  const inConsultCount = todayQueue.filter(v => v.status === 'In-Consultation').length;
  const completedCount = todayQueue.filter(v => v.status === 'Completed').length;

  const totalFeeCollected = todayQueue
    .filter(v => v.isPaid)
    .reduce((sum, v) => sum + v.fee, 0);

  const getPatientForVisit = (patientId: string): Patient | undefined => {
    return patients.find(p => p.id === patientId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Welcome Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Today • Thursday, October 29, 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Good evening, {currentDoctor.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {currentDoctor.title} • {currentDoctor.specialty}
            </p>
          </div>

          {/* Quick Clinic Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium mr-1">Clinic Scope:</span>
            
            <button
              onClick={() => setSelectedOrgId('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedOrgId === 'all'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Clinics ({currentDoctor.organizations.length})
            </button>

            {currentDoctor.organizations.map(org => (
              <button
                key={org.id}
                onClick={() => setSelectedOrgId(org.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedOrgId === org.id
                    ? 'bg-white dark:bg-slate-800 border-sky-600 text-sky-700 dark:text-sky-300 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
                <span>{org.shortName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Queue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's OPD Queue</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{todayQueue.length}</div>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <span className="text-amber-600 font-bold">{waitingCount} Waiting</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-bold">{inConsultCount} In-Room</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{completedCount} Done</span>
          </div>
        </div>

        {/* Card 2: Current Location */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Location</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white truncate">
            {selectedOrgId === 'all' ? currentDoctor.organizations[currentDoctor.organizations.length - 1].shortName : currentDoctor.organizations.find(o => o.id === selectedOrgId)?.shortName}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Evening Session Active</span>
          </div>
        </div>

        {/* Card 3: Transit Warnings */}
        <div 
          onClick={() => setCurrentView('conflicts')}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-amber-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Transit Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">{conflictAlerts.length}</div>
          <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1 group-hover:text-amber-600">
            <span>Commute buffer warning</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Collections */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Collections</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">₹{totalFeeCollected.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-2">
            Across {currentDoctor.organizations.length} consulting facilities
          </div>
        </div>

      </div>

      {/* Main Grid: Queue on Left & Active Room on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Live OPD Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>OPD Consultation Queue</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Call next patient, track arrival tokens, and view longitudinal records
                </p>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setQueueFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    queueFilter === 'ALL' ? 'bg-white dark:bg-slate-700 text-sky-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  All ({todayQueue.length})
                </button>
                <button
                  onClick={() => setQueueFilter('WAITING')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    queueFilter === 'WAITING' ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Waiting ({waitingCount})
                </button>
                <button
                  onClick={() => setQueueFilter('IN_CONSULT')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    queueFilter === 'IN_CONSULT' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  In-Room ({inConsultCount})
                </button>
                <button
                  onClick={() => setQueueFilter('COMPLETED')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    queueFilter === 'COMPLETED' ? 'bg-white dark:bg-slate-700 text-slate-800 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Done ({completedCount})
                </button>
              </div>
            </div>

            {/* Queue List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {filteredQueue.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No appointments found for this filter.
                </div>
              ) : (
                filteredQueue.map(visit => {
                  const pat = getPatientForVisit(visit.patientId);
                  const isCurrentActive = activeConsultation?.id === visit.id;

                  return (
                    <div 
                      key={visit.id}
                      className={`py-4 transition-all ${
                        isCurrentActive ? 'bg-sky-50/50 dark:bg-sky-950/20 -mx-6 px-6 border-l-4 border-sky-600' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Token & Demographics */}
                        <div className="flex items-start space-x-3.5">
                          <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold flex-shrink-0 ${
                            visit.status === 'In-Consultation'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : visit.status === 'Waiting'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : visit.status === 'Completed'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            <span className="text-[9px] uppercase tracking-tighter leading-none opacity-80">Token</span>
                            <span className="text-base leading-none">#{visit.tokenNumber}</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 
                                onClick={() => {
                                  setSelectedPatient(pat || null);
                                  setCurrentView('patients');
                                }}
                                className="font-bold text-slate-900 dark:text-white text-sm hover:text-sky-600 cursor-pointer transition-colors"
                              >
                                {pat?.name}
                              </h3>
                              <span className="text-xs text-slate-500">
                                ({pat?.gender}, {pat?.age}y)
                              </span>

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                visit.status === 'In-Consultation'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : visit.status === 'Waiting'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                  : visit.status === 'Completed'
                                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                  : 'bg-sky-100 text-sky-800'
                              }`}>
                                {visit.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                              <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">{pat?.mrn}</span>
                              <span>•</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">{visit.organizationName}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{visit.time}</span>
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                              <strong>Complaint:</strong> {visit.chiefComplaint}
                            </p>

                            {/* Allergy Alert Pill */}
                            {pat && pat.allergies.length > 0 && (
                              <div className="mt-1.5 inline-flex items-center space-x-1 text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-md">
                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                <span>Allergy Warning: {pat.allergies.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          <button
                            onClick={() => {
                              setSelectedPatient(pat || null);
                              setCurrentView('patients');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            Medical Chart
                          </button>

                          {visit.status === 'Waiting' && (
                            <button
                              onClick={() => startConsultation(visit.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
                            >
                              <span>Call Patient</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {visit.status === 'In-Consultation' && (
                            <button
                              onClick={() => setCurrentView('consultation')}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
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
                              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold"
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

        {/* Right 1 Column: Active Consultation Widget & Transit Schedule */}
        <div className="space-y-6">
          
          {/* Active In-Room Patient Box */}
          {activeConsultation ? (
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    In Consultation Now
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Token #{activeConsultation.tokenNumber}
                </span>
              </div>

              {(() => {
                const pat = getPatientForVisit(activeConsultation.patientId);
                return (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{pat?.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {pat?.gender}, {pat?.age}y • MRN: {pat?.mrn}
                    </p>

                    {/* Vitals Summary */}
                    <div className="grid grid-cols-3 gap-2 my-3 text-center">
                      <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                        <div className="text-[10px] text-slate-400 font-bold">BP</div>
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{activeConsultation.vitals.bp}</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                        <div className="text-[10px] text-slate-400 font-bold">Pulse</div>
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{activeConsultation.vitals.pulse} bpm</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700">
                        <div className="text-[10px] text-slate-400 font-bold">SpO2</div>
                        <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{activeConsultation.vitals.spO2}%</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-4 line-clamp-2">
                      "{activeConsultation.chiefComplaint}"
                    </p>

                    <button
                      onClick={() => setCurrentView('consultation')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Open Rx & Notes Workspace</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 text-center text-slate-500 shadow-sm">
              <Stethoscope className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Consultation Room Available</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Click "Call Patient" on any waiting token to begin.
              </p>
            </div>
          )}

          {/* Today's Multi-Clinic Schedule & Commute */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-sky-600" />
                <span>Today's Clinic Shifts</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">{currentDoctor.organizations.length} Locations</span>
            </div>

            <div className="space-y-3 text-xs">
              {currentDoctor.organizations.map((org, idx) => (
                <div key={org.id} className="flex items-start space-x-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: org.color }} />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{org.name}</div>
                    <div className="text-[11px] text-slate-500">{org.timeSlot} • {org.roomNumber}</div>
                  </div>
                </div>
              ))}
            </div>

            {conflictAlerts.length > 0 && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Transit Alert:</strong> {conflictAlerts[0].message}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
