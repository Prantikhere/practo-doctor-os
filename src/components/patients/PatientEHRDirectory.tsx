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
  Stethoscope, 
  ChevronRight, 
  Printer, 
  UserPlus
} from 'lucide-react';

export const PatientEHRDirectory: React.FC = () => {
  const { 
    doctorPatients,
    patients, 
    visits, 
    selectedPatient, 
    setSelectedPatient, 
    startConsultation, 
    todayQueue, 
    setCurrentView,
    searchQuery,
    setSearchQuery,
    addNewPatient,
    currentDoctor
  } = useApp();

  const [timelineOrgFilter, setTimelineOrgFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'LABS' | 'PRESCRIPTIONS'>('TIMELINE');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // List of patients: either filtered by search or doctor's active patient list
  const displayPatientList = (searchQuery ? patients : doctorPatients).filter(p => {
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

  const patientFacilities = Array.from(new Set(patientVisits.map(v => v.organizationName)));
  const allLabReports = patientVisits.flatMap(v => v.labReports.map(lab => ({ ...lab, visitDate: v.date })));
  const allPrescriptions = patientVisits.flatMap(v => v.prescriptions.map(rx => ({ ...rx, visitDate: v.date, orgName: v.organizationName })));
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
      email: `${newPatName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      bloodGroup: newPatBlood,
      mrn: `MRN-${currentDoctor.specialty.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <Users className="w-4 h-4" />
            <span>{currentDoctor.name}'s Clinical Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Patient Longitudinal Health Records (EHR)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cross-facility clinical notes, diagnostic imaging, and medication history
          </p>
        </div>

        <button
          onClick={() => setIsAddPatientModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Patient</span>
        </button>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Patient Directory (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col h-[750px]">
          
          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, MRN, phone, diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
            Active Patients ({displayPatientList.length})
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {displayPatientList.map((pat) => {
              const isSelected = selectedPatient?.id === pat.id;
              const patVisitsCount = visits.filter(v => v.patientId === pat.id).length;

              return (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatient(pat)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500/80 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-sky-700 dark:text-sky-400' : 'text-slate-900 dark:text-white'}`}>
                        {pat.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {pat.gender}, {pat.age}y • Blood: {pat.bloodGroup}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      {pat.mrn.split('-')[1] || pat.mrn}
                    </span>
                  </div>

                  {/* Conditions */}
                  {pat.chronicConditions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {pat.chronicConditions.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                          {c}
                        </span>
                      ))}
                      {pat.chronicConditions.length > 2 && (
                        <span className="text-[9px] text-slate-400">+{pat.chronicConditions.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Allergy Alert */}
                  {pat.allergies.length > 0 && (
                    <div className="mt-1.5 flex items-center space-x-1 text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">Allergy: {pat.allergies.join(', ')}</span>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{patVisitsCount} Consultations Recorded</span>
                    <span className="text-sky-600 font-semibold flex items-center space-x-0.5">
                      <span>View Chart</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Detailed Patient Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[750px] overflow-hidden">
          {selectedPatient ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Patient Header */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {selectedPatient.name}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {selectedPatient.gender}, {selectedPatient.age}y
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        {selectedPatient.bloodGroup}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-slate-500 font-mono">
                      <span>MRN: <strong className="text-slate-700 dark:text-slate-200">{selectedPatient.mrn}</strong></span>
                      <span>•</span>
                      <span>ABHA: <strong className="text-slate-700 dark:text-slate-200">{selectedPatient.abhaId}</strong></span>
                      <span>•</span>
                      <span>Phone: <strong className="text-slate-700 dark:text-slate-200">{selectedPatient.phone}</strong></span>
                    </div>
                  </div>

                  {/* Top Action */}
                  <div>
                    {todayToken ? (
                      <button
                        onClick={() => startConsultation(todayToken.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>In Queue: Token #{todayToken.tokenNumber}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentView('schedule')}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-sky-600" />
                        <span>Book Appointment</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Prominent Allergy Warning */}
                {selectedPatient.allergies.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-xs text-rose-800 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <div>
                      <strong>Documented Allergies:</strong> {selectedPatient.allergies.join(', ')} — Contraindication alerts active for all prescriptions.
                    </div>
                  </div>
                )}

                {/* Consent & Facilities Ribbon */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cross-Clinic Consent: <strong>{selectedPatient.consentStatus}</strong></span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-slate-400">Facilities:</span>
                    {patientFacilities.map((fac, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700">
                        {fac.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={() => setActiveTab('TIMELINE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'TIMELINE'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    Clinical Timeline ({patientVisits.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('LABS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'LABS'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    Labs & Radiology ({allLabReports.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('PRESCRIPTIONS')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'PRESCRIPTIONS'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    Medication Ledger ({allPrescriptions.length})
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4">
                
                {/* TIMELINE */}
                {activeTab === 'TIMELINE' && (
                  <div className="space-y-4">
                    {displayVisits.map(visit => (
                      <div
                        key={visit.id}
                        className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 border-b border-slate-200/60 dark:border-slate-700">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {visit.date} ({visit.time})
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                              {visit.visitType}
                            </span>
                          </div>

                          <div className="text-xs text-sky-700 dark:text-sky-400 font-semibold flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{visit.organizationName}</span>
                          </div>
                        </div>

                        {/* Chief complaint */}
                        <div className="mt-2.5">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complaint:</div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium mt-0.5">
                            {visit.chiefComplaint}
                          </p>
                        </div>

                        {/* Vitals */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2.5 text-center">
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                            <div className="text-[10px] text-slate-400 font-semibold">BP</div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{visit.vitals.bp}</div>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                            <div className="text-[10px] text-slate-400 font-semibold">Pulse</div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{visit.vitals.pulse} bpm</div>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                            <div className="text-[10px] text-slate-400 font-semibold">SpO2</div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{visit.vitals.spO2}%</div>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                            <div className="text-[10px] text-slate-400 font-semibold">BMI</div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{visit.vitals.bmi}</div>
                          </div>
                        </div>

                        {/* Diagnoses */}
                        {visit.diagnoses.length > 0 && (
                          <div className="my-2 flex flex-wrap gap-1.5">
                            {visit.diagnoses.map((dx, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                {dx.code}: {dx.label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* SOAP Notes */}
                        <div className="mt-2.5 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700 text-xs space-y-1.5">
                          <div>
                            <strong className="text-sky-700 dark:text-sky-400">Assessment:</strong>{' '}
                            <span className="text-slate-700 dark:text-slate-300">{visit.soap.assessment}</span>
                          </div>
                          <div>
                            <strong className="text-emerald-700 dark:text-emerald-400">Plan:</strong>{' '}
                            <span className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{visit.soap.plan}</span>
                          </div>
                        </div>

                        {/* Prescriptions */}
                        {visit.prescriptions.length > 0 && (
                          <div className="mt-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                              <Pill className="w-3 h-3 text-sky-600" />
                              <span>Prescribed Medications ({visit.prescriptions.length}):</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {visit.prescriptions.map(rx => (
                                <div key={rx.id} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px]">
                                  <div className="font-bold text-slate-800 dark:text-slate-200">{rx.drugName} ({rx.dosage})</div>
                                  <div className="text-slate-500">{rx.frequency} • {rx.duration}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Labs */}
                        {visit.labReports.length > 0 && (
                          <div className="mt-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
                              <Activity className="w-3 h-3 text-teal-600" />
                              <span>Diagnostic Reports Linked ({visit.labReports.length}):</span>
                            </div>
                            <div className="space-y-1.5">
                              {visit.labReports.map(lab => (
                                <div key={lab.id} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
                                  <div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-200">{lab.testName}</div>
                                    <div className="text-[10px] text-slate-500">Value: <strong>{lab.value}</strong> ({lab.referenceRange})</div>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    lab.status === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
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
                )}

                {/* LABS TAB */}
                {activeTab === 'LABS' && (
                  <div className="space-y-3">
                    {allLabReports.map((lab, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lab.testName}</h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300">
                                {lab.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {lab.visitDate} • {lab.organizationName}
                            </p>
                          </div>

                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            lab.status === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {lab.status}
                          </span>
                        </div>

                        <div className="mt-2 p-2 rounded-lg bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono">
                          Value: <strong>{lab.value}</strong> (Ref: {lab.referenceRange})
                        </div>
                        {lab.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            Notes: {lab.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* PRESCRIPTIONS TAB */}
                {activeTab === 'PRESCRIPTIONS' && (
                  <div className="space-y-3">
                    {allPrescriptions.map((rx, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{rx.drugName} ({rx.dosage})</div>
                          <div className="text-slate-600 dark:text-slate-300 mt-0.5">{rx.frequency} • {rx.duration}</div>
                          <div className="text-[10px] text-slate-400 mt-1">Prescribed on {rx.visitDate} at {rx.orgName}</div>
                        </div>

                        {rx.warnings && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded">
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
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
              <Users className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-600">Select a Patient</p>
              <p className="text-xs text-slate-400 mt-0.5">Choose any patient from the directory on the left.</p>
            </div>
          )}
        </div>

      </div>

      {/* Enroll New Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enroll New Patient</h3>
              <button onClick={() => setIsAddPatientModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreatePatient} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newPatName}
                  onChange={(e) => setNewPatName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={newPatAge}
                    onChange={(e) => setNewPatAge(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Gender *</label>
                  <select
                    value={newPatGender}
                    onChange={(e) => setNewPatGender(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={newPatPhone}
                  onChange={(e) => setNewPatPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Known Drug Allergies (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Aspirin"
                  value={newPatAllergies}
                  onChange={(e) => setNewPatAllergies(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Chronic Conditions (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Diabetes"
                  value={newPatConditions}
                  onChange={(e) => setNewPatConditions(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold"
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
