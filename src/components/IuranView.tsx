import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { FeePayment } from '../types';
import { KwitansiModal } from './KwitansiModal';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  QrCode, 
  Send, 
  Copy, 
  Check, 
  Search, 
  Filter,
  DollarSign
} from 'lucide-react';

export const IuranView: React.FC = () => {
  const { role, activeResident, residents, fees, payFee, verifyFee, rejectFee, canEditIuran } = useRT();

  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'pay' | 'verification' | 'reminder'>('matrix');
  const [selectedBulan, setSelectedBulan] = useState<string>('2026-09');
  const [searchWarga, setSearchWarga] = useState('');
  const [selectedFeeForKwitansi, setSelectedFeeForKwitansi] = useState<FeePayment | null>(null);

  // Payment form states
  const [payTargetResidentId, setPayTargetResidentId] = useState<string>(activeResident.id);
  const [payTargetMonth, setPayTargetMonth] = useState<string>('2026-09');
  const [payMethod, setPayMethod] = useState<'QRIS' | 'Transfer BCA' | 'Transfer Mandiri' | 'Tunai / Bendahara'>('QRIS');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(false);

  // Copied states
  const [copiedRekening, setCopiedRekening] = useState<string | null>(null);
  const [copiedWaText, setCopiedWaText] = useState<string | null>(null);

  const months = [
    { value: '2026-07', label: 'Juli 2026' },
    { value: '2026-08', label: 'Agustus 2026' },
    { value: '2026-09', label: 'September 2026' },
    { value: '2026-10', label: 'Oktober 2026' },
    { value: '2026-11', label: 'November 2026' },
    { value: '2026-12', label: 'Desember 2026' },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Fees filtered by selected month
  const monthFees = fees.filter(f => f.bulan === selectedBulan);
  const pendingFees = fees.filter(f => f.status === 'Menunggu Verifikasi');
  const unpaidResidents = residents.filter(res => {
    const fee = fees.find(f => f.residentId === res.id && f.bulan === selectedBulan);
    return !fee || fee.status === 'Belum Bayar';
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRekening(id);
    setTimeout(() => setCopiedRekening(null), 2000);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    payFee({
      residentId: role === 'pengurus' ? payTargetResidentId : activeResident.id,
      bulan: payTargetMonth,
      metode: payMethod,
      catatan: paymentNotes
    });
    setPaymentSuccessMsg(true);
    setTimeout(() => {
      setPaymentSuccessMsg(false);
      setActiveSubTab('matrix');
    }, 2000);
  };

  const generateWaReminder = (nama: string, blok: string, bulanLabel: string) => {
    return `Yth. Bpk/Ibu ${nama} (${blok}),\n\nSalam silaturahmi dari Pengurus RT 01 Arcadia. Kami menginfokan bahwa iuran pengelolaan lingkungan (IPL) untuk periode ${bulanLabel} sebesar Rp 150.000 (Keamanan, Kebersihan, Kas Sosial) belum tercatat lunas. Pembayaran dapat dilakukan via transfer atau QRIS melalui portal RT.\n\nTerima kasih atas partisipasi dan kerjasamanya menjaga kebersihan serta keamanan perumahan kita. 🙏`;
  };

  const handleCopyWa = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWaText(id);
    setTimeout(() => setCopiedWaText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Sistem Iuran Pengelolaan Lingkungan (IPL)</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tarif resmi Rp 150.000 / bulan · Keamanan Satpam, Armada Sampah DLH, dan Perawatan Fasum
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'matrix' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Matriks Iuran
          </button>
          <button
            onClick={() => setActiveSubTab('pay')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'pay' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Bayar Online / QRIS
          </button>
          {canEditIuran && (
            <button
              onClick={() => setActiveSubTab('verification')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors relative ${
                activeSubTab === 'verification' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>Verifikasi Bukti</span>
              {pendingFees.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white font-mono text-[10px] rounded-full">
                  {pendingFees.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setActiveSubTab('reminder')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'reminder' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Tunggakan & WA
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Matriks Status Iuran Bulanan */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          {/* Month Selector & Search */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-neutral-700 shrink-0">Pilih Periode:</span>
              <select
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="text-xs py-1.5 px-3 rounded-lg border border-neutral-200 bg-white font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau nomor blok..."
                value={searchWarga}
                onChange={(e) => setSearchWarga(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Nama Warga</th>
                    <th className="py-3 px-4">Blok Hunian</th>
                    <th className="py-3 px-4">Nominal Tagihan</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Status Pembayaran</th>
                    <th className="py-3 px-4 text-right">Kwitansi / Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {residents
                    .filter(r => 
                      r.namaLengkap.toLowerCase().includes(searchWarga.toLowerCase()) ||
                      r.blokRumah.toLowerCase().includes(searchWarga.toLowerCase())
                    )
                    .map((res) => {
                      const feeEntry = fees.find(f => f.residentId === res.id && f.bulan === selectedBulan);
                      const status = feeEntry ? feeEntry.status : 'Belum Bayar';

                      return (
                        <tr key={res.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-neutral-900 block">{res.namaLengkap}</span>
                            <span className="text-[11px] text-neutral-500">{res.statusHunian}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-neutral-800">
                            {res.blokRumah}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-neutral-900 tabular-nums">
                            {formatRupiah(150000)}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-600">
                            {feeEntry?.metodePembayaran || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            {status === 'Lunas' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Lunas ({feeEntry?.tanggalBayar})</span>
                              </span>
                            ) : status === 'Menunggu Verifikasi' ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span>Menunggu Verifikasi</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700">
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                                <span>Belum Bayar</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {status === 'Lunas' && feeEntry ? (
                              <button
                                onClick={() => setSelectedFeeForKwitansi(feeEntry)}
                                className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors inline-flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Kwitansi</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setPayTargetResidentId(res.id);
                                  setPayTargetMonth(selectedBulan);
                                  setActiveSubTab('pay');
                                }}
                                className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                              >
                                Bayar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Bayar Iuran Online (QRIS & Bank Transfer) */}
      {activeSubTab === 'pay' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form (Left 2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-5">
            <div className="pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">Formulir Pembayaran Iuran Lingkungan</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pilih warga, periode tagihan, serta metode transfer bank atau scan QRIS resmi RT 01
              </p>
            </div>

            {paymentSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pembayaran berhasil dicatat! Status sedang diproses oleh bendahara.</span>
              </div>
            )}

            <form onSubmit={handleExecutePayment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Resident Selection */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Pilih Warga / Rumah</label>
                  {canEditIuran ? (
                    <select
                      value={payTargetResidentId}
                      onChange={(e) => setPayTargetResidentId(e.target.value)}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-neutral-800"
                    >
                      {residents.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.namaLengkap} - {r.blokRumah}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2.5 bg-neutral-100 rounded-lg border border-neutral-200 font-semibold text-neutral-900">
                      {activeResident.namaLengkap} ({activeResident.blokRumah})
                    </div>
                  )}
                </div>

                {/* Month Selection */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Periode Bulan Tagihan</label>
                  <select
                    value={payTargetMonth}
                    onChange={(e) => setPayTargetMonth(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-neutral-800"
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-2">Metode Pembayaran</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'QRIS', label: 'QRIS RT 01', desc: 'BCA / Mandiri / GoPay' },
                    { id: 'Transfer BCA', label: 'Transfer BCA', desc: 'Rek: 7890-123-456' },
                    { id: 'Transfer Mandiri', label: 'Transfer Mandiri', desc: 'Rek: 156-00-987' },
                    { id: 'Tunai / Bendahara', label: 'Setor Tunai', desc: 'Ibu Hj. Siti Nurjanah' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id as any)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        payMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <span className="font-semibold text-neutral-900 block">{m.label}</span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Catatan Pembayaran / Keterangan Bukti (Opsional)
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Contoh: Ditransfer dari m-BCA a.n Bambang Pamungkas pk 14:30"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-800"
                />
              </div>

              {/* Fee Breakdown Summary */}
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span>Iuran Keamanan & Satpam 24 Jam</span>
                  <span className="font-mono tabular-nums">Rp 80.000</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Iuran Kebersihan & Angkut Sampah</span>
                  <span className="font-mono tabular-nums">Rp 50.000</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Iuran Kas Sosial & Fasilitas Warga</span>
                  <span className="font-mono tabular-nums">Rp 20.000</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900 text-sm">
                  <span>Total Tagihan Bulanan</span>
                  <span className="font-mono text-emerald-800 tabular-nums">Rp 150.000</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Konfirmasi & Simpan Pembayaran</span>
                </button>
              </div>
            </form>
          </div>

          {/* Payment Instructions & QRIS simulator (Right 1 col) */}
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 pb-2 border-b border-neutral-100 flex items-center justify-between">
              <span>Informasi Rekening & QRIS</span>
              <QrCode className="w-4 h-4 text-emerald-700" />
            </h3>

            {payMethod === 'QRIS' ? (
              <div className="text-center space-y-3">
                <div className="p-4 bg-neutral-900 text-white rounded-lg inline-block">
                  {/* Clean SVG QR Code Representation */}
                  <svg className="w-36 h-36 mx-auto text-white" viewBox="0 0 100 100" fill="currentColor">
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                    <rect x="14" y="14" width="17" height="17" fill="white" />
                    <rect x="18" y="18" width="9" height="9" fill="#0f172a" />

                    <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                    <rect x="69" y="14" width="17" height="17" fill="white" />
                    <rect x="73" y="18" width="9" height="9" fill="#0f172a" />

                    <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                    <rect x="14" y="69" width="17" height="17" fill="white" />
                    <rect x="18" y="73" width="9" height="9" fill="#0f172a" />

                    {/* Data dots */}
                    <rect x="42" y="15" width="8" height="8" fill="#0f172a" />
                    <rect x="42" y="30" width="15" height="8" fill="#0f172a" />
                    <rect x="42" y="45" width="8" height="15" fill="#0f172a" />
                    <rect x="25" y="45" width="10" height="8" fill="#0f172a" />
                    <rect x="65" y="45" width="20" height="8" fill="#0f172a" />
                    <rect x="55" y="65" width="10" height="10" fill="#0f172a" />
                    <rect x="72" y="65" width="15" height="8" fill="#0f172a" />
                    <rect x="42" y="75" width="20" height="10" fill="#0f172a" />
                    <rect x="70" y="80" width="15" height="8" fill="#0f172a" />
                  </svg>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-neutral-900">QRIS STANDAR NASIONAL</p>
                  <p className="text-neutral-500 text-[11px]">NMID: ID1026090188291</p>
                  <p className="font-medium text-emerald-800 mt-1">A.N. KAS RT 01 ARCADIA RESIDENCE</p>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Buka aplikasi mobile banking BCA, Mandiri, BRI, BNI, atau e-wallet GoPay/OVO/ShopeePay, lalu scan kode QR di atas.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block">Bank Central Asia (BCA)</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-bold text-sm text-neutral-900">7890-123-456</span>
                    <button
                      onClick={() => handleCopy('7890123456', 'bca')}
                      className="px-2 py-1 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100 flex items-center gap-1"
                    >
                      {copiedRekening === 'bca' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRekening === 'bca' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-neutral-600 block mt-0.5">a.n. RT 01 ARCADIA KAS</span>
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block">Bank Mandiri</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-bold text-sm text-neutral-900">156-00-9876543-2</span>
                    <button
                      onClick={() => handleCopy('1560098765432', 'mandiri')}
                      className="px-2 py-1 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100 flex items-center gap-1"
                    >
                      {copiedRekening === 'mandiri' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRekening === 'mandiri' ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-neutral-600 block mt-0.5">a.n. RT 01 ARCADIA RESIDENCE</span>
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block">Setor Tunai Langsung</span>
                  <p className="font-semibold text-neutral-900 mt-1">Ibu Hj. Siti Nurjanah (Bendahara)</p>
                  <p className="text-[11px] text-neutral-600">Blok B1 No. 02 · WhatsApp: 0857-1234-5678</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Verifikasi Bukti Bayar (Pengurus Only) */}
      {activeSubTab === 'verification' && role === 'pengurus' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Daftar Menunggu Verifikasi Bendahara</h3>
              <p className="text-xs text-neutral-500">Cek mutasi rekening kas RT dan setujui untuk menerbitkan kwitansi resmi</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 px-2.5 py-1 bg-amber-50 rounded-md border border-amber-200">
              {pendingFees.length} Tagihan Menunggu
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {pendingFees.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                Semua pembayaran iuran telah diverifikasi. Tidak ada antrean verifikasi saat ini.
              </div>
            ) : (
              pendingFees.map((fee) => (
                <div key={fee.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-xs">{fee.residentName}</span>
                      <span className="text-xs text-neutral-500">· {fee.blokRumah}</span>
                    </div>
                    <div className="text-xs text-neutral-600 mt-1 flex items-center gap-3 font-mono">
                      <span>Periode: {fee.bulan}</span>
                      <span>·</span>
                      <span className="font-bold text-neutral-900">{formatRupiah(fee.nominal)}</span>
                      <span>·</span>
                      <span className="text-emerald-700">{fee.metodePembayaran}</span>
                    </div>
                    {fee.catatan && (
                      <p className="text-[11px] text-neutral-500 mt-1 bg-neutral-100 p-1.5 rounded">
                        Catatan Warga: {fee.catatan}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => rejectFee(fee.id, 'Bukti transfer tidak terbaca')}
                      className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => verifyFee(fee.id, 'Ibu Hj. Siti Nurjanah (Bendahara)')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui & Terbitkan Kwitansi</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Tunggakan & Generator Pengingat WhatsApp */}
      {activeSubTab === 'reminder' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Rekap Tunggakan & Pengingat WhatsApp Warga</h3>
              <p className="text-xs text-neutral-500">
                Warga yang belum membayar periode {selectedBulan}. Salin pesan ramah untuk dikirim via WA personal atau grup blok.
              </p>
            </div>
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg border border-neutral-200 bg-white font-medium text-neutral-800"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="divide-y divide-neutral-100">
            {unpaidResidents.length === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-700 font-medium">
                Alhamdulillah! Seluruh warga RT 01 telah melunasi iuran untuk periode {selectedBulan}.
              </div>
            ) : (
              unpaidResidents.map((res) => {
                const waMessage = generateWaReminder(res.namaLengkap, res.blokRumah, selectedBulan);
                return (
                  <div key={res.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900">{res.namaLengkap}</h4>
                      <p className="text-[11px] text-neutral-500">{res.blokRumah} · Telp: {res.noTelepon}</p>
                      <span className="text-xs font-mono font-medium text-rose-700 mt-0.5 block">
                        Tunggakan: Rp 150.000 ({selectedBulan})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyWa(waMessage, res.id)}
                        className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        {copiedWaText === res.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pesan Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Teks WA</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/${res.noTelepon.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(waMessage)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Kwitansi Modal */}
      <KwitansiModal
        fee={selectedFeeForKwitansi}
        onClose={() => setSelectedFeeForKwitansi(null)}
      />
    </div>
  );
};
