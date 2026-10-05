import React, { useState } from 'react';
import { useRT } from '../context/RTContext';
import { CommunityEvent, ActivityPhoto } from '../types';
import { UploadPhotoModal } from './UploadPhotoModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Send, 
  Check, 
  Shield, 
  Image as ImageIcon,
  Upload,
  X,
  Maximize2,
  Trash2,
  Filter,
  HardDrive,
  ExternalLink
} from 'lucide-react';

export const KegiatanView: React.FC = () => {
  const { role, activeResident, events, addEvent, rsvpEvent, deleteEventPhoto, canEditKegiatan } = useRT();

  const [activeSection, setActiveSection] = useState<'events' | 'gallery'>('events');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState(false);
  const [uploadTargetEventId, setUploadTargetEventId] = useState<string | undefined>(undefined);
  const [copiedBroadcastId, setCopiedBroadcastId] = useState<string | null>(null);

  // Lightbox state
  const [lightboxPhoto, setLightboxPhoto] = useState<{ photo: ActivityPhoto; eventTitle: string } | null>(null);

  // New event form state
  const initialFormState: Omit<CommunityEvent, 'id' | 'pesertaRsvp'> = {
    judul: '',
    kategori: 'Kerja Bakti',
    tanggal: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    waktu: '07:00 - 10:00 WIB',
    lokasi: 'Balai Warga RT 01 Arcadia',
    deskripsi: '',
    penanggungJawab: role === 'pengurus' ? 'Hendra Gunawan (Ketua RT)' : activeResident.namaLengkap,
    pesertaTarget: 'Seluruh Warga RT 01 Arcadia',
    broadcastPesan: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const categories = [
    { id: 'all', label: 'Semua Kegiatan' },
    { id: 'Ronda Siskamling', label: 'Ronda Siskamling' },
    { id: 'Kerja Bakti', label: 'Kerja Bakti' },
    { id: 'Senam Bersama', label: 'Senam Sehat' },
    { id: 'Rapat Warga', label: 'Rapat Warga' },
    { id: 'Posyandu', label: 'Posyandu' },
  ];

  const filteredEvents = events.filter(e => {
    if (selectedKategori === 'all') return true;
    return e.kategori === selectedKategori;
  });

  // Extract all photos across events for the gallery view
  const allPhotos: { photo: ActivityPhoto; event: CommunityEvent }[] = events.flatMap(ev => 
    (ev.fotoDokumentasi || []).map(p => ({ photo: p, event: ev }))
  );

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const autoBroadcast = formData.broadcastPesan || 
      `Assalamu alaikum & Salam sejahtera bapak/ibu warga RT 01 Arcadia.\n\nMengingatkan agenda lingkungan: *${formData.judul}*\n📅 Tanggal: ${formData.tanggal}\n⏰ Waktu: ${formData.waktu}\n📍 Lokasi: ${formData.lokasi}\n👥 Peserta: ${formData.pesertaTarget}\n\n${formData.deskripsi}\n\nMohon kehadirannya tepat waktu. Terima kasih!`;

    addEvent({
      ...formData,
      broadcastPesan: autoBroadcast
    });
    setIsAddModalOpen(false);
    setFormData(initialFormState);
  };

  const handleCopyBroadcast = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBroadcastId(id);
    setTimeout(() => setCopiedBroadcastId(null), 2000);
  };

  const openUploadForEvent = (eventId: string) => {
    setUploadTargetEventId(eventId);
    setIsUploadPhotoModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Agenda & Dokumentasi Kegiatan Lingkungan</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Jadwal siskamling, kerja bakti, senam sehat, posyandu, serta galeri foto kegiatan warga Arcadia
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Section Selector Tab */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
            <button
              onClick={() => setActiveSection('events')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSection === 'events' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Jadwal Agenda
            </button>
            <button
              onClick={() => setActiveSection('gallery')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeSection === 'gallery' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Galeri Foto ({allPhotos.length})</span>
            </button>
          </div>

          {canEditKegiatan && (
            <>
              <button
                onClick={() => {
                  setUploadTargetEventId(undefined);
                  setIsUploadPhotoModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Upload Foto</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Jadwalkan Agenda</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!canEditKegiatan && (
        <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <span><strong>Mode Akses Warga:</strong> Anda dapat melihat jadwal agenda dan galeri dokumentasi foto. Penambahan kegiatan atau upload foto dikelola oleh Pengurus RT dan Admin.</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Hanya Lihat</span>
        </div>
      )}

      {/* SECTION 1: Agenda List */}
      {activeSection === 'events' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedKategori(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedKategori === cat.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredEvents.map((evt) => {
              const myRsvp = evt.pesertaRsvp.find(p => p.nama === activeResident.namaLengkap);
              const hadirCount = evt.pesertaRsvp.filter(p => p.status === 'Hadir').length;
              const izinCount = evt.pesertaRsvp.filter(p => p.status === 'Izin').length;
              const photos = evt.fotoDokumentasi || [];

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase">
                          {evt.kategori}
                        </span>
                        <h3 className="text-base font-bold text-neutral-900 mt-0.5 leading-snug">
                          {evt.judul}
                        </h3>
                      </div>
                      <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700 shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {evt.deskripsi}
                    </p>

                    {/* Details Badges */}
                    <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="font-mono text-neutral-800">{evt.tanggal} · {evt.waktu}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{evt.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="text-neutral-500">Target: <strong className="text-neutral-800">{evt.pesertaTarget}</strong></span>
                      </div>
                    </div>

                    {/* Photo Thumbnails */}
                    {photos.length > 0 && (
                      <div className="pt-2 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5">
                          <span className="font-semibold text-neutral-800 flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Foto Dokumentasi Kegiatan ({photos.length})</span>
                          </span>
                          <button
                            onClick={() => openUploadForEvent(evt.id)}
                            className="text-emerald-700 hover:text-emerald-800 font-medium"
                          >
                            + Tambah Foto
                          </button>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {photos.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => setLightboxPhoto({ photo: p, eventTitle: evt.judul })}
                              className="relative group w-20 h-16 rounded-lg overflow-hidden border border-neutral-200 shrink-0 cursor-pointer shadow-2xs"
                            >
                              <img
                                src={p.url}
                                alt={p.caption}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {photos.length === 0 && (
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Belum ada foto dokumentasi</span>
                        {canEditKegiatan && (
                          <button
                            onClick={() => openUploadForEvent(evt.id)}
                            className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Foto</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Event Coordinator & Target Details */}
                    <div className="p-3 bg-neutral-50 rounded-lg text-xs flex items-center justify-between">
                      <span className="text-neutral-500 text-[11px]">Penanggung Jawab:</span>
                      <span className="text-neutral-800 font-semibold">{evt.penanggungJawab}</span>
                    </div>
                  </div>

                  {/* Bottom Actions: Sasaran Peserta & Upload Shortcut */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">Sasaran: {evt.pesertaTarget}</span>
                    {canEditKegiatan && (
                      <button
                        onClick={() => openUploadForEvent(evt.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Dokumentasi</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Gallery of All Activity Photos */}
      {activeSection === 'gallery' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center justify-between shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Koleksi Dokumentasi Kegiatan Warga</h3>
              <p className="text-xs text-neutral-500">Momen kebersamaan, gotong royong, senam, dan keamanan lingkungan RT 01 Arcadia</p>
            </div>
            <button
              onClick={() => {
                setUploadTargetEventId(undefined);
                setIsUploadPhotoModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Foto Baru</span>
            </button>
          </div>

          {allPhotos.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400 bg-white rounded-xl border border-neutral-200">
              Belum ada foto dokumentasi yang diunggah. Klik tombol "Unggah Foto Baru" untuk menambahkan momen kegiatan warga.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allPhotos.map(({ photo, event }) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div
                    onClick={() => setLightboxPhoto({ photo, eventTitle: event.judul })}
                    className="relative aspect-4/3 bg-neutral-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs text-white flex items-center gap-1 font-medium">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Lihat Ukuran Penuh</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider">
                        {event.judul}
                      </span>
                      {photo.googleDriveLink && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-medium bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          <HardDrive className="w-3 h-3" />
                          <span>Google Drive</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-neutral-900 leading-snug">
                      {photo.caption}
                    </p>
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Oleh: <strong className="text-neutral-700">{photo.diuploadOleh}</strong></span>
                      <span className="font-mono">{photo.tanggalUpload}</span>
                    </div>
                  </div>

                  {canEditKegiatan && (
                    <div className="px-4 pb-3 pt-0 flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm('Hapus foto ini dari dokumentasi kegiatan?')) {
                            deleteEventPhoto(event.id, photo.id);
                          }
                        }}
                        className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Foto</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div 
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-xs"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-800 animate-in fade-in zoom-in-95"
          >
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">{lightboxPhoto.eventTitle}</h4>
                <p className="text-xs text-neutral-500">{lightboxPhoto.photo.caption}</p>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] bg-neutral-950 flex items-center justify-center">
              <img
                src={lightboxPhoto.photo.url}
                alt={lightboxPhoto.photo.caption}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            <div className="p-4 bg-neutral-50 text-xs text-neutral-600 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span>Diupload oleh: <strong>{lightboxPhoto.photo.diuploadOleh}</strong></span>
                <span className="text-neutral-400">·</span>
                <span className="font-mono text-neutral-500">{lightboxPhoto.photo.tanggalUpload}</span>
              </div>

              {lightboxPhoto.photo.googleDriveLink && (
                <a
                  href={lightboxPhoto.photo.googleDriveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Buka di Google Drive</span>
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadPhotoModalOpen}
        onClose={() => setIsUploadPhotoModalOpen(false)}
        preselectedEventId={uploadTargetEventId}
      />

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Jadwalkan Kegiatan Baru RT 01</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Kerja Bakti Pembersihan Selokan Blok A-D"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Kategori Kegiatan</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Kerja Bakti">Kerja Bakti</option>
                    <option value="Ronda Siskamling">Ronda Siskamling</option>
                    <option value="Senam Bersama">Senam Bersama</option>
                    <option value="Rapat Warga">Rapat Warga</option>
                    <option value="Pengajian / Arisan">Pengajian / Arisan</option>
                    <option value="Posyandu">Posyandu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Waktu / Jam</label>
                  <input
                    type="text"
                    required
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                    placeholder="Contoh: 07:00 - 10:00 WIB"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Lokasi Fasum</label>
                  <input
                    type="text"
                    required
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Contoh: Balai Warga / Lapangan Blok C"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Target Peserta Warga</label>
                <input
                  type="text"
                  required
                  value={formData.pesertaTarget}
                  onChange={(e) => setFormData({ ...formData, pesertaTarget: e.target.value })}
                  placeholder="Contoh: Seluruh Warga Arcadia / Giliran Bapak-bapak Blok B"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Deskripsi & Perlengkapan</label>
                <textarea
                  rows={3}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Jelaskan tujuan kegiatan dan apa yang perlu dibawa warga..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  Simpan & Siarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
