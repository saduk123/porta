import { Resident, FeePayment, CommunityEvent, OfficialLetter, FinancialRecord, ComplaintReport, GuestLog, RTNotification, RTOfficer, EmergencyContact } from '../types';

export const INITIAL_RESIDENTS: Resident[] = [
  {
    id: 'res-1',
    noKk: '3276011904120001',
    nik: '3276011208850002',
    namaLengkap: 'Bambang Pamungkas',
    blokRumah: 'Blok B3 No. 12',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Semarang',
    tanggalLahir: '1985-08-12',
    agama: 'Islam',
    pekerjaan: 'Pegawai BUMN',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0812-9876-5432',
    platKendaraan: 'B 1980 ARC (Innova Zenix), B 4521 BCD (Vario)',
    jumlahAnggota: 4,
    kontakDarurat: '0812-9876-5433 (Istri - Ratna)',
    tanggalBergabung: '2021-03-15',
  },
  {
    id: 'res-2',
    noKk: '3276011904120002',
    nik: '3276010503820001',
    namaLengkap: 'Hendra Gunawan (Ketua RT)',
    blokRumah: 'Blok A1 No. 01',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Bandung',
    tanggalLahir: '1982-03-05',
    agama: 'Islam',
    pekerjaan: 'Dosen / Peneliti',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0811-2233-4455',
    platKendaraan: 'B 1010 ARC (CR-V), B 6789 EFG (NMAX)',
    jumlahAnggota: 3,
    kontakDarurat: '0811-2233-4456 (Ibu Maya)',
    tanggalBergabung: '2019-01-10',
  },
  {
    id: 'res-officer-wakil',
    noKk: '3276011904120099',
    nik: '3276011009840003',
    namaLengkap: 'Agus Santoso (Wakil Ketua RT)',
    blokRumah: 'Blok B2 No. 04',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Malang',
    tanggalLahir: '1984-09-10',
    agama: 'Islam',
    pekerjaan: 'Manajer Operasional Logistik',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0812-7788-9900',
    platKendaraan: 'N 1845 ARC (Xpander), N 3920 AG (Aerox)',
    jumlahAnggota: 3,
    kontakDarurat: '0812-7788-9901 (Istri - Sari)',
    tanggalBergabung: '2020-08-17',
  },
  {
    id: 'res-3',
    noKk: '3276011904120003',
    nik: '3276012411900004',
    namaLengkap: 'Ahmad Fauzi (Sekretaris)',
    blokRumah: 'Blok A2 No. 05',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Surabaya',
    tanggalLahir: '1990-11-24',
    agama: 'Islam',
    pekerjaan: 'Software Engineer',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0813-8899-7711',
    platKendaraan: 'B 2255 FAZ (HR-V)',
    jumlahAnggota: 2,
    kontakDarurat: '0813-8899-7712 (Istri - Dewi)',
    tanggalBergabung: '2022-07-20',
  },
  {
    id: 'res-4',
    noKk: '3276011904120004',
    nik: '3276011707880003',
    namaLengkap: 'Ibu Hj. Siti Nurjanah (Bendahara)',
    blokRumah: 'Blok B1 No. 02',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '1988-07-17',
    agama: 'Islam',
    pekerjaan: 'Wiraswasta / Pemilik Toko',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0857-1234-5678',
    platKendaraan: 'B 8888 STN (Fortuner), B 3344 KLM (Scoopy)',
    jumlahAnggota: 4,
    kontakDarurat: '0857-1234-5679 (Bpk. Mulyadi)',
    tanggalBergabung: '2020-05-11',
  },
  {
    id: 'res-5',
    noKk: '3276011904120005',
    nik: '3276010901920008',
    namaLengkap: 'dr. Johannes Tanujaya',
    blokRumah: 'Blok C2 No. 08',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1992-01-09',
    agama: 'Katolik',
    pekerjaan: 'Dokter Spesialis Anak',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0818-4455-6677',
    platKendaraan: 'B 1708 DOC (CX-5)',
    jumlahAnggota: 3,
    kontakDarurat: '0818-4455-6678 (Klinik / Istri)',
    tanggalBergabung: '2023-02-14',
  },
  {
    id: 'res-6',
    noKk: '3276011904120006',
    nik: '3276011504950002',
    namaLengkap: 'Kevin Sanjaya Pratama',
    blokRumah: 'Blok C1 No. 03',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Medan',
    tanggalLahir: '1995-04-15',
    agama: 'Kristen',
    pekerjaan: 'Digital Marketer',
    statusHunian: 'Kontrak / Sewa',
    noTelepon: '0877-3322-1199',
    platKendaraan: 'B 3099 KSP (Raize)',
    jumlahAnggota: 2,
    kontakDarurat: '0877-3322-1198 (Orang Tua)',
    tanggalBergabung: '2025-01-05',
  },
  {
    id: 'res-7',
    noKk: '3276011904120007',
    nik: '3276012906800007',
    namaLengkap: 'Bpk. Ir. Joko Prasetyo',
    blokRumah: 'Blok D2 No. 14',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Solo',
    tanggalLahir: '1980-06-29',
    agama: 'Islam',
    pekerjaan: 'Konsultan Sipil',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0812-7788-9900',
    platKendaraan: 'B 1414 JKP (Pajero Sport), B 5566 JKP (PCX)',
    jumlahAnggota: 5,
    kontakDarurat: '0812-7788-9901 (Ibu Endah)',
    tanggalBergabung: '2019-11-20',
  },
  {
    id: 'res-8',
    noKk: '3276011904120008',
    nik: '3276011010930005',
    namaLengkap: 'I Made Dananjaya',
    blokRumah: 'Blok D1 No. 06',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Denpasar',
    tanggalLahir: '1993-10-10',
    agama: 'Hindu',
    pekerjaan: 'Arsitek Landscape',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0819-0102-0304',
    platKendaraan: 'DK 1809 MD (Yaris Cross)',
    jumlahAnggota: 3,
    kontakDarurat: '0819-0102-0305 (Ibu Putu Ayu)',
    tanggalBergabung: '2023-09-01',
  },
  {
    id: 'res-9',
    noKk: '3276011904120009',
    nik: '3276010112870006',
    namaLengkap: 'Bpk. Ridwan Kamiludin',
    blokRumah: 'Blok B2 No. 09',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Cirebon',
    tanggalLahir: '1987-12-01',
    agama: 'Islam',
    pekerjaan: 'Karyawan Swasta',
    statusHunian: 'Tetap (Pemilik)',
    noTelepon: '0821-4567-8901',
    platKendaraan: 'B 2901 RKW (Xpander)',
    jumlahAnggota: 4,
    kontakDarurat: '0821-4567-8902 (Ibu Sarah)',
    tanggalBergabung: '2022-04-18',
  },
  {
    id: 'res-10',
    noKk: '3276011904120010',
    nik: '3276012002960003',
    namaLengkap: 'Annisa Tri Hapsari',
    blokRumah: 'Blok A3 No. 07',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Semarang',
    tanggalLahir: '1996-02-20',
    agama: 'Islam',
    pekerjaan: 'Akuntan Publik',
    statusHunian: 'Kontrak / Sewa',
    noTelepon: '0896-1234-9876',
    platKendaraan: 'B 7707 ATH (Brio)',
    jumlahAnggota: 1,
    kontakDarurat: '0896-1234-9877 (Adik - Fajar)',
    tanggalBergabung: '2024-06-10',
  }
];

