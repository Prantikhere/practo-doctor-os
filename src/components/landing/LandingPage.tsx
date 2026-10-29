import React from 'react';
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
  Lock, 
  Globe, 
  FileText, 
  Clock, 
  Sparkles, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Activity,
  Smartphone,
  Eye,
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, switchDoctor } = useApp();

  const handleLaunchWithDoctor = (docId: string) => {
    switchDoctor(docId);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Banner: Reverse Engineering Context */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-950/60 border-b border-emerald-500/20 px-4 py-2 text-center text-xs text-emerald-300 flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          <strong>Architectural Blueprint:</strong> Reversing Practo from patient-booking into a unified Doctor-Centric Practice Operating System.
        </span>
        <span className="hidden sm:inline-block text-slate-400">|</span>
        <span className="hidden sm:inline-block font-mono text-[11px] text-emerald-400/90">
          Cross-Org Mesh • Travel Buffer Engine • Longitudinal EHR
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8 shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300">
              Practo Re-Engineered For Doctors
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Multi-Organization & Consolidated Care</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
            Healthcare is fragmented across clinics.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Your clinical intelligence shouldn't be.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The next-generation practice OS designed specifically for physicians who consult across multiple hospitals, polyclinics, and private chambers. Unify patient history across facilities, eliminate scheduling collisions, and access complete clinical records anywhere.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2.5"
            >
              <span>Launch Live Doctor MVP</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>

            <a
              href="#doctor-profiles"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-base transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Dummy Doctor Sessions</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </a>
          </div>

          {/* Live KPI Chips */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-left">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-emerald-400">0%</div>
              <div className="text-xs text-slate-400 font-medium">Double-Booking Collisions</div>
              <div className="text-[11px] text-slate-500">Auto travel-buffer checks</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-teal-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Longitudinal History</div>
              <div className="text-[11px] text-slate-500">Cross-consultancy timeline</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-cyan-400">&lt; 100ms</div>
              <div className="text-xs text-slate-400 font-medium">Search & Triage Retrieval</div>
              <div className="text-[11px] text-slate-500">Optimistic local cache</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-2xl font-bold text-purple-400">HIPAA & ABDM</div>
              <div className="text-xs text-slate-400 font-medium">Cryptographic Privacy</div>
              <div className="text-[11px] text-slate-500">Audit logs & consent tokens</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Critical Pain Points Solved */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Pain Point Analysis & Reverse Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Why Existing Doctor Portals Fail Multi-Clinic Physicians
            </h2>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">
              Practo was created primarily for patients to discover doctors. But in the real world, top doctors visit 2 to 4 different hospitals and clinics daily. Here is how DocPulse 360 re-engineers every failure point.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">The Multi-Organization Silo</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                <strong>The Pain:</strong> Doctor has to remember 3 different portal passwords (Hospital A, Hospital B, Private Clinic). Patient data never syncs.
              </p>
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                <strong>DocPulse Solution:</strong> Multi-Organization Workspace Switcher. Toggle between individual clinics or view a <em>Unified Cross-Org Care Mesh</em> in one click.
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Schedule Collisions & Commute Stress</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                <strong>The Pain:</strong> Hospital A books a patient until 2:00 PM; Clinic B books at 2:15 PM. Doctor faces a 40-minute traffic commute, leading to patient delays.
              </p>
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                <strong>DocPulse Solution:</strong> Intelligent Travel-Buffer Engine. Automatically maps transit between hospitals and flags impossible transition windows before they happen.
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Same Patient Across Multiple Consultancies</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                <strong>The Pain:</strong> Vikram visits Dr. Chen at her private clinic, gets stented at Apollo Grand, and does cardiac rehab at St. Jude. The doctor cannot see previous reports in one place.
              </p>
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                <strong>DocPulse Solution:</strong> Universal Longitudinal EHR. Patient records follow the doctor-patient relationship across all institutions with complete timeline tracking.
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Data Privacy & Hospital Data Fencing</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                <strong>The Pain:</strong> Hospital A refuses to expose its patient list to Hospital B. Unregulated sharing creates massive HIPAA/DPDP compliance liabilities.
              </p>
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                <strong>DocPulse Solution:</strong> Patient-Mediated Consent Token (ABDM M1/M2/M3 framework). Only the attending doctor sees authorized medical data, accompanied by full cryptographic audit logging.
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Live OPD Triage & Delays</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                <strong>The Pain:</strong> Doctors have no visibility into who is waiting, who is late, or which walk-in patient needs emergency triage while juggling multi-clinics.
              </p>
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                <strong>DocPulse Solution:</strong> Real-time Token Queue Tracker. Track Waiting, In-Consultation, Delayed, and Telehealth sessions with 1-click status transitions.
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Unresponsive, Clunky Hospital UIs</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                <strong>The Pain:</strong> Most EHRs are legacy desktop software built in the 2000s that don't render on iPhones, iPads, or during in-transit cab rides.
              </p>
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                <strong>DocPulse Solution:</strong> Mobile-First Responsive PWA architecture. Fluid layout adapting seamlessly to desktop monitors, iPad bedside charting, and smartphone queue reviews.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Dummy Doctor Sessions (Core Requirement) */}
      <section id="doctor-profiles" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            1-Click Interactive Sessions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Experience the MVP as a Practicing Specialist
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Select any pre-configured doctor persona below to instantly launch into their live consultation queue, review real patient cross-facility histories, and test schedule conflict resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_DOCTORS.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between group transition-all"
            >
              <div>
                {/* Doctor Avatar & Specialty */}
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      {doc.registrationNumber}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">{doc.specialty}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 italic">
                  "{doc.bio}"
                </p>

                {/* Affiliated Organizations */}
                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Affiliated Facilities ({doc.organizations.length}):
                  </div>
                  {doc.organizations.map(org => (
                    <div 
                      key={org.id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/60 border border-slate-700/60"
                    >
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: org.color }}
                        />
                        <span className="font-medium text-slate-200">{org.shortName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{org.timeSlot.split(' - ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleLaunchWithDoctor(doc.id)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-all flex items-center justify-center space-x-2 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
              >
                <span>Launch {doc.name.split(',')[0]} Session</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Deep-Dive & Architecture Showcase */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Cross-Organization Data Mesh
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              How Patient Vikram's Multi-Clinic Journey Works
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              See how a single patient is treated across 3 separate organizations by Dr. Sarah Chen, with zero data loss or duplicate tests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Facility 1: Private Chamber
              </div>
              <div className="text-xs font-semibold text-slate-400">Step 1 • Aug 15, 2026</div>
              <h4 className="text-base font-bold text-white mt-1 mb-2">Initial Angina Presentation</h4>
              <p className="text-xs text-slate-400 mb-4">
                Vikram consults Dr. Chen at Chen Advanced Heart Clinic for exertional chest tightness. ECG shows anterolateral ischemia.
              </p>
              <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-slate-300">
                <div>• Initial Dx: Unstable Angina (I20.0)</div>
                <div>• Prescribed DAPT + High Statin</div>
                <div>• Scheduled Cath Lab at Apollo Grand</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Facility 2: Tertiary Hospital
              </div>
              <div className="text-xs font-semibold text-slate-400">Step 2 • Aug 20, 2026</div>
              <h4 className="text-base font-bold text-white mt-1 mb-2">Angioplasty & DES Stent</h4>
              <p className="text-xs text-slate-400 mb-4">
                Dr. Chen operates at Apollo Grand Multispeciality Hospital. Mid-LAD 85% lesion opened with Everolimus DES stent.
              </p>
              <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-slate-300">
                <div>• Procedure: Right Radial PCI</div>
                <div>• Angiogram film linked to EHR</div>
                <div>• Re-directed to St. Jude for Rehab</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
              <div className="absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Facility 3: Rehab Institute
              </div>
              <div className="text-xs font-semibold text-slate-400">Step 3 • Sep 15, 2026</div>
              <h4 className="text-base font-bold text-white mt-1 mb-2">Stress Echo & Cardiac Rehab</h4>
              <p className="text-xs text-slate-400 mb-4">
                Patient attends Phase II cardiac rehab at St. Jude Heart Institute. 8.5 METs achieved on submaximal Bruce protocol.
              </p>
              <div className="space-y-1.5 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800 font-mono text-slate-300">
                <div>• Stress Echo: LVEF 58% Normal</div>
                <div>• Zero inducible ischemia</div>
                <div>• Follow-up review scheduled tonight!</div>
              </div>
            </div>

          </div>

          <div className="mt-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-300 font-medium">
            ✨ Tonight at Dr. Chen's chamber (Token #1 in the MVP), Dr. Chen pulls up Vikram's entire journey across all three facilities seamlessly in under 1 second!
          </div>
        </div>
      </section>

      {/* Security, Privacy & Compliance Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Cryptographic Security & Consistency
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
                Enterprise Data Privacy Without Organization Overreach
              </h2>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                Hospital administrators often fear that a doctor will leak patient data to a rival clinic. DocPulse 360 enforces rigorous Attribute-Based Access Control (ABAC) and patient-mediated consent:
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">ABDM / Ayushman Bharat Digital Mission:</strong> Fully compliant with M1 (ABHA creation), M2 (Health record viewing), and M3 (Consent manager).
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Immutable Audit Vault:</strong> Every single record access, prescription issue, or history view generates an IP, device, and timestamped forensic ledger.
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Allergy & Drug-Drug Safety Guard:</strong> Automated cross-facility prescription checking blocks contraindicated medications (e.g. flagging Aspirin in allergic patients).
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Security Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Live Forensic Security Feed</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AES-256 GCM
                </span>
              </div>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>AUTH_TOKEN #9012</span>
                    <span>19:15:30</span>
                  </div>
                  <div className="text-emerald-400 font-semibold mt-0.5">VIEW_CROSS_ORG_HISTORY</div>
                  <div className="text-[10px] text-slate-400">Dr. Sarah Chen accessed Apollo Grand cath lab report with ABHA consent.</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>DRUG_GUARD #4419</span>
                    <span>18:45:10</span>
                  </div>
                  <div className="text-amber-400 font-semibold mt-0.5">ALLERGY_ALERT_DISARMED</div>
                  <div className="text-[10px] text-slate-400">Apixaban chosen instead of Aspirin for patient Marcus Vance.</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>GEO_FENCE #402</span>
                    <span>18:30:00</span>
                  </div>
                  <div className="text-cyan-400 font-semibold mt-0.5">TRAVEL_BUFFER_CLEARED</div>
                  <div className="text-[10px] text-slate-400">Doctor transit verified: Apollo -&gt; Chen Clinic (32 mins elapsed).</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to test the doctor's command center?
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-2xl mx-auto">
            Explore live triage tokens, review cross-facility angiograms and prescriptions, and experience zero-conflict scheduling.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transform hover:-translate-y-0.5 transition-all flex items-center space-x-2"
            >
              <span>Enter Doctor Dashboard MVP</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>DocPulse 360 • Re-engineered Practo Practice OS for Physicians & Multi-Facility Consultants</p>
        <p className="mt-1 font-mono text-[11px] text-slate-600">
          Deployed via GitHub Pages • Responsive across Mobile, Tablet, and Desktop
        </p>
      </footer>
    </div>
  );
};
