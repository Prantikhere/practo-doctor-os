import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor, Patient, ClinicalVisit, AuditLog, Organization, ConflictAlert } from '../types';
import { MOCK_DOCTORS, MOCK_PATIENTS, MOCK_CLINICAL_VISITS, MOCK_AUDIT_LOGS, MOCK_CONFLICT_ALERTS } from '../data/mockData';

interface AppContextType {
  // Navigation & View
  currentView: 'landing' | 'dashboard' | 'patients' | 'schedule' | 'consultation' | 'conflicts' | 'security';
  setCurrentView: (view: 'landing' | 'dashboard' | 'patients' | 'schedule' | 'consultation' | 'conflicts' | 'security') => void;
  
  // Doctor Auth & Multi-Org
  currentDoctor: Doctor;
  switchDoctor: (doctorId: string) => void;
  selectedOrgId: string; // 'all' or org-id
  setSelectedOrgId: (orgId: string) => void;
  currentOrganization: Organization | null;
  
  // Data
  patients: Patient[];
  visits: ClinicalVisit[];
  auditLogs: AuditLog[];
  conflictAlerts: ConflictAlert[];
  
  // Active Consultation / Selected Patient
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  activeConsultation: ClinicalVisit | null;
  setActiveConsultation: (visit: ClinicalVisit | null) => void;
  
  // Actions
  startConsultation: (visitId: string) => void;
  completeConsultation: (visitId: string, updatedData?: Partial<ClinicalVisit>) => void;
  updateVisitSOAP: (visitId: string, soap: ClinicalVisit['soap'], notes?: string) => void;
  addPrescriptionToVisit: (visitId: string, prescription: Omit<ClinicalVisit['prescriptions'][0], 'id'>) => void;
  removePrescriptionFromVisit: (visitId: string, prescriptionId: string) => void;
  addNewVisit: (newVisit: Omit<ClinicalVisit, 'id' | 'tokenNumber'>) => void;
  updateVisitStatus: (visitId: string, status: ClinicalVisit['status']) => void;
  addNewPatient: (patient: Omit<Patient, 'id'>) => Patient;
  updatePatientConsent: (patientId: string, status: Patient['consentStatus']) => void;
  
  // Filtered views
  filteredVisits: ClinicalVisit[];
  todayQueue: ClinicalVisit[];
  
