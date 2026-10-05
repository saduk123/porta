import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { GuestLog } from '../types';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Car, 
  MapPin, 
  X,
  Check
} from 'lucide-react';

export const BukuTamuView: React.FC = () => {
  const { role, activeResident, guestLogs, addGuestLog, canEditBukuTamu, isWarga } = useRT();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const initialFormState: Omit<GuestLog, 'id' | 'statusVerifikasi'> = {
    tuanRumahNama: activeResident.namaLengkap,
    blokRumah: activeResident.blokRumah,
    namaTamu: '',
    asalKota: '',
    hubungan: 'Keluarga Kandung',
    tanggalTiba: new Date().toISOString().split('T')[0],
    rencanaMenginapHari: 2,
    platKendaraan: '',
    catatan: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmitGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaTamu.trim() || !formData.asalKota.trim()) return;

    addGuestLog({
      ...formData,
      tuanRumahNama: role === 'pengurus' ? formData.tuanRumahNama : activeResident.namaLengkap,
      blokRumah: role === 'pengurus' ? formData.blokRumah : activeResident.blokRumah
    });

    setIsAddModalOpen(false);
    setFormData(initialFormState);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Buku Tamu Menginap 1x24 Jam</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kewajiban pelaporan tamu menginap sesuai Perda & Tata Tertib Keamanan Perumahan Arcadia RT 01
          </p>
        </div>

        {!isWarga && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Lapor Tamu Menginap</span>
          </button>
        )}
      </div>

      {isWarga && (
        <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-500" />
            <span><strong>Mode Akses Warga:</strong> Anda dapat melihat rekapitulasi data tamu menginap yang terdaftar. Pendaftaran tamu baru dilakukan oleh Pengurus RT / Admin / Petugas Satpam.</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Hanya Lihat</span>
        </div>
      )}

      {/* Rules Notice */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Tata Tertib Tamu Menginap RT 01 / RW 08 Arcadia:</p>
          <p className="text-emerald-800 leading-relaxed">
            Setiap warga yang menerima tamu menginap lebih dari 1x24 jam wajib mencatatkan identitas tamu dan plat nomor kendaraan demi kelancaran akses satpam di gerbang utama serta mencegah parkir liar yang menghalangi jalan komplek.
          </p>
        </div>
      </div>

      {/* Guest Log Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Nama Tamu & Asal</th>
                <th className="py-3 px-4">Tuan Rumah / Blok</th>
                <th className="py-3 px-4">Hubungan</th>
                <th className="py-3 px-4">Waktu Menginap</th>
                <th className="py-3 px-4">Kendaraan</th>
                <th className="py-3 px-4 text-right">Status Satpam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {guestLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Belum ada tamu menginap yang dilaporkan saat ini.
                  </td>
                </tr>
              ) : (
                guestLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 block">{log.namaTamu}</span>
                      <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{log.asalKota}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-neutral-900">{log.tuanRumahNama}</span>
                      <span className="text-[11px] text-neutral-500 block">{log.blokRumah}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-800">
                      {log.hubungan}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-neutral-800 font-medium">{log.tanggalTiba}</span>
                      <span className="text-[11px] text-neutral-500 block">Durasi: {log.rencanaMenginapHari} hari</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {log.platKendaraan ? (
                        <div className="flex items-center gap-1 text-neutral-700 font-mono text-[11px]">
                          <Car className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{log.platKendaraan}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        <Check className="w-3 h-3" />
                        <span>{log.statusVerifikasi}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Form Lapor Tamu Menginap 1x24 Jam</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitGuest} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Tuan Rumah:</span>
                <p className="font-semibold text-neutral-900">{activeResident.namaLengkap} ({activeResident.blokRumah})</p>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Nama Lengkap Tamu</label>
                <input
                  type="text"
                  required
                  value={formData.namaTamu}
                  onChange={(e) => setFormData({ ...formData, namaTamu: e.target.value })}
                  placeholder="Contoh: Bpk. Suryo Wibowo"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Asal Kota / Alamat Asal</label>
                  <input
                    type="text"
                    required
                    value={formData.asalKota}
                    onChange={(e) => setFormData({ ...formData, asalKota: e.target.value })}
                    placeholder="Contoh: Semarang, Jateng"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Hubungan dengan Tuan Rumah</label>
                  <input
                    type="text"
                    required
                    value={formData.hubungan}
                    onChange={(e) => setFormData({ ...formData, hubungan: e.target.value })}
                    placeholder="Contoh: Orang Tua / Kerabat / Rekan"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tanggal Tiba</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalTiba}
                    onChange={(e) => setFormData({ ...formData, tanggalTiba: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Rencana Menginap (Hari)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={60}
                    value={formData.rencanaMenginapHari}
                    onChange={(e) => setFormData({ ...formData, rencanaMenginapHari: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Plat Kendaraan Tamu (Bila membawa mobil/motor)</label>
                <input
                  type="text"
                  value={formData.platKendaraan}
                  onChange={(e) => setFormData({ ...formData, platKendaraan: e.target.value })}
                  placeholder="Contoh: H 1234 CD (Mobil Avanza)"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tujuan / Catatan (Opsional)</label>
                <input
                  type="text"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  placeholder="Contoh: Silaturahmi keluarga menghadiri hajatan"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Simpan Laporan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
