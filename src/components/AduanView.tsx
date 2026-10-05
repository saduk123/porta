import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { ComplaintReport } from '../types';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Plus, 
  X, 
  Filter,
  Check
} from 'lucide-react';

export const AduanView: React.FC = () => {
  const { role, activeResident, complaints, addComplaint, updateComplaintStatus, canEditAduan } = useRT();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [respondingComplaint, setRespondingComplaint] = useState<ComplaintReport | null>(null);
  const [responseStatus, setResponseStatus] = useState<ComplaintReport['status']>('Sedang Ditangani');
  const [responseText, setResponseText] = useState('');

  // Form state
  const [formKategori, setFormKategori] = useState<ComplaintReport['kategori']>('Lampu / Fasilitas');
  const [formJudul, setFormJudul] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');

  const filteredComplaints = complaints.filter(c => {
    if (selectedKategori === 'all') return true;
    return c.kategori === selectedKategori;
  });

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || !formDeskripsi.trim()) return;

    addComplaint({
      kategori: formKategori,
      judul: formJudul,
      deskripsi: formDeskripsi
    });

    setIsSubmitModalOpen(false);
    setFormJudul('');
    setFormDeskripsi('');
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingComplaint) return;

    updateComplaintStatus(
      respondingComplaint.id,
      responseStatus,
      responseText,
      'Hendra Gunawan (Ketua RT)'
    );

    setRespondingComplaint(null);
    setResponseText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Aspirasi & Aduan Lingkungan Warga</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Saluran pelaporan masalah fasilitas perumahan, sampah, lampu jalan mati, kebisingan, dan keamanan
          </p>
        </div>

        {canEditAduan && (
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Laporan Baru</span>
          </button>
        )}
      </div>

      {!canEditAduan && (
        <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-500" />
            <span><strong>Mode Akses Warga:</strong> Tampilan ini hanya untuk melihat daftar aspirasi/aduan dan respon tindak lanjut. Pembaruan status dan tanggapan resmi dikelola oleh Pengurus RT dan Admin.</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Hanya Lihat</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['all', 'Lampu / Fasilitas', 'Kebersihan / Sampah', 'Keamanan', 'Kebisingan', 'Hewan Peliharaan'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedKategori(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedKategori === cat
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            {cat === 'all' ? 'Semua Laporan' : cat}
          </button>
        ))}
      </div>

      {/* Complaint Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400 bg-white rounded-xl border border-neutral-200">
            Tidak ada laporan aduan dalam kategori ini. Lingkungan aman dan kondusif.
          </div>
        ) : (
          filteredComplaints.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs hover:border-neutral-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-800">{item.kategori}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-500">{item.blokRumah}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-400 font-mono">{item.tanggalLapor}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900">
                    {item.judul}
                  </h3>

                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {item.deskripsi}
                  </p>

                  <div className="text-[11px] text-neutral-500 pt-1">
                    Dilaporkan oleh: <strong className="text-neutral-700">{item.pelaporNama}</strong>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-end gap-2">
                  {item.status === 'Selesai' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai Ditangani</span>
                    </span>
                  ) : item.status === 'Sedang Ditangani' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Sedang Ditangani</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Menunggu Respon</span>
                    </span>
                  )}

                  {canEditAduan && (
                    <button
                      onClick={() => {
                        setRespondingComplaint(item);
                        setResponseStatus(item.status);
                        setResponseText(item.tanggapanPengurus || '');
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                    >
                      Tindak Lanjuti
                    </button>
                  )}
                </div>
              </div>

              {/* Official Response Box */}
              {item.tanggapanPengurus && (
                <div className="mt-4 pt-3 border-t border-neutral-100 bg-neutral-50/80 p-3 rounded-lg border border-neutral-200/60">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Tanggapan Pengurus RT 01</span>
                    </span>
                    <span className="text-[11px] text-neutral-500 font-normal">
                      Petugas: {item.ditanganiOleh || 'Pengurus RT'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {item.tanggapanPengurus}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Complaint Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Kirim Aduan / Laporan Lingkungan</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <span className="text-neutral-500 block">Pelapor:</span>
                <p className="font-semibold text-neutral-900">{activeResident.namaLengkap} ({activeResident.blokRumah})</p>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Kategori Masalah</label>
                <select
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value as any)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Lampu / Fasilitas">Lampu / Fasilitas Jalan</option>
                  <option value="Kebersihan / Sampah">Kebersihan & Sampah Belum Diangkut</option>
                  <option value="Keamanan">Keamanan Lingkungan & Portal</option>
                  <option value="Kebisingan">Kebisingan Jam Istirahat</option>
                  <option value="Hewan Peliharaan">Hewan Peliharaan / Kucing Liar</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Judul Laporan Singkat</label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder="Contoh: Bohlam Lampu PJU Tiang No. 3 Padam"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Deskripsi Detail Masalah & Lokasi</label>
                <textarea
                  rows={4}
                  required
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Jelaskan kondisi secara lengkap, letak persis gang/blok, dan kapan masalah ini mulai terjadi..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Modal for Pengurus */}
      {respondingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-base font-bold text-neutral-900">Tindak Lanjuti Aduan</h3>
            <p className="text-xs text-neutral-500 mt-1">{respondingComplaint.judul}</p>

            <form onSubmit={handleSaveResponse} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Perbarui Status Penanganan</label>
                <select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  <option value="Menunggu Tindak Lanjut">Menunggu Tindak Lanjut</option>
                  <option value="Sedang Ditangani">Sedang Ditangani (Teknisi/Satpam otw)</option>
                  <option value="Selesai">Selesai (Sudah Beres & Dituntaskan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tanggapan / Laporan Tindak Lanjut</label>
                <textarea
                  rows={3}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Contoh: Petugas satpam dan teknisi sudah mengganti lampu baru dan lampu sudah menyala normal..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setRespondingComplaint(null)}
                  className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Simpan Tindak Lanjut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
