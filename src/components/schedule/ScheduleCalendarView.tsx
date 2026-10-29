import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Building2, 
  AlertTriangle, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Video, 
  UserCheck, 
  Sparkles,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { ClinicalVisit, Organization } from '../../types';

export const ScheduleCalendarView: React.FC = () => {
  const { 
    currentDoctor, 
    visits, 
    patients, 
    addNewVisit, 
    conflictAlerts,
    setSelectedPatient,
    setCurrentView
  } = useApp();

  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [activeDate, setActiveDate] = useState<string>('2026-10-29'); // Current demo date
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Filter visits for current doctor
  const docVisits = visits.filter(v => v.doctorId === currentDoctor.id);

  // Filter visits for active date and facility
  const dayVisits = docVisits.filter(v => {
    if (v.date !== activeDate) return false;
    if (selectedFacilityId !== 'all' && v.organizationId !== selectedFacilityId) return false;
    return true;
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Form State for Booking
  const [bookPatientId, setBookPatientId] = useState(patients[0]?.id || '');
  const [bookOrgId, setBookOrgId] = useState(currentDoctor.organizations[0]?.id || '');
  const [bookDate, setBookDate] = useState('2026-10-30');
  const [bookTime, setBookTime] = useState('10:00 AM');
  const [bookType, setBookType] = useState<ClinicalVisit['visitType']>('In-person');
  const [bookComplaint, setBookComplaint] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const checkConflict = (date: string, time: string, orgId: string) => {
    // Check if another visit exists within same day at another org around same time
    const existing = docVisits.find(v => v.date === date && v.organizationId !== orgId);
    if (existing) {
      setConflictWarning(`Notice: You already have appointments booked at ${existing.organizationName} on ${date}. Ensure adequate travel buffer!`);
    } else {
      setConflictWarning(null);
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrg = currentDoctor.organizations.find(o => o.id === bookOrgId) || currentDoctor.organizations[0];
    const pat = patients.find(p => p.id === bookPatientId);

    addNewVisit({
      patientId: bookPatientId,
      doctorId: currentDoctor.id,
      organizationId: targetOrg.id,
      organizationName: targetOrg.name,
      date: bookDate,
      time: bookTime,
      visitType: bookType,
      status: 'Scheduled',
      chiefComplaint: bookComplaint || 'Routine medical evaluation',
      vitals: {
        bp: '120/80',
        pulse: 72,
        temp: '98.6 °F',
        spO2: 99,
        weight: '70 kg',
        height: '170 cm',
        bmi: '24.2',
      },
      soap: {
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
      },
      diagnoses: [],
      prescriptions: [],
      labReports: [],
      fee: targetOrg.consultancyFee,
      isPaid: false,
    });

    setIsBookModalOpen(false);
    setActiveDate(bookDate);
    setBookComplaint('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <Calendar className="w-4 h-4" />
            <span>Multi-Organization Master Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Cross-Facility Scheduling & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Coordinate hospital duty, outpatient clinics, and private consultations with intelligent commute buffering
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Transit Collision Alert Banner */}
      {conflictAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-amber-300">
              Active Schedule Collision Warning ({conflictAlerts[0].date})
            </div>
            <p className="mt-1 text-slate-300">
              {conflictAlerts[0].message}
            </p>
            <div className="mt-2 flex items-center space-x-3 text-[11px] font-mono text-amber-400">
              <span>Commute: {conflictAlerts[0].commuteEstimate}</span>
              <span>•</span>
              <span>Severity: {conflictAlerts[0].severity}</span>
            </div>
          </div>
        </div>
      )}

      {/* Facility Filter Pills & Date Picker */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Facility Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Facility Filter:</span>
          
          <button
            onClick={() => setSelectedFacilityId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFacilityId === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Facilities (Unified)
          </button>

          {currentDoctor.organizations.map(org => (
            <button
              key={org.id}
              onClick={() => setSelectedFacilityId(org.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFacilityId === org.id
                  ? 'bg-slate-100 text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
              <span>{org.shortName}</span>
            </button>
          ))}
        </div>

        {/* Date Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <button 
            onClick={() => {
              const d = new Date(activeDate);
              d.setDate(d.getDate() - 1);
              setActiveDate(d.toISOString().split('T')[0]);
            }}
            className="p-1 hover:text-white text-slate-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold text-white px-2">
            {activeDate === '2026-10-29' ? 'Today, Oct 29, 2026' : activeDate}
          </span>

          <button 
            onClick={() => {
              const d = new Date(activeDate);
              d.setDate(d.getDate() + 1);
              setActiveDate(d.toISOString().split('T')[0]);
            }}
            className="p-1 hover:text-white text-slate-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {activeDate !== '2026-10-29' && (
            <button
              onClick={() => setActiveDate('2026-10-29')}
              className="ml-2 text-[10px] text-emerald-400 hover:underline"
            >
              Jump to Today
            </button>
          )}
        </div>

      </div>

      {/* Daily Master Schedule List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Appointments & Sessions for {activeDate} ({dayVisits.length} slots)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {selectedFacilityId === 'all' ? 'Unified Across All Facilities' : 'Filtered Facility'}
          </span>
        </div>

        {dayVisits.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Calendar className="w-12 h-12 mx-auto text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-400">No appointments scheduled on this date.</p>
            <p className="text-xs text-slate-600 mt-1">Click "Book New Appointment" to assign a patient slot.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayVisits.map((visit) => {
              const pat = patients.find(p => p.id === visit.patientId);
              return (
                <div
                  key={visit.id}
                  className="bg-slate-950 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Time Slot Pill */}
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center min-w-[85px] flex-shrink-0">
                      <div className="text-xs font-bold text-white">{visit.time}</div>
                      <div className="text-[10px] text-slate-400">Token #{visit.tokenNumber}</div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 
                          onClick={() => {
                            setSelectedPatient(pat || null);
                            setCurrentView('patients');
                          }}
                          className="font-bold text-white text-sm hover:text-emerald-400 cursor-pointer"
                        >
                          {pat?.name || 'Walk-in Patient'}
                        </h4>
                        <span className="text-xs text-slate-400">({pat?.gender}, {pat?.age}y)</span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          visit.status === 'Completed'
                            ? 'bg-slate-800 text-slate-400'
                            : visit.status === 'In-Consultation'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {visit.status}
                        </span>
                      </div>

                      {/* Organization & Room Info */}
                      <div className="flex items-center space-x-2 mt-1 text-xs text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-300 font-medium">{visit.organizationName}</span>
                        <span>•</span>
                        <span className="text-slate-400">{visit.visitType}</span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic">
                        "{visit.chiefComplaint}"
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <button
                      onClick={() => {
                        setSelectedPatient(pat || null);
                        setCurrentView('patients');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Patient EHR
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      Fee: ₹{visit.fee}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Book New Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Book New Appointment</h3>
              <button 
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Patient *</label>
                <select
                  value={bookPatientId}
                  onChange={(e) => setBookPatientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Facility *</label>
                <select
                  value={bookOrgId}
                  onChange={(e) => {
                    setBookOrgId(e.target.value);
                    checkConflict(bookDate, bookTime, e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  {currentDoctor.organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.timeSlot})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => {
                      setBookDate(e.target.value);
                      checkConflict(e.target.value, bookTime, bookOrgId);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={bookTime}
                    onChange={(e) => {
                      setBookTime(e.target.value);
                      checkConflict(bookDate, e.target.value, bookOrgId);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Visit Type</label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="In-person">In-person Consultation</option>
                  <option value="Follow-up">Follow-up Review</option>
                  <option value="Telehealth">Video Telehealth</option>
                  <option value="Procedure">Surgical / Cath-Lab Procedure</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Chief Complaint / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Reason for visit..."
                  value={bookComplaint}
                  onChange={(e) => setBookComplaint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              {conflictWarning && (
                <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px]">
                  {conflictWarning}
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
