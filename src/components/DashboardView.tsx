import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { ARCADIA_HERO_IMAGE } from '../data/initialData';
import { Charts } from './Charts';
import { 
  Users, 
  CreditCard, 
  Wallet, 
  Calendar, 
  Shield, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  MessageSquare, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Award, 
  Phone,
  Sparkles,
  MapPin,
  TrendingUp,
  Sun,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenEmergency }) => {
  const { 
    role, 
    activeResident, 
    residents, 
    officers,
    fees, 
    events, 
    letters, 
    complaints, 
    totalKasBalance,
    broadcastNotification,
    canBroadcast,
    isAdmin,
    isPengurus,
    isWarga
  } = useRT();

  const [broadcastDraft, setBroadcastDraft] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Dynamic greeting based on current local hour
  const currentHour = new Date().getHours();
  const greetingText = 
    currentHour >= 4 && currentHour < 11 ? 'Selamat Pagi' :
    currentHour >= 11 && currentHour < 15 ? 'Selamat Siang' :
    currentHour >= 15 && currentHour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  // Statistics calculation
  const totalKK = residents.filter(r => r.statusKeluarga === 'Kepala Keluarga').length;
  const totalJiwa = residents.reduce((acc, curr) => acc + (curr.jumlahAnggota || 1), 0);
  const totalTetap = residents.filter(r => r.statusHunian.includes('Tetap')).length;
  const totalKontrak = residents.filter(r => r.statusHunian.includes('Kontrak') || r.statusHunian.includes('Kos')).length;

  // Fees calculation for current month (September 2026)
  const currentMonthFees = fees.filter(f => f.bulan === '2026-09');
  const paidCount = currentMonthFees.filter(f => f.status === 'Lunas').length;
  const pendingCount = currentMonthFees.filter(f => f.status === 'Menunggu Verifikasi').length;
  const unpaidCount = currentMonthFees.filter(f => f.status === 'Belum Bayar').length;
  const targetTotalCount = Math.max(residents.length, currentMonthFees.length);
  const feeComplianceRate = targetTotalCount > 0 ? Math.round((paidCount / targetTotalCount) * 100) : 0;

  // Active resident fee status
  const myFeeThisMonth = fees.find(f => f.residentId === activeResident.id && f.bulan === '2026-09');

  // Next upcoming events
  const upcomingEvents = [...events].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const nextEvent = upcomingEvents[0];
  const tonightRonda = events.find(e => e.kategori === 'Ronda Siskamling');

  // Complaints stats
  const activeComplaintsCount = complaints.filter(c => c.status !== 'Selesai').length;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleSendCustomBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastDraft.trim()) return;
    broadcastNotification('Pengumuman Resmi Pengurus RT 01', broadcastDraft, 'pengumuman');
    setBroadcastDraft('');
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setShowBroadcastModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Hero Residential Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-900/20 shadow-md bg-linear-to-r from-emerald-950 via-teal-950 to-slate-950 text-white min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={ARCADIA_HERO_IMAGE}
          alt="Perumahan Cluster Arcadia"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Top Chips Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-emerald-300 font-semibold border border-white/10">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{greetingText}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-slate-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pos Satpam 24 Jam Aktif</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-slate-300 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Desa Suwayuwo, Sukorejo, Pasuruan</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {role === 'admin'
              ? 'Pusat Kendali Admin Web RT 01 Arcadia'
              : role === 'pengurus'
              ? 'Portal Operasional Pengurus RT 01'
              : `Selamat Datang, ${activeResident.namaLengkap}`}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
            {role === 'admin'
              ? 'Akses super administrator penuh untuk mengelola master data kependudukan, pembukuan kas RT, persetujuan surat pengantar, verifikasi iuran, dan penyiaran pengumuman warga.'
              : role === 'pengurus'
              ? 'Sistem pelayanan warga RT 01 RW 12 Cluster Arcadia: input dan validasi data kependudukan, iuran IPL, pemantauan kegiatan, dan tindak lanjut aspirasi.'
              : `Hunian Anda di ${activeResident.blokRumah}, Perumahan Oma Indah Kapuk Cluster Arcadia. Pantau iuran IPL lingkungan, jadwal siskamling, dan layanan surat mandiri.`}
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {role === 'warga' && myFeeThisMonth?.status !== 'Lunas' ? (
              <button
                onClick={() => onNavigate('iuran')}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-linear-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Iuran Bulan Ini (Rp 150.000)</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('iuran')}
                className="px-4 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl transition-all border border-white/20 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Cek Iuran & Kwitansi</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('kegiatan')}
              className="px-4 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl transition-all border border-white/20 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Agenda Lingkungan</span>
            </button>

            {canBroadcast && (
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Siarkan Pengumuman</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Role Access Level Banner (Clean, Modern RBAC Status) */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs transition-all ${
        isAdmin 
          ? 'bg-purple-50/90 border-purple-200 text-purple-950'
          : isPengurus
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
          : 'bg-slate-100/90 border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${
            isAdmin ? 'bg-purple-200 text-purple-800' : isPengurus ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-700'
          }`}>
            {isAdmin ? <Shield className="w-4 h-4" /> : isPengurus ? <Users className="w-4 h-4" /> : <Users className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm">
                {isAdmin ? 'Mode User: Super Admin' : isPengurus ? 'Mode User: Pengurus RT' : 'Mode User: Warga (Hanya Lihat)'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAdmin ? 'bg-purple-200 text-purple-800' : isPengurus ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {isAdmin ? 'Akses Penuh Seluruh Web' : isPengurus ? 'Kelola Warga, Iuran, Kegiatan, Aduan' : 'View-Only (Tanpa Edit)'}
              </span>
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isAdmin 
                ? 'User Admin berwenang mengedit SEMUA informasi di web (Data Warga, Iuran, Kegiatan, Aduan, Kas RT, Surat Pengantar, Pengurus RT, dan Pengumuman).'
                : isPengurus
                ? 'User Pengurus berwenang mengedit Data Warga, Iuran Lingkungan, Agenda Kegiatan, dan Tindak Lanjut Aduan.'
                : 'User Warga hanya memiliki hak akses view-only untuk melihat seluruh informasi tanpa mengubah data master.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-[11px] font-semibold text-slate-500 bg-white/70 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          Ganti peran via menu kanan atas
        </div>
      </div>

      {/* 3. 4 Core Metrics Cards (Vibrant, Fresh Visual Presentation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Warga & KK */}
        <div 
          onClick={() => onNavigate('warga')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Populasi RT 01</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">{totalKK}</span>
            <span className="text-xs text-slate-500 font-semibold">Kepala Keluarga</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Total Jiwa: <strong className="text-slate-900 font-mono">{totalJiwa}</strong></span>
            <span className="text-[11px] text-emerald-700 font-medium">{totalTetap} Tetap · {totalKontrak} Sewa</span>
          </div>
        </div>

        {/* Metric 2: Status Iuran IPL */}
        <div 
          onClick={() => onNavigate('iuran')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Iuran IPL September</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">{feeComplianceRate}%</span>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full">Terkumpul</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-linear-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${feeComplianceRate}%` }} 
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="text-emerald-700 font-bold">{paidCount} Lunas</span>
            <span className="text-amber-600 font-bold">{pendingCount} Verifikasi</span>
            <span className="text-rose-600 font-bold">{unpaidCount} Belum</span>
          </div>
        </div>

        {/* Metric 3: Saldo Kas RT */}
        <div 
          onClick={() => onNavigate('keuangan')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo Kas RT 01</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline">
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-700 tabular-nums">
              {formatRupiah(totalKasBalance)}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Transparansi 100%</span>
            </span>
            <span className="text-[11px] text-slate-400">Kas BCA & Kas Tunai</span>
          </div>
        </div>

        {/* Metric 4: Agenda & Layanan */}
        <div 
          onClick={() => onNavigate('kegiatan')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agenda Terdekat</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm font-bold text-slate-900 truncate">
              {nextEvent ? nextEvent.judul : 'Tidak ada agenda'}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
            <span className="truncate text-slate-700 font-medium">{nextEvent?.tanggal}</span>
            <span className="text-[11px] text-indigo-700 font-semibold">{nextEvent?.waktu}</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Quick Shortcuts (Fitur Layanan Mandiri) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Layanan Cepat Warga & Pengurus</h3>
            <p className="text-xs text-slate-500 mt-0.5">Akses mandiri praktis untuk kebutuhan harian warga Cluster Arcadia</p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Akses 24 Jam Online
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          {/* Action 1 */}
          <button
            onClick={() => onNavigate('iuran')}
            className="p-4 rounded-2xl border border-emerald-100 bg-linear-to-b from-emerald-50/50 to-white hover:border-emerald-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                Bayar Iuran IPL
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                QRIS resmi RT 01, transfer BCA, & download kwitansi sah.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Buka Menu</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => onNavigate('surat')}
            className="p-4 rounded-2xl border border-blue-100 bg-linear-to-b from-blue-50/50 to-white hover:border-blue-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-800">
                Surat Pengantar
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Domisili, KTP, KK, usaha, & unduh surat format PDF.
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-700 mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Buka Menu</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => onNavigate('tamu')}
            className="p-4 rounded-2xl border border-amber-100 bg-linear-to-b from-amber-50/50 to-white hover:border-amber-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800">
                Buku Tamu 1x24 Jam
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Pencatatan tamu menginap untuk izin satpam gerbang.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-700 mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Buka Menu</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => onNavigate('aduan')}
            className="p-4 rounded-2xl border border-rose-100 bg-linear-to-b from-rose-50/50 to-white hover:border-rose-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-800">
                Aspirasi & Aduan
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Lapor lampu mati, sampah, fasum, & respon pengurus.
              </p>
            </div>
            <span className="text-[10px] font-bold text-rose-700 mt-3 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Buka Menu</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>

      {/* 5. Interactive Charts & Analytics Section */}
      <Charts />

      {/* 6. Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Siskamling & Susunan Pengurus */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Siskamling / Keamanan Lingkungan Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Jadwal Siskamling & Keamanan Lingkungan</h3>
                  <p className="text-xs text-slate-500">Posko Keamanan Gerbang Utama Arcadia & Ronda Bergilir</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('kegiatan')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <span>Lihat Agenda</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {tonightRonda ? (
              <div className="mt-4 bg-linear-to-r from-emerald-50/70 to-teal-50/70 rounded-2xl p-5 border border-emerald-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      Giliran Ronda Terdekat
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{tonightRonda.judul}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tonightRonda.deskripsi}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-xs font-mono font-medium text-slate-500 block">{tonightRonda.tanggal}</span>
                    <span className="text-xs font-mono font-bold text-emerald-900">{tonightRonda.waktu}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/50 flex items-center justify-between text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">Koordinator Ronda: </span>
                    <span>{tonightRonda.penanggungJawab}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Pos Ronda Utama Blok A/B</span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-slate-500">Belum ada jadwal ronda siskamling khusus pekan ini.</p>
            )}
          </div>

          {/* Susunan Pengurus RT 01 RW 12 (Direct Contact Grid) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Susunan Kepengurusan RT 01 RW 12</h3>
                  <p className="text-xs text-slate-500">Masa Bakti Periode 2024 - 2027 · Cluster Arcadia, Suwayuwo</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('pengurus')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Lihat Susunan Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {officers.map((officer) => {
                const cleanPhone = officer.noTelepon.replace(/[^0-9]/g, '');
                const waNumber = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;

                const roleBadge = 
                  officer.jabatan === 'Ketua RT' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  officer.jabatan === 'Wakil Ketua RT' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                  officer.jabatan === 'Sekretaris' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                  'bg-amber-50 text-amber-800 border-amber-200';

                return (
                  <div 
                    key={officer.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${roleBadge}`}>
                          {officer.jabatan}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{officer.blokRumah}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {officer.namaLengkap}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-medium text-slate-700">{officer.noTelepon}</span>
                      <a
                        href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(officer.namaLengkap)}%2C%20saya%20warga%20RT%2001%20RW%2012`}
                        target="_blank"
                        rel="noreferrer"
                        title="Chat via WhatsApp"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Jadwal Terdekat & Info Lingkungan */}
        <div className="space-y-6">
          
          {/* Upcoming Events Mini Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Agenda Warga Terdekat</h3>
              <button
                onClick={() => onNavigate('kegiatan')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Semua
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {upcomingEvents.slice(0, 3).map((evt) => (
                <div 
                  key={evt.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-200 transition-all flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex flex-col items-center justify-center shrink-0 font-bold leading-none">
                    <span className="text-[10px] uppercase font-mono">{evt.tanggal.split('-')[1]}</span>
                    <span className="text-base mt-0.5">{evt.tanggal.split('-')[2]}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">
                      {evt.kategori}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{evt.judul}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{evt.waktu}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pengelolaan Sampah & Fasum Info Card */}
          <div className="bg-linear-to-br from-teal-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-emerald-300">
                <Sparkles className="w-3 h-3" />
                <span>Informasi Kebersihan DLH</span>
              </div>
              <h4 className="text-base font-bold text-white">Jadwal Pengangkutan Sampah</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Armada truk DLH beroperasi rutin setiap <strong>Senin & Kamis pagi</strong> pukul 06.30 - 08.00 WIB. Mohon letakkan tempat sampah tertutup di depan pagar rumah masing-masing.
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Iuran Sampah DLH:</span>
                <span className="text-white font-bold font-mono">Termasuk dalam IPL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal (Admin Only) */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">Siarkan Pengumuman ke Seluruh Warga</h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {broadcastSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pengumuman berhasil disiarkan ke beranda dan lonceng notifikasi seluruh warga!</span>
              </div>
            )}

            <form onSubmit={handleSendCustomBroadcast} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Isi Pesan Pengumuman Resmi
                </label>
                <textarea
                  rows={4}
                  value={broadcastDraft}
                  onChange={(e) => setBroadcastDraft(e.target.value)}
                  placeholder="Tuliskan informasi penting, pengumuman kerja bakti, pemadaman air/listrik, atau himbauan keamanan bagi seluruh warga Arcadia..."
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
