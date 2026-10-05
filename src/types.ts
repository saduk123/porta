export type UserRole = 'warga' | 'pengurus' | 'admin';

export interface Resident {
  id: string;
  noKk: string;
  nik: string;
  namaLengkap: string;
  blokRumah: string; // e.g., 'Blok A3 No. 12'
  statusKeluarga: 'Kepala Keluarga' | 'Istri' | 'Anak' | 'Orang Tua' | 'Lainnya';
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  pekerjaan: string;
  statusHunian: 'Tetap (Pemilik)' | 'Kontrak / Sewa' | 'Kos / Singgah';
  noTelepon: string;
  platKendaraan: string; // e.g., 'B 1234 ARC (Mobil), B 5678 CD (Motor)'
  jumlahAnggota: number;
  kontakDarurat: string;
  tanggalBergabung: string;
}

export interface FeePayment {
  id: string;
  residentId: string;
  residentName: string;
  blokRumah: string;
  bulan: string; // e.g., '2026-09'
  tahun: number;
  nominal: number;
  rincian: {
    keamanan: number;
    kebersihan: number;
    kasSosial: number;
  };
  metodePembayaran: 'QRIS' | 'Transfer BCA' | 'Transfer Mandiri' | 'Tunai / Bendahara';
  buktiTransferUrl?: string;
  status: 'Lunas' | 'Menunggu Verifikasi' | 'Belum Bayar';
  tanggalBayar?: string;
  diverifikasiOleh?: string;
  catatan?: string;
  noKwitansi?: string;
}

export interface ActivityPhoto {
  id: string;
  url: string;
  caption: string;
  tanggalUpload: string;
  diuploadOleh: string;
  googleDriveId?: string;
  googleDriveLink?: string;
}

export interface CommunityEvent {
  id: string;
  judul: string;
  kategori: 'Ronda Siskamling' | 'Kerja Bakti' | 'Senam Bersama' | 'Rapat Warga' | 'Pengajian / Arisan' | 'Posyandu';
  tanggal: string; // YYYY-MM-DD
  waktu: string; // e.g., '07:00 - 10:00 WIB'
  lokasi: string;
  deskripsi: string;
  penanggungJawab: string;
  pesertaTarget: string; // e.g. 'Semua Kepala Keluarga Blok A-C'
  pesertaRsvp: {
    nama: string;
    blok: string;
    status: 'Hadir' | 'Izin' | 'Tidak Hadir';
  }[];
  broadcastPesan?: string;
  fotoDokumentasi?: ActivityPhoto[];
}

export interface OfficialLetter {
  id: string;
  noSurat: string;
  residentId: string;
  pemohonNama: string;
  nik: string;
  blokRumah: string;
  jenisSurat: 
    | 'Surat Keterangan Domisili'
    | 'Surat Pengantar Pembuatan KTP'
    | 'Surat Pengantar Pembuatan KK'
    | 'Surat Keterangan Usaha (SKU)'
    | 'Surat Keterangan Belum Menikah'
    | 'Surat Keterangan Kematian'
    | 'Surat Keterangan Tidak Mampu';
  keperluan: string;
  tanggalPengajuan: string;
  tanggalDisetujui?: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  ditandatanganiOleh?: string;
  catatanPengurus?: string;
}

export interface FinancialRecord {
  id: string;
  tanggal: string;
  jenis: 'Pemasukan' | 'Pengeluaran';
  kategori: 
    | 'Iuran Warga (IPL)'
    | 'Gaji Satpam & Keamanan'
    | 'Petugas Sampah & Kebersihan'
    | 'Token Listrik Fasum & PJU'
    | 'Perawatan Taman & Lampu'
    | 'Sosial / Santunan Warga'
    | 'Pengadaan Alat Pos Ronda'
    | 'Sumbangan / Donasi'
    | 'Lain-lain';
  nominal: number;
  keterangan: string;
  dicatatOleh: string;
  buktiNota?: string;
}

export interface ComplaintReport {
  id: string;
  residentId: string;
  pelaporNama: string;
  blokRumah: string;
  kategori: 'Keamanan' | 'Kebersihan / Sampah' | 'Lampu / Fasilitas' | 'Kebisingan' | 'Hewan Peliharaan' | 'Lainnya';
  judul: string;
  deskripsi: string;
  tanggalLapor: string;
  status: 'Menunggu Tindak Lanjut' | 'Sedang Ditangani' | 'Selesai';
  tanggapanPengurus?: string;
  ditanganiOleh?: string;
}

export interface GuestLog {
  id: string;
  tuanRumahNama: string;
  blokRumah: string;
  namaTamu: string;
  nikTamu?: string;
  asalKota: string;
  hubungan: string;
  tanggalTiba: string;
  rencanaMenginapHari: number;
  platKendaraan?: string;
  statusVerifikasi: 'Dicatat' | 'Dikonfirmasi Satpam';
  catatan?: string;
}

export interface RTNotification {
  id: string;
  judul: string;
  pesan: string;
  tanggal: string;
  kategori: 'iuran' | 'kegiatan' | 'surat' | 'keamanan' | 'pengumuman';
  sudahDibaca: boolean;
}

export interface RTOfficer {
  id: string;
  jabatan: 'Ketua RT' | 'Wakil Ketua RT' | 'Sekretaris' | 'Bendahara';
  namaLengkap: string;
  blokRumah: string;
  noTelepon: string;
  email?: string;
  periode: string;
  tugasUtama: string;
  tanggungJawab: string[];
}

export interface EmergencyContact {
  id: string;
  title: string;
  subtitle: string;
  number: string;
  kategori: 'keamanan' | 'polisi' | 'medis' | 'damkar' | 'pln' | 'pdam' | 'lainnya';
}

