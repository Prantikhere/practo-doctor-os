import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  Pill, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Activity, 
  Clock, 
  Building2,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { ClinicalVisit, Patient, PrescriptionItem } from '../../types';

export const ConsultationWorkspace: React.FC = () => {
  const { 
    activeConsultation, 
    completeConsultation, 
    updateVisitSOAP, 
    addPrescriptionToVisit, 
    removePrescriptionFromVisit, 
    patients, 
    currentDoctor,
    setSelectedPatient,
    setCurrentView
  } = useApp();

  const patient = patients.find(p => p.id === activeConsultation?.patientId);

  // SOAP State
  const [subjective, setSubjective] = useState(activeConsultation?.soap.subjective || '');
  const [objective, setObjective] = useState(activeConsultation?.soap.objective || '');
  const [assessment, setAssessment] = useState(activeConsultation?.soap.assessment || '');
  const [plan, setPlan] = useState(activeConsultation?.soap.plan || '');
  const [clinicalNotes, setClinicalNotes] = useState(activeConsultation?.clinicalNotes || '');

  // Prescription Form State
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('10 mg');
  const [frequency, setFrequency] = useState('1-0-1 (Twice daily after food)');
  const [duration, setDuration] = useState('30 days');
  const [instructions, setInstructions] = useState('Take with water after food');
  const [allergyAlert, setAllergyAlert] = useState<string | null>(null);

  // Print Rx Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Quick templates for SOAP
  const applyCardiacTemplate = () => {
    setSubjective('Patient reports stable energy levels, no recurrence of exertional chest pain or dyspnea on walking 4 km daily. Compliance with medications confirmed.');
    setObjective('BP 118/74 mmHg, Pulse 62 bpm regular, S1/S2 heard, clear breath sounds bilaterally. Radial access site completely healed. Recent labs: LDL-C 48 mg/dL.');
    setAssessment('Ischemic Heart Disease post-PCI with LAD DES (month 3). Excellent clinical and metabolic response to DAPT & high-intensity statin.');
    setPlan('1. Continue Ticagrelor 90mg BD for full 12 months.\n2. Maintain Rosuvastatin + Ezetimibe for secondary prevention.\n3. Cleared for aerobic physical exercise.\n4. Repeat metabolic profile in 6 months.');
    if (activeConsultation) {
      updateVisitSOAP(activeConsultation.id, {
        subjective: 'Patient reports stable energy levels, no recurrence of exertional chest pain or dyspnea on walking 4 km daily. Compliance with medications confirmed.',
        objective: 'BP 118/74 mmHg, Pulse 62 bpm regular, S1/S2 heard, clear breath sounds bilaterally. Radial access site completely healed. Recent labs: LDL-C 48 mg/dL.',
        assessment: 'Ischemic Heart Disease post-PCI with LAD DES (month 3). Excellent clinical and metabolic response to DAPT & high-intensity statin.',
        plan: '1. Continue Ticagrelor 90mg BD for full 12 months.\n2. Maintain Rosuvastatin + Ezetimibe for secondary prevention.\n3. Cleared for aerobic physical exercise.\n4. Repeat metabolic profile in 6 months.',
      });
    }
  };

  // Drug allergy real-time checker
  const handleDrugNameChange = (val: string) => {
    setDrugName(val);
    if (!patient || !patient.allergies || patient.allergies.length === 0) {
      setAllergyAlert(null);
      return;
    }

    const valLower = val.toLowerCase();
    const matchedAllergy = patient.allergies.find(allergy => {
      const a = allergy.toLowerCase();
      if (valLower.includes('penicillin') && a.includes('penicillin')) return true;
      if (valLower.includes('amoxicillin') && a.includes('penicillin')) return true;
      if (valLower.includes('aspirin') && a.includes('aspirin')) return true;
      if (valLower.includes('sulfa') && a.includes('sulfa')) return true;
      if (valLower.includes('ibuprofen') && a.includes('nsaid')) return true;
      return false;
    });

    if (matchedAllergy) {
      setAllergyAlert(`⚠️ CRITICAL CONTRAINDICATION: Patient has documented severe allergy to "${matchedAllergy}". Prescribing this medication may cause anaphylaxis or severe adverse reaction!`);
    } else {
      setAllergyAlert(null);
    }
  };

  const handleAddDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName || !activeConsultation) return;

    if (allergyAlert) {
      if (!window.confirm(`${allergyAlert}\n\nDo you want to proceed with emergency override?`)) {
        return;
      }
    }

    addPrescriptionToVisit(activeConsultation.id, {
      drugName,
      dosage,
      frequency,
      duration,
      instructions,
      warnings: allergyAlert ? 'Prescribed under emergency override' : undefined,
    });

    setDrugName('');
    setAllergyAlert(null);
  };

  const handleSaveSOAP = () => {
    if (!activeConsultation) return;
    updateVisitSOAP(activeConsultation.id, {
      subjective,
      objective,
      assessment,
      plan,
    }, clinicalNotes);
  };

  const handleComplete = () => {
    if (!activeConsultation) return;
    handleSaveSOAP();
    completeConsultation(activeConsultation.id, {
      soap: { subjective, objective, assessment, plan },
      clinicalNotes,
    });
    setIsCompletedModalOpen(true);
  };

  if (!activeConsultation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        <Stethoscope className="w-16 h-16 mx-auto text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-white">No Consultation Currently Active</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
          Please select a waiting patient from Today's Live Queue on the dashboard or patient directory to begin an active consultation.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Patient Bar with Allergies */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
              #{activeConsultation.tokenNumber}
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {patient?.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                  {patient?.gender}, {patient?.age}y
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  {patient?.bloodGroup}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-400 font-mono">
                <span>MRN: <strong className="text-slate-200">{patient?.mrn}</strong></span>
                <span>•</span>
                <span>ABHA: <strong className="text-slate-200">{patient?.abhaId}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{activeConsultation.organizationName}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSelectedPatient(patient || null);
                setCurrentView('patients');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Full Cross-Org History</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Preview & Print Rx</span>
            </button>

            <button
              onClick={handleComplete}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Sign & Complete Consult</span>
            </button>
          </div>

        </div>

        {/* Prominent Red Alert: Patient Drug Allergies */}
        {patient && patient.allergies.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center space-x-2.5 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
            <div>
              <strong className="text-rose-200 uppercase tracking-wide">Documented Patient Allergies:</strong>{' '}
              <span className="font-bold underline">{patient.allergies.join(', ')}</span>. Rx system will intercept contraindicated prescriptions.
            </div>
          </div>
        )}

        {/* Vitals Ribbon */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Blood Pressure</div>
            <div className="text-xs font-bold text-white mt-0.5">{activeConsultation.vitals.bp}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Heart Rate</div>
            <div className="text-xs font-bold text-white mt-0.5">{activeConsultation.vitals.pulse} bpm</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">SpO2</div>
            <div className="text-xs font-bold text-white mt-0.5">{activeConsultation.vitals.spO2}%</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Temperature</div>
            <div className="text-xs font-bold text-white mt-0.5">{activeConsultation.vitals.temp}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Weight</div>
            <div className="text-xs font-bold text-white mt-0.5">{activeConsultation.vitals.weight}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">BMI</div>
            <div className="text-xs font-bold text-white mt-0.5">{activeConsultation.vitals.bmi}</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: SOAP Clinical Notes on Left, Prescription Builder on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: SOAP Documentation (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Clinical SOAP Documentation</h2>
            </div>

            <button
              onClick={applyCardiacTemplate}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Post-PCI Followup Template</span>
            </button>
          </div>

          {/* Subjective */}
          <div>
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              S — Subjective (Symptoms & History of Present Illness)
            </label>
            <textarea
              rows={2}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="Patient reports..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Objective */}
          <div>
            <label className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1">
              O — Objective (Physical Examination & Lab Findings)
            </label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Physical exam, heart sounds, ECG, vitals..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Assessment */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              A — Assessment (Clinical Diagnosis & Severity)
            </label>
            <textarea
              rows={2}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="Diagnosis, progress evaluation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Plan */}
          <div>
            <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
              P — Plan (Therapeutic Regimen & Follow-up Directions)
            </label>
            <textarea
              rows={3}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="1. Prescriptions\n2. Dietary recommendations\n3. Next follow-up"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveSOAP}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition-colors"
            >
              Save Draft Notes
            </button>
          </div>
        </div>

        {/* Right Column: Digital Prescription (Rx) Generator (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Digital Prescription (Rx)</h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              {activeConsultation.prescriptions.length} Meds Added
            </span>
          </div>

          {/* Drug Allergy Warning Message */}
          {allergyAlert && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Drug Allergy Guard Active</span>
              </div>
              <p>{allergyAlert}</p>
            </div>
          )}

          {/* Add Drug Form */}
          <form onSubmit={handleAddDrug} className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Add New Medicine
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Medication Name & Brand *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tab. Ticagrelor (Brilinta), Tab. Atorvastatin..."
                value={drugName}
                onChange={(e) => handleDrugNameChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500"
              />
              {/* Quick suggestion tags */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => handleDrugNameChange('Tab. Ticagrelor (Brilinta)')}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  Ticagrelor
                </button>
                <button
                  type="button"
                  onClick={() => handleDrugNameChange('Tab. Rosuvastatin + Ezetimibe')}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  Rosuvastatin
                </button>
                <button
                  type="button"
                  onClick={() => handleDrugNameChange('Tab. Metoprolol ER')}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  Metoprolol
                </button>
                <button
                  type="button"
                  onClick={() => handleDrugNameChange('Tab. Amoxicillin (Penicillin)')}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/40 text-rose-300 hover:bg-rose-900/60"
                  title="Test Allergy Interception!"
                >
                  Amoxicillin (Test Allergy)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 90 mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 180 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="1-0-1 (Twice daily after food)">1-0-1 (Twice daily after food)</option>
                <option value="1-0-0 (Once daily morning)">1-0-0 (Once daily morning)</option>
                <option value="0-0-1 (Once daily at bedtime)">0-0-1 (Once daily at bedtime)</option>
                <option value="1-1-1 (Three times daily)">1-1-1 (Three times daily)</option>
                <option value="SOS (As needed)">SOS (As needed for pain/dyspnea)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medication to Prescription</span>
            </button>
          </form>

          {/* Active Prescribed List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Currently Prescribed for this Session:
            </div>

            {activeConsultation.prescriptions.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                No medications prescribed yet.
              </div>
            ) : (
              activeConsultation.prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{rx.drugName} ({rx.dosage})</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{rx.frequency} • {rx.duration}</div>
                    {rx.instructions && (
                      <div className="text-[10px] text-slate-500 mt-0.5 italic">{rx.instructions}</div>
                    )}
                  </div>

                  <button
                    onClick={() => removePrescriptionFromVisit(activeConsultation.id, rx.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Formal Printable Prescription Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* Header: Clinic & Doctor Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">{currentDoctor.name}</h2>
                <p className="text-xs font-semibold text-slate-700">{currentDoctor.title}</p>
                <p className="text-xs text-slate-600 font-mono">Reg. No: {currentDoctor.registrationNumber}</p>
              </div>

              <div className="text-right">
                <h3 className="text-sm font-bold text-emerald-800">{activeConsultation.organizationName}</h3>
                <p className="text-[11px] text-slate-600">{currentDoctor.organizations[0].address}</p>
                <p className="text-[11px] text-slate-600">Ph: {currentDoctor.organizations[0].phone}</p>
              </div>
            </div>

            {/* Patient Bar */}
            <div className="grid grid-cols-4 gap-2 my-4 p-3 bg-slate-100 rounded-lg text-xs font-medium">
              <div><strong>Patient:</strong> {patient?.name}</div>
              <div><strong>Age/Sex:</strong> {patient?.age}y / {patient?.gender}</div>
              <div><strong>Date:</strong> {activeConsultation.date}</div>
              <div><strong>MRN:</strong> {patient?.mrn}</div>
            </div>

            {/* Diagnoses */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Diagnosis:</h4>
              <p className="text-xs font-semibold text-slate-800">
                {assessment || 'Post-PCI Secondary Coronary Prevention • Stable Cardiac Evaluation'}
              </p>
            </div>

            {/* Rx Symbol & Medication List */}
            <div className="mb-6">
              <div className="text-2xl font-serif font-black text-slate-900 mb-2">℞</div>
              <div className="space-y-3">
                {activeConsultation.prescriptions.map((rx, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-2 text-xs">
                    <div className="font-bold text-sm text-slate-900">{idx + 1}. {rx.drugName} — {rx.dosage}</div>
                    <div className="text-slate-700 mt-0.5">Directions: {rx.frequency} for {rx.duration}</div>
                    <div className="text-slate-500 text-[11px]">{rx.instructions}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice / Directions */}
            {plan && (
              <div className="mb-6 text-xs">
                <h4 className="font-bold text-slate-700 mb-1">Clinical Instructions & Lifestyle:</h4>
                <p className="whitespace-pre-line text-slate-700">{plan}</p>
              </div>
            )}

            {/* Digital Signature & Verification QR */}
            <div className="border-t-2 border-slate-900 pt-4 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <QrCode className="w-10 h-10 text-slate-800" />
                <div className="text-[10px] text-slate-600 font-mono">
                  <div>Digital Hash: SHA256-48A9-91B2</div>
                  <div>Verify online at docpulse360.med/verify</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-base font-bold text-slate-800">Dr. Sarah Chen</div>
                <div className="text-[10px] text-slate-600 font-mono">Digitally Signed & Certified</div>
              </div>
            </div>

            {/* Close / Print Button */}
            <div className="mt-6 flex justify-end space-x-3 print:hidden">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800"
              >
                Close Preview
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Formal Rx</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Consultation Completed!</h3>
            <p className="text-xs text-slate-300 mt-2">
              Clinical summary signed, token completed, and cross-facility EHR updated for {patient?.name}.
            </p>
            <button
              onClick={() => {
                setIsCompletedModalOpen(false);
                setCurrentView('dashboard');
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              Return to Today's Queue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
