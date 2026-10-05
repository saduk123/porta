import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { FinancialRecord } from '../types';
import { Charts } from './Charts';
import { printDocumentIsolated } from '../utils/pdfGenerator';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Download, 
  Printer, 
  Filter, 
  X,
  Search,
  BarChart3
} from 'lucide-react';

export const KeuanganView: React.FC = () => {
  const { role, finances, totalKasBalance, addFinancialRecord, canEditKeuangan } = useRT();

  const [filterJenis, setFilterJenis] = useState<'all' | 'Pemasukan' | 'Pengeluaran'>('all');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(true);

  // Form state
  const initialFormState: Omit<FinancialRecord, 'id'> = {
    tanggal: new Date().toISOString().split('T')[0],
    jenis: 'Pengeluaran',
    kategori: 'Perawatan Taman & Lampu',
    nominal: 150000,
    keterangan: '',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  };

  const [formData, setFormData] = useState(initialFormState);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const totalPemasukan = finances
    .filter(f => f.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalPengeluaran = finances
    .filter(f => f.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const filteredFinances = finances.filter(f => {
    const matchesJenis = filterJenis === 'all' || f.jenis === filterJenis;
    const matchesSearch = f.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase()) ||
                          f.kategori.toLowerCase().includes(searchKeterangan.toLowerCase());
    return matchesJenis && matchesSearch;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.keterangan.trim()) return;

    addFinancialRecord(formData);
    setIsAddModalOpen(false);
    setFormData(initialFormState);
  };

  const handlePrint = () => {
    printDocumentIsolated('buku-kas-table-container', 'Laporan Buku Kas RT 01 RW 12 Suwayuwo');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Transparansi Laporan Kas RT 01 RW 12 Cluster Arcadia</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Buku kas umum digital, rincian pengeluaran operasional satpam, sampah, PJU, dan dana sosial warga
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{showCharts ? 'Sembunyikan Grafik' : 'Lihat Grafik Kas'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Buku Kas</span>
          </button>

          {canEditKeuangan && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Kas Masuk/Keluar</span>
            </button>
          )}
        </div>
      </div>

      {!canEditKeuangan && (
        <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-neutral-500" />
            <span><strong>Mode Transparansi Kas:</strong> Anda dapat melihat seluruh laporan, grafik, dan riwayat mutasi kas RT. Pencatatan transaksi kas baru hanya dapat dilakukan oleh User Admin & Bendahara.</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Hanya Lihat</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Saldo Kas */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Saldo Kas Tersedia</span>
            <Wallet className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {formatRupiah(totalKasBalance)}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Saldo riil di rekening BCA & brankas kas kecil</p>
        </div>

        {/* Total Pemasukan */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Total Pemasukan Tercatat</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {formatRupiah(totalPemasukan)}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Iuran warga & sumbangan donasi</p>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Total Pengeluaran Operasional</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-rose-700 tabular-nums">
              {formatRupiah(totalPengeluaran)}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Honor satpam, armada sampah, PJU & fasum</p>
        </div>
      </div>

      {/* Interactive Charts in Finance View */}
      {showCharts && <Charts />}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg w-full sm:w-auto">
          {(['all', 'Pemasukan', 'Pengeluaran'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterJenis(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterJenis === type
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {type === 'all' ? 'Semua Mutasi' : type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari keterangan mutasi kas..."
            value={searchKeterangan}
            onChange={(e) => setSearchKeterangan(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Financial Ledger Table */}
      <div id="buku-kas-table-container" className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kategori & Keterangan</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Dicatat Oleh</th>
                <th className="py-3 px-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredFinances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">
                    Tidak ditemukan data mutasi kas sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredFinances.map((fin) => (
                  <tr key={fin.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-neutral-600 whitespace-nowrap">
                      {fin.tanggal}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 block">{fin.kategori}</span>
                      <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">{fin.keterangan}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {fin.jenis === 'Pemasukan' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Masuk</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Keluar</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                      {fin.dicatatOleh}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={fin.jenis === 'Pemasukan' ? 'text-emerald-700' : 'text-neutral-900'}>
                        {fin.jenis === 'Pemasukan' ? '+' : '-'} {formatRupiah(fin.nominal)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Finance Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Catat Mutasi Kas RT 01</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Jenis Mutasi</label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value as any })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="Pengeluaran">Pengeluaran (Kas Keluar)</option>
                    <option value="Pemasukan">Pemasukan (Kas Masuk)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Kategori Transaksi</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Iuran Warga (IPL)">Iuran Warga (IPL)</option>
                  <option value="Gaji Satpam & Keamanan">Gaji Satpam & Keamanan</option>
                  <option value="Petugas Sampah & Kebersihan">Petugas Sampah & Kebersihan</option>
                  <option value="Token Listrik Fasum & PJU">Token Listrik Fasum & PJU</option>
                  <option value="Perawatan Taman & Lampu">Perawatan Taman & Lampu</option>
                  <option value="Sosial / Santunan Warga">Sosial / Santunan Warga</option>
                  <option value="Pengadaan Alat Pos Ronda">Pengadaan Alat Pos Ronda</option>
                  <option value="Sumbangan / Donasi">Sumbangan / Donasi</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Jumlah Nominal (Rupiah)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={formData.nominal}
                  onChange={(e) => setFormData({ ...formData, nominal: parseInt(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Keterangan / Rincian Belanja</label>
                <textarea
                  rows={3}
                  required
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Contoh: Beli 4 unit lampu LED jalan merk Philips 40W dan kabel konektor..."
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
                  Simpan Catatan Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
