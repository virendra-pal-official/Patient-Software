import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronLeft,
  ClipboardList,
  Clock,
  Copy,
  FileEdit,
  FileText,
  HeartPulse,
  Info,
  Languages,
  LayoutDashboard,
  MapPin,
  Menu,
  Mic,
  Printer,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react'
import { api, type PatientRecord } from './services/api.js'
import { MemberNames } from './Members/MemberNames.js'
import './App.css'

type View = 'home' | 'intake' | 'doctor' | 'ayush' | 'about'

export interface DoctorInfo {
  id: string
  name: string
  specialty: string
  room: string
}

export interface TeamMember {
  id: string
  name: string
  initials: string
  role: string
  department: 'DOCTORS' | 'NURSING' | 'ADMIN'
  specialty: string
  room: string
  shift: string
  assignedWork: string
  status: 'Active Duty' | 'In Consultation' | 'On Call' | 'Break'
}

const AVAILABLE_DOCTORS: DoctorInfo[] = [
  { id: 'dr-ananya', name: 'Dr. Ananya Rao', specialty: 'Cardiology & Internal Med', room: 'OPD-102' },
  { id: 'dr-rajesh', name: 'Dr. Rajesh Verma', specialty: 'General Medicine & OPD', room: 'OPD-105' },
  { id: 'dr-priya', name: 'Dr. Priya Sharma', specialty: 'Emergency & Critical Care', room: 'EMERGENCY-01' },
  { id: 'dr-vikram', name: 'Dr. Vikram Sen', specialty: 'AYUSH & Integrative Medicine', room: 'AYUSH-201' },
]

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'm-1',
    name: 'Dr. Ananya Rao',
    initials: 'AR',
    role: 'Chief Cardiologist & Attending Physician',
    department: 'DOCTORS',
    specialty: 'Cardiovascular & Internal Medicine',
    room: 'OPD Room 102',
    shift: 'Morning (08:00 - 14:00)',
    assignedWork: 'Chest Pain & Acute Cardiac Triage Supervision',
    status: 'Active Duty',
  },
  {
    id: 'm-2',
    name: 'Dr. Rajesh Verma',
    initials: 'RV',
    role: 'Senior Consultant',
    department: 'DOCTORS',
    specialty: 'General Medicine & Primary OPD',
    room: 'OPD Room 105',
    shift: 'Morning (08:00 - 14:00)',
    assignedWork: 'General OPD Queue & Chronic Illness Review',
    status: 'In Consultation',
  },
  {
    id: 'm-3',
    name: 'Dr. Priya Sharma',
    initials: 'PS',
    role: 'Emergency Medicine Lead',
    department: 'DOCTORS',
    specialty: 'Emergency & Critical Care Triage',
    room: 'Emergency Bay 01',
    shift: 'Full Day (08:00 - 20:00)',
    assignedWork: 'Red-Flag Emergency Escalation & Resuscitation',
    status: 'On Call',
  },
  {
    id: 'm-4',
    name: 'Dr. Vikram Sen',
    initials: 'VS',
    role: 'AYUSH Consultant',
    department: 'DOCTORS',
    specialty: 'Ayurveda & Integrative Medicine',
    room: 'AYUSH Suite 201',
    shift: 'Day Shift (09:00 - 15:00)',
    assignedWork: 'Prakriti Assessments, Diet & Lifestyle Prescriptions',
    status: 'Active Duty',
  },
  {
    id: 'm-5',
    name: 'Nurse Kavya Nair',
    initials: 'KN',
    role: 'Senior Triage Nurse',
    department: 'NURSING',
    specialty: 'Clinical Triage & Patient Intake',
    room: 'Kiosk Station 01',
    shift: 'Morning (07:30 - 15:30)',
    assignedWork: 'Patient Digital Consent & Kiosk Orientation',
    status: 'Active Duty',
  },
  {
    id: 'm-6',
    name: 'Rahul Deshmukh',
    initials: 'RD',
    role: 'Biomedical & Systems Admin',
    department: 'ADMIN',
    specialty: 'Health Informatics & Hardware Hub',
    room: 'Tech Support Hub',
    shift: 'General (08:00 - 17:00)',
    assignedWork: 'Terminal MK-014 Hardware, OCR Scanners & API Gateways',
    status: 'Active Duty',
  },
]

const INITIAL_QUEUE: PatientRecord[] = [
  {
    id: 'demo-chest',
    name: 'Arjun Mehta',
    initials: 'AM',
    age: 38,
    gender: 'Male',
    language: 'English',
    complaint: 'Chest pain',
    priority: 'URGENT',
    status: 'Pending review',
    time: '09:42',
    tag: 'Breathlessness reported',
    conditions: ['Type 2 Diabetes'],
    medication: 'Metformin 500 mg twice daily',
    assignedDoctor: 'Dr. Ananya Rao',
  },
  {
    id: 'demo-fever',
    name: 'Meera Nair',
    initials: 'MN',
    age: 29,
    gender: 'Female',
    language: 'Hindi',
    complaint: 'Fever',
    priority: 'NORMAL',
    status: 'Ready for consultation',
    time: '09:31',
    tag: 'Normal triage',
    conditions: ['None recorded'],
    medication: 'None recorded',
    assignedDoctor: 'Dr. Rajesh Verma',
  },
  {
    id: 'demo-ayush',
    name: 'Rohan Iyer',
    initials: 'RI',
    age: 46,
    gender: 'Male',
    language: 'English',
    complaint: 'AYUSH consultation',
    priority: 'HIGH',
    status: 'Intake in progress',
    time: '09:18',
    tag: 'Prakriti assessment',
    conditions: ['Seasonal allergies'],
    medication: 'Herbal formulation (patient reported)',
    assignedDoctor: 'Dr. Vikram Sen',
  },
]

