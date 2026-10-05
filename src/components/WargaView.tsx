import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { Resident } from '../types';
import { printDocumentIsolated } from '../utils/pdfGenerator';
import { 
  Users, 
  UserPlus, 
  Search, 
  Download, 
  Printer, 
  Edit3, 
  Trash2, 
  X, 
  Phone, 
  Car, 
  Home, 
  ShieldAlert,
  Check
} from 'lucide-react';

export const WargaView: React.FC = () => {
  const { role, residents, addResident, updateResident, deleteResident, canEditWarga } = useRT();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [selectedHunian, setSelectedHunian] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [selectedResidentDetail, setSelectedResidentDetail] = useState<Resident | null>(null);

  // Form state
  const initialFormState: Omit<Resident, 'id'> = {
    noKk: '',
    nik: '',
    namaLengkap: '',
    blokRumah: 'Blok A1 No. 01',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1990-01-01',
    agama: 'Islam',
    pekerjaan: '',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '',
    platKendaraan: '',
    jumlahAnggota: 3,
    kontakDarurat: '',
    tanggalBergabung: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<Omit<Resident, 'id'>>(initialFormState);

  // Filter residents
  const filteredResidents = residents.filter(res => {
    const matchesSearch = 
      res.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.blokRumah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.pekerjaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.platKendaraan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBlock = selectedBlock === 'all' || res.blokRumah.includes(`Blok ${selectedBlock}`);
    const matchesHunian = selectedHunian === 'all' || res.statusHunian === selectedHunian;

    return matchesSearch && matchesBlock && matchesHunian;
  });

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setEditingResident(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (res: Resident) => {
    setEditingResident(res);
    setFormData({
      noKk: res.noKk,
      nik: res.nik,
      namaLengkap: res.namaLengkap,
      blokRumah: res.blokRumah,
      statusKeluarga: res.statusKeluarga,
      jenisKelamin: res.jenisKelamin,
      tempatLahir: res.tempatLahir,
      tanggalLahir: res.tanggalLahir,
      agama: res.agama,
      pekerjaan: res.pekerjaan,
      statusHunian: res.statusHunian,
      noTelepon: res.noTelepon,
      platKendaraan: res.platKendaraan,
      jumlahAnggota: res.jumlahAnggota,
      kontakDarurat: res.kontakDarurat,
      tanggalBergabung: res.tanggalBergabung
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResident) {
      updateResident(editingResident.id, formData);
    } else {
      addResident(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus data warga: ${name}?`)) {
      deleteResident(id);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Nama Lengkap', 'Blok Rumah', 'No KK', 'NIK', 'Status Keluarga', 'Status Hunian', 'Pekerjaan', 'No Telepon', 'Plat Kendaraan', 'Jumlah Anggota'];
    const rows = filteredResidents.map(r => [
      `"${r.namaLengkap}"`,
      `"${r.blokRumah}"`,
      `"${r.noKk}"`,
      `"${r.nik}"`,
      `"${r.statusKeluarga}"`,
      `"${r.statusHunian}"`,
      `"${r.pekerjaan}"`,
      `"${r.noTelepon}"`,
      `"${r.platKendaraan}"`,
      r.jumlahAnggota
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_warga_rt01_arcadia_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    printDocumentIsolated('warga-table-container', 'Data Sensus Warga RT 01 RW 12 Suwayuwo');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Kelola Data Warga RT 01 Arcadia</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Buku sensus kependudukan, status hunian tetap/kontrak, dan plat nomor kendaraan lingkungan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Data</span>
          </button>

          {canEditWarga && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Warga</span>
            </button>
          )}
        </div>
      </div>

      {!canEditWarga && (
        <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-500" />
            <span><strong>Mode Akses Warga:</strong> Tampilan ini hanya untuk melihat data (view-only). Pengeditan atau penambahan data warga hanya dapat dilakukan oleh Pengurus RT dan Admin.</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Hanya Lihat</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, blok, plat nomor, atau pekerjaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* Block Filter */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
              {['all', 'A', 'B', 'C', 'D'].map((blk) => (
                <button
                  key={blk}
                  onClick={() => setSelectedBlock(blk)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedBlock === blk
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {blk === 'all' ? 'Semua Blok' : `Blok ${blk}`}
                </button>
              ))}
            </div>

            {/* Hunian Filter */}
            <select
              value={selectedHunian}
              onChange={(e) => setSelectedHunian(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
            >
              <option value="all">Semua Status Hunian</option>
              <option value="Tetap (Pemilik)">Tetap (Pemilik)</option>
              <option value="Kontrak / Sewa">Kontrak / Sewa</option>
              <option value="Kos / Singgah">Kos / Singgah</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="text-xs text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
          <div>
            <span>Menampilkan </span>
            <span className="font-semibold text-neutral-800 font-mono tabular-nums">{filteredResidents.length}</span>
            <span> dari {residents.length} kepala keluarga / warga terdata</span>
          </div>
          {(searchQuery || selectedBlock !== 'all' || selectedHunian !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBlock('all');
                setSelectedHunian('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Residents Table */}
      <div id="warga-table-container" className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Warga</th>
                <th className="py-3 px-4">Blok Hunian</th>
                <th className="py-3 px-4">Status & Pekerjaan</th>
                <th className="py-3 px-4">Kontak & Plat Nomor</th>
                <th className="py-3 px-4 text-center">Anggota</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Tidak ditemukan data warga sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((res) => (
                  <tr key={res.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <span>{res.namaLengkap}</span>
                      </div>
                      <div className="text-neutral-500 text-[11px] font-mono mt-0.5">
                        NIK: {res.nik}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-neutral-900">{res.blokRumah}</span>
                      <span className="block text-[11px] text-neutral-500">{res.statusHunian}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-neutral-800 font-medium">{res.pekerjaan || '-'}</span>
                      <span className="block text-[11px] text-neutral-500">{res.statusKeluarga} · {res.agama}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-neutral-800 font-mono">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span>{res.noTelepon}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono mt-0.5 truncate max-w-xs">
                        <Car className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="truncate">{res.platKendaraan || 'Tidak ada kendaraan'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-semibold text-neutral-800 tabular-nums">
                        {res.jumlahAnggota}
                      </span>
                      <span className="text-[11px] text-neutral-500 block">jiwa</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedResidentDetail(res)}
                          className="px-2 py-1 text-[11px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                        >
                          Detail
                        </button>
                        {canEditWarga && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(res)}
                              title="Edit Data"
                              className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(res.id, res.namaLengkap)}
                              title="Hapus Data"
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                            >
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

      {/* Resident Detail Modal */}
      {selectedResidentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">{selectedResidentDetail.namaLengkap}</h3>
                <p className="text-xs text-neutral-500">{selectedResidentDetail.blokRumah} · {selectedResidentDetail.statusHunian}</p>
              </div>
              <button
                onClick={() => setSelectedResidentDetail(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Nomor Kartu Keluarga (KK)</span>
                <span className="font-mono font-semibold text-neutral-900">{selectedResidentDetail.noKk}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Nomor Induk Kependudukan (NIK)</span>
                <span className="font-mono font-semibold text-neutral-900">{selectedResidentDetail.nik}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Tempat, Tanggal Lahir</span>
                <span className="font-medium text-neutral-900">{selectedResidentDetail.tempatLahir}, {selectedResidentDetail.tanggalLahir}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Agama & Pekerjaan</span>
                <span className="font-medium text-neutral-900">{selectedResidentDetail.agama} · {selectedResidentDetail.pekerjaan}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Nomor WhatsApp / HP</span>
                <span className="font-mono font-semibold text-neutral-900">{selectedResidentDetail.noTelepon}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Total Anggota Keluarga</span>
                <span className="font-semibold text-neutral-900 font-mono">{selectedResidentDetail.jumlahAnggota} Jiwa</span>
              </div>
              <div className="col-span-2 p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Kendaraan Terdaftar (Akses Gerbang)</span>
                <span className="font-medium text-neutral-900">{selectedResidentDetail.platKendaraan || '-'}</span>
              </div>
              <div className="col-span-2 p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg">
                <span className="text-amber-800 font-semibold block">Kontak Darurat Keluarga</span>
                <span className="text-neutral-800">{selectedResidentDetail.kontakDarurat || 'Belum diisi'}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => setSelectedResidentDetail(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Resident Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">
                {editingResident ? 'Perbarui Data Warga' : 'Tambah Warga Baru Arcadia'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nama Lengkap (Beserta Gelar jika ada)</label>
                  <input
                    type="text"
                    required
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Bpk. Bambang Pamungkas"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Blok & Nomor Rumah</label>
                  <input
                    type="text"
                    required
                    value={formData.blokRumah}
                    onChange={(e) => setFormData({ ...formData, blokRumah: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Blok B3 No. 12"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nomor Kartu Keluarga (KK)</label>
                  <input
                    type="text"
                    required
                    value={formData.noKk}
                    onChange={(e) => setFormData({ ...formData, noKk: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="16 Digit No KK"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    required
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="16 Digit NIK KTP"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Status Hubungan Keluarga</label>
                  <select
                    value={formData.statusKeluarga}
                    onChange={(e) => setFormData({ ...formData, statusKeluarga: e.target.value as any })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kepala Keluarga">Kepala Keluarga</option>
                    <option value="Istri">Istri</option>
                    <option value="Anak">Anak</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Status Kepemilikan Hunian</label>
                  <select
                    value={formData.statusHunian}
                    onChange={(e) => setFormData({ ...formData, statusHunian: e.target.value as any })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Tetap (Pemilik)">Tetap (Pemilik)</option>
                    <option value="Kontrak / Sewa">Kontrak / Sewa</option>
                    <option value="Kos / Singgah">Kos / Singgah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Pegawai BUMN / Swasta"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Agama</label>
                  <select
                    value={formData.agama}
                    onChange={(e) => setFormData({ ...formData, agama: e.target.value as any })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={formData.noTelepon}
                    onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="0812-xxxx-xxxx"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Jumlah Anggota Keluarga (Jiwa)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.jumlahAnggota}
                    onChange={(e) => setFormData({ ...formData, jumlahAnggota: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Plat Kendaraan (Mobil / Motor)</label>
                  <input
                    type="text"
                    value={formData.platKendaraan}
                    onChange={(e) => setFormData({ ...formData, platKendaraan: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="Contoh: B 1234 ARC (Innova), B 5678 BCD (Vario)"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Kontak Darurat (Nama & Hubungan)</label>
                  <input
                    type="text"
                    value={formData.kontakDarurat}
                    onChange={(e) => setFormData({ ...formData, kontakDarurat: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: 0812-xxxx-xxxx (Istri - Ibu Ratna)"
                  />
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  {editingResident ? 'Simpan Perubahan' : 'Tambah Warga'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