export const INITIAL_FEES: FeePayment[] = [
  {
    id: 'fee-1',
    residentId: 'res-1',
    residentName: 'Bambang Pamungkas',
    blokRumah: 'Blok B3 No. 12',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'QRIS',
    status: 'Lunas',
    tanggalBayar: '2026-09-02',
    diverifikasiOleh: 'Ibu Hj. Siti Nurjanah',
    noKwitansi: 'KW/ARC-RT01/2026/09/001'
  },
  {
    id: 'fee-2',
    residentId: 'res-2',
    residentName: 'Hendra Gunawan (Ketua RT)',
    blokRumah: 'Blok A1 No. 01',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'Transfer BCA',
    status: 'Lunas',
    tanggalBayar: '2026-09-01',
    diverifikasiOleh: 'Ibu Hj. Siti Nurjanah',
    noKwitansi: 'KW/ARC-RT01/2026/09/002'
  },
  {
    id: 'fee-3',
    residentId: 'res-3',
    residentName: 'Ahmad Fauzi (Sekretaris)',
    blokRumah: 'Blok A2 No. 05',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'Transfer Mandiri',
    status: 'Lunas',
    tanggalBayar: '2026-09-03',
    diverifikasiOleh: 'Ibu Hj. Siti Nurjanah',
    noKwitansi: 'KW/ARC-RT01/2026/09/003'
  },
  {
    id: 'fee-4',
    residentId: 'res-4',
    residentName: 'Ibu Hj. Siti Nurjanah (Bendahara)',
    blokRumah: 'Blok B1 No. 02',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'Tunai / Bendahara',
    status: 'Lunas',
    tanggalBayar: '2026-09-01',
    diverifikasiOleh: 'Hendra Gunawan',
    noKwitansi: 'KW/ARC-RT01/2026/09/004'
  },
  {
    id: 'fee-5',
    residentId: 'res-5',
    residentName: 'dr. Johannes Tanujaya',
    blokRumah: 'Blok C2 No. 08',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'QRIS',
    status: 'Menunggu Verifikasi',
    tanggalBayar: '2026-09-28',
    catatan: 'Bukti transfer QRIS BCA diunggah, menunggu cek mutasi bendahara.'
  },
  {
    id: 'fee-6',
    residentId: 'res-6',
    residentName: 'Kevin Sanjaya Pratama',
    blokRumah: 'Blok C1 No. 03',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'Transfer BCA',
    status: 'Belum Bayar',
  },
  {
    id: 'fee-7',
    residentId: 'res-7',
    residentName: 'Bpk. Ir. Joko Prasetyo',
    blokRumah: 'Blok D2 No. 14',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'Transfer BCA',
    status: 'Lunas',
    tanggalBayar: '2026-09-05',
    diverifikasiOleh: 'Ibu Hj. Siti Nurjanah',
    noKwitansi: 'KW/ARC-RT01/2026/09/005'
  },
  {
    id: 'fee-8',
    residentId: 'res-8',
    residentName: 'I Made Dananjaya',
    blokRumah: 'Blok D1 No. 06',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'QRIS',
    status: 'Belum Bayar'
  },
  {
    id: 'fee-9',
    residentId: 'res-9',
    residentName: 'Bpk. Ridwan Kamiludin',
    blokRumah: 'Blok B2 No. 09',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'Transfer Mandiri',
    status: 'Lunas',
    tanggalBayar: '2026-09-08',
    diverifikasiOleh: 'Ibu Hj. Siti Nurjanah',
    noKwitansi: 'KW/ARC-RT01/2026/09/006'
  },
  {
    id: 'fee-10',
    residentId: 'res-10',
    residentName: 'Annisa Tri Hapsari',
    blokRumah: 'Blok A3 No. 07',
    bulan: '2026-09',
    tahun: 2026,
    nominal: 150000,
    rincian: { keamanan: 80000, kebersihan: 50000, kasSosial: 20000 },
    metodePembayaran: 'QRIS',
    status: 'Belum Bayar'
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    judul: 'Ronda Siskamling Malam Kamis',
    kategori: 'Ronda Siskamling',
    tanggal: '2026-10-01',
    waktu: '22:00 - 04:00 WIB',
    lokasi: 'Pos Satpam Gerbang Barat Blok B',
    deskripsi: 'Giliran jaga malam untuk bapak-bapak Blok B & C. Patroli keliling setiap 2 jam, cek portal gerbang dan CCTV sudut.',
    penanggungJawab: 'Bpk. Bambang Pamungkas (Koordinator Pos B)',
    pesertaTarget: 'Warga Blok B3, B2, C1, C2',
    pesertaRsvp: [
      { nama: 'Bambang Pamungkas', blok: 'Blok B3 No. 12', status: 'Hadir' },
      { nama: 'Ridwan Kamiludin', blok: 'Blok B2 No. 09', status: 'Hadir' },
      { nama: 'Kevin Sanjaya Pratama', blok: 'Blok C1 No. 03', status: 'Izin' },
    ],
    broadcastPesan: 'Selamat malam bapak-bapak, mengingatkan jadwal giliran ronda malam ini pukul 22:00 WIB di Pos Satpam Blok B. Mohon hadir tepat waktu demi keamanan perumahan kita.',
    fotoDokumentasi: [
      {
        id: 'foto-1',
        url: '/src/assets/images/activity_pos_ronda_1790737211877.jpg',
        caption: 'Patroli siskamling dan koordinasi di pos satpam gerbang barat',
        tanggalUpload: '2026-09-25',
        diuploadOleh: 'Bambang Pamungkas'
      }
    ]
  },
  {
    id: 'evt-2',
    judul: 'Kerja Bakti Akbar & Bersih Saluran Air Musim Hujan',
    kategori: 'Kerja Bakti',
    tanggal: '2026-10-04',
    waktu: '06:30 - 09:30 WIB',
    lokasi: 'Fasum Taman Sentral Arcadia & Saluran Utama Blok A-D',
    deskripsi: 'Menjelang musim penghujan, mari kita bersama membersihkan drainase perumahan, pangkas dahan pohon yang rimbun dekat kabel listrik, serta sarapan bubur ayam bersama di Balai Warga.',
    penanggungJawab: 'Hendra Gunawan (Ketua RT)',
    pesertaTarget: 'Seluruh Warga RT 01 Arcadia (Bapak-bapak, Ibu-ibu, & Remaja)',
    pesertaRsvp: [
      { nama: 'Bambang Pamungkas', blok: 'Blok B3 No. 12', status: 'Hadir' },
      { nama: 'Ahmad Fauzi', blok: 'Blok A2 No. 05', status: 'Hadir' },
      { nama: 'dr. Johannes Tanujaya', blok: 'Blok C2 No. 08', status: 'Hadir' },
      { nama: 'Ir. Joko Prasetyo', blok: 'Blok D2 No. 14', status: 'Hadir' }
    ],
    broadcastPesan: 'Assalamu alaikum & Salam sejahtera bapak/ibu warga Arcadia RT 01. Hari Minggu, 4 Oktober 2026 kita adakan Kerja Bakti Serentak. Disediakan konsumsi & bubur ayam. Bawa cangkul/sapu lidi masing-masing.',
    fotoDokumentasi: [
      {
        id: 'foto-2',
        url: '/src/assets/images/activity_kerja_bakti_1790737180517.jpg',
        caption: 'Warga gotong royong membersihkan jalan utama dan saluran air fasum',
        tanggalUpload: '2026-09-20',
        diuploadOleh: 'Hendra Gunawan (Ketua RT)'
      }
    ]
  },
  {
    id: 'evt-3',
    judul: 'Senam Jantung Sehat & Cek Gula Darah / Tensi Gratis',
    kategori: 'Senam Bersama',
    tanggal: '2026-10-11',
    waktu: '06:00 - 08:00 WIB',
    lokasi: 'Lapangan Fasum Blok C',
    deskripsi: 'Senam aerobik bersama instruktur profesional dilanjutkan cek tensi dan konsultasi kesehatan gratis bersama dr. Johannes Tanujaya.',
    penanggungJawab: 'Ibu Maya (Sie Kesehatan & PKK RT 01)',
    pesertaTarget: 'Seluruh warga Arcadia & Lansia',
    pesertaRsvp: [
      { nama: 'Ratna Sari (Istri Bpk Bambang)', blok: 'Blok B3 No. 12', status: 'Hadir' },
      { nama: 'Ibu Hj. Siti Nurjanah', blok: 'Blok B1 No. 02', status: 'Hadir' },
    ],
    broadcastPesan: 'Ayo hidup sehat warga RT 01 Arcadia! Minggu pagi ini ada senam sehat bersama dan cek kesehatan cuma-cuma di lapangan Blok C. Siapkan baju olahraga!',
    fotoDokumentasi: [
      {
        id: 'foto-3',
        url: '/src/assets/images/activity_senam_pagi_1790737196834.jpg',
        caption: 'Keseruan senam pagi bersama ibu-ibu dan keluarga warga Arcadia',
        tanggalUpload: '2026-09-22',
        diuploadOleh: 'Ibu Maya (PKK)'
      }
    ]
  },
  {
    id: 'evt-4',
    judul: 'Rapat Pleno Triwulan & Evaluasi Iuran Sampah/Satpam',
    kategori: 'Rapat Warga',
    tanggal: '2026-10-17',
    waktu: '19:30 - 21:30 WIB',
    lokasi: 'Balai Warga RT 01 Arcadia',
    deskripsi: 'Laporan pertanggungjawaban kas periode Q3, pembahasan usulan penambahan CCTV di Gerbang Timur, dan peremajaan lampu penerangan jalan umum (PJU).',
    penanggungJawab: 'Ahmad Fauzi (Sekretaris)',
    pesertaTarget: 'Perwakilan tiap Kepala Keluarga (1 orang per rumah)',
    pesertaRsvp: [
      { nama: 'Bambang Pamungkas', blok: 'Blok B3 No. 12', status: 'Hadir' },
      { nama: 'Hendra Gunawan', blok: 'Blok A1 No. 01', status: 'Hadir' }
    ]
  },
  {
    id: 'evt-5',
    judul: 'Posyandu Balita & Penimbangan Tumbuh Kembang',
    kategori: 'Posyandu',
    tanggal: '2026-10-20',
    waktu: '08:30 - 11:00 WIB',
    lokasi: 'Balai RT 01 Arcadia',
    deskripsi: 'Pemberian vitamin A, imunisasi dasar, penimbangan balita dan pemberian makanan tambahan (PMT) bergizi dari kader posyandu.',
    penanggungJawab: 'Kader Posyandu Bougenville RT 01',
    pesertaTarget: 'Balita dan Ibu Menyusui RT 01',
    pesertaRsvp: []
  }
];