export interface ClinicalReportData {
  reportType: 'AUTO' | 'MANUAL'
  patientName: string
  age: number
  gender: string
  language: string
  complaint: string
  priority: 'URGENT' | 'HIGH' | 'NORMAL'
  assignedDoctor: string
  doctorSpecialty: string
  generatedAt: string
  sessionId: string
  includeVitals: boolean
  includeHistory: boolean
  includeRedFlags: boolean
  includeOcr: boolean
  includeAyush: boolean
  includeDoctorNotes: boolean
  includeRx: boolean
  diagnosis: string
  doctorNotes: string
  prescription: string
  advice: string
  labFindings: string
  ayushFindings: string
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)

  const view: View =
    location.pathname.startsWith('/doctor') || location.pathname.startsWith('/admin')
      ? 'doctor'
      : location.pathname.startsWith('/ayush')
        ? 'ayush'
        : location.pathname.startsWith('/about')
          ? 'about'
          : location.pathname.startsWith('/patient') || location.pathname.startsWith('/kiosk')
            ? 'intake'
            : 'home'

  // Intake State
  const [step, setStep] = useState(0)
  const [language, setLanguage] = useState('English')
  const [complaint, setComplaint] = useState('Chest pain')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [verified, setVerified] = useState(false)
  const [escalated, setEscalated] = useState(false)
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Ananya Rao')
  const [queue, setQueue] = useState<PatientRecord[]>(INITIAL_QUEUE)
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM)

  // Report Modals State
  const [activeReport, setActiveReport] = useState<ClinicalReportData | null>(null)
  const [manualBuilderPatient, setManualBuilderPatient] = useState<PatientRecord | null>(null)
  const [assignWorkMember, setAssignWorkMember] = useState<TeamMember | null>(null)

  // Check Backend Health
  useEffect(() => {
    api
      .health()
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false))
  }, [])

  const questions = useMemo(() => {
    if (complaint === 'Fever') {
      return ['When did fever start?', 'What was the maximum temperature?', 'Do you have chills or body pain?']
    }
    if (complaint === 'Chest pain') {
      return [
        'When did it start?',
        'Do you have breathlessness?',
        'Do you have sweating?',
        'Do you have sudden weakness?',
        'Did you lose consciousness?',
      ]
    }
    return ['When did it begin?', 'Is there severe breathing difficulty?', 'Is there severe bleeding?']
  }, [complaint])

  const redFlag = useMemo(() => {
    const selectedAnswers = Object.entries(answers)
      .filter(([, value]) => value === 'Yes')
      .map(([question]) => question.toLowerCase())
    const text = `${complaint.toLowerCase()} ${selectedAnswers.join(' ')}`
    return ['chest pain breathlessness', 'chest pain sweating', 'sudden weakness', 'lose consciousness', 'severe breathing difficulty', 'severe bleeding', 'stroke'].some(
      (pattern) => text.includes(pattern)
    )
  }, [answers, complaint])

  const beginDemo = () => {
    navigate('/patient/case-taking')
    setStep(0)
    setAnswers({})
    setConsent(false)
    setUploaded(false)
    setEscalated(false)
    setVerified(false)
    setAssignedDoctor('Dr. Ananya Rao')
  }

  const handleSendToDoctor = (patientName = 'Arjun Mehta') => {
    const newPatient: PatientRecord = {
      id: `intake-${Date.now()}`,
      name: patientName,
      initials: patientName
        .split(' ')
        .map((n) => n[0])
        .join(''),
      age: 38,
      gender: 'Male',
      language,
      complaint,
      priority: redFlag ? 'URGENT' : 'NORMAL',
      status: redFlag ? 'Urgent triage review' : 'Ready for review',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: redFlag ? 'Emergency signal detected' : 'Standard intake',
      conditions: ['Type 2 Diabetes'],
      medication: 'Metformin 500 mg twice daily',
      assignedDoctor,
    }
    setQueue((prev) => [newPatient, ...prev.filter((p) => p.id !== newPatient.id)])
    navigate('/doctor')
  }

  const handleAssignDoctor = (patientId: string, doctorName: string) => {
    setQueue((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, assignedDoctor: doctorName } : p))
    )
    api.assignDoctor(patientId, doctorName).catch(() => {
      // Optimistic local state preserved
    })
  }

  const handleUpdateMemberWork = (updatedMember: TeamMember) => {
    setTeam((prev) => prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)))
    setAssignWorkMember(null)
  }

  // Open Auto Report Generator
  const handleOpenAutoReport = (patient: PatientRecord) => {
    const doc = AVAILABLE_DOCTORS.find((d) => d.name === patient.assignedDoctor) ?? AVAILABLE_DOCTORS[0]
    const autoReport: ClinicalReportData = {
      reportType: 'AUTO',
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender,
      language: patient.language,
      complaint: patient.complaint,
      priority: patient.priority,
      assignedDoctor: doc.name,
      doctorSpecialty: `${doc.specialty} (${doc.room})`,
      generatedAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      sessionId: `MK-${patient.id.slice(-4).toUpperCase()}`,
      includeVitals: true,
      includeHistory: true,
      includeRedFlags: true,
      includeOcr: true,
      includeAyush: patient.complaint.toLowerCase().includes('ayush'),
      includeDoctorNotes: true,
      includeRx: true,
      diagnosis: patient.priority === 'URGENT' ? 'Acute Angina / Correlate with ECG' : 'Upper Respiratory Symptom Complex',
      doctorNotes: `Structured history captured at MediKiosk terminal. Patient reported ${patient.complaint}. ${
        patient.priority === 'URGENT' ? 'Urgent breathlessness flagged. Care team alerted.' : 'Hemodynamically stable.'
      }`,
      prescription: patient.priority === 'URGENT' ? 'Tab. Sorbitrate 5mg SL SOS, 12-lead ECG stat' : 'Tab. Paracetamol 650mg TDS x 3 days, Steam inhalation',
      advice: 'Hydration maintenance, monitor spo2, urgent review if symptoms worsen',
      labFindings: 'HbA1c: 7.2% (T2D recorded), Fasting Blood Glucose: 138 mg/dL',
      ayushFindings: 'Prakriti: Pitta-Kapha dominant. Ahara: Irregular meal schedule. Recommended balanced Shad Rasa diet.',
    }
    setActiveReport(autoReport)
  }

  return (
    <div className="app-shell">
      {/* Topbar */}
      <header className="topbar">
        <button className="brand" onClick={() => navigate('/')} aria-label="MediKiosk home">
          <span className="brand-mark">
            <HeartPulse size={22} />
          </span>
          <span className="brand-title">
            Medi<span>Kiosk</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav>
          <button className={`nav-link ${view === 'home' ? 'nav-active' : ''}`} onClick={() => navigate('/')}>
            Overview
          </button>
          <button className={`nav-link ${view === 'intake' ? 'nav-active' : ''}`} onClick={beginDemo}>
            <Stethoscope size={16} /> Patient intake
          </button>
          <button className={`nav-link ${view === 'doctor' ? 'nav-active' : ''}`} onClick={() => navigate('/doctor')}>
            <LayoutDashboard size={16} /> Doctor workspace
          </button>
          <button className={`nav-link ${view === 'ayush' ? 'nav-active' : ''}`} onClick={() => navigate('/ayush')}>
            <Activity size={16} /> AYUSH
          </button>
          <button className={`nav-link ${view === 'about' ? 'nav-active' : ''}`} onClick={() => navigate('/about')}>
            <Users size={16} /> About & Team
          </button>
        </nav>

        {/* Actions */}
        <div className="top-actions">
          <span className="api-status-badge">
            <span className="status-dot" style={{ background: apiConnected ? '#10b981' : '#f59e0b' }} />
            {apiConnected ? 'LIVE API (mock)' : 'DEMO MODE'}
          </span>
          <button className="avatar-badge" title="Dr. Ananya Rao">
            AR
          </button>
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer open">
          <button
            className={`nav-link ${view === 'home' ? 'nav-active' : ''}`}
            onClick={() => {
              navigate('/')
              setMobileMenuOpen(false)
            }}
          >
            Overview
          </button>
          <button
            className={`nav-link ${view === 'intake' ? 'nav-active' : ''}`}
            onClick={() => {
              beginDemo()
              setMobileMenuOpen(false)
            }}
          >
            <Stethoscope size={16} /> Patient intake
          </button>
          <button
            className={`nav-link ${view === 'doctor' ? 'nav-active' : ''}`}
            onClick={() => {
              navigate('/doctor')
              setMobileMenuOpen(false)
            }}
          >
            <LayoutDashboard size={16} /> Doctor workspace
          </button>
          <button
            className={`nav-link ${view === 'ayush' ? 'nav-active' : ''}`}
            onClick={() => {
              navigate('/ayush')
              setMobileMenuOpen(false)
            }}
          >
            <Activity size={16} /> AYUSH
          </button>
          <button
            className={`nav-link ${view === 'about' ? 'nav-active' : ''}`}
            onClick={() => {
              navigate('/about')
              setMobileMenuOpen(false)
            }}
          >
            <Users size={16} /> About & Team
          </button>
        </div>
      )}

      {/* Main Views */}
      {view === 'home' && <Landing beginDemo={beginDemo} />}
      {view === 'intake' && (
        <Intake
          step={step}
          setStep={setStep}
          language={language}
          setLanguage={setLanguage}
          complaint={complaint}
          setComplaint={setComplaint}
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          consent={consent}
          setConsent={setConsent}
          redFlag={redFlag}
          escalated={escalated}
          setEscalated={setEscalated}
          uploaded={uploaded}
          setUploaded={setUploaded}
          verified={verified}
          setVerified={setVerified}
          assignedDoctor={assignedDoctor}
          setAssignedDoctor={setAssignedDoctor}
          onDoctor={() => handleSendToDoctor('Arjun Mehta')}
        />
      )}
      {view === 'doctor' && (
        <DoctorDashboard
          queue={queue}
          onBack={() => navigate('/')}
          onDemo={beginDemo}
          onAssignDoctor={handleAssignDoctor}
          onOpenAutoReport={handleOpenAutoReport}
          onOpenManualBuilder={(p) => setManualBuilderPatient(p)}
        />
      )}
      {view === 'ayush' && <Ayush onBack={() => navigate('/')} onStart={beginDemo} />}
      {view === 'about' && (
        <AboutAndTeam
          team={team}
          onAssignWorkClick={(member) => setAssignWorkMember(member)}
          onStartDemo={beginDemo}
        />
      )}

      {/* Work Assignment Modal for Team Member */}
      {assignWorkMember && (
        <WorkAssignmentModal
          member={assignWorkMember}
          onClose={() => setAssignWorkMember(null)}
          onSave={handleUpdateMemberWork}
        />
      )}

      {/* Manual Report Builder Modal */}
      {manualBuilderPatient && (
        <ManualReportBuilderModal
          patient={manualBuilderPatient}
          onClose={() => setManualBuilderPatient(null)}
          onCompile={(reportData) => {
            setManualBuilderPatient(null)
            setActiveReport(reportData)
          }}
        />
      )}

      {/* Clinical Report Sheet Modal (Auto or Manual) */}
      {activeReport && <ClinicalReportSheetModal report={activeReport} onClose={() => setActiveReport(null)} />}
    </div>
  )
}

