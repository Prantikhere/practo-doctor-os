import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, ClinicalVisit } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Building2, 
  FileText, 
  Activity, 
  Pill, 
  Heart, 
  Stethoscope, 
  CheckCircle2, 
  ChevronRight, 
  Printer, 
  Eye, 
  Lock, 
  Filter,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const PatientEHRDirectory: React.FC = () => {
  const { 
    patients, 
    visits, 
    selectedPatient, 
    setSelectedPatient, 
    startConsultation, 
    todayQueue, 
    setCurrentView,
    searchQuery,
    setSearchQuery,
    updatePatientConsent,
    addNewPatient
  } = useApp();

  const [timelineOrgFilter, setTimelineOrgFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'LABS' | 'PRESCRIPTIONS'>('TIMELINE');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // Filter patients by global searchQuery
  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.abhaId.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.chronicConditions.some(c => c.toLowerCase().includes(q))
    );
  });

  // Get visits for selected patient
  const patientVisits = visits.filter(v => v.patientId === selectedPatient?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter visits by organization
  const displayVisits = patientVisits.filter(v => {
    if (timelineOrgFilter === 'all') return true;
    return v.organizationId === timelineOrgFilter;
  });

  // Unique facilities attended by this patient
  const patientFacilities = Array.from(new Set(patientVisits.map(v => v.organizationName)));

  // Collect all lab reports from all visits
  const allLabReports = patientVisits.flatMap(v => v.labReports.map(lab => ({ ...lab, visitDate: v.date })));

  // Collect all prescriptions from all visits
  const allPrescriptions = patientVisits.flatMap(v => v.prescriptions.map(rx => ({ ...rx, visitDate: v.date, orgName: v.organizationName })));

  // Check if patient has a token today
  const todayToken = todayQueue.find(v => v.patientId === selectedPatient?.id);

  // New Patient Form State
  const [newPatName, setNewPatName] = useState('');
  const [newPatAge, setNewPatAge] = useState('');
  const [newPatGender, setNewPatGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatPhone, setNewPatPhone] = useState('');
  const [newPatBlood, setNewPatBlood] = useState('O +ve');
  const [newPatAllergies, setNewPatAllergies] = useState('');
  const [newPatConditions, setNewPatConditions] = useState('');

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName || !newPatAge || !newPatPhone) return;

    const created = addNewPatient({
      name: newPatName,
      age: parseInt(newPatAge, 10),
      gender: newPatGender,
      phone: newPatPhone,
      email: `${newPatName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      bloodGroup: newPatBlood,
      mrn: `MRN-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      allergies: newPatAllergies ? newPatAllergies.split(',').map(s => s.trim()) : [],
      chronicConditions: newPatConditions ? newPatConditions.split(',').map(s => s.trim()) : [],
      emergencyContact: {
        name: 'Family Contact',
        relation: 'Spouse',
        phone: newPatPhone,
      },
      consentStatus: 'GRANTED_ALL',
      consentExpiresAt: '2028-12-31',
      registeredDate: new Date().toISOString().split('T')[0],
      notes: 'New patient enrolled directly from clinical directory.',
    });

    setIsAddPatientModalOpen(false);
    setSelectedPatient(created);
    setNewPatName('');
    setNewPatAge('');
    setNewPatPhone('');
    setNewPatAllergies('');
    setNewPatConditions('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Directory Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <Users className="w-4 h-4" />
            <span>Universal Medical Records Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Patient Longitudinal EHR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cross-consultancy patient records, complete visit chronologies, and verified lab history
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddPatientModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Patient</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Directory Left & Full Chart Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Patient Directory List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[750px]">
          
          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, MRN, ABHA, condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
            Patients Enrolled ({filteredPatients.length})
          </div>

          {/* Patient Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredPatients.map((pat) => {
              const isSelected = selectedPatient?.id === pat.id;
              const patVisitsCount = visits.filter(v => v.patientId === pat.id).length;

              return (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatient(pat)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                        {pat.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {pat.gender}, {pat.age}y • Blood: {pat.bloodGroup}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {pat.mrn.split('-')[1] || pat.mrn}
                    </span>
                  </div>

                  {/* Chronic tags preview */}
                  {pat.chronicConditions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {pat.chronicConditions.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                      {pat.chronicConditions.length > 2 && (
                        <span className="text-[9px] text-slate-500">+{pat.chronicConditions.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Allergy Alert Pill */}
                  {pat.allergies.length > 0 && (
                    <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-rose-400 font-medium">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">Allergy: {pat.allergies.join(', ')}</span>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{patVisitsCount} Consultations Recorded</span>
                    <span className="text-emerald-400 font-medium flex items-center space-x-0.5">
                      <span>View Chart</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Detailed Longitudinal EHR Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[750px] overflow-hidden">
          {selectedPatient ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Patient Header Strip */}
              <div className="pb-5 border-b border-slate-800 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {selectedPatient.name}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {selectedPatient.gender}, {selectedPatient.age} Years
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                        {selectedPatient.bloodGroup}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
                      <span>MRN: <strong className="text-slate-200">{selectedPatient.mrn}</strong></span>
                      <span>•</span>
                      <span>ABHA: <strong className="text-slate-200">{selectedPatient.abhaId}</strong></span>
                      <span>•</span>
                      <span>Phone: <strong className="text-slate-200">{selectedPatient.phone}</strong></span>
                    </div>
                  </div>

                  {/* Action: Call into consultation or Start */}
                  <div className="flex items-center space-x-2">
                    {todayToken ? (
                      <button
                        onClick={() => startConsultation(todayToken.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Active Token #{todayToken.tokenNumber}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentView('schedule')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Book Slot</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Critical Allergy Warning Banner */}
                {selectedPatient.allergies.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <div>
                      <strong>Critical Allergy Contraindication:</strong> {selectedPatient.allergies.join(', ')} — DO NOT prescribe without checking allergy profiles.
                    </div>
                  </div>
                )}

                {/* Consent & Cross-Org Network Banner */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">
                      <strong>Cross-Facility Consent:</strong> Active ({selectedPatient.consentStatus})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Valid thru {selectedPatient.consentExpiresAt}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">Facilities Attended:</span>
                    <div className="flex items-center space-x-1">
                      {patientFacilities.map((fac, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                          {fac.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chart View Tabs */}
                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={() => setActiveTab('TIMELINE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'TIMELINE'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Longitudinal Care Timeline ({patientVisits.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('LABS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'LABS'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Cross-Org Labs & Diagnostics ({allLabReports.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('PRESCRIPTIONS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'PRESCRIPTIONS'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Prescription History ({allPrescriptions.length})
                  </button>
                </div>
              </div>

              {/* Tab Content: Scrollable Body */}
              <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
                
                {/* 1. TIMELINE TAB */}
                {activeTab === 'TIMELINE' && (
                  <div className="space-y-4">
                    
                    {/* Facility Filter Pills */}
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400 font-medium">Filter by Facility:</span>
                      <button
                        onClick={() => setTimelineOrgFilter('all')}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          timelineOrgFilter === 'all' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All Facilities ({patientVisits.length})
                      </button>
                      <button
                        onClick={() => setTimelineOrgFilter('org-3')}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          timelineOrgFilter === 'org-3' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Chen Private Clinic
                      </button>
                      <button
                        onClick={() => setTimelineOrgFilter('org-1')}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          timelineOrgFilter === 'org-1' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Apollo Grand Hospital
                      </button>
                      <button
                        onClick={() => setTimelineOrgFilter('org-2')}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          timelineOrgFilter === 'org-2' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        St. Jude Vascular
                      </button>
                    </div>

                    {/* Timeline Visit Cards */}
                    <div className="space-y-4">
                      {displayVisits.map((visit) => (
                        <div
                          key={visit.id}
                          className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 relative"
                        >
                          {/* Visit Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white">
                                {visit.date} ({visit.time})
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {visit.visitType}
                              </span>
                            </div>

                            {/* Facility Badge */}
                            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{visit.organizationName}</span>
                            </div>
                          </div>

                          {/* Chief Complaint */}
                          <div className="mt-3">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              Chief Complaint:
                            </div>
                            <p className="text-xs text-slate-200 mt-0.5 font-medium">
                              {visit.chiefComplaint}
                            </p>
                          </div>

                          {/* Vitals Summary Strip */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-center">
                            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">BP</div>
                              <div className="text-xs font-bold text-white">{visit.vitals.bp} mmHg</div>
                            </div>
                            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">Heart Rate</div>
                              <div className="text-xs font-bold text-white">{visit.vitals.pulse} bpm</div>
                            </div>
                            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">SpO2</div>
                              <div className="text-xs font-bold text-white">{visit.vitals.spO2}%</div>
                            </div>
                            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">BMI</div>
                              <div className="text-xs font-bold text-white">{visit.vitals.bmi}</div>
                            </div>
                          </div>

                          {/* Diagnoses ICD-10 */}
                          {visit.diagnoses.length > 0 && (
                            <div className="my-2 flex flex-wrap gap-1.5">
                              {visit.diagnoses.map((dx, i) => (
                                <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-teal-300 border border-teal-500/30">
                                  {dx.code}: {dx.label}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Clinical SOAP Notes */}
                          <div className="mt-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                            <div>
                              <strong className="text-emerald-400">Assessment:</strong>{' '}
                              <span className="text-slate-300">{visit.soap.assessment}</span>
                            </div>
                            <div>
                              <strong className="text-cyan-400">Plan:</strong>{' '}
                              <span className="text-slate-300 whitespace-pre-line">{visit.soap.plan}</span>
                            </div>
                          </div>

                          {/* Prescribed Drugs in this visit */}
                          {visit.prescriptions.length > 0 && (
                            <div className="mt-3">
                              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                                <Pill className="w-3 h-3 text-emerald-400" />
                                <span>Prescriptions Issued ({visit.prescriptions.length}):</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {visit.prescriptions.map((rx) => (
                                  <div key={rx.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                                    <div className="font-bold text-slate-200">{rx.drugName} ({rx.dosage})</div>
                                    <div className="text-slate-400">{rx.frequency} • {rx.duration}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Attached Lab Reports in this visit */}
                          {visit.labReports.length > 0 && (
                            <div className="mt-3">
                              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                                <Activity className="w-3 h-3 text-cyan-400" />
                                <span>Diagnostics & Labs Linked ({visit.labReports.length}):</span>
                              </div>
                              <div className="space-y-1.5">
                                {visit.labReports.map((lab) => (
                                  <div key={lab.id} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                                    <div>
                                      <div className="font-semibold text-white">{lab.testName}</div>
                                      <div className="text-[10px] text-slate-400">Result: <strong>{lab.value}</strong> ({lab.referenceRange})</div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                      lab.status === 'Normal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                                    }`}>
                                      {lab.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* 2. LABS & DIAGNOSTICS TAB */}
                {activeTab === 'LABS' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 mb-2">
                      Cross-facility lab repository consolidated across Apollo Grand Hospital, St. Jude Vascular, and Chen Clinic:
                    </p>

                    {allLabReports.map((lab, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-white">{lab.testName}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                                {lab.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Conducted on {lab.visitDate} at <strong>{lab.organizationName}</strong>
                            </p>
                          </div>

                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            lab.status === 'Normal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {lab.status}
                          </span>
                        </div>

                        <div className="mt-2.5 p-2 rounded-lg bg-slate-900 text-xs text-slate-300 font-mono">
                          Value: <strong className="text-white">{lab.value}</strong> (Ref: {lab.referenceRange})
                        </div>
                        {lab.notes && (
                          <p className="text-[11px] text-slate-400 mt-1 italic">
                            Notes: {lab.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. PRESCRIPTIONS TAB */}
                {activeTab === 'PRESCRIPTIONS' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 mb-2">
                      Unified medication ledger prescribed across all consultations:
                    </p>

                    {allPrescriptions.map((rx, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white text-sm">{rx.drugName} ({rx.dosage})</div>
                          <div className="text-slate-300 mt-0.5">{rx.frequency} • Duration: {rx.duration}</div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Prescribed on {rx.visitDate} at {rx.orgName}
                          </div>
                        </div>

                        {rx.warnings && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-1 rounded">
                            {rx.warnings}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
              <Users className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-base font-semibold text-slate-400">Select a Patient</h3>
              <p className="text-xs text-slate-600 max-w-sm mt-1">
                Choose a patient from the directory on the left to inspect their complete cross-facility longitudinal history.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Enroll New Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Enroll New Patient</h3>
              <button 
                onClick={() => setIsAddPatientModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newPatName}
                  onChange={(e) => setNewPatName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 42"
                    value={newPatAge}
                    onChange={(e) => setNewPatAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Gender *</label>
                  <select
                    value={newPatGender}
                    onChange={(e) => setNewPatGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newPatPhone}
                  onChange={(e) => setNewPatPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Known Drug Allergies (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Aspirin"
                  value={newPatAllergies}
                  onChange={(e) => setNewPatAllergies(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Chronic Conditions (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, CAD"
                  value={newPatConditions}
                  onChange={(e) => setNewPatConditions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