export const INITIAL_LETTERS: OfficialLetter[] = [
  {
    id: 'let-1',
    noSurat: '038/RT01-ARC/IX/2026',
    residentId: 'res-1',
    pemohonNama: 'Bambang Pamungkas',
    nik: '3276011208850002',
    blokRumah: 'Blok B3 No. 12',
    jenisSurat: 'Surat Keterangan Domisili',
    keperluan: 'Kelengkapan administrasi pembukaan rekening payroll kantor dan mutasi BPJS Ketenagakerjaan.',
    tanggalPengajuan: '2026-09-22',
    tanggalDisetujui: '2026-09-23',
    status: 'Disetujui',
    ditandatanganiOleh: 'Hendra Gunawan (Ketua RT 01)',
    catatanPengurus: 'Data KK dan KTP sudah valid sesuai data sensus RT 01.'
  },
  {
    id: 'let-2',
    noSurat: '039/RT01-ARC/IX/2026',
    residentId: 'res-6',
    pemohonNama: 'Kevin Sanjaya Pratama',
    nik: '3276011504950002',
    blokRumah: 'Blok C1 No. 03',
    jenisSurat: 'Surat Pengantar Pembuatan KTP',
    keperluan: 'Permohonan penggantian e-KTP yang rusak ke Balai Desa Suwayuwo Sukorejo.',
    tanggalPengajuan: '2026-09-27',
    tanggalDisetujui: '2026-09-28',
    status: 'Disetujui',
    ditandatanganiOleh: 'Hendra Gunawan (Ketua RT 01)',
    catatanPengurus: 'Silakan bawa surat ini ke kantor Kelurahan lantai 1 loket kependudukan.'
  },
  {
    id: 'let-3',
    noSurat: '040/RT01-ARC/IX/2026',
    residentId: 'res-10',
    pemohonNama: 'Annisa Tri Hapsari',
    nik: '3276012002960003',
    blokRumah: 'Blok A3 No. 07',
    jenisSurat: 'Surat Keterangan Usaha (SKU)',
    keperluan: 'Syarat pengajuan izin usaha mikro kuliner bakery rumahan ke dinas terkait.',
    tanggalPengajuan: '2026-09-29',
    status: 'Menunggu',
    catatanPengurus: 'Menunggu konfirmasi lampiran foto tempat usaha.'
  }
];

