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
  QrCode,
  Mic,
  MicOff,
  Share2,
  Send,
  Check,
  Clock,
  User,
  Heart,
  ChevronRight
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
  const [frequency, setFrequency] = useState('1-0-1 Khane ke baad (After food)');
  const [duration, setDuration] = useState('30 days');
  const [instructions, setInstructions] = useState('Take with warm water after food');
  const [allergyAlert, setAllergyAlert] = useState<string | null>(null);

  // Voice AI Dictation State
  const [isDictating, setIsDictating] = useState(false);
  const [dictationProgress, setDictationProgress] = useState('');

  // Modals
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppPhone, setWhatsAppPhone] = useState(patient?.phone || '+91 98101 22910');
  const [whatsAppSent, setWhatsAppSent] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Voice Dictation Simulation
  const handleToggleVoiceDictation = () => {
    if (isDictating) {
      setIsDictating(false);
      return;
    }

    setIsDictating(true);
    setDictationProgress('Listening in Indian English & Clinical Shorthand...');

    setTimeout(() => {
      let sampleText = '';
      if (currentDoctor.id === 'doc-2') {
        sampleText = 'Patient ambulating without walker. Range of motion 0 to 110 degrees. Minimal swelling. Surgical scar well healed. Advised quadriceps strengthening and stationary cycling. Stop tramadol; Paracetamol SOS.';
      } else if (currentDoctor.id === 'doc-3') {
        sampleText = 'Child afebrile 48 hours. Lungs clear bilaterally, no ronchi or wheeze. Throat mildly congested. Continue Budesonide 2 puffs twice daily through winter. Follow up in 3 months.';
      } else {
        sampleText = 'Patient reports no angina on 4 km morning walks. Heart sounds regular S1 S2, no murmur. BP 122/78 mmHg. Post LAD stent doing well. Continue Brilinta 90mg BD and Rosuvas 20mg at bedtime. Follow up in 6 months.';
      }

      setSubjective(prev => prev ? `${prev} ${sampleText}` : sampleText);
      setIsDictating(false);
      setDictationProgress('Dictation converted to clinical text!');
      setTimeout(() => setDictationProgress(''), 3000);
    }, 2200);
  };

  // Indian Dosage Frequency Presets
  const frequencyPresets = [
    '1-0-1 Khane ke baad (Twice daily, after food)',
    '1-0-0 Khaali pet (Morning empty stomach)',
    '0-0-1 Raat ko (Bedtime / Night)',
    '1-1-1 (Thrice daily)',
    'SOS (Zaroorat padne par / As needed)'
  ];

  // Specialty-tailored SOAP templates
  const applyClinicalTemplate = () => {
    let s = '';
    let o = '';
    let a = '';
    let p = '';

    if (currentDoctor.id === 'doc-2') {
      s = 'Patient ambulating without walking aid indoors. No rest pain. Mild stiffness after prolonged sitting. Compliant with home exercises.';
      o = 'Right knee scar mature and healed. Active range of motion: 0 to 115 degrees. No joint warmth or effusion. Stable in valgus/varus stress.';
      a = 'Post Robotic Right Total Knee Replacement (Week 7). Excellent progress toward functional rehabilitation.';
      p = '1. Continue quadriceps strengthening at Apex Sports physio.\n2. Stationary cycling 15 minutes daily.\n3. Discontinue tramadol; Paracetamol SOS only.';
    } else if (currentDoctor.id === 'doc-3') {
      s = 'Child active, playing, afebrile for 48 hours. No nocturnal coughing or wheezing. Appetite returned to baseline.';
      o = 'Chest: Bilaterally clear, no wheezing. Heart sounds normal. Weight: 17.2 kg (50th percentile). Throat clear.';
      a = 'Well-controlled Childhood Asthma on inhaled corticosteroid prophylaxis.';
      p = '1. Continue Budesonide/Formoterol inhaler 2 puffs BD through winter.\n2. Administered annual influenza vaccine today.\n3. Follow-up in 3 months.';
    } else {
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

  const handleSendWhatsApp = () => {
    setWhatsAppSent(true);
    setTimeout(() => {
      setWhatsAppSent(false);
      setIsWhatsAppModalOpen(false);
    }, 2500);
  };

  if (!activeConsultation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="w-16 h-16 rounded-3xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Consultation Room Available</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Please select a waiting patient from Today's Queue to initiate an active consultation session.
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-5 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  // Pre-configured suggestions based on doctor
  const getDrugSuggestions = () => {
    if (currentDoctor.id === 'doc-2') {
      return [
        { name: 'Tab. Arcoxia (Etoricoxib)', dose: '90 mg', freq: '1-0-0 Khane ke baad' },
        { name: 'Tab. Dolo 650 (Paracetamol)', dose: '650 mg', freq: 'SOS' },
        { name: 'Tab. Shelcal-500 (Calcium + D3)', dose: '500 mg', freq: '0-0-1 Raat ko' },
        { name: 'Tab. Meganeuron-PG (Pregabalin)', dose: '75 mg', freq: '0-0-1 Raat ko' }
      ];
    }
    if (currentDoctor.id === 'doc-3') {
      return [
        { name: 'Budecort Inhaler (Budesonide)', dose: '100 mcg', freq: '1-0-1 (2 puffs)' },
        { name: 'Syp. Montair-LC Kid', dose: '5 ml', freq: '0-0-1 Raat ko' },
        { name: 'Syp. Augmentin Duo 228mg', dose: '5 ml', freq: '1-0-1 Khane ke baad' },
        { name: 'Syp. Calpol Pediatric 250mg', dose: '5 ml', freq: 'SOS' }
      ];
    }
    return [
      { name: 'Tab. Brilinta (Ticagrelor)', dose: '90 mg', freq: '1-0-1 Khane ke baad' },
      { name: 'Tab. Rosuvas (Rosuvastatin)', dose: '20 mg', freq: '0-0-1 Raat ko' },
      { name: 'Tab. Pan-D (Pantoprazole + Domp)', dose: '40/30 mg', freq: '1-0-0 Khaali pet' },
      { name: 'Tab. Metocard-XL (Metoprolol)', dose: '25 mg', freq: '1-0-0 Khane ke baad' }
    ];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Patient Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center flex-shrink-0 shadow-md">
              #{activeConsultation.tokenNumber}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {patient?.name}
                </h1>
                <span className="text-xs text-slate-500 font-semibold">
                  ({patient?.age}y / {patient?.gender})
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {patient?.bloodGroup}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                  ABHA: {patient?.abhaId}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{activeConsultation.organizationName}</span>
                </span>
                <span>•</span>
                <span>MRN: <strong>{patient?.mrn}</strong></span>
                <span>•</span>
                <span>Phone: <strong>{patient?.phone}</strong></span>
              </div>

              {/* Allergies Warning */}
              {patient?.allergies && patient.allergies.length > 0 && (
                <div className="mt-2 inline-flex items-center space-x-1 text-xs text-rose-700 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Documented Allergies: {patient.allergies.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (patient) {
                  setSelectedPatient(patient);
                  setCurrentView('patients');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Full EHR History</span>
            </button>

            <button
              onClick={() => setIsWhatsAppModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all flex items-center space-x-1.5"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Send WhatsApp Rx</span>
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Letterhead</span>
            </button>

            <button
              onClick={handleComplete}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign & Complete Session</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main 2-Column Split: SOAP Notes Left, Rx Pad Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Clinical SOAP Documentation */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Clinical SOAP Documentation
                </h3>
              </div>

              {/* Dictation & Template Controls */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleToggleVoiceDictation}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isDictating
                      ? 'bg-rose-600 text-white animate-pulse shadow-md'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
                  }`}
                  title="Simulate Voice Dictation"
                >
                  {isDictating ? <Mic className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isDictating ? 'Recording...' : 'Voice Dictate'}</span>
                </button>

                <button
                  type="button"
                  onClick={applyClinicalTemplate}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 text-xs font-bold transition-colors flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Insert Specialty Template</span>
                </button>
              </div>
            </div>

            {/* Voice Dictation Status */}
            {isDictating && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center space-x-3">
                <div className="flex items-end space-x-1 h-6">
                  <div className="w-1 bg-rose-600 animate-wave-1 rounded-full" />
                  <div className="w-1 bg-rose-600 animate-wave-2 rounded-full" />
                  <div className="w-1 bg-rose-600 animate-wave-3 rounded-full" />
                  <div className="w-1 bg-rose-600 animate-wave-4 rounded-full" />
                  <div className="w-1 bg-rose-600 animate-wave-5 rounded-full" />
                </div>
                <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                  {dictationProgress}
                </span>
              </div>
            )}

            {/* Subjective */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                S — Subjective (Symptoms, History of Present Illness)
              </label>
              <textarea
                rows={3}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                placeholder="Patient's reported symptoms, complaint duration, treatment compliance..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Objective */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                O — Objective (Examination Findings, Labs & Vitals)
              </label>
              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Physical examination, auscultation, range of motion, blood pressure, diagnostic report findings..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Assessment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                A — Assessment (Clinical Impression, Differential Diagnosis)
              </label>
              <textarea
                rows={2}
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="Primary clinical diagnosis and post-procedural progress..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Plan */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                P — Plan (Investigations, Rehab, Follow-up Advice)
              </label>
              <textarea
                rows={3}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Medication regimen, lifestyle modifications, review date..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveSOAP}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Save Notes Draft
              </button>
            </div>

          </div>
        </div>

        {/* Right Column (5 cols): Indian Subcontinent Prescription Pad */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Prescription Pad (Rx)
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                1-0-1 Vernacular Ready
              </span>
            </div>

            {/* Allergy Interceptor Warning */}
            {allergyAlert && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold animate-pulse">
                {allergyAlert}
              </div>
            )}

            {/* Quick Medicine Suggestions Chips */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Common Specialty Prescriptions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {getDrugSuggestions().map((drug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDrugName(drug.name);
                      setDosage(drug.dose);
                      setFrequency(drug.freq);
                      handleDrugNameChange(drug.name);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors"
                  >
                    + {drug.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* New Drug Form */}
            <form onSubmit={handleAddDrug} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine Name & Strength *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tab. Brilinta / Augmentin 625 / Dolo 650"
                  value={drugName}
                  onChange={(e) => handleDrugNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 90 mg / 1 tab"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 30 days / 5 days"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Frequency & Timings
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {frequencyPresets.map((f, i) => (
                    <option key={i} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions to Patient
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take after meals with plenty of water"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medication to Prescription</span>
              </button>
            </form>

            {/* Prescribed Drugs List */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Prescription Items ({activeConsultation.prescriptions.length}):
              </span>

              {activeConsultation.prescriptions.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs italic">
                  No medications prescribed yet.
                </div>
              ) : (
                activeConsultation.prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        {rx.drugName} • {rx.dosage}
                      </div>
                      <div className="font-mono text-sky-600 dark:text-sky-400 font-bold mt-0.5">
                        {rx.frequency} ({rx.duration})
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {rx.instructions}
                      </div>
                      {rx.warnings && (
                        <div className="text-[10px] text-amber-600 font-bold mt-1">
                          ⚠️ {rx.warnings}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removePrescriptionFromVisit(activeConsultation.id, rx.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Medication"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>

      {/* WhatsApp Prescription Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Send Prescription via WhatsApp
                  </h3>
                  <p className="text-[11px] text-slate-500">Official NMC-Signed Digital Slip</p>
                </div>
              </div>
              <button 
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Mobile Number (+91)
                </label>
                <input
                  type="text"
                  value={whatsAppPhone}
                  onChange={(e) => setWhatsAppPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* WhatsApp Message Preview Bubble */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 space-y-2">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                  <span>{currentDoctor.name}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">PDF Attachment (184 KB)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Dear <strong>{patient?.name}</strong>, please find your digitally signed prescription from today's consultation at <strong>{activeConsultation.organizationName}</strong>.
                </p>
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-200/50 text-[10px] space-y-1">
                  <div className="font-bold">Prescribed Medicines ({activeConsultation.prescriptions.length}):</div>
                  {activeConsultation.prescriptions.map((p, i) => (
                    <div key={i} className="text-slate-600 dark:text-slate-400">
                      • {p.drugName} ({p.frequency})
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Verified with ABHA QR Code • Council Reg: {currentDoctor.registrationNumber}
                </div>
              </div>

              {whatsAppSent ? (
                <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-center flex items-center justify-center space-x-2 animate-pulse">
                  <Check className="w-4 h-4" />
                  <span>Prescription Delivered to Patient WhatsApp!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp Business API</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Doctor Letterhead Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500">Official Clinical Letterhead Preview</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Letterhead Body */}
            <div id="printable-prescription" className="space-y-6 text-xs bg-white p-4">
              
              {/* Doctor & Clinic Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{currentDoctor.name}</h2>
                  <p className="font-bold text-sky-800 text-xs">{currentDoctor.title}</p>
                  <p className="text-[11px] text-slate-600">{currentDoctor.specialty}</p>
                  <p className="text-[11px] font-mono font-bold text-slate-700 mt-0.5">
                    NMC / State Reg No: {currentDoctor.registrationNumber}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-slate-900">{activeConsultation.organizationName}</div>
                  <div className="text-[11px] text-slate-500 max-w-xs">{currentDoctor.organizations.find(o => o.id === activeConsultation.organizationId)?.address}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Phone: {currentDoctor.phone}</div>
                </div>
              </div>

              {/* Patient Bar */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">PATIENT NAME</span>
                  <span className="font-bold text-slate-900">{patient?.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">AGE / GENDER</span>
                  <span className="font-bold text-slate-900">{patient?.age} Yrs / {patient?.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">ABHA NUMBER</span>
                  <span className="font-mono font-bold text-slate-900">{patient?.abhaId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">CONSULTATION DATE</span>
                  <span className="font-bold text-slate-900">{activeConsultation.date}</span>
                </div>
              </div>

              {/* Vitals */}
              <div className="flex space-x-4 border-b border-slate-200 pb-3 text-[11px]">
                <span>BP: <strong>{activeConsultation.vitals.bp} mmHg</strong></span>
                <span>Pulse: <strong>{activeConsultation.vitals.pulse} bpm</strong></span>
                <span>SpO2: <strong>{activeConsultation.vitals.spO2}%</strong></span>
                <span>Weight: <strong>{activeConsultation.vitals.weight}</strong></span>
              </div>

              {/* Clinical Assessment */}
              <div className="space-y-1">
                <span className="font-black text-xs text-slate-900 uppercase">Clinical Diagnosis:</span>
                <p className="text-slate-800">{assessment || 'Clinical evaluation completed.'}</p>
              </div>

              {/* Rx Symbol & Medication List */}
              <div className="space-y-3 pt-2">
                <div className="text-2xl font-black text-slate-900 font-serif">℞</div>
                <div className="space-y-2">
                  {activeConsultation.prescriptions.map((rx, idx) => (
                    <div key={idx} className="p-2 border-b border-slate-100 flex justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{idx + 1}. {rx.drugName}</span>
                        <span className="text-slate-500 ml-2">({rx.dosage})</span>
                        <div className="text-[11px] text-slate-600 mt-0.5">{rx.instructions}</div>
                      </div>
                      <div className="font-mono font-bold text-slate-800">{rx.frequency}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Advice */}
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-xs uppercase block text-slate-800">Advice / Plan:</span>
                <p className="text-slate-700 whitespace-pre-line mt-1">{plan || 'Review as advised.'}</p>
              </div>

              {/* Footer with Digital Seal */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200">
                <div className="flex items-center space-x-2 text-slate-500 text-[10px]">
                  <QrCode className="w-10 h-10 text-slate-800" />
                  <div>
                    <div>Scan for ABHA PHR Verification</div>
                    <div className="font-mono">DocPulse-ABDM-2026-94812</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="w-32 border-b border-slate-900 mb-1" />
                  <div className="font-bold text-slate-900">{currentDoctor.name}</div>
                  <div className="text-[10px] text-slate-500">Electronically Signed under IT Act 2000</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Completion Confirmation Modal */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              Consultation Signed & Stored
            </h3>
            <p className="text-xs text-slate-500">
              The clinical SOAP note and prescription have been committed to the patient's longitudinal ABHA record.
            </p>
            <button
              onClick={() => {
                setIsCompletedModalOpen(false);
                setCurrentView('dashboard');
              }}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all"
            >
              Return to OPD Queue
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
