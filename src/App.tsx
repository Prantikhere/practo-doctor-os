import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { PatientEHRDirectory } from './components/patients/PatientEHRDirectory';
import { ScheduleCalendarView } from './components/schedule/ScheduleCalendarView';
import { ConsultationWorkspace } from './components/consultation/ConsultationWorkspace';
import { ConflictResolverView } from './components/conflicts/ConflictResolverView';
import { SecurityAuditView } from './components/security/SecurityAuditView';
import { 
  Activity, 
  Users, 
  Calendar, 
  Stethoscope, 
  AlertTriangle, 
  ShieldCheck
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, setCurrentView, conflictAlerts, isDarkMode } = useApp();

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8fafc] text-slate-900'}`}>
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'dashboard' && <DoctorDashboard />}
        {currentView === 'patients' && <PatientEHRDirectory />}
        {currentView === 'schedule' && <ScheduleCalendarView />}
        {currentView === 'consultation' && <ConsultationWorkspace />}
        {currentView === 'conflicts' && <ConflictResolverView />}
        {currentView === 'security' && <SecurityAuditView />}
      </main>

      {/* Mobile Sticky Bottom Bar */}
      {currentView !== 'landing' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              currentView === 'dashboard' ? 'text-sky-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Activity className="w-5 h-5 mb-0.5" />
            <span>Queue</span>
          </button>

          <button
            onClick={() => setCurrentView('patients')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              currentView === 'patients' ? 'text-sky-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span>EHR</span>
          </button>

          <button
            onClick={() => setCurrentView('consultation')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              currentView === 'consultation' ? 'text-sky-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Stethoscope className="w-5 h-5 mb-0.5" />
            <span>Rx</span>
          </button>

          <button
            onClick={() => setCurrentView('schedule')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              currentView === 'schedule' ? 'text-sky-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => setCurrentView('conflicts')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold relative transition-colors ${
              currentView === 'conflicts' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <AlertTriangle className="w-5 h-5 mb-0.5" />
            <span>Transit</span>
            {conflictAlerts.length > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