export const INITIAL_FINANCES: FinancialRecord[] = [
  {
    id: 'fin-1',
    tanggal: '2026-09-01',
    jenis: 'Pemasukan',
    kategori: 'Iuran Warga (IPL)',
    nominal: 4500000,
    keterangan: 'Penerimaan Iuran Warga periode awal September (30 rumah x Rp 150.000)',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  },
  {
    id: 'fin-2',
    tanggal: '2026-09-02',
    jenis: 'Pengeluaran',
    kategori: 'Gaji Satpam & Keamanan',
    nominal: 3000000,
    keterangan: 'Honor 2 petugas satpam jaga shift gerbang utama (Pak Rohman & Pak Sukardi)',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  },
  {
    id: 'fin-3',
    tanggal: '2026-09-03',
    jenis: 'Pengeluaran',
    kategori: 'Petugas Sampah & Kebersihan',
    nominal: 1200000,
    keterangan: 'Biaya angkut sampah rutin 3x seminggu armada DLH & petugas kebersihan gerobak',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  },
  {
    id: 'fin-4',
    tanggal: '2026-09-06',
    jenis: 'Pengeluaran',
    kategori: 'Token Listrik Fasum & PJU',
    nominal: 450000,
    keterangan: 'Isi ulang token listrik PJU jalan utama dan lampu Balai Pertemuan RT',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  },
  {
    id: 'fin-5',
    tanggal: '2026-09-12',
    jenis: 'Pemasukan',
    kategori: 'Sumbangan / Donasi',
    nominal: 1000000,
    keterangan: 'Donasi warga untuk pengadaan dispenser air & kipas angin Balai RT (Bpk Ir. Joko)',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  },
  {
    id: 'fin-6',
    tanggal: '2026-09-18',
    jenis: 'Pengeluaran',
    kategori: 'Pengadaan Alat Pos Ronda',
    nominal: 350000,
    keterangan: 'Beli 2 senter patroli cas ulang, jas hujan satpam, dan P3K pos ronda',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  },
  {
    id: 'fin-7',
    tanggal: '2026-09-25',
    jenis: 'Pengeluaran',
    kategori: 'Sosial / Santunan Warga',
    nominal: 300000,
    keterangan: 'Bantuan tali asih warga sakit rawat inap (Anak Pak Ridwan Blok B2)',
    dicatatOleh: 'Ibu Hj. Siti Nurjanah (Bendahara)'
  }
];

