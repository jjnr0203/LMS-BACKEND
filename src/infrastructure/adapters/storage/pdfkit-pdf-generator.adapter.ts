import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import {
  PdfGeneratorPort,
  EnrollmentCertificateData,
} from '@domain/ports/outbound/storage/pdf-generator.port';

@Injectable()
export class PdfkitPdfGeneratorAdapter implements PdfGeneratorPort {
  async generateEnrollmentCertificate(
    data: EnrollmentCertificateData,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        margins: { top: 40, bottom: 40, left: 55, right: 55 },
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const width = doc.page.width;
      const height = doc.page.height;
      const green = '#064e3b';
      const slate = '#334155';
      const muted = '#64748b';

      doc
        .rect(30, 30, width - 60, height - 60)
        .lineWidth(3)
        .stroke(green);
      doc
        .rect(36, 36, width - 72, height - 72)
        .lineWidth(1)
        .stroke('#d1d5db');

      doc
        .moveDown(2)
        .font('Helvetica-Bold')
        .fontSize(24)
        .fillColor(green)
        .text(data.institutionName, { align: 'center', width: width - 160 });

      if (data.institutionRuc) {
        doc
          .moveDown(0.2)
          .font('Helvetica')
          .fontSize(11)
          .fillColor(muted)
          .text(`RUC: ${data.institutionRuc}`, {
            align: 'center',
            width: width - 160,
          });
      }

      doc
        .moveDown(2.2)
        .font('Helvetica')
        .fontSize(11.5)
        .fillColor(muted)
        .text(`${data.city}, ${this.formatDate(data.generatedAt)}`, {
          align: 'right',
          width: width - 110,
        });

      doc
        .moveDown(3.5)
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(slate)
        .text('CERTIFICADO DE MATRÍCULA', { align: 'center' });

      doc
        .moveDown(2)
        .font('Helvetica')
        .fontSize(12)
        .fillColor(slate)
        .lineGap(8);

      doc.text(
        `Certificamos que el estudiante ${data.studentFullName}, portador de la cédula de identidad N° ${data.studentId}, se encuentra debidamente matriculado en la carrera de ${data.careerName} durante el presente período académico, en ${data.institutionName}.`,
        { align: 'justify' },
      );

      doc
        .moveDown(1)
        .font('Helvetica')
        .fontSize(12)
        .fillColor(slate)
        .text(
          'Certificación que se emite a petición de la parte interesada, para los fines que crea conveniente.',
        );

      doc
        .moveDown(3)
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(slate)
        .text('Secretaría Académica', { align: 'center' });

      doc
        .moveDown(4)
        .font('Helvetica')
        .fontSize(11)
        .fillColor(muted)
        .text(`Código de verificación: ${data.certificateCode}`, {
          align: 'center',
        });

      doc.end();
    });
  }

  private formatDate(date: Date): string {
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('es-EC', { month: 'long' }).format(
      date,
    );
    const year = date.getFullYear();
    return `${day} de ${month} del ${year}`;
  }
}
