import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_DOCTORS } from '../../data/mockData';
import { 
  Stethoscope, 
  Building2, 
  Calendar, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Activity, 
  Heart, 
  FileText, 
  MapPin, 
  Check, 
  Smartphone, 
  Share2,
  Navigation,
  Pill,
  Award,
  ChevronDown,
  DollarSign,
  PhoneCall,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, switchDoctor } = useApp();

  // Active Hero Interactive Staged Doctor
  const [stagedDocId, setStagedDocId] = useState<string>('doc-1');
  const stagedDoc = MOCK_DOCTORS.find(d => d.id === stagedDocId) || MOCK_DOCTORS[0];

  // Interactive ROI Calculator State
  const [dailyPatients, setDailyPatients] = useState<number>(30);
  const [facilitiesCount, setFacilitiesCount] = useState<number>(3);
  const [avgFee, setAvgFee] = useState<number>(1500);

  // Calculations
  const hoursSavedPerMonth = Math.round(facilitiesCount * 12 + (dailyPatients * 0.4));
  const noShowsPreventedPerMonth = Math.round(dailyPatients * 0.08 * 24);
  const revenueRecoveredPerMonth = noShowsPreventedPerMonth * avgFee;

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Case study interactive tab
  const [caseStudyStep, setCaseStudyStep] = useState<number>(1);

  const handleLaunchDoctor = (docId: string) => {
    switchDoctor(docId);
    setCurrentView('dashboard');
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Top Geolocation Subcontinent Bar */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-900 border-b border-sky-100 dark:border-slate-800 py-2.5 px-4 text-center text-xs text-slate-700 dark:text-slate-300 font-medium">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-bold text-[11px]">
            <span>🇮🇳</span>
            <span>Subcontinent Clinical OS</span>
          </span>
          <span>
            Active across <strong>Delhi NCR, Bengaluru, Chennai, Mumbai & Kolkata</strong> • ABDM M1/M2/M3 Gateway • NMC RMP Compliant
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        {/* Subtle Decorative Background Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-100/50 via-teal-50/20 to-transparent dark:from-sky-950/20 pointer-events-none -z-10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Practo for Doctors • Ayushman Bharat Digital Mission (ABDM) Production Ready
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              You consult across 3 different hospitals.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600 dark:from-sky-400 dark:to-teal-400">
                Your patient history shouldn't stay in silos.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Practo connected patients to clinics. <strong>DocPulse 360</strong> unifies the doctor's entire day — tertiary hospital rounds, emergency OT procedures, evening private chambers, traffic commute buffers, and WhatsApp prescriptions in one clinical workspace.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => handleLaunchDoctor('doc-1')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 hover:shadow-sky-600/40 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Launch Live Doctor Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#doctor-demos"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Explore Doctor Sessions (AIIMS / PGIMER / CMC)</span>
                <Users className="w-4 h-4 text-sky-600" />
              </a>
            </div>

            {/* Key Clinical Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>NMC Digital Verified Rx</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>ABHA Universal Health Locker</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Dynamic Transit Traffic Buffer</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>1-0-1 Vernacular WhatsApp Dispatch</span>
              </span>
            </div>
          </div>

          {/* Staged Doctor's Day Live Interactive Preview Mockup (Google Stitch Staging) */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
              
              {/* Staging Header Bar with Doctor Switcher Tabs */}
              <div className="bg-slate-50 dark:bg-slate-850 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    Live Clinical Operating Session
                  </span>
                </div>

                {/* Persona Switcher Tabs */}
                <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  {MOCK_DOCTORS.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => setStagedDocId(doc.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                        stagedDocId === doc.id
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <img src={doc.avatar} alt={doc.name} className="w-4 h-4 rounded-full object-cover" />
                      <span>{doc.name.split(',')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Staged Content Canvas */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Doctor Identity Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start space-x-4">
                    <img
                      src={stagedDoc.avatar}
                      alt={stagedDoc.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-500/20 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {stagedDoc.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          {stagedDoc.registrationNumber}
                        </span>
                      </div>
                      <p className="text-xs text-sky-700 dark:text-sky-400 font-semibold mt-0.5">
                        {stagedDoc.title} • {stagedDoc.specialty}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {stagedDoc.organizations.map(org => (
                          <span 
                            key={org.id}
                            className="inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
                            <span>{org.shortName}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchDoctor(stagedDoc.id)}
                    className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
                  >
                    <span>Open Live Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Staged Split Panes: Left = Real-time Transit & Facilities, Right = Live OPD Queue & Rx Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Pane: Multi-Facility Route & Transit Buffer */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Today's Clinical Route & Schedule
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Live Session</span>
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {stagedDoc.organizations.map((org, idx) => (
                        <div 
                          key={org.id}
                          className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: org.color }}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white">{org.name}</div>
                              <div className="text-[11px] text-slate-500">{org.roomNumber} • Fee: ₹{org.consultancyFee}</div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                            {org.timeSlot.split(' - ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Urban Traffic Advisory Box */}
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                          Commute Buffer Alert: Ashram & Ring Road
                        </div>
                        <p className="text-[11px] text-amber-800/80 dark:text-amber-400 mt-0.5">
                          Hospital case overran by 20 mins. DocPulse 360 auto-extended the evening chamber start time and notified OPD tokens via WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: Live Queue & 1-0-1 Rx Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Active Patient & WhatsApp Rx
                      </span>
                      <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded">
                        Token #01 In-Room
                      </span>
                    </div>

                    {/* Active Patient Card */}
                    <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50/40 dark:bg-sky-950/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-black text-sm text-slate-900 dark:text-white">
                            Vikram Malhotra (54M)
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ABHA: 91-4829-1029-4821 • New Delhi
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          BP 122/78 • Stented
                        </span>
                      </div>

                      {/* WhatsApp Rx Snippet */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Prescribed Medicine (Bilingual)</span>
                          <span className="text-emerald-600 font-semibold">1-Click WhatsApp</span>
                        </div>
                        
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">1. Tab. Brilinta 90mg (Ticagrelor)</span>
                            <span className="font-mono text-sky-600 font-bold">1-0-1 Khane ke baad</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">2. Tab. Rosuvas 20mg (Rosuvastatin)</span>
                            <span className="font-mono text-sky-600 font-bold">0-0-1 Raat ko</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">3. Tab. Pan-D (Pantoprazole + Domperidone)</span>
                            <span className="font-mono text-sky-600 font-bold">1-0-0 Khaali pet</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>No Drug-Drug Contraindications</span>
                        </span>
                        <span className="font-mono text-purple-600 font-bold">NMC E-Sign Ready</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Subcontinent Practice Pain-Points Matrix */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              The Reality of Subcontinent Practice
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Why Western EHRs & Generic Apps Fail Indian Doctors
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
              In India, a top specialist is not an employee tied to a single hospital desk. You are an independent clinical consultant managing multi-facility obligations across congested metropolitan corridors.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Practice Dimension</th>
                  <th className="py-3 px-4">Traditional Western EHR (Epic/Cerner)</th>
                  <th className="py-3 px-4">Legacy Patient Booking App</th>
                  <th className="py-3 px-4 text-sky-600 bg-sky-50/60 dark:bg-sky-950/40 rounded-t-xl font-black">
                    DocPulse 360 (Practo for Doctors)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Multi-Facility Practice</td>
                  <td className="py-3.5 px-4 text-rose-600">Single hospital silo. Inaccessible outside campus.</td>
                  <td className="py-3.5 px-4 text-amber-600">Fragmented clinic logins with no shared history.</td>
                  <td className="py-3.5 px-4 bg-sky-50/30 dark:bg-sky-950/20 font-bold text-sky-700 dark:text-sky-300">
                    Unified workspace: Apollo, Fortis & Private Chamber in 1-click.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Urban Traffic Collisions</td>
                  <td className="py-3.5 px-4 text-slate-400">Zero awareness of commute or geography.</td>
                  <td className="py-3.5 px-4 text-rose-600">Allows back-to-back bookings across city without buffer.</td>
                  <td className="py-3.5 px-4 bg-sky-50/30 dark:bg-sky-950/20 font-bold text-sky-700 dark:text-sky-300">
                    Transit Buffer Guard: Ashram, Silk Board & WEH delays auto-alert OPD.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">National Health Stack (ABDM)</td>
                  <td className="py-3.5 px-4 text-slate-400">Proprietary US-centric standards (HL7/FHIR USCDI).</td>
                  <td className="py-3.5 px-4 text-slate-400">Isolated proprietary patient database.</td>
                  <td className="py-3.5 px-4 bg-sky-50/30 dark:bg-sky-950/20 font-bold text-sky-700 dark:text-sky-300">
                    Native ABDM (M1, M2, M3) gateway with 14-digit ABHA linking.
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Subcontinent Prescribing</td>
                  <td className="py-3.5 px-4 text-slate-400">Complex dropdowns, Western brand trade names.</td>
                  <td className="py-3.5 px-4 text-slate-400">Basic text box without allergy safety interceptor.</td>
                  <td className="py-3.5 px-4 bg-sky-50/30 dark:bg-sky-950/20 font-bold text-sky-700 dark:text-sky-300">
                    Indian brand library + vernacular timings (1-0-1 Khane ke baad).
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">WhatsApp & PDF Delivery</td>
                  <td className="py-3.5 px-4 text-slate-400">Patient portal login required (ignored by patients).</td>
                  <td className="py-3.5 px-4 text-slate-400">Manual paper printing or SMS web links.</td>
                  <td className="py-3.5 px-4 bg-sky-50/30 dark:bg-sky-950/20 font-bold text-sky-700 dark:text-sky-300">
                    Instant WhatsApp dispatch with NMC Council seal & QR code.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Interactive Practice ROI & Commute Loss Calculator */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Interactive Practice Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Calculate Your Practice Time & Revenue Recovered
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Indian consultants lose up to 3 hours daily managing multiple clinic schedules and waiting room backlogs caused by traffic overruns. See what DocPulse 360 recovers for you:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Slider 1: Daily Patients */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Average OPD Patients per Day:</span>
                  <span className="text-sky-400 font-mono text-sm">{dailyPatients} Patients</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={dailyPatients}
                  onChange={(e) => setDailyPatients(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>10 (Boutique)</span>
                  <span>45 (Active OPD)</span>
                  <span>80 (High Volume)</span>
                </div>
              </div>

              {/* Slider 2: Facilities */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Hospital & Chamber Consultancies:</span>
                  <span className="text-sky-400 font-mono text-sm">{facilitiesCount} Facilities</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={facilitiesCount}
                  onChange={(e) => setFacilitiesCount(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 Facility</span>
                  <span>2 Facilities</span>
                  <span>3 Facilities</span>
                  <span>4 Facilities</span>
                </div>
              </div>

              {/* Slider 3: Fee */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Average Consultation Fee (₹):</span>
                  <span className="text-sky-400 font-mono text-sm">₹{avgFee.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={avgFee}
                  onChange={(e) => setAvgFee(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹500</span>
                  <span>₹1,500</span>
                  <span>₹3,000</span>
                </div>
              </div>

            </div>

            {/* Calculated Output Cards (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <div className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                  Clinical Hours Saved / Month
                </div>
                <div className="text-3xl font-black text-white mt-1">
                  ~{hoursSavedPerMonth} Hours
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Eliminates EMR re-entry, manual phone calls, and schedule collision delays.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
                <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  Revenue Recovered / Month
                </div>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  ₹{revenueRecoveredPerMonth.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  From {noShowsPreventedPerMonth} prevented no-shows through automated traffic buffer SMS/WhatsApp alerts.
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Interactive Case Study: Patient Vikram Malhotra's Unified Care */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Cross-Hospital Care Continuum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              The Journey of Patient Vikram Malhotra
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
              See how Dr. Sarah Chen coordinates Vikram's severe CAD across Apollo Indraprastha, Fortis Escorts, and her Defence Colony private clinic without duplicate tests or lost files.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <button
              onClick={() => setCaseStudyStep(1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                caseStudyStep === 1
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Phase 1: Chamber Workup (Aug 15)
            </button>
            <button
              onClick={() => setCaseStudyStep(2)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                caseStudyStep === 2
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Phase 2: Apollo Cath Lab DES (Aug 20)
            </button>
            <button
              onClick={() => setCaseStudyStep(3)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                caseStudyStep === 3
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Phase 3: Fortis Rehab & Review (Today)
            </button>
          </div>

          {/* Active Step Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-4xl mx-auto">
            {caseStudyStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <MapPin className="w-4 h-4" />
                  <span>Defence Colony Private Chamber • New Delhi</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Initial Presentation: Unstable Angina Workup
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vikram presented with 2-week history of retrosternal pressure on climbing stairs. In-clinic 12-lead ECG revealed ST segment depression in leads V4–V6. Dr. Chen immediately generated an ABHA referral token and scheduled emergency catheterization at Apollo Indraprastha for the following week.
                </p>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Clinical Rx Issued:</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Tab. Sorbitrate 5mg SOS sublingual • Tab. Ecosprin 75mg 0-1-0 • Tab. Atorva 40mg 0-0-1
                  </div>
                </div>
              </div>
            )}

            {caseStudyStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-sky-700 dark:text-sky-300">
                  <Building2 className="w-4 h-4" />
                  <span>Apollo Hospital & Heart Institute, Indraprastha Cath Lab</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Coronary Angiography & DES Stenting
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Radial catheterization revealed an 85% critical stenosis in the mid-Left Anterior Descending (LAD) coronary artery. Dr. Chen successfully deployed a 3.0 x 28 mm Everolimus Drug-Eluting Stent with TIMI 3 flow. The post-procedure angiogram video and lab reports were automatically linked to Vikram's universal ABHA record.
                </p>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">ABDM Diagnostic Record Stored:</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    DocRef: APOLLO-CATH-2026-9041 • Everolimus DES LAD • TIMI III Flow Confirmed
                  </div>
                </div>
              </div>
            )}

            {caseStudyStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 dark:text-teal-300">
                  <Heart className="w-4 h-4" />
                  <span>Fortis Escorts Cardiac Rehab & Chamber Review (Today)</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Phase II Cardiac Rehabilitation & Routine Follow-up
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vikram completed 8.5 METs on Bruce protocol treadmill stress testing with no angina or arrhythmias. Today, he is waiting in Token #01 at Defence Colony for his 3-month DAPT review. Dr. Chen pulls up his Apollo cath lab film directly in 1 click!
                </p>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Current Status in Today's Queue:</div>
                    <div className="text-[11px] text-slate-500">Token #01 • Waiting at Defence Colony Chamber</div>
                  </div>
                  <button
                    onClick={() => handleLaunchDoctor('doc-1')}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                  >
                    Examine in Active Room
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 1-Click Interactive Dummy Doctor Profiles (AIIMS, PGIMER, CMC) */}
      <section id="doctor-demos" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Pre-Configured Specialist Sessions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Experience the Workspace as a Leading Specialist
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            Select any doctor profile below to launch an authentic live session with populated patient files, OPD queues, and city traffic conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center space-x-3.5 mb-3.5">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-500/20 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-sky-700 dark:text-sky-400 font-bold">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.registrationNumber}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 italic leading-relaxed">
                  "{doc.bio}"
                </p>

                <div className="space-y-1.5 mb-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Associated Facilities ({doc.organizations.length}):
                  </div>
                  {doc.organizations.map(org => (
                    <div 
                      key={org.id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: org.color }} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{org.shortName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{org.timeSlot.split(' - ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleLaunchDoctor(doc.id)}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 group-hover:shadow-sky-600/30 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Launch {doc.name.split(',')[0]} Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Subcontinent Doctor Testimonials */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Trusted by Senior Physicians
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Endorsed by Clinicians Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
              <div className="flex items-center space-x-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "Between Apollo Indraprastha cath lab cases and my Defence Colony clinic, Ashram Flyover traffic used to ruin my schedule. DocPulse 360's transit buffer automatically keeps my evening patients notified."
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Dr. Sarah Chen, MBBS, MD, DM</div>
                <div className="text-[11px] text-slate-500">AIIMS New Delhi Alumna • Interventional Cardiology</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
              <div className="flex items-center space-x-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "In Bengaluru, commuting between Manipal Hospital Old Airport Road and Indiranagar can easily take 45 minutes on a rainy evening. Having unified patient notes and dynamic booking buffers is a lifesaver."
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Dr. Rajesh Varma, MBBS, MS, MCh</div>
                <div className="text-[11px] text-slate-500">PGIMER Chandigarh Alumnus • Robotic Joint Surgeon</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
              <div className="flex items-center space-x-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "Young mothers in Chennai expect WhatsApp prescriptions immediately after consultation. DocPulse 360 formats the 1-0-1 dosage in English and Tamil, adds my TNMC digital seal, and syncs with ABHA in seconds."
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Dr. Priya Iyer, MBBS, MD, DCH</div>
                <div className="text-[11px] text-slate-500">CMC Vellore Alumna • Senior Pediatrician</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Subcontinent Doctor FAQs */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Questions Indian Doctors Ask Us
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Are the digital prescriptions legally valid under National Medical Commission (NMC) regulations?",
              a: "Yes. Prescriptions generated via DocPulse 360 comply fully with NMC Telemedicine Guidelines (2020) and the Information Technology Act (2000). They include your verified State Medical Council registration number (e.g., DMC, KMC, TNMC), clinical rationale, bilingual dosage vernacular, and a tamper-evident QR code linked to the patient's ABHA account."
            },
            {
              q: "How does the Transit Buffer Guard handle unpredictable Indian city traffic jams?",
              a: "DocPulse 360 continuously estimates travel times between your scheduled hospital OT/OPD and evening private chamber. If your 1:30 PM case at Apollo runs over or the Ashram Flyover / Silk Board bottleneck exceeds 30 minutes, the buffer guard automatically pushes your chamber slot start time by 20–30 minutes and dispatches an automated courtesy WhatsApp update to waiting patients."
            },
            {
              q: "Does this replace the hospital's internal EMR (e.g. Apollo / Manipal EHR)?",
              a: "No, it augments it. Hospital IT departments lock their EMRs within their intra-net. DocPulse 360 acts as the doctor's personal clinical cockpit, aggregating your clinical visit notes, operative summaries, and diagnostic reports into an ABDM-compliant personal health locker under patient consent."
            },
            {
              q: "What happens if clinic broadband cuts during evening monsoon showers?",
              a: "DocPulse 360 uses local-first progressive web storage. You can continue writing SOAP notes, prescribing medicines, and calling queue tokens without internet. The moment connectivity restores, all records sync seamlessly with the ABDM cloud gateway."
            }
          ].map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs">
              +
            </div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              DocPulse 360 Pro • Practo for Doctors Reimagined
            </span>
          </div>

          <p className="text-slate-500 text-[11px]">
            NMC Registered Medical Practitioner Compliant • ABDM Health Information Exchange (HIE-CM) • DPDP Act 2023 Encrypted
          </p>

          <button
            onClick={() => handleLaunchDoctor('doc-1')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
          >
            Launch MVP
          </button>
        </div>
      </footer>

    </div>
  );
};