/* ========================================================
   LANDING VIEW
   ======================================================== */
function Landing({ beginDemo }: { beginDemo: () => void }) {
  return (
    <main className="landing">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={14} /> SMART OPD TRIAGE & INTAKE
          </div>
          <h1>
            Every patient story,
            <br />
            <em>heard clearly.</em>
          </h1>
          <p className="hero-text">
            MediKiosk streamlines OPD triage by capturing multilingual patient conversations, OCR records, and AYUSH
            history into structured, doctor-verified clinical briefs.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={beginDemo}>
              Launch demo <ArrowRight size={18} />
            </button>
            <button className="secondary-button" onClick={beginDemo}>
              <Stethoscope size={17} /> Start patient intake
            </button>
          </div>
          <div className="hero-note">
            <ShieldCheck size={16} /> Synthetic demo data · Physician verification always required
          </div>
        </div>

        <div className="hero-art">
          <div className="orb orb-one" />
          <div className="orb orb-two" />

          {/* Main Showcase Card */}
          <div className="art-card main-card">
            <div className="card-top">
              <span className="live-dot" /> LIVE INTAKE
            </div>
            <div className="patient-row">
              <div className="patient-avatar">AM</div>
              <div>
                <strong>Arjun Mehta</strong>
                <small>Chest pain · Token 014</small>
              </div>
              <span className="urgent">URGENT</span>
            </div>
            <div className="signal">
              <div className="signal-header">
                <span>Red-flag screening</span>
                <b>2 signals</b>
              </div>
              <div className="wave">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <small>Breathlessness reported during structured interview</small>
            </div>
            <div className="progress-row">
              <span>Case completion</span>
              <b>78%</b>
            </div>
            <div className="bar">
              <span />
            </div>
          </div>

          {/* Secondary Floating Card */}
          <div className="art-card float-card">
            <span className="float-icon">
              <FileText size={18} />
            </span>
            <div>
              <strong>AI Draft Ready</strong>
              <small>Awaiting physician verification</small>
            </div>
            <Check size={18} style={{ color: '#10b981', marginLeft: 6 }} />
          </div>

          <div className="art-stamp">
            <Zap size={16} /> 03:42 <small>avg. intake saved</small>
          </div>
        </div>
      </section>

      {/* Proof Strip */}
      <section className="proof-strip">
        <div>
          <strong>01</strong>
          <span>Listen once</span>
          <small>Voice, touch, or text</small>
        </div>
        <div>
          <strong>02</strong>
          <span>Structure instantly</span>
          <small>Adaptive clinical intake</small>
        </div>
        <div>
          <strong>03</strong>
          <span>Verify with confidence</span>
          <small>Physician-in-the-loop brief</small>
        </div>
        <div className="proof-stat">
          <strong>
            98<span>%</span>
          </strong>
          <small>structured completeness in demo testing</small>
        </div>
      </section>

      {/* Feature Band */}
      <section className="feature-band">
        <div>
          <span className="eyebrow">A calmer start to every consult</span>
          <h2>
            From first hello
            <br />
            to clinical clarity.
          </h2>
        </div>
        <div className="feature-list">
          <Feature
            icon={<Mic size={20} />}
            title="Human-first intake"
            text="Patients can speak, tap, or type in their preferred language with seamless speech recognition."
          />
          <Feature
            icon={<FileText size={20} />}
            title="Documents made useful"
            text="Mock OCR extracts critical lab values and medications into editable, verifiable clinical fields."
          />
          <Feature
            icon={<ShieldCheck size={20} />}
            title="Safety in the loop"
            text="Deterministic red-flag rules immediately flag emergencies without making clinical diagnoses."
          />
        </div>
      </section>
    </main>
  )
}

/* ========================================================
   ABOUT & CARE TEAM MEMBERS WITH WORK ASSIGNMENT
   ======================================================== */