  // System actions
  logAuditEvent: (action: AuditLog['action'], details: string, patientId?: string, patientName?: string, orgId?: string, orgName?: string) => void;
  resetAllDemoData: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'docpulse_practo_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check URL hash for initial view (e.g. #app or #landing)
  const getInitialView = (): 'landing' | 'dashboard' => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'app' || hash === 'dashboard') return 'dashboard';
    return 'landing';
  };

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'patients' | 'schedule' | 'consultation' | 'conflicts' | 'security'>(getInitialView());
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}doctor`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_DOCTORS[0];
  });

  const [selectedOrgId, setSelectedOrgId] = useState<string>('all');
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}patients`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_PATIENTS;
  });

  const [visits, setVisits] = useState<ClinicalVisit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}visits`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_CLINICAL_VISITS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}audit`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_AUDIT_LOGS;
  });

  const [conflictAlerts] = useState<ConflictAlert[]>(MOCK_CONFLICT_ALERTS);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(MOCK_PATIENTS[0]);
  const [activeConsultation, setActiveConsultation] = useState<ClinicalVisit | null>(() => {
    return MOCK_CLINICAL_VISITS.find(v => v.status === 'In-Consultation') || null;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}doctor`, JSON.stringify(currentDoctor));
  }, [currentDoctor]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}patients`, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}visits`, JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Keep hash in sync
  useEffect(() => {
    if (currentView === 'landing') {
      window.location.hash = 'landing';
    } else {
      window.location.hash = currentView;
    }
  }, [currentView]);

  const currentOrganization = selectedOrgId === 'all'
    ? null
    : currentDoctor.organizations.find(o => o.id === selectedOrgId) || null;

  const logAuditEvent = (
    action: AuditLog['action'],
    details: string,
    patientId?: string,
    patientName?: string,
    orgId?: string,
    orgName?: string
  ) => {
    const now = new Date();
    const formattedTime = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formattedTime,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      patientId: patientId,
      patientName: patientName,
      organizationId: orgId || selectedOrgId || 'org-unified',
      organizationName: orgName || (selectedOrgId === 'all' ? 'Unified Care Network' : currentDoctor.organizations.find(o => o.id === selectedOrgId)?.name || 'General Clinic'),
      action,
      ipAddress: '192.168.1.104',
      device: window.innerWidth < 768 ? 'Mobile Clinician Client (PWA)' : 'Doctor Chamber Workstation (Desktop)',
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchDoctor = (doctorId: string) => {
    const doc = MOCK_DOCTORS.find(d => d.id === doctorId);
    if (doc) {
      setCurrentDoctor(doc);
      setSelectedOrgId('all');
      logAuditEvent('CONSENT_OVERRIDE', `Switched active doctor session to ${doc.name} (${doc.specialty})`);
    }
  };

  const startConsultation = (visitId: string) => {
    const targetVisit = visits.find(v => v.id === visitId);
    if (!targetVisit) return;

    const patient = patients.find(p => p.id === targetVisit.patientId);
    setSelectedPatient(patient || null);

    const updatedVisits = visits.map(v => {
      if (v.id === visitId) {
        return { ...v, status: 'In-Consultation' as const };
      }
      return v;
    });

    setVisits(updatedVisits);
    const inProgress = updatedVisits.find(v => v.id === visitId) || null;
    setActiveConsultation(inProgress);
    setCurrentView('consultation');

    logAuditEvent(
      'START_CONSULTATION',
      `Called token #${targetVisit.tokenNumber} for active consultation at ${targetVisit.organizationName}`,
      targetVisit.patientId,
      patient?.name,
      targetVisit.organizationId,
      targetVisit.organizationName
    );
  };

  const completeConsultation = (visitId: string, updatedData?: Partial<ClinicalVisit>) => {
    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          ...updatedData,
          status: 'Completed' as const,
        };
      }
      return v;
    }));

    if (activeConsultation?.id === visitId) {
      setActiveConsultation(null);
    }

    const currentV = visits.find(v => v.id === visitId);
    const pat = patients.find(p => p.id === currentV?.patientId);

    logAuditEvent(
      'COMPLETE_VISIT',
      `Completed consultation and locked digital clinical SOAP summary for token #${currentV?.tokenNumber}`,
      currentV?.patientId,
      pat?.name,
      currentV?.organizationId,
      currentV?.organizationName
    );

    setCurrentView('dashboard');
  };

  const updateVisitSOAP = (visitId: string, soap: ClinicalVisit['soap'], notes?: string) => {
    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          soap,
          clinicalNotes: notes !== undefined ? notes : v.clinicalNotes,
        };
      }
      return v;
    }));
    if (activeConsultation?.id === visitId) {
      setActiveConsultation(prev => prev ? { ...prev, soap, clinicalNotes: notes !== undefined ? notes : prev.clinicalNotes } : null);
    }
  };

  const addPrescriptionToVisit = (visitId: string, prescription: Omit<ClinicalVisit['prescriptions'][0], 'id'>) => {
    const newRxItem = {
      ...prescription,
      id: `rx-${Date.now()}`,
    };

    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          prescriptions: [...v.prescriptions, newRxItem],
        };
      }
      return v;
    }));

    if (activeConsultation?.id === visitId) {
      setActiveConsultation(prev => prev ? {
        ...prev,
        prescriptions: [...prev.prescriptions, newRxItem],
      } : null);
    }

    const target = visits.find(v => v.id === visitId);
    const pat = patients.find(p => p.id === target?.patientId);

    logAuditEvent(
      'CREATE_PRESCRIPTION',
      `Prescribed ${prescription.drugName} ${prescription.dosage} (${prescription.frequency})`,
      target?.patientId,
      pat?.name,
      target?.organizationId,
      target?.organizationName
    );
  };

  const removePrescriptionFromVisit = (visitId: string, prescriptionId: string) => {
    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          prescriptions: v.prescriptions.filter(rx => rx.id !== prescriptionId),
        };
      }
      return v;
    }));

    if (activeConsultation?.id === visitId) {
      setActiveConsultation(prev => prev ? {
        ...prev,
        prescriptions: prev.prescriptions.filter(rx => rx.id !== prescriptionId),
      } : null);
    }
  };

  const addNewVisit = (newVisitData: Omit<ClinicalVisit, 'id' | 'tokenNumber'>) => {
    const todayTokens = visits.filter(v => v.date === newVisitData.date).length;
    const newVisit: ClinicalVisit = {
      ...newVisitData,
      id: `vis-${Date.now()}`,
      tokenNumber: todayTokens + 1,
    };

    setVisits(prev => [newVisit, ...prev]);

    const patient = patients.find(p => p.id === newVisit.patientId);
    logAuditEvent(
      'UPDATE_VITALS',
      `Scheduled new appointment for ${patient?.name} at ${newVisit.organizationName}`,
      newVisit.patientId,
      patient?.name,
      newVisit.organizationId,
      newVisit.organizationName
    );
  };

  const updateVisitStatus = (visitId: string, status: ClinicalVisit['status']) => {
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status } : v));
  };

  const addNewPatient = (patientData: Omit<Patient, 'id'>): Patient => {
    const newPat: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
    };
    setPatients(prev => [newPat, ...prev]);
    setSelectedPatient(newPat);

    logAuditEvent(
      'CONSENT_OVERRIDE',
      `Enrolled new patient ${newPat.name} (MRN: ${newPat.mrn}) into Practice Directory with ABHA consent.`,
      newPat.id,
      newPat.name
    );
    return newPat;
  };

  const updatePatientConsent = (patientId: string, status: Patient['consentStatus']) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, consentStatus: status } : p));
    const pat = patients.find(p => p.id === patientId);
    logAuditEvent(
      'CONSENT_OVERRIDE',
      `Updated cross-facility consent status to ${status} for ${pat?.name}`,
      patientId,
      pat?.name
    );
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}doctor`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}patients`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}visits`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}audit`);
    setCurrentDoctor(MOCK_DOCTORS[0]);
    setSelectedOrgId('all');
    setPatients(MOCK_PATIENTS);
    setVisits(MOCK_CLINICAL_VISITS);
    setAuditLogs(MOCK_AUDIT_LOGS);
    setSelectedPatient(MOCK_PATIENTS[0]);
    setActiveConsultation(MOCK_CLINICAL_VISITS.find(v => v.status === 'In-Consultation') || null);
    setCurrentView('dashboard');
  };

  // Filtered views based on doctor and selected organization
  const filteredVisits = visits.filter(v => {
    // Must belong to current doctor
    if (v.doctorId !== currentDoctor.id) return false;
    // Filter by organization if not 'all'
    if (selectedOrgId !== 'all' && v.organizationId !== selectedOrgId) return false;
    return true;
  });

  // Today's visits
  const todayDateStr = '2026-10-29'; // Current demo day
  const todayQueue = filteredVisits.filter(v => v.date === todayDateStr).sort((a, b) => a.tokenNumber - b.tokenNumber);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentDoctor,
        switchDoctor,
        selectedOrgId,
        setSelectedOrgId,
        currentOrganization,
        patients,
        visits,
        auditLogs,
        conflictAlerts,
        selectedPatient,
        setSelectedPatient,
        activeConsultation,
        setActiveConsultation,
        startConsultation,
        completeConsultation,
        updateVisitSOAP,
        addPrescriptionToVisit,
        removePrescriptionFromVisit,
        addNewVisit,
        updateVisitStatus,
        addNewPatient,
        updatePatientConsent,
        filteredVisits,
        todayQueue,
        logAuditEvent,
        resetAllDemoData,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
