import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { 
  LayoutDashboard, CalendarDays, Calendar as CalendarIcon, QrCode, DoorClosed, 
  FileText, CheckSquare, BarChart3, Database, Users, ShieldCheck, 
  Plus, RotateCcw, Menu, Clock, Search, Printer, UserCheck, 
  Download, FileCheck, Edit, Trash2, X, LogOut, Award, AlertTriangle,
  CheckCircle2, PlayCircle, Eye, RefreshCw, ChevronRight, Check
} from 'lucide-react';

// --- TYPES & INTERFACES ---
export type Role = 'SUPERADMIN' | 'ADMIN_UNIT' | 'USER';
export type MeetingStatus = 'DRAFT' | 'MENUNGGU_PERSETUJUAN' | 'DISETUJUI' | 'BERLANGSUNG' | 'SELESAI' | 'DIBATALKAN';
export type Priority = 'Rendah' | 'Sedang' | 'Tinggi' | 'Mendesak';
export type RoomStatus = 'TERSEDIA' | 'PERBAIKAN';
export type FollowupStatus = 'Belum Ditindaklanjuti' | 'Dalam Proses' | 'Menunggu Verifikasi' | 'Selesai' | 'Terlambat';

export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: RoomStatus;
  facilities: string[];
}

export interface Meeting {
  id: number;
  letter_number: string;
  title: string;
  type: string;
  classification: string;
  status: MeetingStatus;
  date: string;
  start_time: string;
  end_time: string;
  room_id: number;
  room_name: string;
  unit: string;
  agendas: string;
  content_body: string;
  signer_title: string;
  signer_name: string;
  signer_rank: string;
  signer_nip: string;
  short_link: string;
  created_at: string;
}

export interface Attendance {
  id: number;
  meeting_id: number;
  name: string;
  nip: string;
  unit: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'TERLAMBAT';
  timestamp: string;
}

export interface MinuteHistory {
  editor: string;
  timestamp: string;
  action: string;
}

export interface MeetingMinutes {
  meeting_id: number;
  leader_name: string;
  secretary_name: string;
  discussion: string;
  results: string;
  decisions: string;
  conclusions: string;
  history: MinuteHistory[];
}

export interface Followup {
  id: number;
  meeting_id: number;
  action: string;
  pic: string;
  deadline: string;
  priority: Priority;
  status: FollowupStatus;
}

export interface UserAccount {
  id: number;
  name: string;
  nip: string;
  position: string;
  unit: string;
  username: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip: string;
}

export interface AppStateData {
  units: string[];
  meetingTypes: string[];
  rooms: Room[];
  meetings: Meeting[];
  attendances: Attendance[];
  minutes: MeetingMinutes[];
  followups: Followup[];
  users: UserAccount[];
  auditLogs: AuditLog[];
}

// Default Storage State
const INITIAL_DATA: AppStateData = {
  units: [
    'Subag Umum & Rumah Tangga',
    'Direktorat',
    'Dinas Kesehatan Kota Sukabumi',
    'Bidang Pelayanan Medis',
    'Instalasi Rekam Medis',
    'Bidang Keuangan & Perencanaan',
    'Komite Keperawatan'
  ],
  meetingTypes: ['Rapat Rutin', 'Rapat Koordinasi', 'Rapat Evaluasi', 'Rapat Darurat', 'Lainnya'],
  rooms: [
    { id: 1, name: 'Ruang Rapat Utama Lt. 2', location: 'Gedung Administrasi Lt. 2', capacity: 60, status: 'TERSEDIA', facilities: ['AC', 'Proyektor', 'Sound System', 'Video Conference'] },
    { id: 2, name: 'Ruang Rapat VIP Direksi', location: 'Gedung Direksi Lt. 1', capacity: 25, status: 'TERSEDIA', facilities: ['AC', 'TV Monitor', 'Sound System', 'Microphones'] },
    { id: 3, name: 'Ruang Aula Syamsudin', location: 'Gedung Utama Lt. 3', capacity: 150, status: 'PERBAIKAN', facilities: ['AC', 'Proyektor Dual', 'Stage Sound System'] }
  ],
  meetings: [
    {
      id: 101,
      letter_number: 'B/SDE. 045/000.8.3/5.7.1/2026',
      title: 'Persiapan Akhir Open Recruitment Tenaga Pemasaran',
      type: 'Rapat Koordinasi',
      classification: 'Biasa',
      status: 'DISETUJUI',
      date: '2026-11-16',
      start_time: '08:30',
      end_time: '12:00',
      room_id: 1,
      room_name: 'Ruang Rapat Utama Lt. 2',
      unit: 'Subag Umum & Rumah Tangga',
      agendas: '1. Finalisasi kriteria seleksi tenaga pemasaran\n2. Pembagian tugas pengawas ujian\n3. Penyiapan ruangan & peralatan',
      content_body: 'Mengharap dengan hormat kehadiran Bapak/Ibu/Saudara pada rapat yang akan diselenggarakan. Mengingat pentingnya acara tersebut, kehadiran tepat pada waktunya sangat kami harapkan.',
      signer_title: 'Direktur UOBK RSUD R. Syamsudin, S.H.',
      signer_name: 'Yanyan Rusyandi, S.E., M.Kes.',
      signer_rank: 'Pembina Utama Muda',
      signer_nip: '19700101 199503 1 001',
      short_link: 'https://v.gd/rsud_rapat_101',
      created_at: '2026-11-09 08:00:00'
    },
    {
      id: 102,
      letter_number: 'B/SDE. 046/000.8.3/5.7.1/2026',
      title: 'Evaluasi Klaim BPJS Kesehatan Rawat Inap Periode Q3',
      type: 'Rapat Evaluasi',
      classification: 'Terbatas',
      status: 'BERLANGSUNG',
      date: '2026-11-10',
      start_time: '09:00',
      end_time: '13:00',
      room_id: 2,
      room_name: 'Ruang Rapat VIP Direksi',
      unit: 'Bidang Pelayanan Medis',
      agendas: '1. Rekonsiliasi berkas klaim terpending\n2. Strategi percepatan verifikasi klaim BPJS',
      content_body: 'Mengharap kehadiran Bapak/Ibu Komite Medis dan Verifikator dalam rapat evaluasi klaim.',
      signer_title: 'Direktur UOBK RSUD R. Syamsudin, S.H.',
      signer_name: 'Yanyan Rusyandi, S.E., M.Kes.',
      signer_rank: 'Pembina Utama Muda',
      signer_nip: '19700101 199503 1 001',
      short_link: 'https://v.gd/rsud_rapat_102',
      created_at: '2026-11-08 10:30:00'
    }
  ],
  attendances: [
    { id: 1, meeting_id: 102, name: 'dr. H. Ahmad Fauzi, Sp.PD', nip: '19820415 200801 1 003', unit: 'Komite Medis', status: 'HADIR', timestamp: '2026-11-10 08:55:12' },
    { id: 2, meeting_id: 102, name: 'Dini Herliani, S.Kep., Ners', nip: '19900820 201402 2 004', unit: 'Bidang Keuangan', status: 'HADIR', timestamp: '2026-11-10 09:02:40' }
  ],
  minutes: [
    {
      meeting_id: 101,
      leader_name: 'Yanyan Rusyandi, S.E., M.Kes.',
      secretary_name: 'Deden Herlan Suangsa, SKM.',
      discussion: 'Telah disepakati jumlah alokasi formasi tenaga pemasaran sebanyak 10 orang. Ujian kompetensi berbasis CAT dilaksanakan tanggal 20 November 2026.',
      results: 'Panitia seleksi dibentuk dengan ketua Subag Umum & RT. Pengawasan ujian melibatkan IT RSUD.',
      decisions: '1. Pengumuman dibuka 12 November 2026.\n2. Anggaran operasional disetujui.',
      conclusions: 'Seluruh persiapan fisik dan sistem administrasi siap 100%.',
      history: [{ editor: 'Deden Herlan Suangsa', timestamp: '2026-11-09 10:00:00', action: 'Membuat draft notulen' }]
    }
  ],
  followups: [
    { id: 1, meeting_id: 101, action: 'Finalisasi soal tes kompetensi teknis tenaga pemasaran', pic: 'Deden Herlan Suangsa', deadline: '2026-11-14', priority: 'Tinggi', status: 'Dalam Proses' },
    { id: 2, meeting_id: 102, action: 'Rekonsiliasi berkas klaim rawat inap dengan BPJS cabang', pic: 'Dini Herliani', deadline: '2026-11-08', priority: 'Mendesak', status: 'Terlambat' }
  ],
  users: [
    { id: 1, name: 'Superadmin RSUD', nip: '19700101 199503 1 001', position: 'Direktur RSUD', unit: 'Direktorat', username: 'superadmin', role: 'SUPERADMIN', status: 'ACTIVE' },
    { id: 2, name: 'Deden Herlan Suangsa', nip: '19820512 200501 1 003', position: 'Kasubag Umum', unit: 'Subag Umum & Rumah Tangga', username: 'admin_umum', role: 'ADMIN_UNIT', status: 'ACTIVE' },
    { id: 3, name: 'dr. H. Ahmad Fauzi', nip: '19820415 200801 1 003', position: 'Dokter Spesialis', unit: 'Bidang Pelayanan Medis', username: 'ahmad_fauzi', role: 'USER', status: 'ACTIVE' }
  ],
  auditLogs: [
    { id: 1, timestamp: '2026-11-10 08:00:00', user: 'Superadmin RSUD', action: 'CREATE_MEETING', details: 'Membuat agenda rapat baru #101', ip: '192.168.1.10' },
    { id: 2, timestamp: '2026-11-10 08:55:12', user: 'dr. H. Ahmad Fauzi', action: 'CHECK_IN_ATTENDANCE', details: 'Presensi rapat #102', ip: '192.168.1.45' }
  ]
};

