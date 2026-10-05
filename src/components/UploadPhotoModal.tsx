import React, { useState, useEffect } from 'react';
import { useRT } from '../context/RTContext';
import { 
  googleSignIn, 
  logoutGoogle, 
  uploadPhotoToGoogleDrive, 
  getAccessToken, 
  initAuth 
} from '../utils/googleDrive';
import { User } from 'firebase/auth';
import { X, Upload, Image as ImageIcon, Check, Loader2, HardDrive, AlertCircle } from 'lucide-react';

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEventId?: string;
}

// Client-side image compression helper to prevent localStorage quota errors
function compressImage(file: File, maxWidth = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (error) => reject(error);
  });
}

export const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  onClose,
  preselectedEventId
}) => {
  const { role, activeResident, events, uploadEventPhoto } = useRT();

  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Google Drive Auth state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasDriveToken, setHasDriveToken] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [syncToDrive, setSyncToDrive] = useState(true);
  const [driveNotice, setDriveNotice] = useState<string | null>(null);

  // Ensure an event is always selected
  useEffect(() => {
    if (preselectedEventId) {
      setSelectedEventId(preselectedEventId);
    } else if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [preselectedEventId, events, selectedEventId]);

  useEffect(() => {
    // Check auth status
    const unsubscribe = initAuth(
      (user) => {
        setGoogleUser(user);
        setHasDriveToken(true);
      },
      () => {
        setGoogleUser(null);
        setHasDriveToken(false);
      }
    );

    // Initial check
    getAccessToken().then(tok => {
      if (tok) setHasDriveToken(true);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    setDriveNotice(null);
    try {
      const result = await googleSignIn();
      setGoogleUser(result.user);
      setHasDriveToken(true);
    } catch (err: any) {
      console.error(err);
      setDriveNotice(err?.message || 'Gagal menghubungkan ke Google Drive.');
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValidationError(null);
      setIsProcessingFile(true);
      try {
        const compressed = await compressImage(file);
        setPreviewUrl(compressed);
        setPhotoUrl(compressed);
      } catch (err) {
        console.error('Failed to process image:', err);
        setValidationError('Gagal membaca gambar. Silakan coba file gambar lain.');
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  const handleUrlChange = (val: string) => {
    setPhotoUrl(val);
    setPreviewUrl(val);
    if (val.trim()) setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation check
    if (!photoUrl) {
      setValidationError('Silakan pilih foto dari perangkat atau masukkan URL foto terlebih dahulu.');
      return;
    }

    const targetEventId = selectedEventId || events[0]?.id;
    if (!targetEventId) {
      setValidationError('Belum ada kegiatan yang dipilih.');
      return;
    }

    setValidationError(null);
    setIsSaving(true);

    const targetEvent = events.find(ev => ev.id === targetEventId);
    const finalCaption = caption.trim() || `Dokumentasi ${targetEvent?.judul || 'Kegiatan RT 01 RW 12'}`;

    let gDriveId: string | undefined = undefined;
    let gDriveLink: string | undefined = undefined;

    // 2. Google Drive Sync if active
    if (hasDriveToken && syncToDrive) {
      try {
        const eventTitleSlug = targetEvent ? targetEvent.judul.replace(/[^a-zA-Z0-9]/g, '_') : 'kegiatan';
        const filename = `Arcadia_RT01_${eventTitleSlug}_${Date.now()}.jpg`;

        const driveResult = await uploadPhotoToGoogleDrive({
          filename,
          dataUrl: photoUrl,
          caption: finalCaption
        });

        gDriveId = driveResult.id;
        gDriveLink = driveResult.webViewLink;
      } catch (err: any) {
        console.warn('Google Drive save error (saving locally instead):', err);
        // We continue saving locally so the user is never blocked!
      }
    }

    // 3. Save into App Context
    uploadEventPhoto(targetEventId, {
      url: photoUrl,
      caption: finalCaption,
      diuploadOleh: role === 'pengurus' ? 'Pengurus RT 01' : activeResident.namaLengkap,
      googleDriveId: gDriveId,
      googleDriveLink: gDriveLink
    });

    setIsSaving(false);
    onClose();
    setPhotoUrl('');
    setPreviewUrl('');
    setCaption('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-neutral-900">Upload Gambar & Dokumentasi Kegiatan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Drive Integration Box */}
        <div className="mt-4 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-md border border-neutral-200 text-blue-600 shadow-2xs">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Penyimpanan Google Drive</p>
                <p className="text-[11px] text-neutral-500">
                  {hasDriveToken 
                    ? `Terhubung: ${googleUser?.email || 'Akun Google Aktif'}` 
                    : 'Simpan dokumentasi foto langsung ke Google Drive'}
                </p>
              </div>
            </div>

            {hasDriveToken ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-[11px] border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Terhubung</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleConnectGoogle}
                disabled={isConnectingGoogle}
                className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 font-semibold text-neutral-800 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                {isConnectingGoogle ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghubungkan...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Hubungkan Drive</span>
                  </>
                )}
              </button>
            )}
          </div>

          {hasDriveToken && (
            <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-neutral-700">
                <input
                  type="checkbox"
                  checked={syncToDrive}
                  onChange={(e) => setSyncToDrive(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Simpan salinan cadangan foto ini ke Google Drive saya</span>
              </label>

              <button
                type="button"
                onClick={async () => {
                  await logoutGoogle();
                  setGoogleUser(null);
                  setHasDriveToken(false);
                }}
                className="text-[10px] text-neutral-400 hover:text-neutral-600"
              >
                Putuskan
              </button>
            </div>
          )}

          {driveNotice && (
            <p className="text-[11px] text-rose-600 font-medium">{driveNotice}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Target Event Selector */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Pilih Kegiatan Lingkungan Terkait
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-neutral-800"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.judul} ({evt.tanggal})
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Pilih / Unggah Foto dari Perangkat
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
              validationError && !photoUrl 
                ? 'border-rose-400 bg-rose-50/40' 
                : 'border-neutral-300 hover:border-emerald-500 bg-neutral-50/50'
            }`}>
              <input
                type="file"
                id="photoFileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="photoFileInput"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-full">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="font-semibold text-neutral-800">
                  {isProcessingFile ? 'Sedang memproses & mengoptimalkan foto...' : 'Klik untuk memilih foto dari HP / Laptop'}
                </span>
                <span className="text-[11px] text-neutral-500">
                  Mendukung kamera HP, JPG, PNG, atau WEBP (otomatis dikompres)
                </span>
              </label>
            </div>
          </div>

          {/* Or Image URL */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Atau Tempel Tautan URL Gambar
            </label>
            <input
              type="text"
              value={photoUrl.startsWith('data:') ? '' : photoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/foto_kegiatan.jpg"
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-800"
            />
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div>
              <span className="block font-semibold text-neutral-700 mb-1">Pratinjau Foto Siap Disimpan</span>
              <div className="rounded-lg overflow-hidden border border-neutral-200 max-h-48 bg-neutral-900 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview dokumentasi"
                  className="max-h-48 w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Caption (Optional with auto-generated fallback) */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center justify-between">
              <span>Keterangan / Caption Foto Kegiatan</span>
              <span className="text-[11px] text-neutral-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Contoh: Warga gotong royong pembersihan drainase di Blok C"
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-800"
            />
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="p-3 bg-neutral-50 rounded-lg text-neutral-600 text-[11px]">
            Foto akan tampil di portal dokumentasi warga RT 01 RW 12 Cluster Arcadia {hasDriveToken && syncToDrive ? 'dan tersimpan aman di Google Drive Anda.' : '.'}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isProcessingFile}
              className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Foto...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Simpan Foto Kegiatan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
