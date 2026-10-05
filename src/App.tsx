/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RTProvider, useRT } from './context/RTContext';
import { Header } from './components/Header';
import { EmergencyModal } from './components/EmergencyModal';
import { DashboardView } from './components/DashboardView';
import { WargaView } from './components/WargaView';
import { IuranView } from './components/IuranView';
import { KegiatanView } from './components/KegiatanView';
import { SuratView } from './components/SuratView';
import { KeuanganView } from './components/KeuanganView';
import { AduanView } from './components/AduanView';
import { BukuTamuView } from './components/BukuTamuView';
import { PengurusView } from './components/PengurusView';
import { AdminControlView } from './components/AdminControlView';

function MainPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const { role, activeResident } = useRT();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-900 selection:bg-emerald-600 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}
        {activeTab === 'pengurus' && <PengurusView onNavigateToAdmin={() => setActiveTab('admin')} />}
        {activeTab === 'warga' && <WargaView />}
        {activeTab === 'iuran' && <IuranView />}
        {activeTab === 'kegiatan' && <KegiatanView />}
        {activeTab === 'surat' && <SuratView />}
        {activeTab === 'keuangan' && <KeuanganView />}
        {activeTab === 'aduan' && <AduanView />}
        {activeTab === 'tamu' && <BukuTamuView />}
        {activeTab === 'admin' && <AdminControlView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-12 py-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-800">RT 01 RW 12 Suwayuwo, Sukorejo, Pasuruan</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Perumahan Oma Indah Kapuk Cluster Arcadia</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="text-rose-600 hover:text-rose-700 transition-colors"
            >
              Hotline Darurat
            </button>
            <button
              onClick={() => setActiveTab('tamu')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Lapor Tamu
            </button>
            <button
              onClick={() => setActiveTab('aduan')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Aspirasi Warga
            </button>
          </div>
        </div>
      </footer>

      {/* Emergency Hotline Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onNavigateToAdmin={() => setActiveTab('admin')}
      />
    </div>
  );
}

export default function App() {
  return (
    <RTProvider>
      <MainPortal />
    </RTProvider>
  );
}
