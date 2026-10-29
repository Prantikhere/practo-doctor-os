export type OrgType = 'hospital' | 'clinic' | 'telehealth' | 'private_practice';

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  type: OrgType;
  address: string;
  city: string;
  color: string;
  badgeColor: string;
  consultancyFee: number;
  roomNumber: string;
  scheduleDays: string[];
  timeSlot: string;
  phone: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  registrationNumber: string;
  email: string;
  phone: string;
  avatar: string;
  experience: string;
  bio: string;
  organizations: Organization[];
  defaultOrgId: string;
}

export interface Vitals {
  bp: string; // "120/80"
  pulse: number; // 72
  temp: string; // "98.6 °F"
  spO2: number; // 99
  weight: string; // "68 kg"
  height: string; // "172 cm"
  bmi: string; // "23.0"
}

export interface PrescriptionItem {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  warnings?: string;
}

export interface LabReportItem {
  id: string;
  testName: string;
  category: 'Blood' | 'Cardiology' | 'Radiology' | 'Pathology' | 'Orthopedics' | 'Pediatrics';
  date: string;
  organizationName: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  value: string;
  referenceRange: string;
  notes: string;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export type VisitStatus = 'Scheduled' | 'Waiting' | 'In-Consultation' | 'Completed' | 'Delayed' | 'Cancelled';

export interface ClinicalVisit {
  id: string;
  patientId: string;
  doctorId: string;
  organizationId: string;
  organizationName: string;
  date: string; // YYYY-MM-DD
  time: string; // "09:30 AM"
  tokenNumber: number;
  visitType: 'In-person' | 'Follow-up' | 'Emergency' | 'Telehealth' | 'Procedure';
  status: VisitStatus;
  chiefComplaint: string;
  vitals: Vitals;
  soap: SOAPNote;
  diagnoses: { code: string; label: string }[];
  prescriptions: PrescriptionItem[];
  labReports: LabReportItem[];
  fee: number;
  isPaid: boolean;
  followUpDate?: string;
  clinicalNotes?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  abhaId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  consentStatus: 'GRANTED_ALL' | 'RESTRICTED_ATTENDING' | 'EMERGENCY_OVERRIDE';
  consentExpiresAt: string;
  registeredDate: string;
  primaryDoctorId?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  doctorId: string;
  doctorName: string;
  patientId?: string;
  patientName?: string;
  organizationId: string;
  organizationName: string;
  action: 'VIEW_CROSS_ORG_HISTORY' | 'CREATE_PRESCRIPTION' | 'START_CONSULTATION' | 'COMPLETE_VISIT' | 'CONSENT_OVERRIDE' | 'EXPORT_EHR' | 'UPDATE_VITALS';
  ipAddress: string;
  device: string;
  details: string;
}

export interface ConflictAlert {
  id: string;
  doctorId: string;
  date: string;
  timeRange: string;
  orgA: { name: string; slot: string };
  orgB: { name: string; slot: string };
  commuteEstimate: string;
  severity: 'HIGH' | 'MEDIUM';
  message: string;
}
