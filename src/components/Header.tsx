import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { 
  Home, 
  Users, 
  CreditCard, 
  Calendar, 
  FileText, 
  Wallet, 
  AlertCircle, 
  BookOpen, 
  UserCheck, 
  ShieldAlert, 
  Bell, 
  ChevronDown, 
  Check, 
  RefreshCw,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEmergency
}) => {
  const { 
    role, 
    setRole, 
    activeResident, 
    unreadNotificationsCount, 
    notifications, 
    markAllNotificationsRead, 
    resetData 
  } = useRT();
  
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Ringkasan', icon: Home },
    { id: 'pengurus', label: 'Pengurus RT', icon: UserCheck },
    { id: 'warga', label: 'Data Warga', icon: Users },
    { id: 'iuran', label: 'Iuran IPL', icon: CreditCard },
    { id: 'kegiatan', label: 'Agenda & Foto', icon: Calendar },
    { id: 'surat', label: 'Surat Pengantar', icon: FileText },
    { id: 'keuangan', label: 'Kas RT', icon: Wallet },
    { id: 'aduan', label: 'Aspirasi & Aduan', icon: AlertCircle },
    { id: 'tamu', label: 'Buku Tamu', icon: BookOpen },
    ...(role === 'admin' ? [{ id: 'admin', label: 'Kelola Admin', icon: ShieldAlert }] : [])
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Upper Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Cluster Info */}
          <div className="flex items-center gap-3">
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dashboard');
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    RT 01 ARCADIA
                  </span>
                  <span className="hidden md:inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md">
                    RW 12
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Perumahan Oma Indah Kapuk · Desa Suwayuwo, Pasuruan
                </p>
              </div>
            </a>
          </div>

          {/* Quick Status Info & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Security Indicator (Hidden on tiny screens) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-700">Pos Satpam 24 Jam Aktif</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                aria-label="Notifikasi RT"
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Notifikasi & Pengumuman</span>
                      <p className="text-[11px] text-slate-400">Pusat informasi resmi pengurus RT 01</p>
                    </div>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Tandai dibaca
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-xs text-center text-slate-400">Belum ada notifikasi baru.</p>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-slate-50 transition-colors ${
                            !notif.sudahDibaca ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-slate-900">{notif.judul}</h4>
                            <span className="text-[10px] font-mono text-slate-400">{notif.tanggal}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.pesan}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Hotline Button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200/80 shadow-2xs hover:shadow-sm transition-all shrink-0 active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span className="hidden sm:inline">Kontak Darurat</span>
              <span className="sm:hidden">Darurat</span>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 shadow-2xs border ${
                  role === 'admin' 
                    ? 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100' 
                    : role === 'pengurus'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  role === 'admin' ? 'bg-purple-600' : role === 'pengurus' ? 'bg-emerald-600' : 'bg-blue-600'
                }`} />
                <span className="font-bold">
                  {role === 'admin' ? 'Super Admin' : role === 'pengurus' ? 'Pengurus RT' : 'Warga (View Only)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-76 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Hak Akses Sistem (RBAC)</p>
                    <p className="text-[11px] text-slate-500">Pilih simulasi peran pengguna di portal</p>
                  </div>

                  {/* 1. User Biasa (Warga) */}
                  <button
                    onClick={() => {
                      setRole('warga');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === 'warga' ? 'bg-slate-50/80 font-medium' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-slate-900">User Biasa (Warga)</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Hanya lihat seluruh data (view-only), tidak bisa edit data.
                      </p>
                    </div>
                    {role === 'warga' && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  </button>

                  {/* 2. User Pengurus */}
                  <button
                    onClick={() => {
                      setRole('pengurus');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === 'pengurus' ? 'bg-emerald-50/70 font-medium' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="font-bold text-emerald-950">User Pengurus RT</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Bisa edit: <strong>Data Warga, Iuran, Kegiatan, & Aduan</strong>.
                      </p>
                    </div>
                    {role === 'pengurus' && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  </button>

                  {/* 3. User Admin */}
                  <button
                    onClick={() => {
                      setRole('admin');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === 'admin' ? 'bg-purple-50/70 font-medium' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                        <span className="font-bold text-purple-950">User Admin (Super Admin)</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Bisa edit <strong>SEMUA</strong> informasi di web (Kas, Surat, Pengurus, dsb).
                      </p>
                    </div>
                    {role === 'admin' && <Check className="w-4 h-4 text-purple-600 shrink-0 ml-2" />}
                  </button>

                  <div className="mt-2 pt-2 border-t border-slate-100 px-4 py-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">Simulasi: {activeResident.namaLengkap}</span>
                    <button
                      onClick={() => {
                        if (confirm('Kembalikan data demo ke setelan awal?')) {
                          resetData();
                          setShowRoleMenu(false);
                        }
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar with Modern Pill Tabs */}
      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              const IconComponent = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs shadow-emerald-700/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