function AboutAndTeam({
  team,
  onAssignWorkClick,
  onStartDemo,
}: {
  team: TeamMember[]
  onAssignWorkClick: (member: TeamMember) => void
  onStartDemo: () => void
}) {
  const [departmentFilter, setDepartmentFilter] = useState<'ALL' | 'DOCTORS' | 'NURSING' | 'ADMIN'>('ALL')

  const filteredTeam = useMemo(() => {
    if (departmentFilter === 'ALL') return team
    return team.filter((m) => m.department === departmentFilter)
  }, [team, departmentFilter])

  return (
    <main className="about-page">
      {/* About Project Hero */}
      <section className="about-hero">
        <div className="eyebrow">
          <Info size={14} /> ABOUT MEDIKIOSK · SIH 2026 PROTOTYPE
        </div>
        <h1>
          Transforming Outpatient Care
          <br />
          <em>with Intelligence & Empathy.</em>
        </h1>
        <p className="about-lead">
          MediKiosk is an AI-powered clinical history taking and triage assistant designed to eliminate long OPD
          consultation delays, empower patients in their native languages, and provide physicians with structured, verified
          clinical briefs before they enter the examination room.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="primary-button" onClick={onStartDemo}>
            <Stethoscope size={17} /> Experience Patient Flow
          </button>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="about-pillars-grid">
        <div className="pillar-card">
          <div className="pillar-icon">
            <Languages size={22} />
          </div>
          <h3>Multilingual & Multimodal</h3>
          <p>
            Patients comfortably interact using speech, touch, or text in English and Hindi, breaking literacy and language
            barriers in high-volume public OPDs.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <Zap size={22} />
          </div>
          <h3>Rule-Based Triage Safety</h3>
          <p>
            Deterministic red-flag algorithms instantly flag high-urgency symptoms (e.g. chest pain with breathlessness)
            without pretending to replace doctor diagnosis.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <Activity size={22} />
          </div>
          <h3>Integrative AYUSH Records</h3>
          <p>
            Seamlessly captures Prakriti, Ahara, and Vihara holistic wellness dimensions alongside conventional allopathic
            medical history.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon">
            <ShieldCheck size={22} />
          </div>
          <h3>Doctor-in-the-Loop</h3>
          <p>
            Every AI extraction or summary is strictly an unverified draft until verified and signed off by the attending
            physician.
          </p>
        </div>
      </section>

      {/* Project Member Names (from Member Name.txt) */}
      <MemberNames />

      {/* Care Team Members & Work Assignment Section */}
      <section className="team-section">
        <div className="team-header-row">
          <div>
            <span className="eyebrow">
              <Users size={14} /> CARE TEAM & DUTY ROSTER
            </span>
            <h2>OPD Specialists & Staff Members</h2>
            <p>View attending physicians, clinical support nurses, and assign active OPD responsibilities.</p>
          </div>

          {/* Department Filter Pills */}
          <div className="team-filter-pills">
            <button
              className={`team-filter-pill ${departmentFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setDepartmentFilter('ALL')}
            >
              All Members ({team.length})
            </button>
            <button
              className={`team-filter-pill ${departmentFilter === 'DOCTORS' ? 'active' : ''}`}
              onClick={() => setDepartmentFilter('DOCTORS')}
            >
              Doctors & Specialists ({team.filter((m) => m.department === 'DOCTORS').length})
            </button>
            <button
              className={`team-filter-pill ${departmentFilter === 'NURSING' ? 'active' : ''}`}
              onClick={() => setDepartmentFilter('NURSING')}
            >
              Nursing & Triage ({team.filter((m) => m.department === 'NURSING').length})
            </button>
            <button
              className={`team-filter-pill ${departmentFilter === 'ADMIN' ? 'active' : ''}`}
              onClick={() => setDepartmentFilter('ADMIN')}
            >
              Admin & Tech ({team.filter((m) => m.department === 'ADMIN').length})
            </button>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="team-grid">
          {filteredTeam.map((member) => (
            <div className="member-card" key={member.id}>
              <div className="member-card-top">
                <div className="member-avatar">{member.initials}</div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
                <span
                  className={`member-status-pill ${
                    member.status === 'Active Duty'
                      ? 'status-active'
                      : member.status === 'In Consultation'
                        ? 'status-consulting'
                        : member.status === 'On Call'
                          ? 'status-oncall'
                          : 'status-break'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {/* Duty & Assignment Box */}
              <div className="member-duty-box">
                <div className="duty-label">
                  <Briefcase size={13} /> Current Assignment
                </div>
                <div className="duty-task">{member.assignedWork}</div>
                <div className="duty-meta">
                  <span>
                    <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />
                    {member.room}
                  </span>
                  <span>
                    <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />
                    {member.shift}
                  </span>
                </div>
              </div>

              {/* Work Assign Action */}
              <button className="btn-assign-work" onClick={() => onAssignWorkClick(member)}>
                <FileEdit size={14} /> Assign Work / Update Duty
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

/* ========================================================
   WORK ASSIGNMENT MODAL
   ======================================================== */
function WorkAssignmentModal({
  member,
  onClose,
  onSave,
}: {
  member: TeamMember
  onClose: () => void
  onSave: (updated: TeamMember) => void
}) {
  const [assignedWork, setAssignedWork] = useState(member.assignedWork)
  const [shift, setShift] = useState(member.shift)
  const [room, setRoom] = useState(member.room)
  const [status, setStatus] = useState(member.status)

  const handleSave = () => {
    onSave({
      ...member,
      assignedWork,
      shift,
      room,
      status,
    })
  }

  return (
    <div className="report-modal-overlay">
      <div className="report-modal" style={{ maxWidth: 540 }}>
        <div className="report-modal-head">
          <h3>
            <Briefcase size={18} style={{ color: '#0f766e' }} /> Assign Work · {member.name}
          </h3>
          <button className="report-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="assign-modal-body">
          <div className="assign-field">
            <label>Assigned Clinical Task / OPD Duty</label>
            <textarea
              rows={3}
              value={assignedWork}
              onChange={(e) => setAssignedWork(e.target.value)}
              placeholder="e.g. Chest Pain Triage, OPD Room Consultations, Lab Verification..."
            />
          </div>

          <div className="assign-field">
            <label>Shift Timing</label>
            <select value={shift} onChange={(e) => setShift(e.target.value)}>
              <option>Morning (08:00 - 14:00)</option>
              <option>Afternoon (14:00 - 20:00)</option>
              <option>Full Day (08:00 - 20:00)</option>
              <option>Night Shift (20:00 - 08:00)</option>
              <option>On-Call Coverage</option>
            </select>
          </div>

          <div className="assign-field">
            <label>OPD Room / Station</label>
            <input value={room} onChange={(e) => setRoom(e.target.value)} />
          </div>

          <div className="assign-field">
            <label>Current Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Active Duty' | 'In Consultation' | 'On Call' | 'Break')}
            >
              <option value="Active Duty">Active Duty</option>
              <option value="In Consultation">In Consultation</option>
              <option value="On Call">On Call</option>
              <option value="Break">Break</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" onClick={handleSave}>
              <Check size={16} /> Save Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================================================
   PATIENT INTAKE WORKFLOW
   ======================================================== */
type IntakeProps = {
  step: number
  setStep: (value: number) => void
  language: string
  setLanguage: (value: string) => void
  complaint: string
  setComplaint: (value: string) => void
  questions: string[]
  answers: Record<string, string>
  setAnswers: (value: Record<string, string>) => void
  consent: boolean
  setConsent: (value: boolean) => void
  redFlag: boolean
  escalated: boolean
  setEscalated: (value: boolean) => void
  uploaded: boolean
  setUploaded: (value: boolean) => void
  verified: boolean
  setVerified: (value: boolean) => void
  assignedDoctor: string
  setAssignedDoctor: (value: string) => void
  onDoctor: () => void
}

function Intake(props: IntakeProps) {
  const labels = ['Language', 'Consent', 'Concern', 'Interview', 'Documents', 'Review']
  const next = () => props.setStep(Math.min(5, props.step + 1))
  const [reportType, setReportType] = useState('Lab report')
  const [reportName, setReportName] = useState('demo-lab-report.pdf')
  const [reportDate, setReportDate] = useState('2026-08-20')
  const [diagnosis, setDiagnosis] = useState('Type 2 Diabetes')
  const [medication, setMedication] = useState('Metformin 500 mg')
  const [labResult, setLabResult] = useState('HbA1c: 7.2%')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeListeningQuestion, setActiveListeningQuestion] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Web Speech API for Narrator
  const toggleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.95
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setIsSpeaking(true)
      }
    }
  }

  // Voice Input Simulation
  const handleMicClick = (question: string) => {
    setActiveListeningQuestion(question)
    setTimeout(() => {
      props.setAnswers({ ...props.answers, [question]: 'Yes' })
      setActiveListeningQuestion(null)
    }, 1200)
  }

  // File Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      props.setUploaded(true)
      setReportName(e.dataTransfer.files[0].name)
    }
  }

  return (
    <main className="workflow">
      <div className="workflow-head">
        <button className="back-link" onClick={props.onDoctor}>
          <ChevronLeft size={16} /> Exit to dashboard
        </button>
        <div className="workflow-title">
          <span className="eyebrow">PATIENT INTAKE · DEMO SESSION</span>
          <h1>Let’s make your visit easier.</h1>
        </div>
        <div className="session-id">
          SESSION <strong>MK-014</strong>
        </div>
      </div>

      {/* Stepper with Animated Progress */}
      <div className="stepper-wrap">
        <div className="stepper-track">
          <div className="stepper-progress" style={{ width: `${(props.step / (labels.length - 1)) * 100}%` }} />
        </div>
        <div className="stepper">
          {labels.map((label, index) => {
            const isDone = index < props.step
            const isCurrent = index === props.step
            return (
              <div
                key={label}
                className={`step ${isDone ? 'step-done' : ''} ${isCurrent ? 'step-current' : ''}`}
                onClick={() => props.setStep(index)}
              >
                <div className="step-node">{isDone ? <Check size={16} /> : index + 1}</div>
                <small>{label}</small>
              </div>
            )
          })}
        </div>
      </div>

      {/* Intake Step Panels */}
      <section className="intake-panel">
        {props.step === 0 && (
          <>
            <div className="panel-icon">
              <Languages size={24} />
            </div>
            <h2>How would you like to continue?</h2>
            <p className="panel-sub">
              You can change your language at any time. We will adapt the questions, screens, and audio.
            </p>
            <div className="language-grid">
              <button
                className={`choice ${props.language === 'English' ? 'selected' : ''}`}
                onClick={() => props.setLanguage('English')}
              >
                <strong>English</strong>
                <small>Continue in English</small>
              </button>
              <button
                className={`choice ${props.language === 'हिंदी' ? 'selected' : ''}`}
                onClick={() => props.setLanguage('हिंदी')}
              >
                <strong>हिंदी (Hindi)</strong>
                <small>हिंदी में जारी रखें</small>
              </button>
            </div>
            <div className="action-row">
              <button className="primary-button" onClick={next}>
                Continue <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {props.step === 1 && (
          <>
            <div className="panel-icon">
              <ShieldCheck size={24} />
            </div>
            <h2>Your information, your choice.</h2>
            <p className="panel-sub">
              We collect this information to prepare a structured clinical brief for your doctor. This is a synthetic
              demo session compliant with data safety standards.
            </p>
            <label className="consent-check">
              <input
                type="checkbox"
                checked={props.consent}
                onChange={(e) => props.setConsent(e.target.checked)}
              />
              <span>
                <strong>I consent to structured clinical intake</strong>
                <small>
                  I understand that AI assistance creates an unverified draft. A licensed physician must review and
                  verify it before clinical use.
                </small>
              </span>
            </label>
            <button
              className={`audio-button ${isSpeaking ? 'playing' : ''}`}
              onClick={() =>
                toggleSpeech(
                  'We collect this information to prepare your clinical brief for the doctor. AI assistance creates a draft only, and a doctor will verify everything.'
                )
              }
            >
              {isSpeaking ? <VolumeX size={17} /> : <Volume2 size={17} />}
              {isSpeaking ? 'Stop listening' : 'Listen to this explanation'}
            </button>
            <div className="action-row">
              <button className="primary-button" disabled={!props.consent} onClick={next}>
                I agree and continue <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {props.step === 2 && (
          <>
            <div className="panel-icon">
              <HeartPulse size={24} />
            </div>
            <h2>What brings you in today?</h2>
            <p className="panel-sub">Choose your chief symptom. Our questions will adapt automatically.</p>
            <div className="complaint-grid">
              {['Chest pain', 'Fever', 'Cough', 'Headache', 'Stomach pain', 'Something else'].map((item) => (
                <button
                  key={item}
                  className={`complaint ${props.complaint === item ? 'selected' : ''}`}
                  onClick={() => props.setComplaint(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="action-row">
              <button className="primary-button" onClick={next}>
                Continue to questions <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {props.step === 3 && (
          <>
            <div className="panel-icon">
              <Mic size={24} />
            </div>
            <h2>Tell us a little more.</h2>
            <p className="panel-sub">
              Answer by tapping Yes/No or clicking the microphone icon. These questions adapt to{' '}
              <strong>{props.complaint}</strong>.
            </p>
            <div className="question-list">
              {props.questions.map((question, index) => (
                <div className="question" key={question}>
                  <div>
                    <span className="question-number">0{index + 1}</span>
                    <strong>{question}</strong>
                  </div>
                  <div className="answer-actions">
                    <button
                      className={`speak-button ${activeListeningQuestion === question ? 'listening' : ''}`}
                      onClick={() => handleMicClick(question)}
                      title="Voice input simulation"
                    >
                      <Mic size={16} />
                    </button>
                    <button
                      className={`answer ${props.answers[question] === 'Yes' ? 'active-yes' : ''}`}
                      onClick={() => props.setAnswers({ ...props.answers, [question]: 'Yes' })}
                    >
                      Yes
                    </button>
                    <button
                      className={`answer ${props.answers[question] === 'No' ? 'active-no' : ''}`}
                      onClick={() => props.setAnswers({ ...props.answers, [question]: 'No' })}
                    >
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Urgent Red Flag Alert */}
            {props.redFlag && (
              <div className="alert">
                <div className="alert-icon-box">
                  <Zap size={20} />
                </div>
                <div>
                  <strong>Urgent Triage Alert</strong>
                  <span>
                    Emergency symptoms detected (breathlessness with chest pain). Hospital care staff have been
                    notified.
                  </span>
                </div>
              </div>
            )}

            <div className="action-row">
              <button className="primary-button" onClick={next}>
                Save and continue <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {props.step === 4 && (
          <>
            <div className="panel-icon">
              <Upload size={24} />
            </div>
            <h2>Bring your reports with you.</h2>
            <p className="panel-sub">
              Drag and drop a prescription, lab report, or discharge summary. Our mock OCR extracts key clinical data
              instantly.
            </p>
            <div className="report-tools">
              <label>
                Report type
                <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option>Lab report</option>
                  <option>Prescription</option>
                  <option>Discharge summary</option>
                  <option>Imaging report</option>
                  <option>Other</option>
                </select>
              </label>
              <button
                className="secondary-button compact"
                onClick={() => {
                  props.setUploaded(true)
                  setReportName('demo-lab-report.pdf')
                }}
              >
                <Sparkles size={16} /> Generate demo report
              </button>
            </div>

            <label
              className={`upload-zone ${props.uploaded ? 'uploaded' : ''} ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  props.setUploaded(true)
                  setReportName(e.target.files?.[0]?.name ?? 'uploaded-report.pdf')
                }}
              />
              {props.uploaded ? (
                <>
                  <CheckCircle2 size={32} style={{ color: '#10b981' }} />
                  <strong>{reportName}</strong>
                  <small>{reportType} · Mock OCR parsed successfully</small>
                </>
              ) : (
                <>
                  <Upload size={32} />
                  <strong>Drop a report here or click to browse</strong>
                  <small>JPG, PNG, or PDF up to 8MB</small>
                </>
              )}
            </label>

            {/* Editable OCR Review */}
            {props.uploaded && (
              <div className="ocr-review">
                <div className="ocr-review-head">
                  <div>
                    <Sparkles size={17} />
                    <strong>Mock OCR · Review Extracted Data</strong>
                  </div>
                  <span>EDITABLE</span>
                </div>
                <div className="ocr-fields">
                  <label>
                    Document Date
                    <input value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
                  </label>
                  <label>
                    Extracted Diagnosis
                    <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                  </label>
                  <label>
                    Medication
                    <input value={medication} onChange={(e) => setMedication(e.target.value)} />
                  </label>
                  <label>
                    Lab Result
                    <input value={labResult} onChange={(e) => setLabResult(e.target.value)} />
                  </label>
                </div>
                <p>Verify all extracted values. Nothing is committed without your review.</p>
              </div>
            )}

            <div className="action-row">
              <button className="primary-button" disabled={!props.uploaded} onClick={next}>
                Review extracted history <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {props.step === 5 && (
          <>
            <div className="panel-icon">
              <ClipboardList size={24} />
            </div>
            <h2>Your visit brief is ready.</h2>
            <p className="panel-sub">Review the generated draft before transmitting it to the clinical queue.</p>

            <div className="review-grid">
              <div className="document-preview">
                <div className="doc-heading">
                  {reportType} · {reportDate}
                </div>
                <div className="doc-line wide" />
                <div className="doc-line" />
                <div className="doc-heading">Extracted Findings</div>
                <div className="summary-item">
                  <Check size={16} /> {diagnosis}
                </div>
                <div className="summary-item">
                  <Check size={16} /> {medication} · {labResult}
                </div>
              </div>

              <div className="summary-preview">
                <div className="summary-label">
                  AI-GENERATED DRAFT <span>UNVERIFIED</span>
                </div>
                <h3>{props.complaint}</h3>
                <p>
                  Patient reported {props.complaint.toLowerCase()} during structured kiosk intake.{' '}
                  {props.redFlag
                    ? 'Breathlessness was reported and requires immediate triage review.'
                    : 'No emergency red flags were flagged in structured answers.'}
                </p>
                <div className="summary-item">
                  <Check size={15} /> {diagnosis} · Verified draft field
                </div>
                <div className="summary-item">
                  <Check size={15} /> {medication} · {labResult}
                </div>
              </div>
            </div>

            {/* Doctor Assignment during intake */}
            <div className="doctor-assign-box" style={{ marginTop: 24 }}>
              <div className="doctor-assign-label">
                <span>Assign to Physician</span>
                <strong>Select preferred attending doctor</strong>
              </div>
              <select
                className="doctor-select"
                value={props.assignedDoctor}
                onChange={(e) => props.setAssignedDoctor(e.target.value)}
              >
                {AVAILABLE_DOCTORS.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>

            <label className="consent-check" style={{ marginTop: 20 }}>
              <input
                type="checkbox"
                checked={props.verified}
                onChange={(e) => props.setVerified(e.target.checked)}
              />
              <span>
                <strong>I have reviewed the clinical summary above</strong>
                <small>A physician will examine and verify this draft before beginning consultation.</small>
              </span>
            </label>

            <div className="action-row">
              <button className="primary-button" disabled={!props.verified} onClick={props.onDoctor}>
                Confirm and send to doctor queue <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

/* ========================================================
   DOCTOR WORKSPACE / DASHBOARD
   ======================================================== */
function DoctorDashboard({
  queue,
  onBack,
  onDemo,
  onAssignDoctor,
  onOpenAutoReport,
  onOpenManualBuilder,
}: {
  queue: PatientRecord[]
  onBack: () => void
  onDemo: () => void
  onAssignDoctor: (patientId: string, doctorName: string) => void
  onOpenAutoReport: (patient: PatientRecord) => void
  onOpenManualBuilder: (patient: PatientRecord) => void
}) {
  const [selectedId, setSelectedId] = useState(queue[0]?.id ?? 'demo-chest')
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'documents' | 'summary'>('overview')
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('ALL')
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({})
  const [doctorNotes, setDoctorNotes] = useState<Record<string, string>>({})

  const filteredQueue = useMemo(() => {
    if (selectedDoctorFilter === 'ALL') return queue
    return queue.filter((p) => p.assignedDoctor === selectedDoctorFilter)
  }, [queue, selectedDoctorFilter])

  const patient = queue.find((item) => item.id === selectedId) ?? queue[0]
  const isVerified = Boolean(verifiedMap[patient.id])

  const handleVerifyDraft = () => {
    setVerifiedMap({ ...verifiedMap, [patient.id]: true })
  }

  return (
    <main className="dashboard">
      <div className="dashboard-head">
        <div>
          <button className="back-link" onClick={onBack}>
            <ChevronLeft size={16} /> Back to overview
          </button>
          <span className="eyebrow">CLINICAL WORKSPACE · DR. ANANYA RAO</span>
          <h1>OPD Consultation Dashboard</h1>
        </div>
        <button className="primary-button compact" onClick={onDemo}>
          <Zap size={16} /> Launch patient demo
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metrics">
        <Metric icon={<Users size={20} />} number="24" label="Today's patients" trend="+12%" />
        <Metric icon={<ClipboardList size={20} />} number={`0${queue.length}`} label="Pending cases" trend="3 urgent" danger />
        <Metric icon={<FileText size={20} />} number="67" label="Documents processed" trend="+8 today" />
        <Metric icon={<Activity size={20} />} number="03:42" label="Avg. intake time" trend="-18%" />
      </div>

      {/* Doctor Filter Tabs */}
      <div className="doctor-filter-bar">
        <button
          className={`doctor-filter-pill ${selectedDoctorFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedDoctorFilter('ALL')}
        >
          All Patients ({queue.length})
        </button>
        {AVAILABLE_DOCTORS.map((doc) => {
          const count = queue.filter((p) => p.assignedDoctor === doc.name).length
          return (
            <button
              key={doc.id}
              className={`doctor-filter-pill ${selectedDoctorFilter === doc.name ? 'active' : ''}`}
              onClick={() => setSelectedDoctorFilter(doc.name)}
            >
              {doc.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Workspace Grid */}
      <div className="workspace-grid">
        {/* Left: Queue */}
        <section className="queue-card">
          <div className="card-header">
            <div>
              <span className="eyebrow">LIVE QUEUE</span>
              <h2>Patients Awaiting Review</h2>
            </div>
          </div>
          <div className="queue-list">
            {filteredQueue.map((item) => (
              <button
                className={`queue-row ${selectedId === item.id ? 'selected' : ''}`}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <span className="patient-avatar small">{item.initials ?? 'PT'}</span>
                <span className="queue-name">
                  <strong>{item.name}</strong>
                  <small>{item.complaint}</small>
                  <span className="doctor-badge">
                    <UserCheck size={11} /> {item.assignedDoctor ?? 'Dr. Ananya Rao'}
                  </span>
                </span>
                <span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span>
                <span className="queue-status">{item.status}</span>
                <span className="queue-time">{item.time ?? '09:40'}</span>
                <ArrowRight size={16} style={{ color: '#94a3b8' }} />
              </button>
            ))}
          </div>
        </section>

        {/* Right: Selected Patient Dossier */}
        <section className="patient-card">
          <div className="patient-card-head">
            <div className="patient-avatar large">{patient.initials ?? 'PT'}</div>
            <div>
              <span className={`priority ${patient.priority.toLowerCase()}`}>{patient.priority} PRIORITY</span>
              <h2>{patient.name}</h2>
              <p>
                {patient.age} years · {patient.gender} · {patient.language}
              </p>
            </div>
          </div>

          {/* Doctor Assignment Box */}
          <div className="doctor-assign-box">
            <div className="doctor-assign-label">
              <span>Assigned Physician</span>
              <strong>{patient.assignedDoctor ?? 'Dr. Ananya Rao'}</strong>
            </div>
            <select
              className="doctor-select"
              value={patient.assignedDoctor ?? 'Dr. Ananya Rao'}
              onChange={(e) => onAssignDoctor(patient.id, e.target.value)}
            >
              {AVAILABLE_DOCTORS.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>

          {/* Dual Report Generation Action Buttons */}
          <div className="report-action-buttons">
            <button className="btn-report-auto" onClick={() => onOpenAutoReport(patient)}>
              <Sparkles size={16} /> Auto Clinical Report
            </button>
            <button className="btn-report-manual" onClick={() => onOpenManualBuilder(patient)}>
              <FileEdit size={16} /> Manual Report Builder
            </button>
          </div>

          {/* Urgent alert notice */}
          {patient.priority === 'URGENT' && (
            <div className="patient-alert">
              <Zap size={20} />
              <div>
                <strong>Urgent Triage Signal</strong>
                <span>{patient.tag ?? 'Emergency symptoms reported during structured intake.'}</span>
              </div>
            </div>
          )}

          {/* Dossier Tabs */}
          <div className="patient-tabs">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Structured History
            </button>
            <button
              className={`tab-button ${activeTab === 'documents' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents & OCR
            </button>
            <button
              className={`tab-button ${activeTab === 'summary' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              AI Brief & Verification
            </button>
          </div>

          {/* Tab Contents */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="mini-summary">
                <span className="eyebrow">CHIEF PRESENTATION</span>
                <h3>{patient.complaint}</h3>
                <p>
                  Patient completed guided kiosk intake in {patient.language}. History captured and ready for clinical
                  examination.
                </p>
                <div className="clinical-badge-row">
                  <span className="clinical-badge">Conditions: {patient.conditions?.join(', ') ?? 'None'}</span>
                  <span className="clinical-badge">Meds: {patient.medication ?? 'None recorded'}</span>
                  <span className="clinical-badge">Doctor: {patient.assignedDoctor ?? 'Dr. Ananya Rao'}</span>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="mini-summary">
                <span className="eyebrow">RECORDED INTAKE RESPONSES</span>
                <h3>Intake Timeline</h3>
                <p>Structured interview recorded at kiosk terminal MK-014.</p>
                <div className="summary-item">
                  <Check size={16} /> Chief complaint: {patient.complaint}
                </div>
                <div className="summary-item">
                  <Check size={16} /> Reported breathlessness: {patient.priority === 'URGENT' ? 'Yes (Flagged)' : 'No'}
                </div>
                <div className="summary-item">
                  <Check size={16} /> Digital consent verified: Accepted by patient
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="mini-summary">
                <span className="eyebrow">EXTRACTED LAB & CLINICAL OCR</span>
                <h3>Uploaded Reports</h3>
                <div className="summary-item">
                  <Check size={16} /> Document: demo-lab-report.pdf (Verified)
                </div>
                <div className="summary-item">
                  <Check size={16} /> Biomarker: HbA1c 7.2% (Type 2 Diabetes)
                </div>
                <div className="summary-item">
                  <Check size={16} /> Prescription: Metformin 500 mg twice daily
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="mini-summary">
                <span className="eyebrow">AI DRAFT FOR PHYSICIAN REVIEW</span>
                <h3>Clinical Brief</h3>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: 120,
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    marginTop: 8,
                    marginBottom: 16,
                  }}
                  value={
                    doctorNotes[patient.id] ??
                    `CHIEF COMPLAINT:\n${patient.complaint}\n\nHISTORY OF PRESENT ILLNESS:\nPatient reported symptoms during kiosk intake. ${
                      patient.priority === 'URGENT' ? 'Breathlessness reported.' : ''
                    }\n\nPAST MEDICAL HISTORY:\nType 2 Diabetes. Metformin 500 mg.\n\nAI draft ready for doctor review.`
                  }
                  onChange={(e) => setDoctorNotes({ ...doctorNotes, [patient.id]: e.target.value })}
                />

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {isVerified ? (
                    <span className="verified-stamp">
                      <CheckCircle2 size={16} /> PHYSICIAN VERIFIED · {patient.assignedDoctor ?? 'DR. ANANYA RAO'}
                    </span>
                  ) : (
                    <button className="primary-button compact" onClick={handleVerifyDraft}>
                      <Check size={15} /> Physician verify draft
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="summary-footer">
            <div className={`verification-status ${isVerified ? 'verified' : ''}`}>
              <Check size={16} />
              {isVerified ? `Verified by ${patient.assignedDoctor ?? 'Dr. Ananya Rao'}` : 'Intake complete · Draft unverified'}
            </div>
            <button className="secondary-button compact" onClick={() => onOpenAutoReport(patient)}>
              View Full Report <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

/* ========================================================
   MANUAL REPORT BUILDER MODAL
   ======================================================== */
function ManualReportBuilderModal({
  patient,
  onClose,
  onCompile,
}: {
  patient: PatientRecord
  onClose: () => void
  onCompile: (report: ClinicalReportData) => void
}) {
  const [selectedDoctor, setSelectedDoctor] = useState(patient.assignedDoctor ?? 'Dr. Ananya Rao')
  const [includeVitals, setIncludeVitals] = useState(true)
  const [includeHistory, setIncludeHistory] = useState(true)
  const [includeRedFlags, setIncludeRedFlags] = useState(true)
  const [includeOcr, setIncludeOcr] = useState(true)
  const [includeAyush, setIncludeAyush] = useState(patient.complaint.toLowerCase().includes('ayush'))
  const [includeDoctorNotes, setIncludeDoctorNotes] = useState(true)
  const [includeRx, setIncludeRx] = useState(true)

  const [diagnosis, setDiagnosis] = useState(
    patient.priority === 'URGENT' ? 'Coronary Artery Disease - Angina Pectoris' : 'Acute Febrile Illness'
  )
  const [doctorNotes, setDoctorNotes] = useState(
    `Patient examined at OPD. Chief complaint of ${patient.complaint.toLowerCase()}. Heart sounds normal, S1S2 present. Bilateral chest clear. Triage red-flags noted.`
  )
  const [prescription, setPrescription] = useState(
    patient.priority === 'URGENT'
      ? '1. Tab. Sorbitrate 5mg sublingual SOS\n2. Tab. Clopidogrel 75mg OD\n3. Tab. Atorvastatin 40mg HS'
      : '1. Tab. Paracetamol 650mg TDS x 3 days\n2. Tab. Pantoprazole 40mg OD before breakfast x 5 days'
  )
  const [advice, setAdvice] = useState(
    'Rest, low-sodium diet, maintain blood pressure chart, review after 3 days with fresh ECG.'
  )

  const handleCompile = () => {
    const doc = AVAILABLE_DOCTORS.find((d) => d.name === selectedDoctor) ?? AVAILABLE_DOCTORS[0]
    const reportData: ClinicalReportData = {
      reportType: 'MANUAL',
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender,
      language: patient.language,
      complaint: patient.complaint,
      priority: patient.priority,
      assignedDoctor: doc.name,
      doctorSpecialty: `${doc.specialty} (${doc.room})`,
      generatedAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
      sessionId: `MK-${patient.id.slice(-4).toUpperCase()}`,
      includeVitals,
      includeHistory,
      includeRedFlags,
      includeOcr,
      includeAyush,
      includeDoctorNotes,
      includeRx,
      diagnosis,
      doctorNotes,
      prescription,
      advice,
      labFindings: 'HbA1c: 7.2% (Diabetes), Serum Creatinine: 0.9 mg/dL',
      ayushFindings: 'Prakriti: Vata-Pitta. Agni: Mandagni. Recommended Ahara: light warm meals.',
    }
    onCompile(reportData)
  }

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">
        <div className="report-modal-head">
          <h3>
            <FileEdit size={20} style={{ color: '#0d9488' }} /> Manual Clinical Report Generator
          </h3>
          <button className="report-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="report-modal-body">
          {/* Doctor Assignment in Report Builder */}
          <div className="builder-section">
            <div className="builder-section-title">
              <UserCheck size={16} /> Attending Doctor Assignment
            </div>
            <div className="doctor-assign-box" style={{ margin: 0 }}>
              <div className="doctor-assign-label">
                <span>Signing Physician</span>
                <strong>{selectedDoctor}</strong>
              </div>
              <select
                className="doctor-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {AVAILABLE_DOCTORS.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section Toggles */}
          <div className="builder-section">
            <div className="builder-section-title">Select Sections to Include in Report</div>
            <div className="builder-toggle-grid">
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeVitals}
                  onChange={(e) => setIncludeVitals(e.target.checked)}
                />
                <span>Patient Vitals & Demographics</span>
              </label>
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeHistory}
                  onChange={(e) => setIncludeHistory(e.target.checked)}
                />
                <span>Chief Complaints & Intake History</span>
              </label>
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeRedFlags}
                  onChange={(e) => setIncludeRedFlags(e.target.checked)}
                />
                <span>Red-Flag Triage Status</span>
              </label>
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeOcr}
                  onChange={(e) => setIncludeOcr(e.target.checked)}
                />
                <span>OCR Extracted Lab & Meds</span>
              </label>
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeAyush}
                  onChange={(e) => setIncludeAyush(e.target.checked)}
                />
                <span>AYUSH Dosha Assessment</span>
              </label>
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeDoctorNotes}
                  onChange={(e) => setIncludeDoctorNotes(e.target.checked)}
                />
                <span>Doctor Clinical Observations</span>
              </label>
              <label className="builder-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeRx}
                  onChange={(e) => setIncludeRx(e.target.checked)}
                />
                <span>Prescription (Rx) & Advice</span>
              </label>
            </div>
          </div>

          {/* Clinical Inputs */}
          <div className="builder-section">
            <div className="builder-section-title">Physician Clinical Findings & Prescription</div>
            <div className="builder-input-group">
              <label>Provisional Clinical Diagnosis</label>
              <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>
            <div className="builder-input-group">
              <label>Clinical Examination & Observations</label>
              <textarea rows={3} value={doctorNotes} onChange={(e) => setDoctorNotes(e.target.value)} />
            </div>
            <div className="builder-input-group">
              <label>Prescribed Medications (Rx)</label>
              <textarea rows={3} value={prescription} onChange={(e) => setPrescription(e.target.value)} />
            </div>
            <div className="builder-input-group">
              <label>Clinical Advice & Follow-up</label>
              <input value={advice} onChange={(e) => setAdvice(e.target.value)} />
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" onClick={handleCompile}>
              <Check size={16} /> Compile & Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================================================
   PRINTABLE CLINICAL REPORT SHEET MODAL
   ======================================================== */
function ClinicalReportSheetModal({
  report,
  onClose,
}: {
  report: ClinicalReportData
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = `
MEDIKIOSK OPD CLINICAL SUMMARY REPORT (${report.reportType} GENERATED)
Hospital: MediKiosk Smart OPD Health Centre
Date: ${report.generatedAt} | Session: ${report.sessionId}
Patient: ${report.patientName} (${report.age}y / ${report.gender})
Chief Complaint: ${report.complaint} | Priority: ${report.priority}
Attending Physician: ${report.assignedDoctor} (${report.doctorSpecialty})

DIAGNOSIS:
${report.diagnosis}

CLINICAL NOTES:
${report.doctorNotes}

PRESCRIPTION (Rx):
${report.prescription}

ADVICE:
${report.advice}
    `.trim()

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="report-modal-overlay">
      <div className="report-modal" style={{ maxWidth: 860 }}>
        <div className="report-modal-head">
          <h3>
            <FileText size={20} style={{ color: '#0f766e' }} />
            {report.reportType === 'AUTO' ? 'Auto-Synthesized OPD Brief' : 'Custom Physician OPD Summary'}
          </h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="secondary-button compact" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button className="primary-button compact" onClick={handlePrint}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button className="report-modal-close" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="report-modal-body">
          {/* The Printable Clinical Document Sheet */}
          <div className="clinical-report-sheet">
            {/* Header */}
            <div className="report-header-banner">
              <div className="hospital-title">
                <span className="brand-mark">
                  <HeartPulse size={24} />
                </span>
                <div>
                  <h2>
                    Medi<span>Kiosk</span> OPD Health Centre
                  </h2>
                  <p>Smart Outpatient Department · Electronic Health Records · NABH Accredited</p>
                </div>
              </div>
              <div className="report-token-badge">
                <strong>{report.sessionId}</strong>
                <small>Generated: {report.generatedAt}</small>
              </div>
            </div>

            {/* Demographics Grid */}
            <div className="report-demographics-grid">
              <div className="demo-cell">
                <small>Patient Name</small>
                <strong>{report.patientName}</strong>
              </div>
              <div className="demo-cell">
                <small>Age / Gender</small>
                <strong>
                  {report.age} Yrs / {report.gender}
                </strong>
              </div>
              <div className="demo-cell">
                <small>Triage Urgency</small>
                <strong style={{ color: report.priority === 'URGENT' ? '#e11d48' : '#0d9488' }}>
                  {report.priority}
                </strong>
              </div>
              <div className="demo-cell">
                <small>Attending Physician</small>
                <strong>{report.assignedDoctor}</strong>
              </div>
            </div>

            {/* Section: Chief Complaints */}
            {report.includeHistory && (
              <div className="report-section-box">
                <div className="report-section-header">
                  <Activity size={14} /> 1. Chief Complaint & Intake History
                </div>
                <ul className="report-bullet-list">
                  <li>
                    <strong>Chief Complaint:</strong> {report.complaint}
                  </li>
                  <li>
                    <strong>Intake Language:</strong> {report.language}
                  </li>
                  <li>
                    <strong>Clinical History:</strong> {report.doctorNotes}
                  </li>
                </ul>
              </div>
            )}

            {/* Section: Red Flag Triage */}
            {report.includeRedFlags && (
              <div className="report-section-box">
                <div className="report-section-header">
                  <Zap size={14} /> 2. Emergency Red-Flag Triage
                </div>
                <p>
                  {report.priority === 'URGENT'
                    ? '⚠️ Emergency red flag alert active: Breathlessness reported with chest pain. Urgent clinical priority.'
                    : '✓ No emergency red-flag symptoms detected in structured questionnaire.'}
                </p>
              </div>
            )}

            {/* Section: Diagnostic Lab Findings & OCR */}
            {report.includeOcr && (
              <div className="report-section-box">
                <div className="report-section-header">
                  <FileText size={14} /> 3. Document OCR & Lab Findings
                </div>
                <p>{report.labFindings}</p>
              </div>
            )}

            {/* Section: AYUSH Parameters (if enabled) */}
            {report.includeAyush && (
              <div className="report-section-box">
                <div className="report-section-header">
                  <Activity size={14} /> 4. AYUSH Holistic Assessment
                </div>
                <p>{report.ayushFindings}</p>
              </div>
            )}

            {/* Section: Provisional Diagnosis */}
            <div className="report-section-box">
              <div className="report-section-header">
                <CheckCircle2 size={14} /> 5. Clinical Impression & Diagnosis
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#0f766e' }}>{report.diagnosis}</p>
            </div>

            {/* Section: Prescription (Rx) */}
            {report.includeRx && (
              <div className="prescription-sheet">
                <div className="prescription-sheet-title">
                  <Sparkles size={14} /> ℞ Prescribed Medications & Dosage
                </div>
                <p style={{ whiteSpace: 'pre-line', margin: '4px 0 10px', fontSize: 13, lineHeight: 1.6 }}>
                  {report.prescription}
                </p>
                <div style={{ borderTop: '1px dashed #99f6e4', paddingTop: 8, fontSize: 12, color: '#0f766e' }}>
                  <strong>Special Advice:</strong> {report.advice}
                </div>
              </div>
            )}

            {/* Signature & Seal Block */}
            <div className="report-signature-block">
              <div className="seal-stamp-box">
                <CheckCircle2 size={18} />
                <div>
                  <span>PHYSICIAN VERIFIED</span>
                  <small style={{ display: 'block', fontSize: 9 }}>DIGITALLY RECORDED</small>
                </div>
              </div>
              <div className="doctor-sign-line">
                <strong>{report.assignedDoctor}</strong>
                <small>{report.doctorSpecialty}</small>
                <small style={{ display: 'block', marginTop: 2 }}>Medical License: MCI-849204</small>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="report-footer-actions">
            <button className="secondary-button" onClick={onClose}>
              Close
            </button>
            <button className="primary-button" onClick={handlePrint}>
              <Printer size={16} /> Print Clinical Summary Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ========================================================
   AYUSH ASSESSMENT VIEW
   ======================================================== */
const AYUSH_DOMAINS = [
  {
    name: 'Prakriti',
    title: 'Biological Constitution',
    desc: 'Assessment of fundamental Dosha dominance: Vata (Movement), Pitta (Metabolism), and Kapha (Structure).',
  },
  {
    name: 'Ahara',
    title: 'Nutritional Intake',
    desc: 'Analysis of dietary habits, digestive fire (Agni), taste balance (Shad Rasa), and meal timing.',
  },
  {
    name: 'Vihara',
    title: 'Daily Regimen & Lifestyle',
    desc: 'Assessment of sleep patterns (Nidra), physical exercise (Vyayama), and occupational stress.',
  },
  {
    name: 'Vikriti',
    title: 'Doshic Imbalances',
    desc: 'Current symptom deviations from constitutional baseline; identifies root causes for preventive care.',
  },
  {
    name: 'Sattva',
    title: 'Mental Clarity & Resilience',
    desc: 'Psychological balance evaluation (Satva, Rajas, Tamas) to guide stress reduction and mental health.',
  },
  {
    name: 'Vaya',
    title: 'Age-Specific Dynamics',
    desc: 'Chronological life stage evaluation to adjust therapeutic recommendations and longevity protocols.',
  },
]

function Ayush({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const [selectedDomain, setSelectedDomain] = useState(AYUSH_DOMAINS[0])

  return (
    <main className="ayush-page">
      <button className="back-link" onClick={onBack}>
        <ChevronLeft size={16} /> Back to overview
      </button>

      <div className="ayush-hero">
        <div>
          <span className="eyebrow">STRUCTURED AYUSH ASSESSMENT</span>
          <h1>
            A fuller picture
            <br />
            <em>of wellbeing.</em>
          </h1>
          <p>
            Capture Prakriti, Vikriti, Ahara, Vihara, and Dashavidha parameters in an intuitive, guided interface designed
            for integrative healthcare clinics.
          </p>
          <button className="primary-button" onClick={onStart}>
            Start AYUSH assessment <ArrowRight size={18} />
          </button>
        </div>

        {/* Circular AYUSH Interactive Wheel */}
        <div className="ayush-wheel-wrap">
          <div className="ayush-wheel">
            <div className="wheel-center">
              <Activity size={32} />
              <small>AYUSH</small>
            </div>
            {AYUSH_DOMAINS.map((domain, index) => {
              const angle = index * (360 / AYUSH_DOMAINS.length)
              const isSelected = selectedDomain.name === domain.name
              return (
                <button
                  key={domain.name}
                  className={`wheel-node ${isSelected ? 'active-node' : ''}`}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)`,
                  }}
                  onClick={() => setSelectedDomain(domain)}
                >
                  {domain.name}
                </button>
              )
            })}
          </div>

          {/* Selected Parameter Details Card */}
          <div className="ayush-detail-card" style={{ width: '100%', maxWidth: 460 }}>
            <span className="eyebrow">{selectedDomain.name}</span>
            <h3>{selectedDomain.title}</h3>
            <p>{selectedDomain.desc}</p>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <ShieldCheck size={20} />
        <span>
          <strong>Structured history, not autonomous diagnosis.</strong> Every AYUSH parameter is recorded as a draft for
          qualified practitioner review.
        </span>
      </div>
    </main>
  )
}

/* Helper Components */
function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="feature">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

function Metric({
  icon,
  number,
  label,
  trend,
  danger = false,
}: {
  icon: ReactNode
  number: string
  label: string
  trend: string
  danger?: boolean
}) {
  return (
    <div className="metric">
      <span className="metric-icon">{icon}</span>
      <div>
        <strong>{number}</strong>
        <small>{label}</small>
      </div>
      <span className={`metric-trend ${danger ? 'danger' : ''}`}>{trend}</span>
    </div>
  )
}

export default App
