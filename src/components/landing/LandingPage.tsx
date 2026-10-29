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
  Clock, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  Activity,
  Heart,
  FileText,
  MapPin,
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, switchDoctor } = useApp();

  const handleLaunchDoctor = (docId: string) => {
    switchDoctor(docId);
    setCurrentView('dashboard');
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Top Banner */}
      <div className="bg-sky-50 dark:bg-sky-950/60 border-b border-sky-100 dark:border-sky-900/60 py-2.5 px-4 text-center text-xs text-sky-800 dark:text-sky-300 font-medium">
        <span>
          <strong>Practo for Doctors Reimagined:</strong> The unified practice operating system for physicians visiting multiple hospitals, clinics, and chambers.
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Multi-Clinic Practice Operating System
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            You consult at multiple hospitals.{' '}
            <span className="text-sky-600 dark:text-sky-400">
              Your patient records should follow you.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate portal juggling, avoid scheduling collisions across clinics, and pull up any patient's complete cross-hospital medical history in under one second.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Launch Live Doctor Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#doctor-demos"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Select Pre-Loaded Doctor Account</span>
              <Users className="w-4 h-4 text-sky-600" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-sky-600">Unified</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Schedule Across Clinics</div>
              <div className="text-[11px] text-slate-500">Auto travel-buffer guard</div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Longitudinal Patient EHR</div>
              <div className="text-[11px] text-slate-500">Cross-facility chart tracking</div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-purple-600">Safe Rx</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Allergy Safeguard</div>
              <div className="text-[11px] text-slate-500">Cross-clinic drug alert check</div>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="text-2xl font-black text-amber-600">Live Triage</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">OPD Queue Tracker</div>
              <div className="text-[11px] text-slate-500">Zero waiting room confusion</div>
            </div>
          </div>

        </div>
      </section>

      {/* The 5 Real-World Doctor Pain Points Solved */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              The Real-World Reality
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Why Doctors Need Their Own Operating System
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
              Consumer healthcare apps treat clinics like isolated silos. We engineered DocPulse 360 around the daily movement of physicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Multi-Organization Schedulers</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Hospital A books you until 1:30 PM, but Clinic B books at 2:00 PM across city traffic. Our <strong>Intelligent Commute Buffer</strong> warns you of transit collisions before patients get delayed.
              </p>
            </div>

            {/* 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Same Patient, Multiple Facilities</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                A patient attends your private clinic for initial consult, gets operated under you at a tertiary hospital, and follows up at your rehab chamber. Access their unified chart anywhere without repeat tests.
              </p>
            </div>

            {/* 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Allergy & Contraindication Defense</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                If a patient is allergic to Penicillin or Aspirin at Clinic A, that critical alert is instantly active when you write an Rx at Hospital B or during a late-night telehealth consult.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 1-Click Interactive Dummy Doctor Profiles (All Accounts Loaded) */}
      <section id="doctor-demos" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Interactive Test Sessions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Test the MVP as Any of the 3 Practicing Doctors
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            Every dummy doctor profile has their own real patients, live queues, past procedures, X-rays/labs, and specific schedule transit alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3.5 mb-3.5">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{doc.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.registrationNumber}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 italic">
                  "{doc.bio}"
                </p>

                <div className="space-y-1.5 mb-5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Affiliated Facilities ({doc.organizations.length}):
                  </div>
                  {doc.organizations.map(org => (
                    <div 
                      key={org.id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{org.shortName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{org.timeSlot.split(' - ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleLaunchDoctor(doc.id)}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Launch {doc.name.split(',')[0]} Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Patient Multi-Hospital Journey Walkthrough */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Clinical Case Study
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              How Patient Vikram Malhotra's Care is Unified
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
              See how Dr. Sarah Chen followed Vikram across 3 separate hospital entities with zero duplicate blood tests or lost angiography films.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                1. Private Chamber (Aug 15)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">Initial Angina Workup</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Consulted for exertional chest tightness. ECG showed T-wave inversion. Admitted to Apollo Grand for emergency angiography.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                2. Apollo Grand Cath Lab (Aug 20)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">Radial PCI & DES Stent</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Dr. Chen deployed an Everolimus DES stent (3.0 x 28 mm) for 85% Mid-LAD lesion. Angiogram film linked to universal EHR.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                3. St. Jude Vascular (Sep 15)
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">Stress Echo & Rehab</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Patient completed 8.5 METs treadmill evaluation (LVEF 58%). Tonight is his 3-month review at Chen Clinic!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 dark:text-slate-400">DocPulse 360 • Reimagined Practo for Doctors</p>
        <p className="mt-1">Multi-Facility Practice Management • Longitudinal EHR • Conflict Prevention</p>
      </footer>

    </div>
  );
};
