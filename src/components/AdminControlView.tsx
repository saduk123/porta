import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { Resident, RTOfficer, EmergencyContact } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Phone, 
  Award, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Search, 
  AlertTriangle, 
  Flame, 
  Ambulance, 
  Zap, 
  Droplets, 
  UserCheck, 
  MapPin, 
  Save,
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export const AdminControlView: React.FC = () => {
  const { 
    residents, 
    officers, 
    emergencyContacts, 
    assignOfficer, 
    updateOfficer, 
    updateResidentStatus, 
    updateResident,
    addEmergencyContact, 
    updateEmergencyContact, 
    deleteEmergencyContact,
    resetData 
  } = useRT();

  const [activeAdminTab, setActiveAdminTab] = useState<'pengurus' | 'statusWarga' | 'kontakDarurat'>('pengurus');

  // --- SECTION 1: PENGURUS RT STATE ---
  const [editingOfficer, setEditingOfficer] = useState<RTOfficer | null>(null);
  const [assignModalJabatan, setAssignModalJabatan] = useState<RTOfficer['jabatan'] | null>(null);
  const [selectedResidentForAssign, setSelectedResidentForAssign] = useState<string>('');
  const [customPhoneAssign, setCustomPhoneAssign] = useState<string>('');
  const [customBlockAssign, setCustomBlockAssign] = useState<string>('');

  // Officer Edit Form State
  const [formOfficerName, setFormOfficerName] = useState('');
  const [formOfficerBlock, setFormOfficerBlock] = useState('');
  const [formOfficerPhone, setFormOfficerPhone] = useState('');
  const [formOfficerPeriod, setFormOfficerPeriod] = useState('');

  // --- SECTION 2: STATUS WARGA STATE ---
  const [searchWarga, setSearchWarga] = useState('');
  const [filterHunian, setFilterHunian] = useState<string>('all');
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [resName, setResName] = useState('');
  const [resNik, setResNik] = useState('');
  const [resNoKk, setResNoKk] = useState('');
  const [resBlock, setResBlock] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resJob, setResJob] = useState('');

  // --- SECTION 3: KONTAK DARURAT STATE ---
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [emgTitle, setEmgTitle] = useState('');
  const [emgSubtitle, setEmgSubtitle] = useState('');
  const [emgNumber, setEmgNumber] = useState('');
  const [emgCategory, setEmgCategory] = useState<EmergencyContact['kategori']>('keamanan');

  // Helpers
  const getCategoryIcon = (kategori: EmergencyContact['kategori']) => {
    switch (kategori) {
      case 'polisi': return AlertTriangle;
      case 'damkar': return Flame;
      case 'medis': return Ambulance;
      case 'pln': return Zap;
      case 'pdam': return Droplets;
      default: return ShieldAlert;
    }
  };

  // 1. Handle Officer Edit Save
  const handleSaveOfficerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;
    updateOfficer(editingOfficer.id, {
      namaLengkap: formOfficerName,
      blokRumah: formOfficerBlock,
      noTelepon: formOfficerPhone,
      periode: formOfficerPeriod
    });
    setEditingOfficer(null);
  };

  // 2. Handle Assign Resident as Officer
  const handleExecuteAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalJabatan || !selectedResidentForAssign) return;
    assignOfficer(assignModalJabatan, selectedResidentForAssign, customPhoneAssign || undefined, customBlockAssign || undefined);
    setAssignModalJabatan(null);
    setSelectedResidentForAssign('');
    setCustomPhoneAssign('');
    setCustomBlockAssign('');
  };

  // 3. Handle Resident Profile Edit Save
  const handleSaveResidentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResident) return;
    updateResident(editingResident.id, {
      namaLengkap: resName,
      nik: resNik,
      noKk: resNoKk,
      blokRumah: resBlock,
      noTelepon: resPhone,
      pekerjaan: resJob
    });
    setEditingResident(null);
  };

  // 4. Handle Emergency Contact Save (Add / Edit)
  const handleSaveEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emgTitle.trim() || !emgNumber.trim()) return;

    if (editingContact) {
      updateEmergencyContact(editingContact.id, {
        title: emgTitle,
        subtitle: emgSubtitle,
        number: emgNumber,
        kategori: emgCategory
      });
    } else {
      addEmergencyContact({
        title: emgTitle,
        subtitle: emgSubtitle,
        number: emgNumber,
        kategori: emgCategory
      });
    }

    setIsEmergencyModalOpen(false);
    setEditingContact(null);
    setEmgTitle('');
    setEmgSubtitle('');
    setEmgNumber('');
    setEmgCategory('keamanan');
  };

  const openAddContactModal = () => {
    setEditingContact(null);
    setEmgTitle('');
    setEmgSubtitle('');
    setEmgNumber('');
    setEmgCategory('keamanan');
    setIsEmergencyModalOpen(true);
  };

  const openEditContactModal = (item: EmergencyContact) => {
    setEditingContact(item);
    setEmgTitle(item.title);
    setEmgSubtitle(item.subtitle);
    setEmgNumber(item.number);
    setEmgCategory(item.kategori);
    setIsEmergencyModalOpen(true);
  };

  // Filtered residents
  const filteredResidents = residents.filter(r => {
    const matchesSearch = r.namaLengkap.toLowerCase().includes(searchWarga.toLowerCase()) ||
                          r.blokRumah.toLowerCase().includes(searchWarga.toLowerCase()) ||
                          r.nik.includes(searchWarga);
    const matchesHunian = filterHunian === 'all' || r.statusHunian.includes(filterHunian);
    return matchesSearch && matchesHunian;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Header Banner */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded-full text-xs font-bold mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
            <span>Panel Pengaturan Khusus Super Admin</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Kelola Master Data & Konfigurasi Sistem RT 01
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-1.5 leading-relaxed">
            Halaman khusus administrator untuk mengubah susunan pengurus (Ketua RT, Wakil, Sekretaris, Bendahara), memperbarui status warga, serta menambah & mengedit nomor kontak darurat resmi.
          </p>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('pengurus')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeAdminTab === 'pengurus'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Kelola Pengurus RT (Ketua, Wakil, Sekr, Bend)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('statusWarga')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeAdminTab === 'statusWarga'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Status Warga & Kependudukan</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('kontakDarurat')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
            activeAdminTab === 'kontakDarurat'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Kontak Darurat & Hotline</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KELOLA PENGURUS RT (KETUA RT, WAKIL, SEKRETARIS, BENDAHARA) */}
      {/* ========================================================================= */}
      {activeAdminTab === 'pengurus' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Penetapan Jabatan Pengurus RT 01 RW 12
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Admin dapat menunjuk warga terpilih menjadi Ketua RT, Wakil Ketua RT, Sekretaris, atau Bendahara, atau mengedit data kontak masing-masing.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                4 Jabatan Inti
              </span>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {officers.map((officer) => {
                const badgeColor = 
                  officer.jabatan === 'Ketua RT' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                  officer.jabatan === 'Wakil Ketua RT' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                  officer.jabatan === 'Sekretaris' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                  'bg-amber-50 text-amber-800 border-amber-300';

                return (
                  <div 
                    key={officer.id} 
                    className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg border uppercase tracking-wider ${badgeColor}`}>
                          {officer.jabatan}
                        </span>
                        <span className="text-xs font-mono font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {officer.periode}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 mt-2">
                        {officer.namaLengkap}
                      </h4>

                      <div className="mt-2 space-y-1 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Alamat Blok: <strong className="text-slate-800">{officer.blokRumah}</strong></span>
                        </p>
                        <p className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>No. Telepon / WA: <strong className="text-slate-800">{officer.noTelepon}</strong></span>
                        </p>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-3 line-clamp-2 leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-100">
                        "{officer.tugasUtama}"
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setAssignModalJabatan(officer.jabatan);
                          setSelectedResidentForAssign(residents[0]?.id || '');
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Tunjuk Warga</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingOfficer(officer);
                          setFormOfficerName(officer.namaLengkap);
                          setFormOfficerBlock(officer.blokRumah);
                          setFormOfficerPhone(officer.noTelepon);
                          setFormOfficerPeriod(officer.periode);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Data</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STATUS WARGA & KEPENDUDUKAN */}
      {/* ========================================================================= */}
      {activeAdminTab === 'statusWarga' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Kelola Data & Status Kependudukan Warga
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ubah status kepemilikan hunian (Tetap, Kontrak, Kos) dan hubungan keluarga langsung secara instan.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchWarga}
                  onChange={(e) => setSearchWarga(e.target.value)}
                  placeholder="Cari nama / NIK / blok..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 font-semibold mr-1">Filter Hunian:</span>
              {['all', 'Tetap', 'Kontrak', 'Kos'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterHunian(status)}
                  className={`px-3 py-1 font-semibold rounded-lg transition-colors ${
                    filterHunian === status
                      ? 'bg-purple-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status === 'all' ? 'Semua Hunian' : status}
                </button>
              ))}
            </div>

            {/* Residents Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">Nama Lengkap & NIK</th>
                    <th className="py-3 px-4">Alamat Blok</th>
                    <th className="py-3 px-4">Status Hunian</th>
                    <th className="py-3 px-4">Status Keluarga</th>
                    <th className="py-3 px-4 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResidents.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{res.namaLengkap}</span>
                        <span className="text-[11px] text-slate-400 font-mono">NIK: {res.nik} · {res.pekerjaan}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {res.blokRumah}
                      </td>
                      <td className="py-3 px-4">
                        {/* Instant Status Hunian Selector */}
                        <select
                          value={res.statusHunian}
                          onChange={(e) => updateResidentStatus(res.id, e.target.value as Resident['statusHunian'], res.statusKeluarga)}
                          className={`p-1 text-xs font-bold rounded-lg border ${
                            res.statusHunian.includes('Tetap')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="Tetap (Pemilik)">Tetap (Pemilik)</option>
                          <option value="Kontrak / Sewa">Kontrak / Sewa</option>
                          <option value="Kos / Singgah">Kos / Singgah</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        {/* Instant Status Keluarga Selector */}
                        <select
                          value={res.statusKeluarga}
                          onChange={(e) => updateResidentStatus(res.id, res.statusHunian, e.target.value as Resident['statusKeluarga'])}
                          className="p-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800"
                        >
                          <option value="Kepala Keluarga">Kepala Keluarga</option>
                          <option value="Istri">Istri</option>
                          <option value="Anak">Anak</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingResident(res);
                            setResName(res.namaLengkap);
                            setResNik(res.nik);
                            setResNoKk(res.noKk);
                            setResBlock(res.blokRumah);
                            setResPhone(res.noTelepon || '');
                            setResJob(res.pekerjaan);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                        >
                          Edit Lengkap
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KONTAK DARURAT & HOTLINE */}
      {/* ========================================================================= */}
      {activeAdminTab === 'kontakDarurat' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Nomor Kontak Darurat & Hotline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kontak ini tampil otomatis pada tombol "Kontak Darurat" di seluruh halaman warga & pos satpam.
                </p>
              </div>

              <button
                onClick={openAddContactModal}
                className="px-3.5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kontak Baru</span>
              </button>
            </div>

            {/* Emergency Contacts Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {emergencyContacts.map((item) => {
                const Icon = getCategoryIcon(item.kategori);
                return (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                          {item.kategori}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                        <span className="text-xs font-mono font-bold text-slate-800 mt-1 block">
                          {item.number}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditContactModal(item)}
                        className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit Kontak"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus kontak darurat "${item.title}"?`)) {
                            deleteEmergencyContact(item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Kontak"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT PENGURUS RT */}
      {/* ========================================================================= */}
      {editingOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Edit Data: {editingOfficer.jabatan}
              </h3>
              <button
                onClick={() => setEditingOfficer(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOfficerEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Pengurus</label>
                <input
                  type="text"
                  value={formOfficerName}
                  onChange={(e) => setFormOfficerName(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Blok Hunian</label>
                <input
                  type="text"
                  value={formOfficerBlock}
                  onChange={(e) => setFormOfficerBlock(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={formOfficerPhone}
                  onChange={(e) => setFormOfficerPhone(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Masa Periode Kepengurusan</label>
                <input
                  type="text"
                  value={formOfficerPeriod}
                  onChange={(e) => setFormOfficerPeriod(e.target.value)}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOfficer(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ASSIGN WARGA TO BECOME OFFICER (KETUA / WAKIL / SEKR / BENDAHARA) */}
      {/* ========================================================================= */}
      {assignModalJabatan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Tunjuk Warga Menjadi: {assignModalJabatan}
              </h3>
              <button
                onClick={() => setAssignModalJabatan(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAssign} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Warga dari Daftar Warga Arcadia:
                </label>
                <select
                  value={selectedResidentForAssign}
                  onChange={(e) => {
                    setSelectedResidentForAssign(e.target.value);
                    const found = residents.find(r => r.id === e.target.value);
                    if (found) {
                      setCustomPhoneAssign(found.noTelepon || '');
                      setCustomBlockAssign(found.blokRumah);
                    }
                  }}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.namaLengkap} ({r.blokRumah})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor HP / WhatsApp Resmi Jabatan:
                </label>
                <input
                  type="text"
                  value={customPhoneAssign}
                  onChange={(e) => setCustomPhoneAssign(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Blok Rumah:
                </label>
                <input
                  type="text"
                  value={customBlockAssign}
                  onChange={(e) => setCustomBlockAssign(e.target.value)}
                  placeholder="Blok A1 No. 01"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalJabatan(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors"
                >
                  Tetapkan Pejabat RT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT PROFILE WARGA LENGKAP */}
      {/* ========================================================================= */}
      {editingResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Edit Profil Lengkap Warga
              </h3>
              <button
                onClick={() => setEditingResident(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResidentEdit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Blok Rumah</label>
                  <input
                    type="text"
                    value={resBlock}
                    onChange={(e) => setResBlock(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    value={resNik}
                    onChange={(e) => setResNik(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                  <input
                    type="text"
                    value={resNoKk}
                    onChange={(e) => setResNoKk(e.target.value)}
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={resPhone}
                    onChange={(e) => setResPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={resJob}
                    onChange={(e) => setResJob(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingResident(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TAMBAH / EDIT KONTAK DARURAT */}
      {/* ========================================================================= */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingContact ? 'Edit Kontak Darurat' : 'Tambah Kontak Darurat Baru'}
              </h3>
              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmergencyContact} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Instansi / Kontak Darurat
                </label>
                <input
                  type="text"
                  value={emgTitle}
                  onChange={(e) => setEmgTitle(e.target.value)}
                  placeholder="Misal: Pos Satpam Gerbang Arcadia / Bhabinkamtibmas"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan / Person In Charge (PIC)
                </label>
                <input
                  type="text"
                  value={emgSubtitle}
                  onChange={(e) => setEmgSubtitle(e.target.value)}
                  placeholder="Misal: Standby 24 Jam - Pak Rohman"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Telepon / Hotline
                </label>
                <input
                  type="text"
                  value={emgNumber}
                  onChange={(e) => setEmgNumber(e.target.value)}
                  placeholder="0812-xxxx-xxxx / 112"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori Kontak:
                </label>
                <select
                  value={emgCategory}
                  onChange={(e) => setEmgCategory(e.target.value as EmergencyContact['kategori'])}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  <option value="keamanan">Keamanan / Satpam</option>
                  <option value="polisi">Kepolisian / Babinsa</option>
                  <option value="medis">Medis / Ambulans / Puskesmas</option>
                  <option value="damkar">Pemadam Kebakaran (Damkar)</option>
                  <option value="pln">Listrik PLN</option>
                  <option value="pdam">Air Bersih PDAM</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors"
                >
                  Simpan Kontak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
