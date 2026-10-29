import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Plus,
  Copy,
  Check,
  Send,
  Phone,
  ShieldCheck,
  Volume2
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
    conflictAlerts,
    updateVisitStatus,
    addNewVisit,
    addNewPatient
  } = useApp();

  const [queueFilter, setQueueFilter] = useState<'ALL' | 'WAITING' | 'IN_CONSULT' | 'COMPLETED'>('ALL');
  const [copiedAbha, setCopiedAbha] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Urgent Walk-in Modal State
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInAge, setWalkInAge] = useState('');
  const [walkInGender, setWalkInGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [walkInPhone, setWalkInPhone] = useState('+91 ');
  const [walkInComplaint, setWalkInComplaint] = useState('');
  const [walkInOrgId, setWalkInOrgId] = useState(currentDoctor.organizations[currentDoctor.organizations.length - 1].id);

  // Real-time Clock in Indian Standard Time (IST)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyAbha = (abha: string) => {
    navigator.clipboard.writeText(abha);
    setCopiedAbha(abha);
    setTimeout(() => setCopiedAbha(null), 2000);
  };

  const handleBroadcastTransitDelay = () => {
    showToast(`WhatsApp & SMS advisory dispatched to ${todayQueue.filter(v => v.status === 'Waiting').length} waiting patients: "Dr. ${currentDoctor.name.split(',')[0]} transit buffer extended by +20m to prevent clinic overcrowding."`);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInAge) return;

    const targetOrg = currentDoctor.organizations.find(o => o.id === walkInOrgId) || currentDoctor.organizations[0];

    // Create rapid patient entry
    const newPat = addNewPatient({
      name: walkInName,
      age: parseInt(walkInAge, 10),
      gender: walkInGender,
      phone: walkInPhone.length > 4 ? walkInPhone : '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      email: `${walkInName.toLowerCase().replace(/\s+/g, '')}@walkin.med`,
      bloodGroup: 'B +ve',
      mrn: `MRN-EMG-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      allergies: [],
      chronicConditions: ['Walk-in Emergency Assessment'],
      emergencyContact: {
        name: 'Family',
        relation: 'Relative',
        phone: walkInPhone,
      },
      consentStatus: 'GRANTED_ALL',
      consentExpiresAt: '2028-12-31',
      registeredDate: new Date().toISOString().split('T')[0],
      notes: 'Urgent walk-in registered at reception chamber.',
    });

    // Add into today's queue
    addNewVisit({
      patientId: newPat.id,
      doctorId: currentDoctor.id,
      organizationId: targetOrg.id,
      organizationName: targetOrg.name,
      date: new Date().toISOString().split('T')[0],
      time: currentTime,
      visitType: 'In-person',
      status: 'Waiting',
      chiefComplaint: walkInComplaint || 'Urgent walk-in evaluation',
      vitals: {
        bp: '130/85',
        pulse: 82,
        temp: '98.8 °F',
        spO2: 98,
        weight: '65 kg',
        height: '168 cm',
        bmi: '23.0',
      },
      soap: { subjective: '', objective: '', assessment: '', plan: '' },
      diagnoses: [],
      prescriptions: [],
      labReports: [],
      fee: targetOrg.consultancyFee,
      isPaid: true,
    });

    setIsWalkInModalOpen(false);
    setWalkInName('');
    setWalkInAge('');
    setWalkInComplaint('');
    showToast(`Urgent Walk-in Token created for ${newPat.name} at ${targetOrg.shortName}!`);
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white text-xs font-semibold p-4 rounded-2xl shadow-2xl border border-sky-500/40 flex items-start space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{toastMessage}</div>
        </div>
      )}

      {/* Top Clinical Command Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            <img
              src={currentDoctor.avatar}
              alt={currentDoctor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/30 shadow-md flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Today • {currentTime} IST</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {currentDoctor.registrationNumber}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {currentDoctor.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {currentDoctor.title} • {currentDoctor.specialty}
              </p>
            </div>
          </div>

          {/* Quick Clinic Scope Switcher & Walk-in Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setSelectedOrgId('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedOrgId === 'all'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
                }`}
              >
                All Facilities ({currentDoctor.organizations.length})
              </button>

              {currentDoctor.organizations.map(org => (
                <button
                  key={org.id}
                  onClick={() => setSelectedOrgId(org.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    selectedOrgId === org.id
                      ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
                  <span>{org.shortName}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsWalkInModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Urgent Walk-in Slip</span>
            </button>
          </div>

        </div>
      </div>

      {/* Urban Traffic Advisory Banner for Doctor */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Urban Transit Advisory: {currentDoctor.id === 'doc-2' ? 'Bengaluru (Domlur / Old Airport Rd)' : currentDoctor.id === 'doc-3' ? 'Chennai (Madhya Kailash / Adyar)' : 'Delhi NCR (Ashram Flyover / Ring Rd)'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                +20m Buffer
              </span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-400 mt-0.5 leading-relaxed">
              Hospital rounds overran. The transit buffer guard prevents waiting room bottlenecks by auto-adjusting OPD queue tokens.
            </p>
          </div>
        </div>

        <button
          onClick={handleBroadcastTransitDelay}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5 whitespace-nowrap"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast +20m Delay to OPD</span>
        </button>
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
            <span>Evening Chamber Session</span>
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

      {/* Main Grid: Live Queue on Left & Active Room on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Live OPD Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>Live OPD Consultation Queue</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Call next patient, review longitudinal ABHA records, and track arrivals
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
                          <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-bold flex-shrink-0 ${
                            visit.status === 'In-Consultation'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : visit.status === 'Waiting'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            <span className="text-[10px] uppercase leading-none">Token</span>
                            <span className="text-base font-black leading-none mt-0.5">#{visit.tokenNumber}</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                                {pat?.name || 'Walk-in Patient'}
                              </h3>
                              <span className="text-xs text-slate-500 font-medium">
                                ({pat?.age}y / {pat?.gender})
                              </span>
                              
                              {/* Status Badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                visit.status === 'In-Consultation'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 animate-pulse'
                                  : visit.status === 'Waiting'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}>
                                {visit.status}
                              </span>
                            </div>

                            {/* ABHA ID with Copy */}
                            <div className="flex items-center space-x-2 mt-1 text-xs">
                              <span className="font-mono text-[11px] text-slate-500">
                                ABHA: {pat?.abhaId || '91-4829-1029-4821'}
                              </span>
                              <button
                                onClick={() => handleCopyAbha(pat?.abhaId || '91-4829-1029-4821')}
                                className="text-slate-400 hover:text-sky-600 transition-colors"
                                title="Copy ABHA ID"
                              >
                                {copiedAbha === (pat?.abhaId || '91-4829-1029-4821') ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                                {visit.organizationName}
                              </span>
                            </div>

                            {/* Complaint */}
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                              "{visit.chiefComplaint}"
                            </p>

                            {/* Vitals Pills */}
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                BP: <strong>{visit.vitals.bp}</strong>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                Pulse: <strong>{visit.vitals.pulse} bpm</strong>
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                SpO2: <strong>{visit.vitals.spO2}%</strong>
                              </span>
                              {pat?.allergies && pat.allergies.length > 0 && (
                                <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800">
                                  Allergy: {pat.allergies.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0">
                          <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            {visit.time}
                          </span>

                          <div className="flex items-center space-x-1.5">
                            {visit.status !== 'In-Consultation' && (
                              <button
                                onClick={() => startConsultation(visit.id)}
                                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
                              >
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>Call Patient</span>
                              </button>
                            )}

                            {visit.status === 'In-Consultation' && (
                              <button
                                onClick={() => setCurrentView('consultation')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
                              >
                                <span>In Room</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (pat) {
                                  setSelectedPatient(pat);
                                  setCurrentView('patients');
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                              title="View Patient Full EHR History"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* Right 1 Column: Active Consultation Room & Subcontinent Financials */}
        <div className="space-y-6">
          
          {/* Active Consultation Spotlight */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Active Consultation Room</span>
              </span>
              <span className="text-xs font-mono text-slate-400">Room 101</span>
            </div>

            {activeConsultation ? (
              <div className="space-y-4">
                {(() => {
                  const pat = getPatientForVisit(activeConsultation.patientId);
                  return (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          #{activeConsultation.tokenNumber}
                        </div>
                        <div>
                          <h4 className="font-black text-base text-slate-900 dark:text-white">
                            {pat?.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {pat?.age}y / {pat?.gender} • {activeConsultation.organizationName}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                        <div className="text-slate-500 font-medium">Chief Complaint:</div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 italic">
                          "{activeConsultation.chiefComplaint}"
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                          <span className="text-slate-400 text-[10px]">Blood Pressure</span>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.bp}</div>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                          <span className="text-slate-400 text-[10px]">Pulse Rate</span>
                          <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.pulse} bpm</div>
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentView('consultation')}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <Stethoscope className="w-4 h-4" />
                        <span>Open SOAP Note & Rx Pad</span>
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <Stethoscope className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  No active consultation in progress. Click <strong>"Call Patient"</strong> from the queue to start.
                </p>
                {todayQueue.filter(v => v.status === 'Waiting').length > 0 && (
                  <button
                    onClick={() => {
                      const firstWaiting = todayQueue.find(v => v.status === 'Waiting');
                      if (firstWaiting) startConsultation(firstWaiting.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm"
                  >
                    Call Next Token (#{todayQueue.find(v => v.status === 'Waiting')?.tokenNumber})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Practice Revenue & Facility Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Facility Breakdown
              </span>
              <span className="text-xs font-bold text-emerald-600">
                Total ₹{totalFeeCollected.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              {currentDoctor.organizations.map(org => {
                const orgVisits = todayQueue.filter(v => v.organizationId === org.id);
                const orgRev = orgVisits.filter(v => v.isPaid).reduce((s, v) => s + v.fee, 0);

                return (
                  <div key={org.id} className="text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: org.color }} />
                        <span className="text-slate-800 dark:text-slate-200">{org.shortName}</span>
                      </div>
                      <span className="text-slate-900 dark:text-white font-mono">₹{orgRev.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pl-4">
                      <span>{orgVisits.length} appointments scheduled</span>
                      <span>Fee: ₹{org.consultancyFee}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Urgent Walk-In Slip Modal */}
      {isWalkInModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Urgent Walk-in Slip
                  </h3>
                  <p className="text-[11px] text-slate-500">Emergency OPD Token Generator</p>
                </div>
              </div>
              <button 
                onClick={() => setIsWalkInModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 48"
                    value={walkInAge}
                    onChange={(e) => setWalkInAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gender *
                  </label>
                  <select
                    value={walkInGender}
                    onChange={(e) => setWalkInGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (for WhatsApp Rx)
                </label>
                <input
                  type="text"
                  placeholder="+91 98101 22910"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Consulting Facility
                </label>
                <select
                  value={walkInOrgId}
                  onChange={(e) => setWalkInOrgId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currentDoctor.organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name} (Fee: ₹{org.consultancyFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chief Complaint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acute chest discomfort / High fever"
                  value={walkInComplaint}
                  onChange={(e) => setWalkInComplaint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  Issue Token & Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
