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
  Activity, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  RefreshCw,
  Sun,
  Moon,
  Home,
  Check
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    currentDoctor, 
    switchDoctor, 
    selectedOrgId, 
    setSelectedOrgId, 
    conflictAlerts,
    searchQuery,
    setSearchQuery,
    resetAllDemoData,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const selectedOrg = selectedOrgId === 'all' 
    ? null 
    : currentDoctor.organizations.find(o => o.id === selectedOrgId);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Landing Toggle */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 group focus:outline-none text-left"
              title="Return to Concept Overview"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    DocPulse<span className="text-sky-600">360</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">Practo for Doctors</p>
              </div>
            </button>

            {/* Quick View Toggle */}
            <button
              onClick={() => setCurrentView(currentView === 'landing' ? 'dashboard' : 'landing')}
              className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                currentView === 'landing'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{currentView === 'landing' ? 'Open Clinical Workspace' : 'Concept & About'}</span>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          {currentView !== 'landing' && (
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Today's Queue</span>
              </button>

              <button
                onClick={() => setCurrentView('patients')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'patients'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Patient Records (EHR)</span>
              </button>

              <button
                onClick={() => setCurrentView('schedule')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'schedule'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>

              <button
                onClick={() => setCurrentView('consultation')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'consultation'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Write Rx</span>
              </button>

              <button
                onClick={() => setCurrentView('conflicts')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold relative transition-all ${
                  currentView === 'conflicts'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Transit & Conflicts</span>
                {conflictAlerts.length > 0 && (
                  <span className="w-4 h-4 text-[10px] bg-amber-500 text-white rounded-full font-bold flex items-center justify-center">
                    {conflictAlerts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('security')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'security'
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Compliance</span>
              </button>
            </nav>
          )}

          {/* Right Controls: Org Switcher & Doctor Persona Switcher */}
          <div className="flex items-center space-x-2.5">
            
            {/* Global Patient Search (Desktop) */}
            {currentView !== 'landing' && (
              <div className="hidden xl:block relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient / MRN..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'patients') setCurrentView('patients');
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>
            )}

            {/* Active Clinic / Organization Switcher */}
            {currentView !== 'landing' && (
              <div className="relative">
                <button
                  onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors focus:outline-none shadow-sm"
                >
                  <Building2 className="w-3.5 h-3.5 text-sky-600" />
                  <span className="max-w-[110px] sm:max-w-[140px] truncate font-semibold">
                    {selectedOrg ? selectedOrg.shortName : 'All Clinics'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isOrgDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Practice Scope
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Filter by clinic or view combined</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrgId('all');
                        setIsOrgDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                        selectedOrgId === 'all' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-sky-600" />
                        <div>
                          <div>All Facilities (Consolidated)</div>
                          <div className="text-[10px] text-slate-400 font-normal">All shifts & queues merged</div>
                        </div>
                      </div>
                      {selectedOrgId === 'all' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>

                    {currentDoctor.organizations.map(org => (
                      <button
                        key={org.id}
                        onClick={() => {
                          setSelectedOrgId(org.id);
                          setIsOrgDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                          selectedOrgId === org.id ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold' : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: org.color }}
                          />
                          <div>
                            <div className="font-semibold">{org.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{org.roomNumber} • {org.timeSlot}</div>
                          </div>
                        </div>
                        {selectedOrgId === org.id && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Doctor Persona Switcher (Authentic Clinical Profile) */}
            <div className="relative">
              <button
                onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-500/50 rounded-xl px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 transition-all focus:outline-none shadow-sm"
              >
                <img
                  src={currentDoctor.avatar}
                  alt={currentDoctor.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-500/40"
                />
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-slate-900 dark:text-white leading-tight">{currentDoctor.name.split(',')[0]}</div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-medium leading-tight">{currentDoctor.specialty.split('&')[0]}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDocDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700/80">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Doctor Account (Demo Sessions)
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Each profile has full clinical queue & history</p>
                  </div>

                  {MOCK_DOCTORS.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        switchDoctor(doc.id);
                        setIsDocDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors ${
                        currentDoctor.id === doc.id ? 'bg-sky-50 dark:bg-sky-950/40 border-l-4 border-sky-600' : ''
                      }`}
                    >
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</div>
                        <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium truncate">{doc.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {doc.organizations.map(o => o.shortName).join(' • ')}
                        </div>
                      </div>
                    </button>
                  ))}

                  <div className="p-2 border-t border-slate-100 dark:border-slate-700/80 mt-1 flex items-center justify-between">
                    <button
                      onClick={() => {
                        resetAllDemoData();
                        setIsDocDropdownOpen(false);
                      }}
                      className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Data</span>
                    </button>

                    <button
                      onClick={toggleDarkMode}
                      className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      title="Toggle Dark / Light Mode"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'dashboard' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Today's OPD Queue</span>
          </button>

          <button
            onClick={() => { setCurrentView('patients'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'patients' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patient Records (EHR)</span>
          </button>

          <button
            onClick={() => { setCurrentView('schedule'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'schedule' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => { setCurrentView('consultation'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'consultation' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Write Prescription</span>
          </button>

          <button
            onClick={() => { setCurrentView('conflicts'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'conflicts' ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Transit & Conflicts ({conflictAlerts.length})</span>
          </button>

          <button
            onClick={() => { setCurrentView('security'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
              currentView === 'security' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Compliance & Consent</span>
          </button>
        </div>
      )}
    </header>
  );
};
