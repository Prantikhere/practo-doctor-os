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
  Home, 
  RefreshCw,
  Clock,
  Sparkles
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
    resetAllDemoData
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const selectedOrg = selectedOrgId === 'all' 
    ? null 
    : currentDoctor.organizations.find(o => o.id === selectedOrgId);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Back to Landing */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 group focus:outline-none"
              title="Return to Concept Overview"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    DocPulse<span className="text-emerald-400">360</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Doctor OS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-none">Reimagined Practo for Doctors</p>
              </div>
            </button>

            {/* View Landing Toggle */}
            <button
              onClick={() => setCurrentView(currentView === 'landing' ? 'dashboard' : 'landing')}
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'landing'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{currentView === 'landing' ? 'Back to App MVP' : 'Concept & Pitch'}</span>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          {currentView !== 'landing' && (
            <nav className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Today's Queue</span>
              </button>

              <button
                onClick={() => setCurrentView('patients')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'patients'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Patient Longitudinal EHR</span>
              </button>

              <button
                onClick={() => setCurrentView('schedule')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'schedule'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Multi-Org Schedule</span>
              </button>

              <button
                onClick={() => setCurrentView('consultation')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'consultation'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Rx Workspace</span>
              </button>

              <button
                onClick={() => setCurrentView('conflicts')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium relative transition-all ${
                  currentView === 'conflicts'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Schedule Conflicts</span>
                {conflictAlerts.length > 0 && (
                  <span className="w-4 h-4 text-[10px] bg-amber-500 text-slate-950 rounded-full font-bold flex items-center justify-center">
                    {conflictAlerts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('security')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'security'
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>HIPAA & Audit</span>
              </button>
            </nav>
          )}

          {/* Right Controls: Org Switcher & Doctor Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Global Search (Desktop) */}
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
                  className="w-full bg-slate-800/70 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}

            {/* Active Organization Switcher */}
            {currentView !== 'landing' && (
              <div className="relative">
                <button
                  onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 hover:border-slate-600 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors focus:outline-none"
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[120px] sm:max-w-[150px] truncate">
                    {selectedOrg ? selectedOrg.shortName : 'All Organizations'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isOrgDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-700/70">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Practice Organization Scope
                      </p>
                      <p className="text-xs text-slate-300">Switch clinic or see cross-org unified</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrgId('all');
                        setIsOrgDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition-colors ${
                        selectedOrgId === 'all' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div>Unified Cross-Org View</div>
                          <div className="text-[10px] text-slate-400">All 3 clinics & hospitals consolidated</div>
                        </div>
                      </div>
                      {selectedOrgId === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>

                    {currentDoctor.organizations.map(org => (
                      <button
                        key={org.id}
                        onClick={() => {
                          setSelectedOrgId(org.id);
                          setIsOrgDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition-colors ${
                          selectedOrgId === org.id ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: org.color }}
                          />
                          <div>
                            <div className="font-medium text-slate-200">{org.name}</div>
                            <div className="text-[10px] text-slate-400">{org.roomNumber} • {org.timeSlot}</div>
                          </div>
                        </div>
                        {selectedOrgId === org.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Doctor Session Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                className="flex items-center space-x-2 bg-gradient-to-r from-slate-800 to-slate-800/60 border border-slate-700 hover:border-emerald-500/40 rounded-xl px-2.5 py-1 text-xs text-slate-200 transition-all focus:outline-none"
              >
                <img
                  src={currentDoctor.avatar}
                  alt={currentDoctor.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/50"
                />
                <div className="hidden sm:block text-left">
                  <div className="font-semibold text-white leading-tight">{currentDoctor.name}</div>
                  <div className="text-[10px] text-emerald-400 leading-tight">{currentDoctor.specialty.split('&')[0]}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isDocDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-700/70">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Active Doctor Demo
                    </p>
                    <p className="text-xs text-slate-300">Pre-configured multi-consultancy profiles</p>
                  </div>

                  {MOCK_DOCTORS.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        switchDoctor(doc.id);
                        setIsDocDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs flex items-center space-x-3 hover:bg-slate-700/70 transition-colors ${
                        currentDoctor.id === doc.id ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : ''
                      }`}
                    >
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-100 truncate">{doc.name}</div>
                        <div className="text-[11px] text-emerald-400 truncate">{doc.specialty}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {doc.organizations.length} Organizations ({doc.organizations.map(o => o.shortName).join(', ')})
                        </div>
                      </div>
                    </button>
                  ))}

                  <div className="p-2 border-t border-slate-700/70 mt-1">
                    <button
                      onClick={() => {
                        resetAllDemoData();
                        setIsDocDropdownOpen(false);
                      }}
                      className="w-full py-1.5 text-center text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Navigation</span>
            <button
              onClick={() => {
                setCurrentView(currentView === 'landing' ? 'dashboard' : 'landing');
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-emerald-400 font-semibold"
            >
              {currentView === 'landing' ? 'Open Doctor MVP App' : 'View Concept Landing'}
            </button>
          </div>

          <button
            onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm ${
              currentView === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Today's Live Queue</span>
          </button>

          <button
            onClick={() => { setCurrentView('patients'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm ${
              currentView === 'patients' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patient Longitudinal EHR</span>
          </button>

          <button
            onClick={() => { setCurrentView('schedule'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm ${
              currentView === 'schedule' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Multi-Org Schedule</span>
          </button>

          <button
            onClick={() => { setCurrentView('consultation'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm ${
              currentView === 'consultation' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-300'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Rx Consultation Workspace</span>
          </button>

          <button
            onClick={() => { setCurrentView('conflicts'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm ${
              currentView === 'conflicts' ? 'bg-amber-500/20 text-amber-400 font-medium' : 'text-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Schedule Conflicts ({conflictAlerts.length})</span>
          </button>

          <button
            onClick={() => { setCurrentView('security'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm ${
              currentView === 'security' ? 'bg-purple-500/20 text-purple-400 font-medium' : 'text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>HIPAA Audit & Consent Ledger</span>
          </button>
        </div>
      )}
    </header>
  );
};
