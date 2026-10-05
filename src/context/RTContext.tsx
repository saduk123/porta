import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Resident,
  FeePayment,
  CommunityEvent,
  OfficialLetter,
  FinancialRecord,
  ComplaintReport,
  GuestLog,
  RTNotification,
  RTOfficer,
  EmergencyContact
} from '../types';
import {
  INITIAL_RESIDENTS,
  INITIAL_FEES,
  INITIAL_EVENTS,
  INITIAL_LETTERS,
  INITIAL_FINANCES,
  INITIAL_COMPLAINTS,
  INITIAL_GUEST_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RT_OFFICERS,
  INITIAL_EMERGENCY_CONTACTS
} from '../data/initialData';

interface RTContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeResident: Resident;
  residents: Resident[];
  officers: RTOfficer[];
  emergencyContacts: EmergencyContact[];
  fees: FeePayment[];
  events: CommunityEvent[];
  letters: OfficialLetter[];
  finances: FinancialRecord[];
  complaints: ComplaintReport[];
  guestLogs: GuestLog[];
  notifications: RTNotification[];
  totalKasBalance: number;
  unreadNotificationsCount: number;
  
  // Warga actions
  addResident: (resident: Omit<Resident, 'id'>) => void;
  updateResident: (id: string, resident: Partial<Resident>) => void;
  deleteResident: (id: string) => void;
  
  // Fee actions
  payFee: (payment: {
    residentId: string;
    bulan: string;
    metode: 'QRIS' | 'Transfer BCA' | 'Transfer Mandiri' | 'Tunai / Bendahara';
    catatan?: string;
  }) => void;
  verifyFee: (feeId: string, verifierName: string) => void;
  rejectFee: (feeId: string, alasan: string) => void;
  
  // Event actions
  addEvent: (event: Omit<CommunityEvent, 'id' | 'pesertaRsvp'>) => void;
  rsvpEvent: (eventId: string, status: 'Hadir' | 'Izin' | 'Tidak Hadir') => void;
  uploadEventPhoto: (eventId: string, photo: { url: string; caption: string; diuploadOleh: string; googleDriveId?: string; googleDriveLink?: string }) => void;
  deleteEventPhoto: (eventId: string, photoId: string) => void;
  
  // Letter actions
  requestLetter: (letter: {
    jenisSurat: OfficialLetter['jenisSurat'];
    keperluan: string;
  }) => void;
  approveLetter: (letterId: string, noSurat?: string, catatan?: string) => void;
  rejectLetter: (letterId: string, catatan: string) => void;
  
  // Financial actions
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  
  // Complaint actions
  addComplaint: (complaint: {
    kategori: ComplaintReport['kategori'];
    judul: string;
    deskripsi: string;
  }) => void;
  updateComplaintStatus: (id: string, status: ComplaintReport['status'], tanggapan: string, ditanganiOleh: string) => void;
  
  // Guest log actions
  addGuestLog: (log: Omit<GuestLog, 'id' | 'statusVerifikasi'>) => void;
  
  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  broadcastNotification: (judul: string, pesan: string, kategori: RTNotification['kategori']) => void;

  // Officer actions
  updateOfficer: (id: string, updated: Partial<RTOfficer>) => void;
  assignOfficer: (jabatan: RTOfficer['jabatan'], residentId: string, customPhone?: string, customBlock?: string) => void;

  // Emergency Contact actions
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
  deleteEmergencyContact: (id: string) => void;

  // Resident status update
  updateResidentStatus: (residentId: string, statusHunian: Resident['statusHunian'], statusKeluarga?: Resident['statusKeluarga']) => void;

  // Role permissions
  canEditWarga: boolean;
  canEditIuran: boolean;
  canEditKegiatan: boolean;
  canEditAduan: boolean;
  canEditSurat: boolean;
  canEditKeuangan: boolean;
  canEditPengurus: boolean;
  canEditBukuTamu: boolean;
  canBroadcast: boolean;
  isAdmin: boolean;
  isPengurus: boolean;
  isWarga: boolean;
  
  // Reset demo
  resetData: () => void;
}

const RTContext = createContext<RTContextType | undefined>(undefined);