export const INITIAL_COMPLAINTS: ComplaintReport[] = [
  {
    id: 'cmp-1',
    residentId: 'res-1',
    pelaporNama: 'Bambang Pamungkas',
    blokRumah: 'Blok B3 No. 12',
    kategori: 'Lampu / Fasilitas',
    judul: 'Lampu Penerangan Jalan Umum Depan Blok B3 Padam',
    deskripsi: 'Sudah 3 malam lampu tiang penerangan jalan nomor 04 di depan rumah B3 padam, jalanan agak gelap saat jam kepulangan kantor.',
    tanggalLapor: '2026-09-26',
    status: 'Sedang Ditangani',
    tanggapanPengurus: 'Sudah dikoordinasikan dengan petugas teknisi PJU dan bohlam LED pengganti sudah dipesan, estimasi diganti Rabu sore.',
    ditanganiOleh: 'Hendra Gunawan'
  },
  {
    id: 'cmp-2',
    residentId: 'res-5',
    pelaporNama: 'dr. Johannes Tanujaya',
    blokRumah: 'Blok C2 No. 08',
    kategori: 'Kebisingan',
    judul: 'Parkir Mobil Menghalangi Akses Keluar Masuk Gang C',
    deskripsi: 'Ada mobil tamu yang parkir memakan separuh jalan di tikungan Blok C sehingga mobil warga susah belok.',
    tanggalLapor: '2026-09-20',
    status: 'Selesai',
    tanggapanPengurus: 'Satpam sudah mendatangi pemilik rumah terkait dan mobil sudah dipindahkan ke kantong parkir fasum.',
    ditanganiOleh: 'Pak Rohman (Satpam)'
  }
];

