# DocPulse 360 | Practo for Doctors OS

> **The Unified Multi-Organization Practice & Longitudinal Patient Care Platform for Doctors**  
> *Reverse-engineered and reconstructed following the REA methodology.*

[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-success?style=flat-square&logo=github)](https://prantikhere.github.io/practo-doctor-os/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)
[![Compliance](https://img.shields.io/badge/Compliance-HIPAA%20%7C%20ABDM%20M1--M3-purple?style=flat-square)](https://prantikhere.github.io/practo-doctor-os/#security)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan?style=flat-square&logo=react)](https://react.dev/)

---

## 🎯 The Core Concept & Reverse-Engineered Paradigm Shift

Existing healthcare platforms like **Practo** were built primarily around the **patient discovery experience**: searching doctors, booking slots, and ordering pharmaceuticals.

However, modern physicians face a fundamentally different operational reality:
- **Multi-Facility Mobility:** Top specialists rarely sit in one clinic. They conduct morning OPD at a tertiary hospital, perform afternoon surgical procedures at a vascular center, and consult at private chambers or via telehealth in the evening.
- **Siloed Patient Records:** When patient *Vikram Malhotra* attends Dr. Sarah Chen's private clinic, his coronary angiogram and stent placement data from Apollo Grand Hospital and cardiac stress echo results from St. Jude Vascular Institute are trapped in disconnected hospital EMRs.
- **Commute & Scheduling Collisions:** Doctors are frequently double-booked or left with unrealistic 15-minute commute windows across congested city traffic.
- **Compliance Friction:** Cross-organization record sharing without cryptographic patient consent triggers severe legal liabilities under HIPAA, GDPR, and the DPDP Act.

**DocPulse 360** reverses the architecture: instead of patients booking silos, **doctors log in to a unified clinical command center** that follows them across all their institutions with zero data fragmentation.

---

## 🚀 Key Architectural Innovations

### 1. Multi-Organization Practice Scope Switcher
- Instantly toggle between individual hospital accounts or view a **Unified Cross-Org Care Mesh**.
- Color-coded facility ribbons and dedicated fee schedules per organization.

### 2. Universal Longitudinal Patient EHR
- Tracks the patient across multiple facilities attended by the doctor.
- Chronological timeline capturing previous hospital admissions, surgical videos, cath-lab reports, ECGs, vitals progression, and digital SOAP notes.
- Prominent **Drug Allergy Safeguards** that prevent contraindicated prescribing.

### 3. Intelligent Commute Buffer & Collision Detection
- Live transit telemetry calculating travel time between hospital affiliations.
- Early warning system flagging overlapping OPD shifts and impossible transitions (e.g., 38-minute drive across Outer Ring Road with only 30 minutes between appointments).
- Configurable minimum buffer guard (15 to 60 mins) that auto-protects booking engines.

### 4. Real-Time OPD Triage & Live Consultation Queue
- Dynamic status tracking: `Waiting`, `In-Consultation`, `Scheduled`, `Completed`.
- One-click call patient, live vitals recording, and clinical note generator.

### 5. Digital Prescription (Rx) & SOAP Documentation
- Pre-loaded clinical follow-up templates (e.g., Post-PCI Secondary Prevention).
- Real-time allergy interception (e.g., blocks Penicillin or Aspirin if patient profile has a documented allergy).
- Formal printable prescription generator with Doctor Registration Number, Clinic Letterhead, Digital Cryptographic Signature, and Verification QR Stamp.

### 6. HIPAA, ABDM & Forensic Audit Vault
- Fully compliant with **Ayushman Bharat Digital Mission (ABDM)** M1 (ABHA identity), M2 (Health Information Provider/User), and M3 (Consent Manager).
- Real-time immutable audit trail recording every medical chart view, prescription write, and consent override.

---

## 🩺 Interactive Pre-Configured Doctor Personas

The MVP includes 3 fully functional dummy sessions with authentic clinical histories:

| Doctor | Specialty | Affiliated Facilities | Key Clinical Scenario |
|---|---|---|---|
| **Dr. Sarah Chen, MD, DM** | Interventional Cardiology | • Apollo Grand Multispeciality<br>• St. Jude Vascular Institute<br>• Chen Advanced Heart Clinic | Follows *Vikram Malhotra* across Private Clinic (Angina) ➔ Apollo Grand (Angioplasty & DES Stent) ➔ St. Jude (Cardiac Rehab & Stress Echo) ➔ Tonight's 3-month review. |
| **Dr. Rajesh Varma, MS, MCh** | Orthopedic & Joint Surgery | • City Care Trauma Hospital<br>• Apex Sports Medicine<br>• TeleHealth Network | Manages surgical joint replacements and sports rehabilitation across trauma centers. |
| **Dr. Elena Rostova, MD** | Pediatric Care & Neonatology | • Metro Children's Hospital<br>• Sunshine Pediatric Clinic | Coordinates infant developmental screening and immunization schedules across regional centers. |

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling & Design System:** Tailwind CSS with custom medical theme & glassmorphism
- **Iconography:** Lucide React
- **Build Tool:** Vite 5 (Sub-second HMR & optimized production chunking)
- **State Management:** React Context + Optimistic LocalStorage Sync
- **Deployment:** GitHub Pages via GitHub Actions CI/CD

---

## 💻 Local Development Setup

To run DocPulse 360 locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/Prantikhere/practo-doctor-os.git

# 2. Enter workspace directory
cd practo-doctor-os

# 3. Install dependencies
npm install

# 4. Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Live MVP Demo

Experience the live web application on GitHub Pages:  
👉 **[https://prantikhere.github.io/practo-doctor-os/](https://prantikhere.github.io/practo-doctor-os/)**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
