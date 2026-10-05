import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { OfficialLetter } from '../types';
import { generateSuratPengantarPdf, printDocumentIsolated } from '../utils/pdfGenerator';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Printer, 
  X, 
  Search,
  Check,
  ShieldCheck,
  Download,
  Loader2
} from 'lucide-react';

export const SuratView: React.FC = () => {
  const { role, activeResident, letters, requestLetter, approveLetter, rejectLetter, canEditSurat, isWarga } = useRT();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedLetterForPrint, setSelectedLetterForPrint] = useState<OfficialLetter | null>(null);
  const [rejectingLetterId, setRejectingLetterId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [printSuccessNotice, setPrintSuccessNotice] = useState<string | null>(null);

  // Form state
  const [selectedJenisSurat, setSelectedJenisSurat] = useState<OfficialLetter['jenisSurat']>('Surat Keterangan Domisili');
  const [keperluan, setKeperluan] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keperluan.trim()) return;

    requestLetter({
      jenisSurat: selectedJenisSurat,
      keperluan
    });

    setIsApplyModalOpen(false);
    setKeperluan('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingLetterId) return;
    rejectLetter(rejectingLetterId, rejectReason || 'Persyaratan belum lengkap.');
    setRejectingLetterId(null);
    setRejectReason('');
  };

  const handleDownloadPdf = () => {
    if (!selectedLetterForPrint) return;
    setIsGeneratingPdf(true);
    generateSuratPengantarPdf(selectedLetterForPrint);
    setPrintSuccessNotice('Dokumen resmi siap cetak telah diunduh dalam format PDF. Silakan buka berkas untuk langsung mencetaknya.');
    setTimeout(() => {
      setIsGeneratingPdf(false);
    }, 600);
  };

  const handlePrint = () => {
    if (!selectedLetterForPrint) return;
    setIsGeneratingPdf(true);
    // 1. Immediately provide the official PDF file download (guaranteed to work across all devices and sandboxed iframes)
    generateSuratPengantarPdf(selectedLetterForPrint);
    // 2. Also attempt print dialog
    try {
      printDocumentIsolated('surat-resmi-print-area', `Surat Pengantar - ${selectedLetterForPrint.pemohonNama}`);
    } catch (e) {
      console.warn('Sandbox blocked print:', e);
    }
    setPrintSuccessNotice('Dokumen resmi telah diunduh dalam format PDF siap cetak. Buka berkas PDF untuk mencetak langsung.');
    setTimeout(() => {
      setIsGeneratingPdf(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Layanan Surat Pengantar RT Online</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pengajuan mandiri surat keterangan domisili, pengantar KTP/KK, SKU, dan legalisir pengurus RT
          </p>
        </div>

        {!isWarga && (
          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Ajukan Surat Pengantar</span>
          </button>
        )}
      </div>

      {isWarga && (
        <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-500" />
            <span><strong>Mode Akses Warga:</strong> Anda dapat melihat daftar surat dan mencetak/mengunduh berkas PDF surat yang telah berstatus Disetujui. Pengajuan resmi & persetujuan surat dikelola oleh Admin RT.</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Hanya Lihat</span>
        </div>
      )}

      {/* Letters List */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <tr>
                <th className="py-3 px-4">No. Surat & Jenis</th>
                <th className="py-3 px-4">Nama Pemohon</th>
                <th className="py-3 px-4">Keperluan</th>
                <th className="py-3 px-4">Tanggal Pengajuan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {letters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    Belum ada pengajuan surat pengantar.
                  </td>
                </tr>
              ) : (
                letters.map((letter) => (
                  <tr key={letter.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 block">{letter.jenisSurat}</span>
                      <span className="text-[11px] font-mono text-neutral-500">{letter.noSurat}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-neutral-900">{letter.pemohonNama}</span>
                      <span className="text-[11px] text-neutral-500 block">{letter.blokRumah}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 max-w-xs">
                      <p className="line-clamp-2 leading-relaxed">{letter.keperluan}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">
                      {letter.tanggalPengajuan}
                    </td>
                    <td className="py-3.5 px-4">
                      {letter.status === 'Disetujui' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Disetujui</span>
                        </span>
                      ) : letter.status === 'Menunggu' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Menunggu Validasi</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Ditolak</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {letter.status === 'Disetujui' && (
                          <button
                            onClick={() => setSelectedLetterForPrint(letter)}
                            className="px-2.5 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Surat</span>
                          </button>
                        )}

                        {canEditSurat && letter.status === 'Menunggu' && (
                          <>
                            <button
                              onClick={() => approveLetter(letter.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => setRejectingLetterId(letter.id)}
                              className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                            >
                              Tolak
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

      {/* Apply Letter Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Form Pengajuan Surat Pengantar RT</h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg space-y-1">
                <span className="text-neutral-500 block">Pemohon:</span>
                <p className="font-semibold text-neutral-900">{activeResident.namaLengkap}</p>
                <p className="text-[11px] text-neutral-500 font-mono">NIK: {activeResident.nik} · {activeResident.blokRumah}</p>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Jenis Surat yang Dibutuhkan</label>
                <select
                  value={selectedJenisSurat}
                  onChange={(e) => setSelectedJenisSurat(e.target.value as any)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
                  <option value="Surat Pengantar Pembuatan KTP">Surat Pengantar Pembuatan KTP</option>
                  <option value="Surat Pengantar Pembuatan KK">Surat Pengantar Pembuatan KK</option>
                  <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                  <option value="Surat Keterangan Belum Menikah">Surat Keterangan Belum Menikah</option>
                  <option value="Surat Keterangan Kematian">Surat Keterangan Kematian</option>
                  <option value="Surat Keterangan Tidak Mampu">Surat Keterangan Tidak Mampu</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Keperluan / Keterangan Penggunaan</label>
                <textarea
                  rows={3}
                  required
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Contoh: Persyaratan pembuatan buku tabungan rekening baru atau pengajuan KTP baru di Kelurahan Sukamaju..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingLetterId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-base font-bold text-neutral-900">Tolak Permohonan Surat</h3>
            <p className="text-xs text-neutral-500 mt-1">Berikan alasan penolakan agar warga dapat melengkapi berkasnya.</p>

            <form onSubmit={handleConfirmReject} className="mt-4 space-y-3 text-xs">
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Data NIK belum sinkron dengan data sensus RT atau foto tempat usaha belum dilampirkan..."
                className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingLetterId(null)}
                  className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Tolak Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Indonesian Letter Printable Modal */}
      {selectedLetterForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-2xl border border-neutral-300 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 no-print">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Format Standar Surat Pengantar RT
              </span>
              <button
                onClick={() => setSelectedLetterForPrint(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Indonesian Letter Body */}
            <div 
              id="surat-resmi-print-area"
              className="mt-4 p-8 bg-white border border-neutral-300 font-serif text-neutral-900 leading-relaxed text-sm"
            >
              {/* Kop Surat RT */}
              <div className="text-center border-b-2 border-black pb-3">
                <h3 className="text-lg font-bold tracking-wider uppercase">
                  RUKUN TETANGGA 01 / RUKUN WARGA 12
                </h3>
                <h4 className="text-base font-bold uppercase">
                  DESA SUWAYUWO - KECAMATAN SUKOREJO, KABUPATEN PASURUAN
                </h4>
                <p className="text-xs font-sans text-neutral-600 mt-1">
                  Sekretariat: Perumahan Oma Indah Kapuk Cluster Arcadia, Suwayuwo, Sukorejo, Pasuruan · Telp: 0811-2233-4455
                </p>
              </div>

              {/* Title & Number */}
              <div className="text-center mt-6">
                <h2 className="text-base font-bold uppercase underline tracking-wider">
                  SURAT KETERANGAN PENGANTAR
                </h2>
                <p className="text-xs font-sans text-neutral-700 mt-1">
                  Nomor: {selectedLetterForPrint.noSurat}
                </p>
              </div>

              {/* Content Body */}
              <div className="mt-6 space-y-4 text-justify font-sans text-xs">
                <p>
                  Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 01 / RW 12 Desa Suwayuwo, Kecamatan Sukorejo, Kabupaten Pasuruan, menerangkan dengan sebenarnya bahwa:
                </p>

                <div className="pl-6 space-y-1.5 font-sans">
                  <div className="grid grid-cols-4">
                    <span className="text-neutral-600">Nama Lengkap</span>
                    <span className="col-span-3 font-bold">: {selectedLetterForPrint.pemohonNama}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="text-neutral-600">NIK (No. KTP)</span>
                    <span className="col-span-3 font-mono">: {selectedLetterForPrint.nik}</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="text-neutral-600">Alamat / Blok</span>
                    <span className="col-span-3">: {selectedLetterForPrint.blokRumah}, Perumahan Oma Indah Kapuk Cluster Arcadia</span>
                  </div>
                  <div className="grid grid-cols-4">
                    <span className="text-neutral-600">Keperluan</span>
                    <span className="col-span-3 font-semibold">: {selectedLetterForPrint.keperluan}</span>
                  </div>
                </div>

                <p className="leading-relaxed">
                  Adalah benar nama tersebut di atas merupakan warga yang bertempat tinggal / berdomisili di lingkungan RT 01 / RW 12 Suwayuwo, Perumahan Oma Indah Kapuk Cluster Arcadia dan berkelakuan baik dalam kehidupan bermasyarakat.
                </p>

                <p className="leading-relaxed">
                  Surat pengantar ini diberikan untuk keperluan: <strong>{selectedLetterForPrint.jenisSurat}</strong> sesuai dengan maksud yang bersangkutan.
                </p>

                <p>
                  Demikian surat pengantar ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya oleh pihak yang berwenang.
                </p>
              </div>

              {/* Date & Signatures */}
              <div className="mt-12 flex justify-between items-end font-sans text-xs">
                <div className="text-center w-40">
                  <p>Pemohon,</p>
                  <div className="h-20 flex items-end justify-center">
                    <p className="font-bold underline">{selectedLetterForPrint.pemohonNama}</p>
                  </div>
                </div>

                <div className="text-center w-52 relative">
                  {/* Digital Stamp Simulation */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="border-2 border-emerald-900 rounded-full w-28 h-28 flex items-center justify-center p-2 text-center text-[8px] font-bold text-emerald-900 uppercase">
                      PENGURUS RT 01 / RW 12 OMA INDAH KAPUK CLUSTER ARCADIA
                    </div>
                  </div>

                  <p>Pasuruan, {selectedLetterForPrint.tanggalDisetujui || '2026-09-29'}</p>
                  <p className="font-medium mt-0.5">Ketua RT 01 / RW 12</p>
                  <div className="h-16 flex items-end justify-center">
                    <p className="font-bold underline">Hendra Gunawan</p>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">Perumahan Oma Indah Kapuk</p>
                </div>
              </div>
            </div>

            {/* Success Notice if printed/downloaded */}
            {printSuccessNotice && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{printSuccessNotice}</span>
                </div>
                <button 
                  onClick={() => setPrintSuccessNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Print & Download Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dokumen resmi siap cetak atau unduh PDF untuk kantor desa & instansi</span>
              </div>
              <div className="flex items-center gap-2 font-sans">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Membuat PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Dokumen</span>
                </button>
                <button
                  onClick={() => setSelectedLetterForPrint(null)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