// Logo Component with Image & Vector Fallback
const LogoUOBK = ({ className = "w-8 h-8" }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${className} bg-teal-600 rounded-lg p-1.5 flex items-center justify-center text-white shadow-sm shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          <path d="M50 5 L88 27 L88 73 L50 95 L12 73 L12 27 Z" fill="#0284c7" />
          <path d="M50 20 L75 35 L75 65 L50 80 L25 65 L25 35 Z" fill="#10b981" />
          <circle cx="50" cy="50" r="14" fill="#f59e0b" />
          <rect x="46" y="38" width="8" height="24" fill="#ffffff" />
          <rect x="38" y="46" width="24" height="8" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  return (
    <img 
      src="/logo-uobk.jpg" 
      alt="Logo UOBK RSUD R. Syamsudin" 
      className={`${className} object-contain rounded-lg bg-white p-0.5 shadow-sm shrink-0`} 
      onError={() => setHasError(true)}
    />
  );
};

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('SUPERADMIN');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [timeString, setTimeString] = useState<string>('');

  const [appData, setAppData] = useState<AppStateData>(() => {
    const saved = localStorage.getItem('RSUD_RAPAT_FULL_STATE');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [activeModal, setActiveModal] = useState<'meeting' | 'previewSurat' | 'checkin' | 'room' | 'followup' | 'user' | null>(null);
  const [selectedMeetingForSurat, setSelectedMeetingForSurat] = useState<Meeting | null>(null);
  const [selectedMeetingQR, setSelectedMeetingQR] = useState<number>(101);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Forms
  const [meetingForm, setMeetingForm] = useState({
    id: null as number | null,
    title: '',
    type: 'Rapat Rutin',
    classification: 'Biasa',
    unit: 'Subag Umum & Rumah Tangga',
    date: '2026-11-16',
    start_time: '09:00',
    end_time: '12:00',
    room_id: 1,
    agendas: '',
    content_body: 'Mengharap dengan hormat kehadiran Bapak/Ibu/Saudara pada rapat yang akan diselenggarakan. Mengingat pentingnya acara tersebut, kehadiran tepat pada waktunya sangat kami harapkan.'
  });

  const [checkinForm, setCheckinForm] = useState({
    meeting_id: 101,
    name: '',
    nip: '',
    unit: '',
    status: 'HADIR' as 'HADIR' | 'IZIN' | 'SAKIT' | 'TERLAMBAT'
  });

  const [roomForm, setRoomForm] = useState({
    name: '',
    location: '',
    capacity: 30,
    facilities: '',
    status: 'TERSEDIA' as RoomStatus
  });

  const [followupForm, setFollowupForm] = useState({
    meeting_id: 101,
    action: '',
    pic: '',
    deadline: '',
    priority: 'Sedang' as Priority
  });

  const [userForm, setUserForm] = useState({
    name: '',
    nip: '',
    position: '',
    unit: 'Subag Umum & Rumah Tangga',
    username: '',
    role: 'USER' as Role
  });

  // Filters & Search
  const [searchMeeting, setSearchMeeting] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  // Minutes State
  const [selectedMinutesMeetingId, setSelectedMinutesMeetingId] = useState<number>(101);
  const [minutesForm, setMinutesForm] = useState({
    leader_name: 'Yanyan Rusyandi, S.E., M.Kes.',
    secretary_name: 'Deden Herlan Suangsa, SKM.',
    discussion: '',
    results: '',
    decisions: '',
    conclusions: ''
  });

  useEffect(() => {
    localStorage.setItem('RSUD_RAPAT_FULL_STATE', JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    const existing = appData.minutes.find(m => m.meeting_id === selectedMinutesMeetingId);
    if (existing) {
      setMinutesForm({
        leader_name: existing.leader_name || '',
        secretary_name: existing.secretary_name || '',
        discussion: existing.discussion || '',
        results: existing.results || '',
        decisions: existing.decisions || '',
        conclusions: existing.conclusions || ''
      });
    } else {
      setMinutesForm({
        leader_name: 'Yanyan Rusyandi, S.E., M.Kes.',
        secretary_name: 'Deden Herlan Suangsa, SKM.',
        discussion: '',
        results: '',
        decisions: '',
        conclusions: ''
      });
    }
  }, [selectedMinutesMeetingId, appData.minutes]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('id-ID') + ' WIB');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addAuditLog = (action: string, details: string) => {
    const now = new Date();
    const ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + now.toLocaleTimeString('id-ID');
    const newLog: AuditLog = {
      id: appData.auditLogs.length + 1,
      timestamp: ts,
      user: currentRole === 'SUPERADMIN' ? 'Superadmin Web' : currentRole === 'ADMIN_UNIT' ? 'Admin Unit Subag' : 'dr. H. Ahmad Fauzi',
      action, details,
      ip: '192.168.1.' + Math.floor(Math.random() * 80 + 10)
    };
    setAppData(prev => ({ ...prev, auditLogs: [newLog, ...prev.auditLogs] }));
  };

  const resetDemoData = () => {
    if (window.confirm('Reset ulang seluruh data ke versi standar demo?')) {
      setAppData(INITIAL_DATA);
      localStorage.removeItem('RSUD_RAPAT_FULL_STATE');
      showToast('Data berhasil di-reset ke kondisi awal.', 'info');
    }
  };

  const handleSaveMeeting = (e: FormEvent) => {
    e.preventDefault();
    const roomObj = appData.rooms.find(r => r.id === Number(meetingForm.room_id));
    if (roomObj && roomObj.status === 'PERBAIKAN') {
      alert('Peringatan: Ruang rapat sedang dalam perbaikan!');
      return;
    }

    const conflict = appData.meetings.find(m => {
      if (meetingForm.id && m.id === meetingForm.id) return false;
      if (m.room_id === Number(meetingForm.room_id) && m.date === meetingForm.date && m.status !== 'DIBATALKAN') {
        return (meetingForm.start_time < m.end_time && meetingForm.end_time > m.start_time);
      }
      return false;
    });

    if (conflict) {
      alert(`BENTURAN JADWAL!\nRuangan "${roomObj?.name}" sudah digunakan oleh "${conflict.title}" pada jam ${conflict.start_time} - ${conflict.end_time}`);
      return;
    }

    if (meetingForm.id) {
      setAppData(prev => ({
        ...prev,
        meetings: prev.meetings.map(m => m.id === meetingForm.id ? {
          ...m, ...meetingForm, room_name: roomObj ? roomObj.name : ''
        } as Meeting : m)
      }));
      addAuditLog('EDIT_MEETING', `Mengubah agenda rapat ID #${meetingForm.id}`);
      showToast('Agenda rapat diperbarui.', 'success');
    } else {
      const newId = 100 + appData.meetings.length + 1;
      const newM: Meeting = {
        ...meetingForm,
        id: newId,
        letter_number: `B/SDE. 0${newId}/000.8.3/5.7.1/2026`,
        status: currentRole === 'SUPERADMIN' ? 'DISETUJUI' : 'MENUNGGU_PERSETUJUAN',
        room_name: roomObj ? roomObj.name : '',
        signer_title: 'Direktur UOBK RSUD R. Syamsudin, S.H.',
        signer_name: 'Yanyan Rusyandi, S.E., M.Kes.',
        signer_rank: 'Pembina Utama Muda',
        signer_nip: '19700101 199503 1 001',
        short_link: `https://v.gd/rsud_rapat_${newId}`,
        created_at: new Date().toISOString()
      };
      setAppData(prev => ({ ...prev, meetings: [...prev.meetings, newM] }));
      addAuditLog('CREATE_MEETING', `Membuat agenda rapat "${newM.title}"`);
      showToast('Agenda rapat baru berhasil diajukan.', 'success');
    }
    setActiveModal(null);
  };

  const handleApproveMeeting = (id: number) => {
    setAppData(prev => ({
      ...prev,
      meetings: prev.meetings.map(m => m.id === id ? { ...m, status: 'DISETUJUI' } : m)
    }));
    addAuditLog('APPROVE_MEETING', `Menyetujui agenda rapat #${id}`);
    showToast('Undangan rapat telah disetujui.', 'success');
  };

  const handleDeleteMeeting = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus agenda rapat ini?')) {
      setAppData(prev => ({ ...prev, meetings: prev.meetings.filter(m => m.id !== id) }));
      addAuditLog('DELETE_MEETING', `Menghapus rapat ID #${id}`);
      showToast('Agenda rapat dihapus.', 'info');
    }
  };

  const handleEditMeeting = (m: Meeting) => {
    setMeetingForm({
      id: m.id,
      title: m.title,
      type: m.type,
      classification: m.classification,
      unit: m.unit,
      date: m.date,
      start_time: m.start_time,
      end_time: m.end_time,
      room_id: m.room_id,
      agendas: m.agendas,
      content_body: m.content_body
    });
    setActiveModal('meeting');
  };

  const handleCheckinSubmit = (e: FormEvent) => {
    e.preventDefault();
    const meetingId = Number(checkinForm.meeting_id);
    const duplicate = appData.attendances.find(a => 
      a.meeting_id === meetingId && 
      ((checkinForm.nip && a.nip === checkinForm.nip) || (a.name.toLowerCase() === checkinForm.name.toLowerCase()))
    );

    if (duplicate) {
      alert(`ABSENSI GANDA!\nPeserta a.n "${checkinForm.name}" sudah presensi pada jam ${duplicate.timestamp}.`);
      return;
    }

    const now = new Date();
    const ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + now.toLocaleTimeString('id-ID');
    const newAtt: Attendance = {
      id: appData.attendances.length + 1,
      meeting_id: meetingId,
      name: checkinForm.name,
      nip: checkinForm.nip,
      unit: checkinForm.unit,
      status: checkinForm.status,
      timestamp: ts
    };

    setAppData(prev => ({ ...prev, attendances: [...prev.attendances, newAtt] }));
    addAuditLog('CHECK_IN_ATTENDANCE', `Presensi ${checkinForm.name}`);
    showToast('Presensi berhasil dicatat.', 'success');
    setActiveModal(null);
  };

  const handleSaveRoom = (e: FormEvent) => {
    e.preventDefault();
    const facilitiesArr = roomForm.facilities.split(',').map(s => s.trim());
    const newRoom: Room = {
      id: appData.rooms.length + 1,
      name: roomForm.name,
      location: roomForm.location,
      capacity: Number(roomForm.capacity),
      facilities: facilitiesArr,
      status: roomForm.status
    };
    setAppData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    addAuditLog('ADD_ROOM', `Menambah ruang rapat "${roomForm.name}"`);
    showToast('Ruang rapat berhasil ditambahkan.', 'success');
    setActiveModal(null);
  };

  const handleSaveFollowup = (e: FormEvent) => {
    e.preventDefault();
    const newF: Followup = {
      id: appData.followups.length + 1,
      meeting_id: Number(followupForm.meeting_id),
      action: followupForm.action,
      pic: followupForm.pic,
      deadline: followupForm.deadline,
      priority: followupForm.priority,
      status: 'Dalam Proses'
    };
    setAppData(prev => ({ ...prev, followups: [...prev.followups, newF] }));
    addAuditLog('ADD_FOLLOWUP', `Menambah tindak lanjut PIC: ${followupForm.pic}`);
    showToast('Tindak lanjut ditambahkan.', 'success');
    setActiveModal(null);
  };

  const handleToggleFollowupStatus = (id: number) => {
    setAppData(prev => ({
      ...prev,
      followups: prev.followups.map(f => f.id === id ? {
        ...f, status: f.status === 'Selesai' ? 'Dalam Proses' : 'Selesai'
      } : f)
    }));
    showToast('Status tindak lanjut diperbarui.', 'info');
  };

  const handleSaveUser = (e: FormEvent) => {
    e.preventDefault();
    const newUser: UserAccount = {
      id: appData.users.length + 1,
      name: userForm.name,
      nip: userForm.nip,
      position: userForm.position,
      unit: userForm.unit,
      username: userForm.username,
      role: userForm.role,
      status: 'ACTIVE'
    };
    setAppData(prev => ({ ...prev, users: [...prev.users, newUser] }));
    addAuditLog('ADD_USER', `Menambah user ${userForm.username}`);
    showToast('User baru berhasil ditambahkan.', 'success');
    setActiveModal(null);
  };

  const handleSaveMinutes = (e: FormEvent) => {
    e.preventDefault();
    const meetingId = Number(selectedMinutesMeetingId);
    const existingIndex = appData.minutes.findIndex(m => m.meeting_id === meetingId);
    const now = new Date();
    const ts = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + now.toLocaleTimeString('id-ID');
    const historyEntry: MinuteHistory = { 
      editor: currentRole === 'SUPERADMIN' ? 'Superadmin Web' : 'Admin Unit', 
      timestamp: ts, 
      action: 'Pembaruan Notulen Rapat' 
    };

    let updatedMinutes = [...appData.minutes];
    if (existingIndex !== -1) {
      updatedMinutes[existingIndex] = {
        ...updatedMinutes[existingIndex],
        ...minutesForm,
        history: [...(updatedMinutes[existingIndex].history || []), historyEntry]
      };
    } else {
      updatedMinutes.push({
        meeting_id: meetingId,
        ...minutesForm,
        history: [historyEntry]
      });
    }

    setAppData(prev => ({ ...prev, minutes: updatedMinutes }));
    addAuditLog('UPDATE_MINUTES', `Memperbarui notulen rapat #${meetingId}`);
    showToast('Notulen rapat berhasil disimpan.', 'success');
  };

  const filteredMeetings = appData.meetings.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(searchMeeting.toLowerCase()) || 
                        (m.letter_number && m.letter_number.toLowerCase().includes(searchMeeting.toLowerCase()));
    const matchStatus = filterStatus ? m.status === filterStatus : true;
    const matchType = filterType ? m.type === filterType : true;
    return matchSearch && matchStatus && matchType;
  });

  const totalMeetings = appData.meetings.length;
  const scheduledMeetings = appData.meetings.filter(m => m.status === 'DISETUJUI' || m.status === 'MENUNGGU_PERSETUJUAN').length;
  const ongoingMeetings = appData.meetings.filter(m => m.status === 'BERLANGSUNG').length;
  const completedMeetings = appData.meetings.filter(m => m.status === 'SELESAI').length;
  const pendingFollowups = appData.followups.filter(f => f.status !== 'Selesai').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 antialiased overflow-hidden font-sans flex-col">

      {/* TOP CONTROL BAR FOR DEMO ROLE SWITCHING */}
      <div className="no-print bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap justify-between items-center z-50 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">Demo Control</span>
          <span className="text-slate-300 font-medium hidden sm:inline">Role Aktif Saat Ini:</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px] hidden md:inline">Ganti Peran:</span>
          <div className="inline-flex rounded-md shadow-sm bg-slate-800 p-0.5">
            <button 
              onClick={() => setCurrentRole('SUPERADMIN')} 
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${currentRole === 'SUPERADMIN' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              SUPERADMIN
            </button>
            <button 
              onClick={() => setCurrentRole('ADMIN_UNIT')} 
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${currentRole === 'ADMIN_UNIT' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              ADMIN UNIT
            </button>
            <button 
              onClick={() => setCurrentRole('USER')} 
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${currentRole === 'USER' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
            >
              PESERTA / PENGGUNA
            </button>
          </div>
          <button onClick={resetDemoData} className="ml-2 text-slate-400 hover:text-white text-xs underline flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reset Data
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* SIDEBAR */}
        <aside className={`no-print bg-sky-950 text-white ${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 flex flex-col justify-between transition-all duration-300 z-40`}>
          {/* Header Brand */}
          <div className="p-4 border-b border-sky-900 flex items-center space-x-3">
            <LogoUOBK className="w-9 h-9" />
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-xs tracking-tight text-white leading-tight">APLIKASI RAPAT</h1>
                <p className="text-[10px] text-sky-200 uppercase font-semibold tracking-wider truncate">UOBK RSUD R. SYAMSUDIN</p>
                <p className="text-[9px] text-sky-300">KOTA SUKABUMI</p>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {sidebarOpen && <div className="px-3 py-1.5 text-[10px] font-bold text-sky-300 uppercase tracking-wider">Navigasi Utama</div>}
            
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'meetings', label: 'Manajemen Rapat', icon: CalendarDays },
              { id: 'calendar', label: 'Kalender Jadwal', icon: CalendarIcon },
              { id: 'attendance', label: 'Absensi QR Code', icon: QrCode },
              { id: 'rooms', label: 'Ruang Rapat', icon: DoorClosed },
              { id: 'minutes', label: 'Notulen & Hasil', icon: FileText },
              { id: 'followups', label: 'Tindak Lanjut', icon: CheckSquare, badge: pendingFollowups },
              { id: 'reports', label: 'Laporan & Rekap', icon: BarChart3 }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all gap-2.5 ${currentTab === item.id ? 'bg-sky-800 text-white font-semibold' : 'text-sky-100 hover:bg-sky-900'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {item.badge !== undefined && item.badge > 0 && sidebarOpen && (
                  <span className="ml-auto bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Superadmin Menu */}
            {currentRole === 'SUPERADMIN' && (
              <div className="pt-3 border-t border-sky-900/60 mt-3 space-y-1">
                {sidebarOpen && <div className="px-3 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">Superadmin Menu</div>}
                {[
                  { id: 'masterdata', label: 'Master Data', icon: Database },
                  { id: 'users', label: 'Manajemen User', icon: Users },
                  { id: 'auditlog', label: 'Audit Log System', icon: ShieldCheck }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all gap-2.5 ${currentTab === item.id ? 'bg-sky-800 text-white font-semibold' : 'text-sky-100 hover:bg-sky-900'}`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Badge */}
          <div className="p-3 bg-sky-950 border-t border-sky-900 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-sky-500">
                {currentRole === 'SUPERADMIN' ? 'SA' : currentRole === 'ADMIN_UNIT' ? 'AU' : 'AF'}
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden text-xs">
                  <div className="font-semibold text-white truncate">
                    {currentRole === 'SUPERADMIN' ? 'Superadmin Web' : currentRole === 'ADMIN_UNIT' ? 'Admin Unit Subag' : 'dr. H. Ahmad Fauzi'}
                  </div>
                  <div className="text-[10px] text-sky-300 truncate">
                    {currentRole === 'SUPERADMIN' ? 'Hak Akses Penuh' : currentRole === 'ADMIN_UNIT' ? 'Subag Umum & RT' : 'Peserta / Pegawai'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">

          {/* Top Header */}
          <header className="no-print bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-700">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-base font-bold text-slate-800 capitalize">
                  {currentTab === 'dashboard' && 'Dashboard Utama'}
                  {currentTab === 'meetings' && 'Manajemen Rapat & Undangan'}
                  {currentTab === 'calendar' && 'Kalender Jadwal Rapat'}
                  {currentTab === 'attendance' && 'Absensi Digital QR Code'}
                  {currentTab === 'rooms' && 'Ruang Rapat & Fasilitas'}
                  {currentTab === 'minutes' && 'Notulen & Hasil Rapat'}
                  {currentTab === 'followups' && 'Tindak Lanjut Keputusan'}
                  {currentTab === 'reports' && 'Laporan & Rekapitulasi'}
                  {currentTab === 'masterdata' && 'Master Data System'}
                  {currentTab === 'users' && 'Manajemen Pengguna'}
                  {currentTab === 'auditlog' && 'Audit Log Keamanan'}
                </h2>
                <p className="text-xs text-slate-500">Sistem Informasi Terintegrasi Kegiatan Rapat UOBK RSUD R. Syamsudin, S.H.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{timeString}</span>
              </span>

              {currentRole !== 'USER' && (
                <button 
                  onClick={() => {
                    setMeetingForm({
                      id: null, title: '', type: 'Rapat Rutin', classification: 'Biasa',
                      unit: 'Subag Umum & Rumah Tangga', date: '2026-11-16', start_time: '09:00',
                      end_time: '12:00', room_id: 1, agendas: '',
                      content_body: 'Mengharap kehadiran tepat pada waktunya.'
                    });
                    setActiveModal('meeting');
                  }} 
                  className="bg-sky-700 hover:bg-sky-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Buat Rapat Baru
                </button>
              )}
            </div>
          </header>

          {/* Scrollable View Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

            {/* TAB 1: DASHBOARD */}
            {currentTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* KPI STAT CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider">Total Rapat</span>
                      <CalendarDays className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{totalMeetings}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Keseluruhan agenda</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider">Dijadwalkan</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{scheduledMeetings}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Menunggu waktu</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider">Berlangsung</span>
                      <PlayCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{ongoingMeetings}</div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-1">Aktif saat ini</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider">Selesai</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{completedMeetings}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Telah terlaksana</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider">Tindak Lanjut</span>
                      <AlertTriangle className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{pendingFollowups}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Belum selesai</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider">Kehadiran</span>
                      <Users className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="text-2xl font-bold text-teal-600">88%</div>
                    <div className="text-[10px] text-slate-500 mt-1">Rata-rata presensi</div>
                  </div>
                </div>

                {/* TODAY TIMELINE & DISTRIBUTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's Schedule */}
                  <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-sky-600" /> Agenda Rapat Hari Ini (10 Nopember 2026)
                      </h3>
                      <span className="text-[11px] bg-sky-50 text-sky-700 font-medium px-2 py-0.5 rounded">Hari Ini</span>
                    </div>

                    <div className="space-y-3">
                      {appData.meetings.map(m => (
                        <div key={m.id} className={`p-3 rounded-lg border-l-4 ${m.status === 'BERLANGSUNG' ? 'border-emerald-500 bg-emerald-50/50' : 'border-sky-600 bg-slate-50'} text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{m.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-3">
                              <span>🕒 {m.start_time} - {m.end_time} WIB</span>
                              <span>📍 {m.room_name}</span>
                              <span>🏢 {m.unit}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.status === 'BERLANGSUNG' ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-sky-100 text-sky-800'}`}>
                              {m.status}
                            </span>
                            <button onClick={() => { setSelectedMeetingForSurat(m); setActiveModal('previewSurat'); }} className="px-2 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded text-[11px] font-semibold">
                              Pratinjau Surat
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Distribution */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Distribusi Jenis Rapat</h3>
                      <div className="space-y-3 text-xs">
                        {appData.meetingTypes.map((type, idx) => {
                          const count = appData.meetings.filter(m => m.type === type).length;
                          const pct = Math.round((count / (totalMeetings || 1)) * 100);
                          return (
                            <div key={idx}>
                              <div className="flex justify-between text-slate-600 font-medium mb-1">
                                <span>{type}</span>
                                <span className="font-bold">{count} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-sky-600 h-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500 italic">
                      * Data diupdate secara real-time berdasarkan aktivitas admin unit.
                    </div>
                  </div>
                </div>

                {/* EVALUATION INDICATORS */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" /> Indikator Kinerja Pengelolaan Rapat (Dashboard Evaluasi RSUD)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg bg-slate-50">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>1. Ketepatan Pelaksanaan Agenda</span>
                        <span className="font-bold text-sky-700">92%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-sky-600 h-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-500">Target: 95% (Rapat Terlaksana / Dijadwalkan)</span>
                    </div>

                    <div className="p-3 border rounded-lg bg-slate-50">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>2. Kelengkapan Dokumen Notulen</span>
                        <span className="font-bold text-teal-700">100%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-teal-600 h-full" style={{ width: '100%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-500">Target: 100% (Notulen / Rapat Selesai)</span>
                    </div>

                    <div className="p-3 border rounded-lg bg-slate-50">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>3. Penyelesaian Tindak Lanjut</span>
                        <span className="font-bold text-purple-700">75%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-purple-600 h-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-[10px] text-slate-500">Target: 90% (Status Tindak Lanjut Selesai)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: MANAJEMEN RAPAT */}
            {currentTab === 'meetings' && (
              <div className="space-y-4">
                
                {/* Search & Action Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        value={searchMeeting} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchMeeting(e.target.value)} 
                        placeholder="Cari judul rapat / nomor surat..." 
                        className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <select 
                      value={filterStatus} 
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)} 
                      className="border border-slate-200 rounded-lg text-xs p-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="">Semua Status</option>
                      <option value="DRAFT">Draft</option>
                      <option value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</option>
                      <option value="DISETUJUI">Disetujui / Diterbitkan</option>
                      <option value="BERLANGSUNG">Berlangsung</option>
                      <option value="SELESAI">Selesai</option>
                      <option value="DIBATALKAN">Dibatalkan</option>
                    </select>

                    <select 
                      value={filterType} 
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)} 
                      className="border border-slate-200 rounded-lg text-xs p-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="">Semua Jenis Rapat</option>
                      {appData.meetingTypes.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {currentRole !== 'USER' && (
                    <button 
                      onClick={() => {
                        setMeetingForm({
                          id: null, title: '', type: 'Rapat Rutin', classification: 'Biasa',
                          unit: 'Subag Umum & Rumah Tangga', date: '2026-11-16', start_time: '09:00',
                          end_time: '12:00', room_id: 1, agendas: '', content_body: 'Mengharap kehadiran tepat pada waktunya.'
                        });
                        setActiveModal('meeting');
                      }} 
                      className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Buat Agenda Rapat
                    </button>
                  )}
                </div>

                {/* Meeting Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold uppercase tracking-wider">
                          <th className="p-3">Nomor Surat / Judul Rapat</th>
                          <th className="p-3">Waktu & Lokasi</th>
                          <th className="p-3">Penyelenggara / Unit</th>
                          <th className="p-3">Sifat Surat</th>
                          <th className="p-3">Status Persetujuan</th>
                          <th className="p-3 text-center">Aksi / Dokumen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredMeetings.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 italic">Tidak ada agenda rapat ditemukan.</td>
                          </tr>
                        ) : (
                          filteredMeetings.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3">
                                <div className="font-bold text-slate-800 text-xs">{m.title}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{m.letter_number}</div>
                              </td>
                              <td className="p-3">
                                <div className="font-medium text-slate-700">{m.date} ({m.start_time} - {m.end_time})</div>
                                <div className="text-[10px] text-slate-500">{m.room_name}</div>
                              </td>
                              <td className="p-3">
                                <div className="text-xs text-slate-700">{m.unit}</div>
                                <div className="text-[10px] text-slate-500 font-semibold">{m.type}</div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  m.classification === 'Biasa' ? 'bg-slate-100 text-slate-700' :
                                  m.classification === 'Terbatas' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {m.classification}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                  m.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' :
                                  m.status === 'BERLANGSUNG' ? 'bg-blue-100 text-blue-800 font-bold animate-pulse' :
                                  m.status === 'SELESAI' ? 'bg-slate-100 text-slate-800' :
                                  m.status === 'MENUNGGU_PERSETUJUAN' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {m.status}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button 
                                    onClick={() => { setSelectedMeetingForSurat(m); setActiveModal('previewSurat'); }} 
                                    className="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-[11px] font-medium inline-flex items-center gap-1"
                                    title="Pratinjau Surat Undangan"
                                  >
                                    <FileCheck className="w-3.5 h-3.5" /> Surat
                                  </button>

                                  {currentRole === 'SUPERADMIN' && m.status === 'MENUNGGU_PERSETUJUAN' && (
                                    <button onClick={() => handleApproveMeeting(m.id)} className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[11px] font-semibold">
                                      Setujui
                                    </button>
                                  )}

                                  {currentRole !== 'USER' && (
                                    <>
                                      <button onClick={() => handleEditMeeting(m)} className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg">
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => handleDeleteMeeting(m.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-lg">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: KALENDER RAPAT */}
            {currentTab === 'calendar' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800">Kalender Kegiatan Rapat (Nopember 2026)</h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Dijadwalkan</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Disetujui/Aktif</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Selesai</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, idx) => (
                    <div key={idx} className="bg-slate-100 p-2 text-center text-xs font-bold text-slate-600 uppercase">{day}</div>
                  ))}
                  
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                    const dayStr = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                    const events = appData.meetings.filter(m => m.date === dayStr);

                    return (
                      <div key={dayNum} className="bg-white p-2 min-h-[90px] border-t flex flex-col justify-between hover:bg-slate-50">
                        <div className="text-xs font-bold text-slate-500 mb-1">{dayNum}</div>
                        <div className="space-y-1 overflow-y-auto flex-1">
                          {events.map(ev => (
                            <div 
                              key={ev.id} 
                              onClick={() => { setSelectedMeetingForSurat(ev); setActiveModal('previewSurat'); }} 
                              className={`p-1 rounded text-[10px] font-semibold text-white truncate cursor-pointer ${
                                ev.status === 'BERLANGSUNG' ? 'bg-emerald-600' :
                                ev.status === 'SELESAI' ? 'bg-blue-600' : 'bg-amber-500'
                              }`} 
                              title={ev.title}
                            >
                              {ev.start_time} {ev.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: ABSENSI DIGITAL QR CODE */}
            {currentTab === 'attendance' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* QR Display Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Absensi Digital QR Code</h3>
                  <p className="text-xs text-slate-500 mb-4">Pilih rapat untuk menampilkan QR Code & Link</p>

                  <select 
                    value={selectedMeetingQR} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedMeetingQR(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg text-xs p-2 mb-4 font-semibold text-slate-700 focus:ring-2 focus:ring-sky-500"
                  >
                    {appData.meetings.map(m => (
                      <option key={m.id} value={m.id}>{m.title} ({m.date})</option>
                    ))}
                  </select>

                  {/* QR Simulator Box */}
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl mb-3 flex flex-col items-center justify-center w-56 h-56 shadow-inner">
                    <QrCode className="w-32 h-32 text-sky-900" />
                    <span className="text-[10px] text-slate-400 mt-2 font-mono">RSUD-QR-VERIFIED</span>
                  </div>

                  {/* v.gd Short Link Box */}
                  <div className="w-full bg-sky-50 border border-sky-100 p-2.5 rounded-lg text-center mb-4">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">Short Link v.gd Resmi:</span>
                    <a 
                      href={appData.meetings.find(m => m.id === selectedMeetingQR)?.short_link || '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-sky-700 hover:underline break-all"
                    >
                      {appData.meetings.find(m => m.id === selectedMeetingQR)?.short_link || 'https://v.gd/rsud_rapat_001'}
                    </a>
                  </div>

                  <div className="flex gap-2 w-full">
                    <button onClick={() => window.print()} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5">
                      <Printer className="w-3.5 h-3.5" /> Cetak QR
                    </button>
                    <button onClick={() => setActiveModal('checkin')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" /> Presensi Manual
                    </button>
                  </div>
                </div>

                {/* Attendance Log Table */}
                <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Rekapitulasi Kehadiran Peserta</h3>
                      <p className="text-xs text-slate-500">Daftar presensi terverifikasi real-time</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 border-b">
                          <th className="p-2.5">Waktu Presensi</th>
                          <th className="p-2.5">Nama Peserta / NIP</th>
                          <th className="p-2.5">Unit Kerja</th>
                          <th className="p-2.5">Status Kehadiran</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {appData.attendances.filter(a => a.meeting_id === selectedMeetingQR).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-slate-400 italic">Belum ada peserta melakukan presensi pada rapat ini.</td>
                          </tr>
                        ) : (
                          appData.attendances.filter(a => a.meeting_id === selectedMeetingQR).map(a => (
                            <tr key={a.id} className="hover:bg-slate-50">
                              <td className="p-2.5 text-slate-500 font-mono text-[11px]">{a.timestamp}</td>
                              <td className="p-2.5 font-semibold text-slate-800">
                                {a.name}
                                <br />
                                <span className="text-[10px] font-normal text-slate-500">NIP: {a.nip || '-'}</span>
                              </td>
                              <td className="p-2.5 text-slate-600">{a.unit}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {a.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: RUANG RAPAT */}
            {currentTab === 'rooms' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Manajemen Ruangan & Fasilitas Rapat</h3>
                    <p className="text-xs text-slate-500">Kapasitas dan status ketersediaan fasilitas</p>
                  </div>
                  {currentRole === 'SUPERADMIN' && (
                    <button onClick={() => setActiveModal('room')} className="bg-sky-700 hover:bg-sky-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Plus className="w-4 h-4" /> Tambah Ruang Rapat
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {appData.rooms.map(r => (
                    <div key={r.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm text-slate-800">{r.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'TERSEDIA' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">📍 {r.location} (Kapasitas: {r.capacity} Orang)</p>
                      <div className="flex flex-wrap gap-1">
                        {r.facilities.map((f, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">{f}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: NOTULEN & HASIL RAPAT */}
            {currentTab === 'minutes' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Pendokumentasian Notulen & Hasil Rapat</h3>
                    <p className="text-xs text-slate-500">Pencatatan resmi keputusan rapat manajemen</p>
                  </div>
                  <select 
                    value={selectedMinutesMeetingId} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedMinutesMeetingId(Number(e.target.value))}
                    className="border border-slate-200 rounded-lg text-xs p-2 font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                  >
                    {appData.meetings.map(m => (
                      <option key={m.id} value={m.id}>{m.title} ({m.date})</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSaveMinutes} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pimpinan Rapat *</label>
                      <input 
                        type="text" 
                        required 
                        value={minutesForm.leader_name} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMinutesForm({ ...minutesForm, leader_name: e.target.value })} 
                        className="w-full p-2 border rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Notulis *</label>
                      <input 
                        type="text" 
                        required 
                        value={minutesForm.secretary_name} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMinutesForm({ ...minutesForm, secretary_name: e.target.value })} 
                        className="w-full p-2 border rounded-lg" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pokok Pembahasan *</label>
                    <textarea 
                      rows={3} 
                      required 
                      value={minutesForm.discussion} 
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMinutesForm({ ...minutesForm, discussion: e.target.value })} 
                      placeholder="Uraikan pokok pembahasan..." 
                      className="w-full p-2 border rounded-lg" 
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Keputusan Rapat *</label>
                    <textarea 
                      rows={3} 
                      required 
                      value={minutesForm.decisions} 
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMinutesForm({ ...minutesForm, decisions: e.target.value })} 
                      placeholder="Uraikan poin keputusan final..." 
                      className="w-full p-2 border rounded-lg" 
                    />
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-[10px] text-slate-400">Status Dokumentasi: Terverifikasi Notulis</span>
                    <button type="submit" className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-lg font-semibold shadow">
                      Simpan Dokumen Notulen
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 7: TINDAK LANJUT */}
            {currentTab === 'followups' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Monitoring Tindak Lanjut Rapat</h3>
                    <p className="text-xs text-slate-500">Pemantauan progres pelaksanaan keputusan rapat</p>
                  </div>
                  {currentRole !== 'USER' && (
                    <button onClick={() => setActiveModal('followup')} className="bg-sky-700 hover:bg-sky-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Plus className="w-4 h-4" /> Tambah Tindak Lanjut
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b uppercase font-semibold">
                        <th className="p-3">Uraian Keputusan & Tindak Lanjut</th>
                        <th className="p-3">Penanggung Jawab (PIC)</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Prioritas</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appData.followups.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-800">{f.action}</td>
                          <td className="p-3 text-slate-700 font-medium">{f.pic}</td>
                          <td className="p-3 font-mono text-slate-600">{f.deadline}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.priority === 'Mendesak' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {f.priority}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                              f.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {f.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => handleToggleFollowupStatus(f.id)} 
                              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-[11px] font-semibold"
                            >
                              Ubah Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 8: LAPORAN & REKAP */}
            {currentTab === 'reports' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Laporan & Rekapitulasi Kegiatan Rapat</h3>
                <p className="text-xs text-slate-500 mb-4">Unduh rekapitulasi data aktual rapat sesuai kebutuhan monitoring & evaluasi</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-xl bg-slate-50 hover:bg-white transition-all">
                    <h4 className="font-bold text-xs text-slate-800 mb-1">Laporan Keseluruhan Rapat</h4>
                    <p className="text-[11px] text-slate-500 mb-3">Rekapitulasi seluruh agenda rapat unit kerja periode 2026.</p>
                    <button onClick={() => window.print()} className="bg-sky-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium w-full flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Cetak Laporan PDF
                    </button>
                  </div>

                  <div className="p-4 border rounded-xl bg-slate-50 hover:bg-white transition-all">
                    <h4 className="font-bold text-xs text-slate-800 mb-1">Rekap Kehadiran Peserta</h4>
                    <p className="text-[11px] text-slate-500 mb-3">Rekapitulasi tingkat presensi peserta per unit kerja.</p>
                    <button onClick={() => window.print()} className="bg-teal-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium w-full flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Cetak Rekap Presensi
                    </button>
                  </div>

                  <div className="p-4 border rounded-xl bg-slate-50 hover:bg-white transition-all">
                    <h4 className="font-bold text-xs text-slate-800 mb-1">Laporan Tindak Lanjut</h4>
                    <p className="text-[11px] text-slate-500 mb-3">Status dan keterlambatan tindak lanjut keputusan rapat.</p>
                    <button onClick={() => window.print()} className="bg-purple-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium w-full flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Cetak Evaluasi PIC
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUPERADMIN TABS */}
            {currentRole === 'SUPERADMIN' && currentTab === 'masterdata' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Master Data System</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border p-4 rounded-xl bg-slate-50">
                    <h4 className="font-bold text-xs mb-2">Master Unit Kerja</h4>
                    <ul className="divide-y bg-white rounded border text-xs">
                      {appData.units.map((u, i) => (
                        <li key={i} className="p-2 flex justify-between"><span>{u}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="border p-4 rounded-xl bg-slate-50">
                    <h4 className="font-bold text-xs mb-2">Master Jenis Rapat</h4>
                    <ul className="divide-y bg-white rounded border text-xs">
                      {appData.meetingTypes.map((t, i) => (
                        <li key={i} className="p-2 flex justify-between"><span>{t}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {currentRole === 'SUPERADMIN' && currentTab === 'users' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800">Manajemen Pengguna (RBAC)</h3>
                  <button onClick={() => setActiveModal('user')} className="bg-sky-700 text-white px-3 py-1.5 rounded text-xs font-semibold">
                    + Tambah User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 border-b">
                        <th className="p-2.5">Nama & NIP</th>
                        <th className="p-2.5">Jabatan & Unit</th>
                        <th className="p-2.5">Role</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {appData.users.map(u => (
                        <tr key={u.id}>
                          <td className="p-2.5 font-bold">{u.name}<br/><span className="font-normal text-[10px]">{u.nip}</span></td>
                          <td className="p-2.5">{u.position}<br/><span className="text-[10px] text-slate-500">{u.unit}</span></td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">{u.role}</span></td>
                          <td className="p-2.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{u.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentRole === 'SUPERADMIN' && currentTab === 'auditlog' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Audit Log System Activity</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left font-mono">
                    <thead>
                      <tr className="bg-slate-100 border-b font-sans font-semibold">
                        <th className="p-2.5">Waktu</th>
                        <th className="p-2.5">User</th>
                        <th className="p-2.5">Aksi</th>
                        <th className="p-2.5">Rincian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {appData.auditLogs.map(l => (
                        <tr key={l.id}>
                          <td className="p-2.5 text-slate-500">{l.timestamp}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{l.user}</td>
                          <td className="p-2.5"><span className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-bold">{l.action}</span></td>
                          <td className="p-2.5 text-slate-700">{l.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL 1: CREATE / EDIT MEETING */}
      {activeModal === 'meeting' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-sky-950 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Buat Agenda Rapat Baru
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveMeeting} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Rapat *</label>
                <input 
                  type="text" 
                  required 
                  value={meetingForm.title} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setMeetingForm({ ...meetingForm, title: e.target.value })} 
                  placeholder="Contoh: Rapat Evaluasi Pelayanan..." 
                  className="w-full p-2 border rounded-lg" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Rapat *</label>
                  <select 
                    value={meetingForm.type} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMeetingForm({ ...meetingForm, type: e.target.value })} 
                    className="w-full p-2 border rounded-lg"
                  >
                    {appData.meetingTypes.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sifat Surat *</label>
                  <select 
                    value={meetingForm.classification} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMeetingForm({ ...meetingForm, classification: e.target.value })} 
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Terbatas">Terbatas</option>
                    <option value="Rahasia">Rahasia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Penyelenggara *</label>
                  <select 
                    value={meetingForm.unit} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMeetingForm({ ...meetingForm, unit: e.target.value })} 
                    className="w-full p-2 border rounded-lg"
                  >
                    {appData.units.map((u, idx) => <option key={idx} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal *</label>
                  <input 
                    type="date" 
                    required 
                    value={meetingForm.date} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMeetingForm({ ...meetingForm, date: e.target.value })} 
                    className="w-full p-2 border rounded-lg" 
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu Mulai *</label>
                  <input 
                    type="time" 
                    required 
                    value={meetingForm.start_time} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMeetingForm({ ...meetingForm, start_time: e.target.value })} 
                    className="w-full p-2 border rounded-lg" 
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu Selesai *</label>
                  <input 
                    type="time" 
                    required 
                    value={meetingForm.end_time} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMeetingForm({ ...meetingForm, end_time: e.target.value })} 
                    className="w-full p-2 border rounded-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ruang Rapat *</label>
                <select 
                  value={meetingForm.room_id} 
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setMeetingForm({ ...meetingForm, room_id: Number(e.target.value) })} 
                  className="w-full p-2 border rounded-lg"
                >
                  {appData.rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (Kapasitas: {r.capacity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agenda Pembahasan *</label>
                <textarea 
                  rows={2} 
                  required 
                  value={meetingForm.agendas} 
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMeetingForm({ ...meetingForm, agendas: e.target.value })} 
                  className="w-full p-2 border rounded-lg" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold shadow">Simpan & Ajukan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PREVIEW SURAT UNDANGAN RESMI (TATA NASKAH DINAS) */}
      {activeModal === 'previewSurat' && selectedMeetingForSurat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden my-4 max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Pratinjau Surat Undangan Resmi (Tata Naskah Dinas)
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow">
                  <Printer className="w-3.5 h-3.5" /> Cetak PDF
                </button>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-slate-100 flex-1 flex justify-center">
              <div className="bg-white p-10 shadow-lg border border-slate-300 rounded w-[210mm] text-black font-serif text-[12pt] leading-normal">
                {/* Kop Surat */}
                <table className="w-full border-b-4 border-black pb-3 mb-6">
                  <tbody>
                    <tr>
                      <td className="w-1/6 text-center align-middle">
                        <LogoUOBK className="w-16 h-16 mx-auto" />
                      </td>
                      <td className="w-4/6 text-center align-middle">
                        <span className="text-[11pt] font-bold block leading-tight">PEMERINTAH KOTA SUKABUMI</span>
                        <span className="text-[11pt] font-bold block leading-tight">DINAS KESEHATAN</span>
                        <span className="text-[13pt] font-bold uppercase block mt-1 leading-tight">UOBK RSUD R. SYAMSUDIN, S.H.</span>
                        <span className="text-[8.5pt] block mt-1 font-sans">Jalan Rumah Sakit No.1 Kota Sukabumi Kode Pos 43113 Jawa Barat</span>
                        <span className="text-[8.5pt] block font-sans">Telp. 0266 - 225180 - 225181 Fax. 212988</span>
                      </td>
                      <td className="w-1/6 text-center align-middle">
                        <div className="w-16 h-16 bg-emerald-600 rounded-lg p-1 text-white flex items-center justify-center font-bold text-xs mx-auto">
                          RSUD
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Surat Details */}
                <table className="w-full text-[11pt] mb-6">
                  <tbody>
                    <tr>
                      <td className="w-3/5 align-top">
                        <table className="w-full">
                          <tbody>
                            <tr><td className="w-20">Nomor</td><td>: {selectedMeetingForSurat.letter_number}</td></tr>
                            <tr><td>Sifat</td><td>: {selectedMeetingForSurat.classification}</td></tr>
                            <tr><td>Lampiran</td><td>: 1 (satu) Berkas</td></tr>
                            <tr><td>Hal</td><td>: <b>{selectedMeetingForSurat.title}</b></td></tr>
                          </tbody>
                        </table>
                      </td>
                      <td className="w-2/5 align-top text-right">
                        Sukabumi, {selectedMeetingForSurat.date}<br /><br />
                        Yth.<br />
                        <b>Terlampir di Daftar Undangan</b><br />
                        di - <u>Sukabumi</u>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Content */}
                <div className="text-[11pt] space-y-4 mb-6 leading-relaxed text-justify">
                  <p>{selectedMeetingForSurat.content_body}</p>

                  <table className="ml-6 space-y-1.5 my-4">
                    <tbody>
                      <tr><td className="w-36 font-semibold">Tanggal</td><td>: {selectedMeetingForSurat.date}</td></tr>
                      <tr><td className="font-semibold">Pukul</td><td>: {selectedMeetingForSurat.start_time} s.d. {selectedMeetingForSurat.end_time} WIB</td></tr>
                      <tr><td className="font-semibold">Tempat</td><td>: {selectedMeetingForSurat.room_name}</td></tr>
                      <tr><td className="font-semibold align-top">Agenda</td><td>: {selectedMeetingForSurat.agendas}</td></tr>
                    </tbody>
                  </table>

                  <p>Demikian disampaikan, atas perhatian dan kerjasamanya diucapkan terima kasih.</p>
                </div>

                {/* Signer */}
                <div className="flex justify-end mt-12 text-[11pt]">
                  <div className="text-left w-72">
                    <p>{selectedMeetingForSurat.signer_title}</p>
                    <br /><br /><br />
                    <p className="font-bold underline">{selectedMeetingForSurat.signer_name}</p>
                    <p>{selectedMeetingForSurat.signer_rank}</p>
                    <p>NIP. {selectedMeetingForSurat.signer_nip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MANUAL CHECK-IN PRESENSI */}
      {activeModal === 'checkin' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> Form Presensi Kehadiran
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleCheckinSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Rapat Aktif *</label>
                <select 
                  value={checkinForm.meeting_id} 
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setCheckinForm({ ...checkinForm, meeting_id: Number(e.target.value) })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {appData.meetings.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input 
                  type="text" 
                  required 
                  value={checkinForm.name} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckinForm({ ...checkinForm, name: e.target.value })} 
                  placeholder="Contoh: dr. H. Ahmad Fauzi, Sp.PD" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                <input 
                  type="text" 
                  value={checkinForm.nip} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckinForm({ ...checkinForm, nip: e.target.value })} 
                  placeholder="19850101 201001 1 002" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Kerja / Jabatan *</label>
                <input 
                  type="text" 
                  required 
                  value={checkinForm.unit} 
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckinForm({ ...checkinForm, unit: e.target.value })} 
                  placeholder="Subag Humas / Dokter Spesialis" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Kehadiran *</label>
                <select 
                  value={checkinForm.status} 
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setCheckinForm({ ...checkinForm, status: e.target.value as any })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="HADIR">Hadir</option>
                  <option value="IZIN">Izin</option>
                  <option value="SAKIT">Sakit</option>
                  <option value="TERLAMBAT">Terlambat</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow">Kirim Presensi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ROOM FORM */}
      {activeModal === 'room' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-sky-950 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold">Tambah Ruang Rapat Baru</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveRoom} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Ruangan *</label>
                <input type="text" required value={roomForm.name} onChange={e => setRoomForm({...roomForm, name: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Ruang Rapat VIP Utama" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gedung / Lantai *</label>
                <input type="text" required value={roomForm.location} onChange={e => setRoomForm({...roomForm, location: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Gedung Admin Lt. 2" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kapasitas (Orang) *</label>
                <input type="number" required value={roomForm.capacity} onChange={e => setRoomForm({...roomForm, capacity: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fasilitas (Pisahkan Koma)</label>
                <input type="text" value={roomForm.facilities} onChange={e => setRoomForm({...roomForm, facilities: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="AC, Proyektor, Sound System" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-sky-700 text-white rounded font-semibold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: FOLLOWUP FORM */}
      {activeModal === 'followup' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-sky-950 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold">Tambah Tindak Lanjut Keputusan</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveFollowup} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Rapat Asal *</label>
                <select value={followupForm.meeting_id} onChange={e => setFollowupForm({...followupForm, meeting_id: Number(e.target.value)})} className="w-full p-2 border rounded-lg">
                  {appData.meetings.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uraian Tindak Lanjut *</label>
                <textarea rows={2} required value={followupForm.action} onChange={e => setFollowupForm({...followupForm, action: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Tindakan yang harus dilakukan..." />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Penanggung Jawab (PIC) *</label>
                <input type="text" required value={followupForm.pic} onChange={e => setFollowupForm({...followupForm, pic: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Nama / Unit Kerja PIC" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deadline *</label>
                  <input type="date" required value={followupForm.deadline} onChange={e => setFollowupForm({...followupForm, deadline: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prioritas *</label>
                  <select value={followupForm.priority} onChange={e => setFollowupForm({...followupForm, priority: e.target.value as Priority})} className="w-full p-2 border rounded-lg">
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Mendesak">Mendesak</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-sky-700 text-white rounded font-semibold">Simpan Tindak Lanjut</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: USER FORM */}
      {activeModal === 'user' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-sky-950 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold">Tambah Pengguna Sistem</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input type="text" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="dr. H. Hendra, M.Kes." />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP</label>
                <input type="text" value={userForm.nip} onChange={e => setUserForm({...userForm, nip: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="19780510..." />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jabatan *</label>
                <input type="text" required value={userForm.position} onChange={e => setUserForm({...userForm, position: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="Kasubag Umum" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                  <input type="text" required value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="hendra_rsud" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as Role})} className="w-full p-2 border rounded-lg">
                    <option value="USER">PESERTA / PENGGUNA</option>
                    <option value="ADMIN_UNIT">ADMIN UNIT</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-sky-700 text-white rounded font-semibold">Simpan User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 no-print">
          <div className={`p-3 rounded-lg shadow-lg text-xs font-semibold text-white flex items-center gap-2 transition-all ${
            toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}