export const INITIAL_GUEST_LOGS: GuestLog[] = [
  {
    id: 'gst-1',
    tuanRumahNama: 'Bambang Pamungkas',
    blokRumah: 'Blok B3 No. 12',
    namaTamu: 'Suryo Wibowo',
    asalKota: 'Semarang, Jawa Tengah',
    hubungan: 'Keluarga Kandung (Kakak)',
    tanggalTiba: '2026-09-28',
    rencanaMenginapHari: 3,
    platKendaraan: 'H 8910 AB (Avanza)',
    statusVerifikasi: 'Dikonfirmasi Satpam',
    catatan: 'Acara silaturahmi keluarga'
  },
  {
    id: 'gst-2',
    tuanRumahNama: 'I Made Dananjaya',
    blokRumah: 'Blok D1 No. 06',
    namaTamu: 'Gusti Ngurah Rai',
    asalKota: 'Denpasar, Bali',
    hubungan: 'Rekan Bisnis',
    tanggalTiba: '2026-09-29',
    rencanaMenginapHari: 2,
    statusVerifikasi: 'Dicatat',
    catatan: 'Urusan pekerjaan arsitektur'
  }
];

export const INITIAL_NOTIFICATIONS: RTNotification[] = [
  {
    id: 'notif-1',
    judul: 'Iuran IPL September 2026 Telah Dibuka',
    pesan: 'Bagi bapak/ibu warga Arcadia yang belum melakukan pembayaran iuran bulan September, silakan transfer via QRIS atau setor ke bendahara.',
    tanggal: '2026-09-01',
    kategori: 'iuran',
    sudahDibaca: true
  },
  {
    id: 'notif-2',
    judul: 'Jadwal Kerja Bakti Pra-Musim Hujan',
    pesan: 'Kerja bakti gotong royong warga akan dilaksanakan pada hari Minggu 4 Oktober 2026 pukul 06:30 WIB di area drainase fasum.',
    tanggal: '2026-09-27',
    kategori: 'kegiatan',
    sudahDibaca: false
  },
  {
    id: 'notif-3',
    judul: 'Waspada Keamanan Lingkungan & Tamu 1x24 Jam',
    pesan: 'Himbauan seluruh warga untuk selalu mengunci pagar rumah dan melaporkan tamu yang menginap lebih dari 24 jam melalui portal ini atau ke pos satpam.',
    tanggal: '2026-09-28',
    kategori: 'keamanan',
    sudahDibaca: false
  }
];