export const RTProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('arcadia_rt_role') as UserRole) || 'pengurus';
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem('arcadia_residents');
    return saved ? JSON.parse(saved) : INITIAL_RESIDENTS;
  });

  const [fees, setFees] = useState<FeePayment[]>(() => {
    const saved = localStorage.getItem('arcadia_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    const saved = localStorage.getItem('arcadia_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [letters, setLetters] = useState<OfficialLetter[]>(() => {
    const saved = localStorage.getItem('arcadia_letters');
    return saved ? JSON.parse(saved) : INITIAL_LETTERS;
  });

  const [finances, setFinances] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('arcadia_finances');
    return saved ? JSON.parse(saved) : INITIAL_FINANCES;
  });

  const [complaints, setComplaints] = useState<ComplaintReport[]>(() => {
    const saved = localStorage.getItem('arcadia_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [guestLogs, setGuestLogs] = useState<GuestLog[]>(() => {
    const saved = localStorage.getItem('arcadia_guest_logs');
    return saved ? JSON.parse(saved) : INITIAL_GUEST_LOGS;
  });

  const [notifications, setNotifications] = useState<RTNotification[]>(() => {
    const saved = localStorage.getItem('arcadia_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [officers, setOfficers] = useState<RTOfficer[]>(() => {
    const saved = localStorage.getItem('arcadia_officers');
    return saved ? JSON.parse(saved) : INITIAL_RT_OFFICERS;
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('arcadia_emergency_contacts');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_CONTACTS;
  });

  // Safe localStorage helper to prevent QuotaExceededError when storing images
  const safeSetItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Storage quota exceeded or error writing ${key}:`, e);
    }
  };

  // Sync with LocalStorage
  useEffect(() => {
    safeSetItem('arcadia_rt_role', role);
  }, [role]);

  useEffect(() => {
    safeSetItem('arcadia_residents', JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    safeSetItem('arcadia_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    safeSetItem('arcadia_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    safeSetItem('arcadia_letters', JSON.stringify(letters));
  }, [letters]);

  useEffect(() => {
    safeSetItem('arcadia_finances', JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    safeSetItem('arcadia_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    safeSetItem('arcadia_guest_logs', JSON.stringify(guestLogs));
  }, [guestLogs]);

  useEffect(() => {
    safeSetItem('arcadia_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeSetItem('arcadia_officers', JSON.stringify(officers));
  }, [officers]);

  useEffect(() => {
    safeSetItem('arcadia_emergency_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Current logged in resident for "warga" view: Pak Bambang Pamungkas (res-1)
  const activeResident = residents[0] || INITIAL_RESIDENTS[0];

  // Calculate kas balance
  const totalKasBalance = finances.reduce((acc, curr) => {
    if (curr.jenis === 'Pemasukan') return acc + curr.nominal;
    return acc - curr.nominal;
  }, 0);

  const unreadNotificationsCount = notifications.filter(n => !n.sudahDibaca).length;

  // Resident CRUD
  const addResident = (data: Omit<Resident, 'id'>) => {
    const newId = `res-${Date.now()}`;
    const newResident: Resident = { ...data, id: newId };
    setResidents(prev => [newResident, ...prev]);

    // Also initialize fee entry for current month
    const newFee: FeePayment = {
      id: `fee-${Date.now()}`,
      residentId: newId,
      residentName: newResident.namaLengkap,
      blokRumah: newResident.blokRumah,
      bulan: '2026-09',
      tahun: 2026,
      nominal: 150000,
      rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
      metodePembayaran: 'QRIS',
      status: 'Belum Bayar'
    };
    setFees(prev => [newFee, ...prev]);
  };

  const updateResident = (id: string, updated: Partial<Resident>) => {
    setResidents(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    // update in fees too
    if (updated.namaLengkap || updated.blokRumah) {
      setFees(prev => prev.map(f => f.residentId === id ? {
        ...f,
        residentName: updated.namaLengkap || f.residentName,
        blokRumah: updated.blokRumah || f.blokRumah
      } : f));
    }
  };

  const deleteResident = (id: string) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    setFees(prev => prev.filter(f => f.residentId !== id));
  };

  // Fee Operations
  const payFee = ({
    residentId,
    bulan,
    metode,
    catatan
  }: {
    residentId: string;
    bulan: string;
    metode: 'QRIS' | 'Transfer BCA' | 'Transfer Mandiri' | 'Tunai / Bendahara';
    catatan?: string;
  }) => {
    const resident = residents.find(r => r.id === residentId) || activeResident;
    const existingIndex = fees.findIndex(f => f.residentId === residentId && f.bulan === bulan);
    const today = new Date().toISOString().split('T')[0];

    // If paying by cash directly to bendahara while in admin role, auto lunas. Otherwise Menunggu Verifikasi
    const isDirectCash = role === 'pengurus' && metode === 'Tunai / Bendahara';
    const status: FeePayment['status'] = isDirectCash ? 'Lunas' : 'Menunggu Verifikasi';
    const kwitansiNo = `KW/ARC-RT01/2026/${bulan.split('-')[1]}/${Math.floor(100 + Math.random() * 900)}`;

    if (existingIndex >= 0) {
      setFees(prev => prev.map((item, idx) => {
        if (idx === existingIndex) {
          return {
            ...item,
            metodePembayaran: metode,
            status,
            tanggalBayar: today,
            catatan,
            noKwitansi: isDirectCash ? kwitansiNo : undefined,
            diverifikasiOleh: isDirectCash ? 'Ibu Hj. Siti Nurjanah (Bendahara)' : undefined
          };
        }
        return item;
      }));
    } else {
      const newFee: FeePayment = {
        id: `fee-${Date.now()}`,
        residentId,
        residentName: resident.namaLengkap,
        blokRumah: resident.blokRumah,
        bulan,
        tahun: parseInt(bulan.split('-')[0]) || 2026,
        nominal: 150000,
        rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
        metodePembayaran: metode,
        status,
        tanggalBayar: today,
        catatan,
        noKwitansi: isDirectCash ? kwitansiNo : undefined,
        diverifikasiOleh: isDirectCash ? 'Ibu Hj. Siti Nurjanah (Bendahara)' : undefined
      };
      setFees(prev => [newFee, ...prev]);
    }

    // If direct cash or auto approved, record in kas
    if (isDirectCash) {
      addFinancialRecord({
        tanggal: today,
        jenis: 'Pemasukan',
        kategori: 'Iuran Warga (IPL)',
        nominal: 150000,
        keterangan: `Iuran IPL ${bulan} dari ${resident.namaLengkap} (${resident.blokRumah})`,
        dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
      });
    }

    // Add notification
    const newNotif: RTNotification = {
      id: `notif-${Date.now()}`,
      judul: 'Pembayaran Iuran Diterima',
      pesan: `Pembayaran iuran ${bulan} untuk ${resident.blokRumah} sebesar Rp 150.000 telah masuk dengan metode ${metode}.`,
      tanggal: today,
      kategori: 'iuran',
      sudahDibaca: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const verifyFee = (feeId: string, verifierName: string) => {
    const fee = fees.find(f => f.id === feeId);
    if (!fee) return;

    const today = new Date().toISOString().split('T')[0];
    const kwitansiNo = `KW/ARC-RT01/2026/${fee.bulan.split('-')[1]}/${Math.floor(100 + Math.random() * 900)}`;

    setFees(prev => prev.map(f => {
      if (f.id === feeId) {
        return {
          ...f,
          status: 'Lunas',
          diverifikasiOleh: verifierName,
          noKwitansi: kwitansiNo,
          tanggalBayar: f.tanggalBayar || today
        };
      }
      return f;
    }));

    // Add entry to finance
    addFinancialRecord({
      tanggal: today,
      jenis: 'Pemasukan',
      kategori: 'Iuran Warga (IPL)',
      nominal: fee.nominal,
      keterangan: `Verifikasi Iuran IPL ${fee.bulan} dari ${fee.residentName} (${fee.blokRumah})`,
      dicatatOleh: verifierName
    });
  };

  const rejectFee = (feeId: string, alasan: string) => {
    setFees(prev => prev.map(f => {
      if (f.id === feeId) {
        return {
          ...f,
          status: 'Belum Bayar',
          catatan: `Verifikasi ditolak: ${alasan}`
        };
      }
      return f;
    }));
  };

  // Community Events
  const addEvent = (eventData: Omit<CommunityEvent, 'id' | 'pesertaRsvp'>) => {
    const newEvent: CommunityEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      pesertaRsvp: []
    };
    setEvents(prev => [newEvent, ...prev]);

    // Also broadcast notification
    broadcastNotification(
      `Kegiatan Baru: ${newEvent.judul}`,
      `Akan dilaksanakan pada ${newEvent.tanggal} pukul ${newEvent.waktu} di ${newEvent.lokasi}.`,
      'kegiatan'
    );
  };

  const rsvpEvent = (eventId: string, rsvpStatus: 'Hadir' | 'Izin' | 'Tidak Hadir') => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const existingRsvpIndex = ev.pesertaRsvp.findIndex(p => p.nama === activeResident.namaLengkap);
        let updatedRsvp = [...ev.pesertaRsvp];
        if (existingRsvpIndex >= 0) {
          updatedRsvp[existingRsvpIndex] = {
            nama: activeResident.namaLengkap,
            blok: activeResident.blokRumah,
            status: rsvpStatus
          };
        } else {
          updatedRsvp.push({
            nama: activeResident.namaLengkap,
            blok: activeResident.blokRumah,
            status: rsvpStatus
          });
        }
        return { ...ev, pesertaRsvp: updatedRsvp };
      }
      return ev;
    }));
  };

  const uploadEventPhoto = (eventId: string, photo: { url: string; caption: string; diuploadOleh: string; googleDriveId?: string; googleDriveLink?: string }) => {
    const today = new Date().toISOString().split('T')[0];
    const newPhoto = {
      id: `foto-${Date.now()}`,
      url: photo.url,
      caption: photo.caption,
      tanggalUpload: today,
      diuploadOleh: photo.diuploadOleh,
      googleDriveId: photo.googleDriveId,
      googleDriveLink: photo.googleDriveLink
    };

    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          fotoDokumentasi: [...(ev.fotoDokumentasi || []), newPhoto]
        };
      }
      return ev;
    }));

    broadcastNotification(
      'Dokumentasi Kegiatan Baru Diunggah',
      `${photo.diuploadOleh} mengunggah foto kegiatan baru.`,
      'kegiatan'
    );
  };

  const deleteEventPhoto = (eventId: string, photoId: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          fotoDokumentasi: (ev.fotoDokumentasi || []).filter(p => p.id !== photoId)
        };
      }
      return ev;
    }));
  };

  // Letters
  const requestLetter = (data: {
    jenisSurat: OfficialLetter['jenisSurat'];
    keperluan: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const newLetter: OfficialLetter = {
      id: `let-${Date.now()}`,
      noSurat: `DRAFT/RT01-ARC/${Math.floor(10 + Math.random() * 90)}`,
      residentId: activeResident.id,
      pemohonNama: activeResident.namaLengkap,
      nik: activeResident.nik,
      blokRumah: activeResident.blokRumah,
      jenisSurat: data.jenisSurat,
      keperluan: data.keperluan,
      tanggalPengajuan: today,
      status: 'Menunggu'
    };
    setLetters(prev => [newLetter, ...prev]);

    broadcastNotification(
      'Pengajuan Surat Pengantar Baru',
      `${activeResident.namaLengkap} mengajukan ${data.jenisSurat}. Menunggu validasi Ketua RT.`,
      'surat'
    );
  };

  const approveLetter = (letterId: string, customNoSurat?: string, catatan?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const generatedNo = customNoSurat || `0${Math.floor(41 + Math.random() * 20)}/RT01-ARC/X/2026`;

    setLetters(prev => prev.map(l => {
      if (l.id === letterId) {
        return {
          ...l,
          noSurat: generatedNo,
          status: 'Disetujui',
          tanggalDisetujui: today,
          ditandatanganiOleh: 'Hendra Gunawan (Ketua RT 01)',
          catatanPengurus: catatan || 'Telah diverifikasi dan disetujui sesuai data kependudukan.'
        };
      }
      return l;
    }));
  };

  const rejectLetter = (letterId: string, catatan: string) => {
    setLetters(prev => prev.map(l => {
      if (l.id === letterId) {
        return {
          ...l,
          status: 'Ditolak',
          catatanPengurus: catatan
        };
      }
      return l;
    }));
  };

  // Finance
  const addFinancialRecord = (record: Omit<FinancialRecord, 'id'>) => {
    const newFin: FinancialRecord = {
      ...record,
      id: `fin-${Date.now()}`
    };
    setFinances(prev => [newFin, ...prev]);
  };

  // Complaint
  const addComplaint = (data: {
    kategori: ComplaintReport['kategori'];
    judul: string;
    deskripsi: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const newComplaint: ComplaintReport = {
      id: `cmp-${Date.now()}`,
      residentId: activeResident.id,
      pelaporNama: activeResident.namaLengkap,
      blokRumah: activeResident.blokRumah,
      kategori: data.kategori,
      judul: data.judul,
      deskripsi: data.deskripsi,
      tanggalLapor: today,
      status: 'Menunggu Tindak Lanjut'
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (
    id: string,
    status: ComplaintReport['status'],
    tanggapan: string,
    ditanganiOleh: string
  ) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          tanggapanPengurus: tanggapan,
          ditanganiOleh
        };
      }
      return c;
    }));
  };

  // Guest Log
  const addGuestLog = (data: Omit<GuestLog, 'id' | 'statusVerifikasi'>) => {
    const newGuest: GuestLog = {
      ...data,
      id: `gst-${Date.now()}`,
      statusVerifikasi: 'Dicatat'
    };
    setGuestLogs(prev => [newGuest, ...prev]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, sudahDibaca: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, sudahDibaca: true })));
  };

  const broadcastNotification = (judul: string, pesan: string, kategori: RTNotification['kategori']) => {
    const today = new Date().toISOString().split('T')[0];
    const newNotif: RTNotification = {
      id: `notif-${Date.now()}`,
      judul,
      pesan,
      tanggal: today,
      kategori,
      sudahDibaca: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateOfficer = (id: string, updated: Partial<RTOfficer>) => {
    setOfficers(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
  };

  const assignOfficer = (jabatan: RTOfficer['jabatan'], residentId: string, customPhone?: string, customBlock?: string) => {
    const res = residents.find(r => r.id === residentId);
    if (!res) return;
    setOfficers(prev => prev.map(off => {
      if (off.jabatan === jabatan) {
        return {
          ...off,
          namaLengkap: res.namaLengkap,
          blokRumah: customBlock || res.blokRumah,
          noTelepon: customPhone || res.noTelepon
        };
      }
      return off;
    }));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `emg-${Date.now()}`
    };
    setEmergencyContacts(prev => [...prev, newContact]);
  };

  const updateEmergencyContact = (id: string, updated: Partial<EmergencyContact>) => {
    setEmergencyContacts(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  const updateResidentStatus = (
    residentId: string, 
    statusHunian: Resident['statusHunian'], 
    statusKeluarga?: Resident['statusKeluarga']
  ) => {
    setResidents(prev => prev.map(r => {
      if (r.id === residentId) {
        return {
          ...r,
          statusHunian,
          statusKeluarga: statusKeluarga || r.statusKeluarga
        };
      }
      return r;
    }));
  };

  const isAdmin = role === 'admin';
  const isPengurus = role === 'pengurus';
  const isWarga = role === 'warga';

  // User permission levels based on user request:
  // - User Biasa (warga): hanya view saja tidak bisa edit sama sekali
  // - User Pengurus: bisa edit data warga, iuran, kegiatan, aduan
  // - User Admin: bisa edit semua informasi dan data di web (termasuk kas, surat, pengurus, master)
  const canEditWarga = role === 'pengurus' || role === 'admin';
  const canEditIuran = role === 'pengurus' || role === 'admin';
  const canEditKegiatan = role === 'pengurus' || role === 'admin';
  const canEditAduan = role === 'pengurus' || role === 'admin';
  const canEditSurat = role === 'admin';
  const canEditKeuangan = role === 'admin';
  const canEditPengurus = role === 'admin';
  const canEditBukuTamu = role === 'pengurus' || role === 'admin';
  const canBroadcast = role === 'admin';

  const resetData = () => {
    setResidents(INITIAL_RESIDENTS);
    setFees(INITIAL_FEES);
    setEvents(INITIAL_EVENTS);
    setLetters(INITIAL_LETTERS);
    setFinances(INITIAL_FINANCES);
    setComplaints(INITIAL_COMPLAINTS);
    setGuestLogs(INITIAL_GUEST_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setOfficers(INITIAL_RT_OFFICERS);
    setEmergencyContacts(INITIAL_EMERGENCY_CONTACTS);
    localStorage.clear();
  };

  return (
    <RTContext.Provider
      value={{
        role,
        setRole,
        activeResident,
        residents,
        officers,
        emergencyContacts,
        fees,
        events,
        letters,
        finances,
        complaints,
        guestLogs,
        notifications,
        totalKasBalance,
        unreadNotificationsCount,
        addResident,
        updateResident,
        deleteResident,
        payFee,
        verifyFee,
        rejectFee,
        addEvent,
        rsvpEvent,
        uploadEventPhoto,
        deleteEventPhoto,
        requestLetter,
        approveLetter,
        rejectLetter,
        addFinancialRecord,
        addComplaint,
        updateComplaintStatus,
        addGuestLog,
        markNotificationRead,
        markAllNotificationsRead,
        broadcastNotification,
        updateOfficer,
        assignOfficer,
        addEmergencyContact,
        updateEmergencyContact,
        deleteEmergencyContact,
        updateResidentStatus,
        canEditWarga,
        canEditIuran,
        canEditKegiatan,
        canEditAduan,
        canEditSurat,
        canEditKeuangan,
        canEditPengurus,
        canEditBukuTamu,
        canBroadcast,
        isAdmin,
        isPengurus,
        isWarga,
        resetData
      }}
    >
      {children}
    </RTContext.Provider>
  );
};

export const useRT = () => {
  const context = useContext(RTContext);
  if (!context) {
    throw new Error('useRT must be used within an RTProvider');
  }
  return context;
};
