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
  Building2,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { ClinicalVisit, Patient } from '../../types';

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

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Specialty-tailored SOAP templates
  const applyClinicalTemplate = () => {
    let s = '';
    let o = '';
    let a = '';
    let p = '';

    if (currentDoctor.id === 'doc-2') {
      // Orthopedics
      s = 'Patient ambulating without walking aid indoors. No rest pain. Mild stiffness after prolonged sitting. Compliant with home exercises.';
      o = 'Right knee scar mature and healed. Active range of motion: 0 to 115 degrees. No joint warmth or effusion. Stable in valgus/varus stress.';
      a = 'Post Robotic Right Total Knee Replacement (Week 7). Excellent progress toward functional rehabilitation.';
      p = '1. Continue quadriceps strengthening at Apex Sports physio.\n2. Stationary cycling 15 minutes daily.\n3. Discontinue tramadol; Paracetamol SOS only.';
    } else if (currentDoctor.id === 'doc-3') {
      // Pediatrics
      s = 'Child active, playing, afebrile for 48 hours. No nocturnal coughing or wheezing. Appetite returned to baseline.';
      o = 'Chest: Bilaterally clear, no wheezing. Heart sounds normal. Weight: 17.2 kg (50th percentile). Throat clear.';
      a = 'Well-controlled Childhood Asthma on inhaled corticosteroid prophylaxis.';
      p = '1. Continue Budesonide/Formoterol inhaler 2 puffs BD through winter.\n2. Administered annual influenza vaccine today.\n3. Follow-up in 3 months.';
    } else {
      // Cardiology
      s = 'Patient reports stable energy levels, no recurrence of exertional chest heaviness on walking 5 km daily. Diet strictly controlled.';
      o = 'BP 118/74 mmHg, Pulse 62 bpm regular. Heart sounds crisp, clear lungs. Recent labs: LDL-C 48 mg/dL (target < 55 attained).';
      a = 'Ischemic Heart Disease post-PCI with LAD Everolimus DES (Month 3). Excellent clinical and lipid target response.';
      p = '1. Maintain Ticagrelor 90mg BD for full 12 months.\n2. Rosuvastatin + Ezetimibe at bedtime.\n3. Cleared for recreational swimming.\n4. Repeat metabolic panel in 6 months.';
    }

    setSubjective(s);
    setObjective(o);
    setAssessment(a);
    setPlan(p);

    if (activeConsultation) {
      updateVisitSOAP(activeConsultation.id, { subjective: s, objective: o, assessment: a, plan: p });
    }
  };

  // Allergy safety check
  const handleDrugNameChange = (val: string) => {
    setDrugName(val);
    if (!patient || !patient.allergies || patient.allergies.length === 0) {
      setAllergyAlert(null);
      return;
    }

    const valLower = val.toLowerCase();
    const matched = patient.allergies.find(allergy => {
      const a = allergy.toLowerCase();
      if (valLower.includes('penicillin') && a.includes('penicillin')) return true;
      if (valLower.includes('amoxicillin') && a.includes('penicillin')) return true;
      if (valLower.includes('amoxicillin') && a.includes('amoxicillin')) return true;
      if (valLower.includes('aspirin') && a.includes('aspirin')) return true;
      if (valLower.includes('morphine') && a.includes('morphine')) return true;
      if (valLower.includes('codeine') && a.includes('codeine')) return true;
      if (valLower.includes('sulfa') && a.includes('sulfa')) return true;
      if (valLower.includes('ibuprofen') && a.includes('nsaid')) return true;
      return false;
    });

    if (matched) {
      setAllergyAlert(`⚠️ ALLERGY WARNING: Patient has documented allergy to "${matched}". Please verify safety before issuing!`);
    } else {
      setAllergyAlert(null);
    }
  };

  const handleAddDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName || !activeConsultation) return;

    if (allergyAlert) {
      if (!window.confirm(`${allergyAlert}\n\nDo you want to override and prescribe?`)) {
        return;
      }
    }

    addPrescriptionToVisit(activeConsultation.id, {
      drugName,
      dosage,
      frequency,
      duration,
      instructions,
      warnings: allergyAlert ? 'Allergy alert acknowledged by physician' : undefined,
    });

    setDrugName('');
    setAllergyAlert(null);
  };

  const handleSaveSOAP = () => {
    if (!activeConsultation) return;
    updateVisitSOAP(activeConsultation.id, { subjective, objective, assessment, plan }, clinicalNotes);
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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-500">
        <Stethoscope className="w-14 h-14 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Consultation Room Available</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Please select a waiting patient from Today's Queue to initiate an active consultation session.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  // Pre-configured suggestions based on doctor
  const getDrugSuggestions = () => {
    if (currentDoctor.id === 'doc-2') {
      return ['Tab. Etoricoxib (Arcoxia)', 'Tab. Paracetamol 650mg', 'Tab. Glucosamine Complex', 'Tab. Pregabalin 75mg'];
    }
    if (currentDoctor.id === 'doc-3') {
      return ['Budesonide Inhaler 100mcg', 'Levosalbutamol Respules', 'Syrup Montelukast 4mg', 'Paracetamol Pediatric Drops'];
    }
    return ['Tab. Ticagrelor (Brilinta)', 'Tab. Rosuvastatin + Ezetimibe', 'Tab. Metoprolol ER 25mg', 'Tab. Apixaban 5mg'];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Patient Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              #{activeConsultation.tokenNumber}
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {patient?.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {patient?.gender}, {patient?.age}y
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
                  {patient?.bloodGroup}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-slate-500 font-mono">
                <span>MRN: <strong className="text-slate-800 dark:text-slate-200">{patient?.mrn}</strong></span>
                <span>•</span>
                <span>ABHA: <strong className="text-slate-800 dark:text-slate-200">{patient?.abhaId}</strong></span>
                <span>•</span>
                <span className="text-sky-700 dark:text-sky-400 font-semibold">{activeConsultation.organizationName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedPatient(patient || null);
                setCurrentView('patients');
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Full Medical Chart</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4 text-cyan-600" />
              <span>Preview & Print Rx</span>
            </button>

            <button
              onClick={handleComplete}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign & Complete Consult</span>
            </button>
          </div>

        </div>

        {/* Allergy Alert */}
        {patient && patient.allergies.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-xs text-rose-800 dark:text-rose-300 font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <div>
              <strong>Documented Allergies:</strong> {patient.allergies.join(', ')} — System will alert if matching medication is prescribed.
            </div>
          </div>
        )}

        {/* Vitals Ribbon */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">BP</div>
            <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.bp}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Heart Rate</div>
            <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.pulse} bpm</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">SpO2</div>
            <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.spO2}%</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Temp</div>
            <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.temp}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Weight</div>
            <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.weight}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
            <div className="text-[10px] text-slate-400 font-bold uppercase">BMI</div>
            <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{activeConsultation.vitals.bmi}</div>
          </div>
        </div>

      </div>

      {/* Main Grid: SOAP Notes Left & Rx Generator Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SOAP Notes (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Clinical SOAP Documentation</span>
            </h2>

            <button
              onClick={applyClinicalTemplate}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Clinical Template</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              S — Subjective (Symptoms & History)
            </label>
            <textarea
              rows={2}
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="Patient reports..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              O — Objective (Examination & Physical Findings)
            </label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Physical findings, heart sounds, range of motion, lungs..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              A — Assessment (Clinical Diagnosis & Progression)
            </label>
            <textarea
              rows={2}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              placeholder="Diagnosis..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
              P — Plan (Prescription, Dietary & Follow-up Instructions)
            </label>
            <textarea
              rows={3}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Directions..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveSOAP}
              className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Save Draft Notes
            </button>
          </div>
        </div>

        {/* Rx Generator (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Pill className="w-4 h-4 text-sky-600" />
              <span>Prescription Builder (Rx)</span>
            </h2>
            <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">
              {activeConsultation.prescriptions.length} Prescribed
            </span>
          </div>

          {allergyAlert && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {allergyAlert}
            </div>
          )}

          {/* Add Medication Form */}
          <form onSubmit={handleAddDrug} className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
            <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              Add Medication
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Drug Name & Formulation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tab. Ticagrelor, Syrup Azithromycin..."
                value={drugName}
                onChange={(e) => handleDrugNameChange(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
              />
              {/* Quick suggestions */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {getDrugSuggestions().map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDrugNameChange(sug)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-medium"
                  >
                    {sug.split(' ')[1] || sug}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g. 500 mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 14 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-400 font-semibold block mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
              >
                <option value="1-0-1 (Twice daily after food)">1-0-1 (Twice daily after food)</option>
                <option value="1-0-0 (Once daily in morning)">1-0-0 (Once daily in morning)</option>
                <option value="0-0-1 (Once daily at bedtime)">0-0-1 (Once daily at bedtime)</option>
                <option value="1-1-1 (Three times daily)">1-1-1 (Three times daily)</option>
                <option value="SOS (As needed)">SOS (As needed for pain/fever)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Prescription</span>
            </button>
          </form>

          {/* Prescribed List */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Issued for this Visit:
            </div>

            {activeConsultation.prescriptions.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No medications added yet.
              </div>
            ) : (
              activeConsultation.prescriptions.map(rx => (
                <div
                  key={rx.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{rx.drugName} ({rx.dosage})</div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{rx.frequency} • {rx.duration}</div>
                    {rx.instructions && <div className="text-[10px] text-slate-400 mt-0.5 italic">{rx.instructions}</div>}
                  </div>

                  <button
                    onClick={() => removePrescriptionFromVisit(activeConsultation.id, rx.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">{currentDoctor.name}</h2>
                <p className="text-xs font-semibold text-slate-700">{currentDoctor.title}</p>
                <p className="text-xs text-slate-500 font-mono">Reg: {currentDoctor.registrationNumber}</p>
              </div>

              <div className="text-right">
                <h3 className="text-sm font-bold text-sky-800">{activeConsultation.organizationName}</h3>
                <p className="text-[11px] text-slate-600">{currentDoctor.organizations[0].address}</p>
                <p className="text-[11px] text-slate-600">Ph: {currentDoctor.organizations[0].phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 my-4 p-3 bg-slate-50 rounded-lg text-xs font-medium border border-slate-200">
              <div><strong>Patient:</strong> {patient?.name}</div>
              <div><strong>Age/Sex:</strong> {patient?.age}y / {patient?.gender}</div>
              <div><strong>Date:</strong> {activeConsultation.date}</div>
              <div><strong>MRN:</strong> {patient?.mrn}</div>
            </div>

            <div className="mb-4 text-xs">
              <strong>Clinical Assessment:</strong> {assessment || 'Follow-up clinical assessment.'}
            </div>

            <div className="mb-6">
              <div className="text-2xl font-serif font-black text-slate-900 mb-2">℞</div>
              <div className="space-y-3">
                {activeConsultation.prescriptions.map((rx, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-2 text-xs">
                    <div className="font-bold text-sm text-slate-900">{idx + 1}. {rx.drugName} — {rx.dosage}</div>
                    <div className="text-slate-700 mt-0.5">Directions: {rx.frequency} for {rx.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            {plan && (
              <div className="mb-6 text-xs">
                <strong className="block mb-1">Clinical Instructions:</strong>
                <p className="whitespace-pre-line text-slate-700">{plan}</p>
              </div>
            )}

            <div className="border-t-2 border-slate-800 pt-4 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <QrCode className="w-10 h-10 text-slate-800" />
                <div className="text-[10px] text-slate-500 font-mono">
                  <div>Digital Rx ID: #{activeConsultation.id}</div>
                  <div>Verified by Practo Pro Engine</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic text-base font-bold text-slate-800">{currentDoctor.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">Digitally Signed & Validated</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3 print:hidden">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-sm flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Rx</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Completion Modal */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Consultation Completed</h3>
            <p className="text-xs text-slate-500 mt-1">
              Clinical summary signed and universal health chart updated for {patient?.name}.
            </p>
            <button
              onClick={() => {
                setIsCompletedModalOpen(false);
                setCurrentView('dashboard');
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm"
            >
              Return to OPD Queue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