export const ARCADIA_HERO_IMAGE = '/src/assets/images/arcadia_residence_hero_1790736733475.jpg';

export const INITIAL_RT_OFFICERS: RTOfficer[] = [
  {
    id: 'off-1',
    jabatan: 'Ketua RT',
    namaLengkap: 'Bpk. Hendra Gunawan',
    blokRumah: 'Blok A1 No. 01',
    noTelepon: '0811-2233-4455',
    email: 'ketua.rt01arcadia@gmail.com',
    periode: '2024 - 2027',
    tugasUtama: 'Memimpin organisasi rukun tetangga, perwakilan resmi ke RW/Kelurahan/Desa Suwayuwo, pembina ketertiban lingkungan dan pengayom warga.',
    tanggungJawab: [
      'Menandatangani surat pengantar & administrasi resmi kependudukan warga',
      'Memimpin rapat warga & musyawarah mufakat lingkungan RT 01',
      'Koordinasi berkala dengan Ketua RW 12 dan Kepala Desa Suwayuwo',
      'Menjaga ketenteraman, toleransi, dan keharmonisan sosial antar warga'
    ]
  },
  {
    id: 'off-2',
    jabatan: 'Wakil Ketua RT',
    namaLengkap: 'Bpk. Agus Santoso',
    blokRumah: 'Blok B2 No. 04',
    noTelepon: '0812-7788-9900',
    email: 'wakil.rt01arcadia@gmail.com',
    periode: '2024 - 2027',
    tugasUtama: 'Membantu Ketua RT dalam koordinasi operasional harian, keamanan lingkungan, pos satpam, dan mewakili Ketua jika berhalangan.',
    tanggungJawab: [
      'Koordinasi jadwal siskamling & operasional regu keamanan / satpam perumahan',
      'Pengawasan pemeliharaan fasilitas umum (PJU, pos kamling, CCTV & taman)',
      'Membantu penanganan aduan cepat warga dan tindak lanjut lapangan',
      'Mewakili Ketua RT dalam agenda rapat atau koordinasi eksternal'
    ]
  },
  {
    id: 'off-3',
    jabatan: 'Sekretaris',
    namaLengkap: 'Bpk. Ahmad Fauzi',
    blokRumah: 'Blok A2 No. 05',
    noTelepon: '0813-8899-7711',
    email: 'sekretaris.rt01arcadia@gmail.com',
    periode: '2024 - 2027',
    tugasUtama: 'Tata kelola administrasi surat-menyurat, pendataan sensus warga, notulensi rapat, dan arsip digital kependudukan.',
    tanggungJawab: [
      'Penerbitan & verifikasi berkas permohonan surat keterangan pengantar RT',
      'Pengelolaan data sensus kepala keluarga, nomor KK, KTP & buku tamu',
      'Dokumentasi notulensi rapat warga & publikasi warta pengumuman resmi',
      'Pengarsipan data digital warga dan tertib administrasi persuratan'
    ]
  },
  {
    id: 'off-4',
    jabatan: 'Bendahara',
    namaLengkap: 'Ibu Hj. Siti Nurjanah',
    blokRumah: 'Blok B1 No. 02',
    noTelepon: '0857-1234-5678',
    email: 'bendahara.rt01arcadia@gmail.com',
    periode: '2024 - 2027',
    tugasUtama: 'Pengelolaan keuangan kas RT, penagihan & verifikasi iuran IPL warga, pembayaran operasional kebersihan/keamanan, serta pembukuan transparan.',
    tanggungJawab: [
      'Pencatatan & verifikasi pembayaran iuran IPL warga (QRIS, transfer BCA, tunai)',
      'Penerbitan bukti kwitansi tanda terima pembayaran iuran resmi bertanda tangan',
      'Penyaluran dana operasional bulanan satpam, petugas kebersihan/sampah, dan PJU',
      'Penyusunan laporan pembukuan kas bulanan yang terbuka dan transparan'
    ]
  }
];

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'emg-1',
    title: 'Pos Satpam Gerbang Arcadia',
    subtitle: 'Standby 24 Jam - Petugas Pak Rohman / Pak Sukardi',
    number: '0812-3344-5566',
    kategori: 'keamanan'
  },
  {
    id: 'emg-2',
    title: 'Bhabinkamtibmas Polsek Sukorejo',
    subtitle: 'Aiptu Suhendra (Bina Mitra Keamanan)',
    number: '0813-5566-7788',
    kategori: 'polisi'
  },
  {
    id: 'emg-3',
    title: 'Babinsa Koramil Sukorejo',
    subtitle: 'Serda Marzuki (TNI AD)',
    number: '0812-7788-9911',
    kategori: 'keamanan'
  },
  {
    id: 'emg-4',
    title: 'Pemadam Kebakaran (Damkar) Pasuruan',
    subtitle: 'Pos Pemadam Kebakaran Sektor Timur',
    number: '113 / (0343) 421113',
    kategori: 'damkar'
  },
  {
    id: 'emg-5',
    title: 'Ambulans Gawat Darurat & Puskesmas Sukorejo',
    subtitle: 'Layanan Medis Darurat 24 Jam',
    number: '119 / (0343) 611222',
    kategori: 'medis'
  },
  {
    id: 'emg-6',
    title: 'Gangguan Listrik PLN Sukorejo',
    subtitle: 'Layanan Pengaduan & Kabel Rusak PLN',
    number: '123',
    kategori: 'pln'
  },
  {
    id: 'emg-7',
    title: 'Gangguan Air Bersih PDAM Pasuruan',
    subtitle: 'Layanan Pipa & Kebocoran PDAM Tirta',
    number: '(0343) 424123',
    kategori: 'pdam'
  }
];

