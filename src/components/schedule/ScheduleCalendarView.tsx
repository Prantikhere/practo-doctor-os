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
  MapPin, 
  AlertCircle
} from 'lucide-react';
import { ClinicalVisit } from '../../types';

export const ScheduleCalendarView: React.FC = () => {
  const { 
    currentDoctor, 
    visits, 
    doctorPatients, 
    addNewVisit, 
    conflictAlerts,
    setSelectedPatient,
    setCurrentView
  } = useApp();

  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [activeDate, setActiveDate] = useState<string>('2026-10-29');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const docVisits = visits.filter(v => v.doctorId === currentDoctor.id);

  const dayVisits = docVisits.filter(v => {
    if (v.date !== activeDate) return false;
    if (selectedFacilityId !== 'all' && v.organizationId !== selectedFacilityId) return false;
    return true;
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Form State
  const [bookPatientId, setBookPatientId] = useState(doctorPatients[0]?.id || '');
  const [bookOrgId, setBookOrgId] = useState(currentDoctor.organizations[0]?.id || '');
  const [bookDate, setBookDate] = useState('2026-10-30');
  const [bookTime, setBookTime] = useState('10:00 AM');
  const [bookType, setBookType] = useState<ClinicalVisit['visitType']>('In-person');
  const [bookComplaint, setBookComplaint] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const checkConflict = (date: string, time: string, orgId: string) => {
    const existing = docVisits.find(v => v.date === date && v.organizationId !== orgId);
    if (existing) {
      setConflictWarning(`Notice: You already have appointments booked at ${existing.organizationName} on this date. Allow travel buffer!`);
    } else {
      setConflictWarning(null);
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrg = currentDoctor.organizations.find(o => o.id === bookOrgId) || currentDoctor.organizations[0];

    addNewVisit({
      patientId: bookPatientId,
      doctorId: currentDoctor.id,
      organizationId: targetOrg.id,
      organizationName: targetOrg.name,
      date: bookDate,
      time: bookTime,
      visitType: bookType,
      status: 'Scheduled',
      chiefComplaint: bookComplaint || 'Routine clinical follow-up',
      vitals: {
        bp: '120/80',
        pulse: 72,
        temp: '98.6 °F',
        spO2: 99,
        weight: '68 kg',
        height: '170 cm',
        bmi: '23.5',
      },
      soap: { subjective: '', objective: '', assessment: '', plan: '' },
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
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <Calendar className="w-4 h-4" />
            <span>Master Schedule & Schedulers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Cross-Clinic Scheduling & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track appointments across hospital duty, specialty clinics, and private chambers
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Transit Collision Warning Banner */}
      {conflictAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">
              Active Transit Collision Alert ({conflictAlerts[0].date})
            </div>
            <p className="mt-0.5 text-slate-700 dark:text-slate-300">
              {conflictAlerts[0].message}
            </p>
            <div className="mt-1.5 flex items-center space-x-3 text-[11px] font-mono text-amber-700 dark:text-amber-400">
              <span>Estimated Commute: {conflictAlerts[0].commuteEstimate}</span>
              <span>•</span>
              <span>Severity: {conflictAlerts[0].severity}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Date Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Clinic Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold mr-1">Clinic:</span>
          
          <button
            onClick={() => setSelectedFacilityId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFacilityId === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Clinics Combined
          </button>

          {currentDoctor.organizations.map(org => (
            <button
              key={org.id}
              onClick={() => setSelectedFacilityId(org.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedFacilityId === org.id
                  ? 'bg-white dark:bg-slate-800 border-sky-600 text-sky-700 dark:text-sky-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
              <span>{org.shortName}</span>
            </button>
          ))}
        </div>

        {/* Date Navigator */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button 
            onClick={() => {
              const d = new Date(activeDate);
              d.setDate(d.getDate() - 1);
              setActiveDate(d.toISOString().split('T')[0]);
            }}
            className="p-1 hover:text-slate-900 text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold text-slate-900 dark:text-white px-2">
            {activeDate === '2026-10-29' ? 'Today, Oct 29, 2026' : activeDate}
          </span>

          <button 
            onClick={() => {
              const d = new Date(activeDate);
              d.setDate(d.getDate() + 1);
              setActiveDate(d.toISOString().split('T')[0]);
            }}
            className="p-1 hover:text-slate-900 text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {activeDate !== '2026-10-29' && (
            <button
              onClick={() => setActiveDate('2026-10-29')}
              className="ml-2 text-[10px] text-sky-600 font-bold hover:underline"
            >
              Today
            </button>
          )}
        </div>

      </div>

      {/* Appointment Slots */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Appointments on {activeDate} ({dayVisits.length} booked)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {selectedFacilityId === 'all' ? 'All Clinics View' : 'Single Clinic'}
          </span>
        </div>

        {dayVisits.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No appointments scheduled for this date</p>
            <p className="text-xs text-slate-400 mt-0.5">Click "Book Appointment" to add a new slot.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayVisits.map(visit => {
              const pat = doctorPatients.find(p => p.id === visit.patientId);
              return (
                <div
                  key={visit.id}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-center min-w-[85px] flex-shrink-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{visit.time}</div>
                      <div className="text-[10px] text-slate-500">Token #{visit.tokenNumber}</div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 
                          onClick={() => {
                            setSelectedPatient(pat || null);
                            setCurrentView('patients');
                          }}
                          className="font-bold text-slate-900 dark:text-white text-sm hover:text-sky-600 cursor-pointer"
                        >
                          {pat?.name}
                        </h4>
                        <span className="text-xs text-slate-500">({pat?.gender}, {pat?.age}y)</span>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          visit.status === 'Completed'
                            ? 'bg-slate-100 text-slate-600'
                            : visit.status === 'In-Consultation'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {visit.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-sky-600" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{visit.organizationName}</span>
                        <span>•</span>
                        <span>{visit.visitType}</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 italic">
                        "{visit.chiefComplaint}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-center">
                    <button
                      onClick={() => {
                        setSelectedPatient(pat || null);
                        setCurrentView('patients');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
                    >
                      Patient Chart
                    </button>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                      Fee: ₹{visit.fee}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Book Appointment</h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Select Patient *</label>
                <select
                  value={bookPatientId}
                  onChange={(e) => setBookPatientId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                >
                  {doctorPatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Clinic / Hospital *</label>
                <select
                  value={bookOrgId}
                  onChange={(e) => {
                    setBookOrgId(e.target.value);
                    checkConflict(bookDate, bookTime, e.target.value);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
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
                  <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => {
                      setBookDate(e.target.value);
                      checkConflict(e.target.value, bookTime, bookOrgId);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    value={bookTime}
                    onChange={(e) => {
                      setBookTime(e.target.value);
                      checkConflict(bookDate, e.target.value, bookOrgId);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Visit Type</label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                >
                  <option value="In-person">In-person Consultation</option>
                  <option value="Follow-up">Follow-up Review</option>
                  <option value="Telehealth">Telehealth Video</option>
                  <option value="Procedure">Surgical / Clinical Procedure</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">Reason for Visit</label>
                <textarea
                  rows={2}
                  placeholder="Notes..."
                  value={bookComplaint}
                  onChange={(e) => setBookComplaint(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                />
              </div>

              {conflictWarning && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                  {conflictWarning}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
