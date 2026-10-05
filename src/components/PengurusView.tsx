import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { RTOfficer } from '../types';
import { 
  Award, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Copy, 
  Check,
  Edit3,
  X,
  ShieldAlert,
  Users,
  ChevronRight
} from 'lucide-react';

interface PengurusViewProps {
  onNavigateToAdmin?: () => void;
}

export const PengurusView: React.FC<PengurusViewProps> = ({ onNavigateToAdmin }) => {
  const { officers, canEditPengurus, updateOfficer } = useRT();
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [editingOfficer, setEditingOfficer] = useState<RTOfficer | null>(null);
  const [editName, setEditName] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const ketua = officers.find(o => o.jabatan === 'Ketua RT');
  const wakil = officers.find(o => o.jabatan === 'Wakil Ketua RT');
  const sekretaris = officers.find(o => o.jabatan === 'Sekretaris');
  const bendahara = officers.find(o => o.jabatan === 'Bendahara');

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const getCleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');
  const getWaNumber = (phone: string) => {
    const clean = getCleanPhone(phone);
    return clean.startsWith('0') ? `62${clean.slice(1)}` : clean;
  };

  const handleOpenEdit = (officer: RTOfficer) => {
    setEditingOfficer(officer);
    setEditName(officer.namaLengkap);
    setEditBlock(officer.blokRumah);
    setEditPhone(officer.noTelepon);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;
    updateOfficer(editingOfficer.id, {
      namaLengkap: editName,
      blokRumah: editBlock,
      noTelepon: editPhone
    });
    setEditingOfficer(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-linear-to-l from-emerald-50/60 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Periode 2024 - 2027</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Susunan Kepengurusan RT 01 RW 12
          </h2>
          <p className="text-sm font-medium text-emerald-800 mt-1">
            Desa Suwayuwo · Kecamatan Sukorejo · Kabupaten Pasuruan
          </p>
          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
            Perumahan Oma Indah Kapuk Cluster Arcadia. Berikut susunan pengurus Rukun Tetangga (Ketua RT, Wakil Ketua RT, Sekretaris, dan Bendahara).
          </p>
        </div>
      </div>

      {!canEditPengurus && (
        <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-500" />
            <span><strong>Mode Akses Warga:</strong> Tampilan ini hanya untuk melihat susunan kepengurusan RT. Pembaruan data pengurus dikelola oleh User Admin Web.</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Hanya Lihat</span>
        </div>
      )}

      {canEditPengurus && (
        <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-700 shrink-0" />
            <span><strong>Mode Admin Web Aktif:</strong> Anda memiliki akses penuh untuk mengubah nama, alamat blok, dan kontak kepengurusan RT.</span>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-3 py-1 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>Kelola di Halaman Admin</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded">Akses Admin</span>
          </div>
        </div>
      )}

      {/* Visual Organizational Hierarchy Structure */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Bagan Struktur Susunan Kepengurusan</h3>
            <p className="text-xs text-neutral-500">Pengurus RT 01 RW 12 Cluster Arcadia</p>
          </div>
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-mono">
            4 Pengurus
          </span>
        </div>

        {/* Tree Layout */}
        <div className="mt-8 flex flex-col items-center">
          {/* Level 1: Ketua RT */}
          {ketua && (
            <div className="w-full max-w-md">
              <div className="bg-emerald-50/70 border-2 border-emerald-500/80 rounded-2xl p-5 shadow-xs mx-auto">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-700 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    Ketua RT
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-mono">{ketua.blokRumah}</span>
                    {canEditPengurus && (
                      <button
                        onClick={() => handleOpenEdit(ketua)}
                        className="p-1 hover:bg-emerald-200/60 rounded text-emerald-800"
                        title="Edit Data Pengurus"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-neutral-900">
                  {ketua.namaLengkap}
                </h4>

                <div className="mt-2 flex items-center justify-between text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-800">{ketua.noTelepon}</span>
                    <button
                      onClick={() => handleCopyPhone(ketua.noTelepon, ketua.id)}
                      title="Salin nomor"
                      className="p-1 hover:bg-neutral-200/60 rounded text-neutral-500"
                    >
                      {copiedPhoneId === ketua.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${getWaNumber(ketua.noTelepon)}?text=Halo%20${encodeURIComponent(ketua.namaLengkap)}%2C%20saya%20warga%20RT%2001%20RW%2012`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${getCleanPhone(ketua.noTelepon)}`}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telepon</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Connector Line 1 to 2 */}
          <div className="w-0.5 h-6 bg-neutral-300 my-1" />

          {/* Level 2: Wakil Ketua RT */}
          {wakil && (
            <div className="w-full max-w-md">
              <div className="bg-blue-50/70 border-2 border-blue-500/80 rounded-2xl p-5 shadow-xs mx-auto">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-700 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    Wakil Ketua RT
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-mono">{wakil.blokRumah}</span>
                    {canEditPengurus && (
                      <button
                        onClick={() => handleOpenEdit(wakil)}
                        className="p-1 hover:bg-blue-200/60 rounded text-blue-800"
                        title="Edit Data Pengurus"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-neutral-900">
                  {wakil.namaLengkap}
                </h4>

                <div className="mt-2 flex items-center justify-between text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-800">{wakil.noTelepon}</span>
                    <button
                      onClick={() => handleCopyPhone(wakil.noTelepon, wakil.id)}
                      title="Salin nomor"
                      className="p-1 hover:bg-neutral-200/60 rounded text-neutral-500"
                    >
                      {copiedPhoneId === wakil.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${getWaNumber(wakil.noTelepon)}?text=Halo%20${encodeURIComponent(wakil.namaLengkap)}%2C%20saya%20warga%20RT%2001%20RW%2012`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${getCleanPhone(wakil.noTelepon)}`}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telepon</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Connector Line 2 to 3 (Split into Sekretaris & Bendahara) */}
          <div className="w-0.5 h-6 bg-neutral-300 my-1" />
          <div className="w-full max-w-xl h-0.5 bg-neutral-300 hidden sm:block" />

          {/* Level 3: Sekretaris & Bendahara */}
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 sm:mt-0 pt-0 sm:pt-4">
            {/* Sekretaris */}
            {sekretaris && (
              <div className="bg-purple-50/70 border-2 border-purple-500/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 bg-purple-700 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    Sekretaris
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-mono">{sekretaris.blokRumah}</span>
                    {canEditPengurus && (
                      <button
                        onClick={() => handleOpenEdit(sekretaris)}
                        className="p-1 hover:bg-purple-200/60 rounded text-purple-800"
                        title="Edit Data Pengurus"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-neutral-900">
                  {sekretaris.namaLengkap}
                </h4>

                <div className="mt-2 flex items-center justify-between text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-800">{sekretaris.noTelepon}</span>
                    <button
                      onClick={() => handleCopyPhone(sekretaris.noTelepon, sekretaris.id)}
                      title="Salin nomor"
                      className="p-1 hover:bg-neutral-200/60 rounded text-neutral-500"
                    >
                      {copiedPhoneId === sekretaris.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${getWaNumber(sekretaris.noTelepon)}?text=Halo%20${encodeURIComponent(sekretaris.namaLengkap)}%2C%20saya%20warga%20RT%2001%20RW%2012`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${getCleanPhone(sekretaris.noTelepon)}`}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telepon</span>
                  </a>
                </div>
              </div>
            )}

            {/* Bendahara */}
            {bendahara && (
              <div className="bg-amber-50/70 border-2 border-amber-500/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 bg-amber-700 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                    Bendahara
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 font-mono">{bendahara.blokRumah}</span>
                    {canEditPengurus && (
                      <button
                        onClick={() => handleOpenEdit(bendahara)}
                        className="p-1 hover:bg-amber-200/60 rounded text-amber-800"
                        title="Edit Data Pengurus"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-neutral-900">
                  {bendahara.namaLengkap}
                </h4>

                <div className="mt-2 flex items-center justify-between text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-800">{bendahara.noTelepon}</span>
                    <button
                      onClick={() => handleCopyPhone(bendahara.noTelepon, bendahara.id)}
                      title="Salin nomor"
                      className="p-1 hover:bg-neutral-200/60 rounded text-neutral-500"
                    >
                      {copiedPhoneId === bendahara.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${getWaNumber(bendahara.noTelepon)}?text=Halo%20${encodeURIComponent(bendahara.namaLengkap)}%2C%20saya%20warga%20RT%2001%20RW%2012`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${getCleanPhone(bendahara.noTelepon)}`}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telepon</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {editingOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">
                Edit Data: {editingOfficer.jabatan}
              </h3>
              <button
                onClick={() => setEditingOfficer(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Alamat Blok Hunian</label>
                <input
                  type="text"
                  value={editBlock}
                  onChange={(e) => setEditBlock(e.target.value)}
                  required
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOfficer(null)}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
