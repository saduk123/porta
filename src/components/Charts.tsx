import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { TrendingUp, BarChart3, PieChart, ShieldCheck } from 'lucide-react';

export const Charts: React.FC = () => {
  const { residents, fees, finances } = useRT();
  const [activeChartTab, setActiveChartTab] = useState<'cashflow' | 'compliance' | 'expenses'>('cashflow');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // 1. Monthly Cashflow Data (Simulated 6 months historical + real current)
  const monthlyCashflowData = [
    { bulan: 'Mei', pemasukan: 4200000, pengeluaran: 3800000 },
    { bulan: 'Jun', pemasukan: 4500000, pengeluaran: 4100000 },
    { bulan: 'Jul', pemasukan: 4650000, pengeluaran: 3950000 },
    { bulan: 'Agt', pemasukan: 4800000, pengeluaran: 4400000 },
    { bulan: 'Sep', pemasukan: 5500000, pengeluaran: 5300000 },
    { bulan: 'Okt (Est)', pemasukan: 4500000, pengeluaran: 4200000 },
  ];

  const maxVal = Math.max(...monthlyCashflowData.flatMap(d => [d.pemasukan, d.pengeluaran]));

  // 2. Fee Compliance by Block (Blok A, B, C, D)
  const blocks = ['A', 'B', 'C', 'D'];
  const blockStats = blocks.map(blk => {
    const blockResidents = residents.filter(r => r.blokRumah.includes(`Blok ${blk}`));
    const total = blockResidents.length || 1;
    const paid = blockResidents.filter(r => {
      const fee = fees.find(f => f.residentId === r.id && f.bulan === '2026-09');
      return fee && fee.status === 'Lunas';
    }).length;
    const rate = Math.round((paid / total) * 100);
    return { block: `Blok ${blk}`, total, paid, unpaid: total - paid, rate };
  });

  // 3. Expense Distribution
  const expenseCategories = [
    { label: 'Gaji Satpam & Keamanan 24 Jam', nominal: 3000000, color: 'bg-emerald-700', pct: 56 },
    { label: 'Petugas Sampah & DLH Rutin', nominal: 1200000, color: 'bg-teal-600', pct: 23 },
    { label: 'Token Listrik Fasum & PJU', nominal: 450000, color: 'bg-amber-600', pct: 8 },
    { label: 'Alat Pos Ronda & Senter', nominal: 350000, color: 'bg-indigo-600', pct: 7 },
    { label: 'Dana Sosial & Santunan Warga', nominal: 300000, color: 'bg-rose-600', pct: 6 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Grafik & Analitik Lingkungan RT 01 Arcadia</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Visualisasi tren arus kas bulanan, tingkat kepatuhan iuran per blok, dan alokasi dana warga
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveChartTab('cashflow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeChartTab === 'cashflow'
                ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Arus Kas
          </button>
          <button
            onClick={() => setActiveChartTab('compliance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeChartTab === 'compliance'
                ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Iuran per Blok
          </button>
          <button
            onClick={() => setActiveChartTab('expenses')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeChartTab === 'expenses'
                ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pos Belanja
          </button>
        </div>
      </div>

      {/* Chart 1: Cashflow Bars */}
      {activeChartTab === 'cashflow' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
                <span className="font-medium text-neutral-900">Pemasukan (Iuran & Donasi)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
                <span className="font-medium text-neutral-900">Pengeluaran Operasional</span>
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">Skala: s/d {formatRupiah(maxVal)}</span>
          </div>

          {/* SVG & CSS Responsive Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-neutral-200">
            {monthlyCashflowData.map((item, idx) => {
              const inHeightPct = Math.round((item.pemasukan / maxVal) * 100);
              const outHeightPct = Math.round((item.pengeluaran / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[11px] p-2 rounded-md shadow-lg pointer-events-none z-20 whitespace-nowrap font-mono tabular-nums">
                    <div>Masuk: {formatRupiah(item.pemasukan)}</div>
                    <div>Keluar: {formatRupiah(item.pengeluaran)}</div>
                  </div>

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-full">
                    {/* In Bar */}
                    <div
                      style={{ height: `${inHeightPct}%` }}
                      className="w-1/2 max-w-[28px] bg-emerald-600 hover:bg-emerald-500 rounded-t-sm transition-all duration-300 relative"
                    />
                    {/* Out Bar */}
                    <div
                      style={{ height: `${outHeightPct}%` }}
                      className="w-1/2 max-w-[28px] bg-rose-500 hover:bg-rose-400 rounded-t-sm transition-all duration-300 relative"
                    />
                  </div>

                  <span className="text-xs font-mono font-medium text-neutral-600 mt-2 block">
                    {item.bulan}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-500 text-[11px] block">Rata-rata Masuk / Bulan</span>
              <span className="font-bold font-mono text-neutral-900 tabular-nums">Rp 4.700.000</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-500 text-[11px] block">Rata-rata Beban Operasional</span>
              <span className="font-bold font-mono text-neutral-900 tabular-nums">Rp 4.290.000</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 text-[11px] font-medium block">Surplus Rata-rata</span>
              <span className="font-bold font-mono text-emerald-800 tabular-nums">+Rp 410.000</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <span className="text-neutral-500 text-[11px] block">Status Likuiditas Kas</span>
              <span className="font-bold text-neutral-800">Sehat & Stabil</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart 2: Compliance Rate by Block */}
      {activeChartTab === 'compliance' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500">
            Persentase kepatuhan pembayaran iuran IPL September 2026 per blok hunian:
          </div>

          <div className="space-y-3.5">
            {blockStats.map((item) => (
              <div key={item.block} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-900">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-800">{item.block}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">
                      ({item.paid} dari {item.total} rumah lunas)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neutral-800 tabular-nums">
                    {item.rate}% Lunas
                  </span>
                </div>

                <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${item.rate}%` }}
                    className={`h-full transition-all duration-500 ${
                      item.rate >= 80 ? 'bg-emerald-600' : item.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 flex items-center justify-between mt-3">
            <span>Blok dengan kepatuhan tertinggi saat ini: <strong className="text-neutral-900">Blok A (100% Lunas)</strong></span>
            <span className="font-mono text-neutral-500 text-[11px]">Target RT: 100% tanggal 10</span>
          </div>
        </div>
      )}

      {/* Chart 3: Expense Categories Distribution */}
      {activeChartTab === 'expenses' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500">
            Alokasi penggunaan dana iuran warga RT 01 Arcadia per bulan:
          </div>

          {/* Stacked bar representation */}
          <div className="h-5 w-full bg-neutral-100 rounded-lg overflow-hidden flex shadow-2xs">
            {expenseCategories.map((c, i) => (
              <div
                key={i}
                style={{ width: `${c.pct}%` }}
                className={`${c.color} h-full transition-all`}
                title={`${c.label}: ${c.pct}%`}
              />
            ))}
          </div>

          {/* Legend and details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {expenseCategories.map((cat, idx) => (
              <div key={idx} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-xs ${cat.color} shrink-0`} />
                  <div>
                    <span className="font-semibold text-neutral-900 block">{cat.label}</span>
                    <span className="text-neutral-500 text-[11px] font-mono tabular-nums">{formatRupiah(cat.nominal)} / bln</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-neutral-800 tabular-nums text-sm">
                  {cat.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
