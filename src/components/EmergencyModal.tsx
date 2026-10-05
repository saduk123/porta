import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { 
  Phone, 
  ShieldAlert, 
  X, 
  AlertTriangle, 
  Zap, 
  Droplets, 
  Flame, 
  Ambulance, 
  Award, 
  MessageSquare,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin?: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToAdmin
}) => {
  const { officers, emergencyContacts, isAdmin } = useRT();
  const [activeTab, setActiveTab] = useState<'pengurus' | 'instansi'>('pengurus');

  if (!isOpen) return null;

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

  const getCategoryColor = (kategori: EmergencyContact['kategori']) => {
    switch (kategori) {
      case 'polisi': return 'bg-blue-50 text-blue-700';
      case 'damkar': return 'bg-red-50 text-red-700';
      case 'medis': return 'bg-rose-50 text-rose-700';
      case 'pln': return 'bg-amber-50 text-amber-700';
      case 'pdam': return 'bg-cyan-50 text-cyan-700';
      default: return 'bg-emerald-50 text-emerald-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Kontak Darurat RT 01 RW 12 Arcadia</h3>
            <p className="text-xs text-slate-500 mt-0.5">Desa Suwayuwo, Sukorejo, Pasuruan · Layanan cepat 24 jam</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Quick Action Banner */}
        {isAdmin && onNavigateToAdmin && (
          <div className="mt-3 p-2.5 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs text-purple-950">
            <span className="font-semibold">Sebagai Admin, Anda dapat mengedit nomor darurat ini.</span>
            <button
              onClick={() => {
                onClose();
                onNavigateToAdmin();
              }}
              className="px-2.5 py-1 text-[11px] font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-1 shrink-0 ml-2"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Kontak</span>
            </button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 mt-3">
          <button
            onClick={() => setActiveTab('pengurus')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'pengurus'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Pengurus RT 01</span>
          </button>
          <button
            onClick={() => setActiveTab('instansi')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'instansi'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Satpam & Darurat Luar ({emergencyContacts.length})</span>
          </button>
        </div>

        {/* Contact List */}
        <div className="mt-3 divide-y divide-slate-100 max-h-[55vh] overflow-y-auto pr-1">
          {activeTab === 'pengurus' ? (
            officers.map((officer) => {
              const cleanPhone = officer.noTelepon.replace(/[^0-9]/g, '');
              const waNumber = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;

              const badgeColor = 
                officer.jabatan === 'Ketua RT' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                officer.jabatan === 'Wakil Ketua RT' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                officer.jabatan === 'Sekretaris' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                'bg-amber-50 text-amber-800 border-amber-200';

              return (
                <div key={officer.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${badgeColor} border font-bold text-xs shrink-0 flex items-center justify-center w-10 h-10`}>
                      {officer.jabatan === 'Ketua RT' ? 'RT' : 
                       officer.jabatan === 'Wakil Ketua RT' ? 'W.RT' : 
                       officer.jabatan === 'Sekretaris' ? 'SEK' : 'BEN'}
                    </div>
                    <div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${badgeColor} border mb-0.5`}>
                        {officer.jabatan}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{officer.namaLengkap}</h4>
                      <p className="text-[11px] text-slate-500">{officer.blokRumah}</p>
                      <span className="text-xs font-mono font-semibold text-slate-700 block mt-0.5">{officer.noTelepon}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(officer.namaLengkap)}%2C%20saya%20warga%20RT%2001%20RW%2012`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Telepon</span>
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            emergencyContacts.map((item) => {
              const Icon = getCategoryIcon(item.kategori);
              const colorClass = getCategoryColor(item.kategori);

              return (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${colorClass} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                      <span className="text-xs font-mono font-bold text-slate-800 mt-0.5 block">{item.number}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi</span>
                  </a>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
