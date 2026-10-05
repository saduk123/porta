import { jsPDF } from 'jspdf';
import { OfficialLetter, FeePayment } from '../types';

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 3000);
}

/**
 * Generates an official, sharp vector PDF for Surat Pengantar RT
 */
export function generateSuratPengantarPdf(letter: OfficialLetter): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // --- KOP SURAT RT ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text('RUKUN TETANGGA 01 / RUKUN WARGA 12', pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFontSize(12);
    doc.text('DESA SUWAYUWO - KECAMATAN SUKOREJO, KABUPATEN PASURUAN', pageWidth / 2, y, { align: 'center' });
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('Sekretariat: Perumahan Oma Indah Kapuk Cluster Arcadia, Suwayuwo, Sukorejo, Pasuruan', pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.text('Kontak Sekretariat RT: 0811-2233-4455 / 0813-8899-7711', pageWidth / 2, y, { align: 'center' });
    y += 4;

    // Double rule lines
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 1.2;
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // --- JUDUL & NOMOR SURAT ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('SURAT KETERANGAN PENGANTAR', pageWidth / 2, y, { align: 'center' });
    
    // Underline under title
    const titleWidth = doc.getTextWidth('SURAT KETERANGAN PENGANTAR');
    doc.setLineWidth(0.4);
    doc.line((pageWidth - titleWidth) / 2, y + 1.2, (pageWidth + titleWidth) / 2, y + 1.2);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nomor: ${letter.noSurat || '038/SKP/RT01-RW12/SWY/IX/2026'}`, pageWidth / 2, y, { align: 'center' });
    y += 14;

    // --- PEMBUKA ---
    doc.setFontSize(10);
    doc.text(
      'Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 01 / RW 12 Desa Suwayuwo, Kecamatan Sukorejo, Kabupaten Pasuruan, dengan ini menerangkan dengan sebenarnya bahwa:',
      margin,
      y,
      { maxWidth: contentWidth, align: 'left', lineHeightFactor: 1.4 }
    );
    y += 14;

    // --- DATA PEMOHON ---
    const fieldX = margin + 8;
    const valueX = margin + 55;

    const printField = (label: string, val: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, fieldX, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`: ${val}`, valueX, y);
      y += 7;
    };

    printField('Nama Lengkap', letter.pemohonNama);
    printField('NIK / No. KTP', letter.nik);
    printField('Tempat Tinggal', `${letter.blokRumah}, Perumahan Oma Indah Kapuk Cluster Arcadia`);
    printField('Keperluan Surat', letter.keperluan);
    y += 4;

    // --- PARAGRAF PENJELASAN ---
    doc.text(
      'Orang tersebut di atas adalah benar-benar warga yang bertempat tinggal / berdomisili di lingkungan RT 01 / RW 12 Desa Suwayuwo, Perumahan Oma Indah Kapuk Cluster Arcadia, dan sepanjang pengamatan kami memiliki kelakuan baik dalam kehidupan bermasyarakat.',
      margin,
      y,
      { maxWidth: contentWidth, align: 'justify', lineHeightFactor: 1.4 }
    );
    y += 14;

    doc.text(
      `Surat pengantar ini diberikan untuk keperluan: ${letter.jenisSurat} sesuai dengan permohonan yang bersangkutan kepada instansi / pihak terkait.`,
      margin,
      y,
      { maxWidth: contentWidth, align: 'justify', lineHeightFactor: 1.4 }
    );
    y += 12;

    doc.text(
      'Demikian surat keterangan pengantar ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.',
      margin,
      y,
      { maxWidth: contentWidth, align: 'left', lineHeightFactor: 1.4 }
    );
    y += 20;

    // --- TANDA TANGAN & STEMPEL ---
    const signLeftX = margin + 15;
    const signRightX = pageWidth - margin - 55;

    doc.setFont('helvetica', 'normal');
    doc.text('Pemohon,', signLeftX, y, { align: 'center' });

    const dateStr = letter.tanggalDisetujui || new Date().toISOString().split('T')[0];
    doc.text(`Suwayuwo, ${dateStr}`, signRightX, y, { align: 'center' });
    y += 5;
    doc.text('Ketua RT 01 / RW 12', signRightX, y, { align: 'center' });

    // Digital Stamp Drawing
    doc.setDrawColor(16, 120, 70);
    doc.setLineWidth(0.6);
    doc.circle(signRightX, y + 16, 15);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 120, 70);
    doc.text('PENGURUS RT 01 / RW 12', signRightX, y + 14, { align: 'center' });
    doc.text('OMA INDAH KAPUK', signRightX, y + 17, { align: 'center' });
    doc.text('CLUSTER ARCADIA', signRightX, y + 20, { align: 'center' });

    y += 32;

    // Signatures Names
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(letter.pemohonNama, signLeftX, y, { align: 'center' });
    const pemohonWidth = doc.getTextWidth(letter.pemohonNama);
    doc.setLineWidth(0.3);
    doc.line(signLeftX - pemohonWidth / 2, y + 1, signLeftX + pemohonWidth / 2, y + 1);

    doc.text('Hendra Gunawan', signRightX, y, { align: 'center' });
    const ketuaWidth = doc.getTextWidth('Hendra Gunawan');
    doc.line(signRightX - ketuaWidth / 2, y + 1, signRightX + ketuaWidth / 2, y + 1);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Warga RT 01 RW 12', signLeftX, y, { align: 'center' });
    doc.text('Ketua RT 01 RW 12 Suwayuwo', signRightX, y, { align: 'center' });

    // Generate blob and trigger download
    const blob = doc.output('blob');
    const safeName = `Surat_Pengantar_RT01_RW12_${letter.pemohonNama}_${letter.noSurat || '038'}`;
    triggerBlobDownload(blob, safeName);
    return true;
  } catch (err) {
    console.error('Error generating Surat Pengantar PDF:', err);
    return false;
  }
}

/**
 * Generates an official, sharp vector PDF for Kwitansi IPL
 */
export function generateKwitansiPdf(fee: FeePayment): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a5'
    });

    const pageWidth = 210;
    const pageHeight = 148;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 14;

    // Outer border
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.6);
    doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

    y += 6;
    // Kop Kwitansi
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text('RUKUN TETANGGA 01 / RUKUN WARGA 12', pageWidth / 2, y, { align: 'center' });
    y += 4.5;
    doc.setFontSize(9);
    doc.text('PERUMAHAN OMA INDAH KAPUK CLUSTER ARCADIA', pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 90);
    doc.text('Desa Suwayuwo, Kec. Sukorejo, Pasuruan · Telp: 0811-2233-4455 / 0857-1234-5678', pageWidth / 2, y, { align: 'center' });
    y += 3;

    // Divider
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.4);
    doc.line(margin + 4, y, pageWidth - margin - 4, y);
    y += 6;

    // Title box
    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth / 2 - 60, y - 4, 120, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);
    doc.text('KWITANSI PEMBAYARAN IURAN PENGELOLAAN LINGKUNGAN (IPL)', pageWidth / 2, y, { align: 'center' });
    y += 7;

    // No & Tanggal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`No. Kwitansi: ${fee.noKwitansi || 'KW/ARC-RT01/2026/09/012'}`, margin + 6, y);
    doc.text(`Tanggal: ${fee.tanggalBayar || '2026-09-29'}`, pageWidth - margin - 6, y, { align: 'right' });
    y += 6;

    // Fields
    const fieldX = margin + 6;
    const valX = margin + 45;

    const row = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, fieldX, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`: ${value}`, valX, y);
      y += 5;
    };

    row('Telah Diterima Dari', fee.residentName);
    row('Alamat Hunian', `${fee.blokRumah}, Oma Indah Kapuk Cluster Arcadia`);
    row('Untuk Pembayaran', `Iuran Pengelolaan Lingkungan (IPL) Periode ${fee.bulan}`);
    row('Rincian Pos', 'Keamanan (Rp 80.000), Sampah/DLH (Rp 50.000), Fasum/Sosial (Rp 20.000)');
    row('Metode Pembayaran', fee.metodePembayaran);
    y += 2;

    // Amount Box
    doc.setFillColor(240, 253, 244); // light emerald
    doc.setDrawColor(22, 101, 52);
    doc.rect(margin + 6, y, 90, 9, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 83, 45);
    doc.text('JUMLAH: Rp 150.000,-', margin + 10, y + 6);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Terbilang: Seratus Lima Puluh Ribu Rupiah', margin + 6, y + 13);

    // Signatures
    const signPenyetorX = margin + 25;
    const signBendaharaX = pageWidth - margin - 35;
    const signY = y + 1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(40, 40, 40);
    doc.text('Penyetor,', signPenyetorX, signY, { align: 'center' });
    doc.text('Bendahara RT 01 RW 12,', signBendaharaX, signY, { align: 'center' });

    // Stamp
    doc.setDrawColor(22, 101, 52);
    doc.circle(signBendaharaX, signY + 12, 11);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('LUNAS RT 01 RW 12', signBendaharaX, signY + 11, { align: 'center' });
    doc.text('CLUSTER ARCADIA', signBendaharaX, signY + 14, { align: 'center' });

    // Names
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(fee.residentName.split(' ')[0], signPenyetorX, signY + 21, { align: 'center' });
    doc.text(fee.diverifikasiOleh || 'Hj. Siti Nurjanah', signBendaharaX, signY + 21, { align: 'center' });

    const blob = doc.output('blob');
    const safeName = `Kwitansi_IPL_RT01_RW12_${fee.residentName}_${fee.bulan}`;
    triggerBlobDownload(blob, safeName);
    return true;
  } catch (err) {
    console.error('Error generating Kwitansi PDF:', err);
    return false;
  }
}

/**
 * Clean printable document renderer that prints or creates a standalone printable HTML
 */
export function printDocumentIsolated(elementId: string, title: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Create self-contained printable HTML page
  const printableHtml = `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { 
            font-family: Arial, Helvetica, sans-serif; 
            color: #111; 
            margin: 0; 
            padding: 20px;
            background: #fff;
          }
          * { box-sizing: border-box; }
          .no-print { display: none !important; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  // Try iframe print first
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printableHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print blocked, opening window or downloading print page');
        }
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        }, 1500);
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Iframe print error:', err);
  }

  // Fallback: direct window.print()
  try {
    window.print();
  } catch (e) {
    console.warn('window.print error:', e);
  }
}
