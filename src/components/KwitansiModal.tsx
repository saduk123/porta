import React, { useState } from 'react';
import { FeePayment } from '../types';
import { generateKwitansiPdf, printDocumentIsolated } from '../utils/pdfGenerator';
import { X, Printer, CheckCircle, ShieldCheck, Download, Loader2 } from 'lucide-react';

interface KwitansiModalProps {
  fee: FeePayment | null;
  onClose: () => void;
}

export const KwitansiModal: React.FC<KwitansiModalProps> = ({ fee, onClose }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [printSuccessNotice, setPrintSuccessNotice] = useState<string | null>(null);

  if (!fee) return null;

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    generateKwitansiPdf(fee);
    setPrintSuccessNotice('Kwitansi resmi telah diunduh dalam format PDF. Silakan buka berkas untuk langsung mencetaknya.');
    setTimeout(() => {
      setIsGeneratingPdf(false);
    }, 600);
  };

  const handlePrint = () => {
    setIsGeneratingPdf(true);
    // 1. Immediately download official PDF (works on all devices & inside iframes)
    generateKwitansiPdf(fee);
    // 2. Also try print dialog
    try {
      printDocumentIsolated('kwitansi-print-area', `Kwitansi IPL - ${fee.residentName}`);
    } catch (e) {
      console.warn('Sandbox blocked print:', e);
    }
    setPrintSuccessNotice('Kwitansi resmi siap cetak telah diunduh sebagai PDF! Buka berkas PDF untuk mencetak langsung.');
    setTimeout(() => {
      setIsGeneratingPdf(false);
    }, 600);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getBulanNama = (bulanStr: string) => {
    const [tahun, bulan] = bulanStr.split('-');
    const date = new Date(parseInt(tahun), parseInt(bulan) - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-neutral-300">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 no-print">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Tanda Terima Iuran Sah RT 01 RW 12</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Receipt Body (Printable & Exportable) */}
        <div 
          id="kwitansi-print-area"
          className="mt-4 p-6 border-2 border-neutral-800 rounded-lg bg-white relative"
        >
          {/* Header Kop Kwitansi */}
          <div className="text-center pb-4 border-b-2 border-neutral-800">
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">
              RUKUN TETANGGA 01 / RUKUN WARGA 12
            </h3>
            <p className="text-xs font-semibold text-neutral-800 uppercase">
              PERUMAHAN OMA INDAH KAPUK CLUSTER ARCADIA
            </p>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              DESA SUWAYUWO, KEC. SUKOREJO, PASURUAN · Telp: 0811-2233-4455
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-neutral-100 border border-neutral-400 text-xs font-bold uppercase tracking-wide">
              KWITANSI PEMBAYARAN IURAN PENGELOLAAN LINGKUNGAN (IPL)
            </div>
          </div>

          {/* Receipt Info */}
          <div className="mt-4 flex justify-between text-xs font-mono">
            <div>
              <span className="text-neutral-500">No. Kwitansi: </span>
              <span className="font-bold text-neutral-900">{fee.noKwitansi || 'KW/ARC-RT01/2026/09/XXX'}</span>
            </div>
            <div>
              <span className="text-neutral-500">Tanggal: </span>
              <span className="font-semibold text-neutral-900">{fee.tanggalBayar || '2026-09-29'}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 text-xs text-neutral-800">
            <div className="grid grid-cols-3 border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Telah Diterima Dari</span>
              <span className="col-span-2 font-bold text-neutral-900">: {fee.residentName}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Alamat Hunian</span>
              <span className="col-span-2 font-medium text-neutral-900">: {fee.blokRumah}, Oma Indah Kapuk Cluster Arcadia</span>
            </div>
            <div className="grid grid-cols-3 border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Untuk Pembayaran</span>
              <span className="col-span-2 font-semibold text-neutral-900">: Iuran Lingkungan Periode {getBulanNama(fee.bulan)}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Rincian Pos Iuran</span>
              <div className="col-span-2 text-neutral-700 space-y-0.5 font-mono text-[11px]">
                <p>· Keamanan & Satpam 24 Jam : Rp 80.000</p>
                <p>· Pengangkutan Sampah & DLH : Rp 50.000</p>
                <p>· Kas Sosial & Perawatan Fasum : Rp 20.000</p>
              </div>
            </div>
            <div className="grid grid-cols-3 border-b border-neutral-100 pb-2">
              <span className="text-neutral-500">Metode Bayar</span>
              <span className="col-span-2 font-medium">: {fee.metodePembayaran}</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="mt-5 p-3 bg-neutral-50 border border-neutral-300 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-neutral-700">Jumlah Nominal:</span>
            <span className="text-lg font-bold font-mono text-emerald-800 tabular-nums">
              {formatRupiah(fee.nominal)}
            </span>
          </div>

          <p className="mt-2 text-[11px] italic text-neutral-500">
            Terbilang: Seratus Lima Puluh Ribu Rupiah.
          </p>

          {/* Signature & Stamp */}
          <div className="mt-6 flex justify-between items-end text-xs">
            <div className="text-center w-36">
              <p className="text-neutral-500">Penyetor</p>
              <div className="h-14 flex items-end justify-center">
                <span className="font-medium text-neutral-800">{fee.residentName.split(' ')[0]}</span>
              </div>
              <div className="border-t border-neutral-400 mt-1">
                <p className="text-[10px] text-neutral-500">Warga RT 01 RW 12</p>
              </div>
            </div>

            <div className="text-center w-48 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                <div className="border-2 border-emerald-800 rounded-full w-24 h-24 flex items-center justify-center text-center">
                  <span className="text-[7px] font-bold text-emerald-800 uppercase">LUNAS RT 01 RW 12 CLUSTER ARCADIA</span>
                </div>
              </div>
              <p className="text-neutral-500">Bendahara RT 01 RW 12</p>
              <div className="h-14 flex items-end justify-center">
                <span className="font-bold text-neutral-900 underline">
                  {fee.diverifikasiOleh || 'Hj. Siti Nurjanah'}
                </span>
              </div>
              <div className="border-t border-neutral-400 mt-1">
                <p className="text-[10px] text-neutral-500">Oma Indah Kapuk Cluster Arcadia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Notice */}
        {printSuccessNotice && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kwitansi sah terverifikasi kas RT 01 RW 12</span>
          </div>
          <div className="flex items-center gap-2">
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
              <span>Cetak Kwitansi</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
