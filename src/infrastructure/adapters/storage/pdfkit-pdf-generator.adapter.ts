import { Injectable } from '@nestjs/common';
import * as https from 'node:https';
import * as http from 'node:http';
import PDFDocument from 'pdfkit';
import {
  PdfGeneratorPort,
  EnrollmentCertificateData,
  PaymentCertificateData,
} from '@domain/ports/outbound/storage/pdf-generator.port';

@Injectable()
export class PdfkitPdfGeneratorAdapter implements PdfGeneratorPort {
  async generateEnrollmentCertificate(
    data: EnrollmentCertificateData,
  ): Promise<Buffer> {
    const logoBuffer = data.institutionLogoUrl
      ? await this.fetchImage(data.institutionLogoUrl)
      : null;
    const enrollmentSentence = `Certificamos que el estudiante ${data.studentFullName}, portador de la cédula de identidad N° ${data.studentId}, se encuentra debidamente matriculado en la carrera de ${data.careerName} durante el presente período académico, en ${data.institutionName}.`;
    return this.render(
      data,
      'CERTIFICADO DE MATRÍCULA',
      [enrollmentSentence],
      logoBuffer,
    );
  }

  async generatePaymentCertificate(
    data: PaymentCertificateData,
  ): Promise<Buffer> {
    const logoBuffer = data.institutionLogoUrl
      ? await this.fetchImage(data.institutionLogoUrl)
      : null;
    return this.render(
      data,
      'CERTIFICADO DE PAGO',
      [this.paymentSentence(data)],
      logoBuffer,
    );
  }

  private paymentSentence(data: PaymentCertificateData): string {
    const base = `Certificamos que el estudiante ${data.studentFullName}, portador de la cédula de identidad N° ${data.studentId}, `;
    switch (data.paymentStatus) {
      case 'pagado':
        return `${base}ha cancelado el pago total de su matrícula en ${data.institutionName}.`;
      case 'pagando':
        return `${base}se encuentra cancelando el pago de su matrícula mediante convenio (${data.paidInstallments}/4 cuotas pagadas) en ${data.institutionName}.`;
      default:
        return `${base}no registra pagos de matrícula a la fecha en ${data.institutionName}.`;
    }
  }

  private render(
    data: EnrollmentCertificateData,
    title: string,
    bodyParagraphs: string[],
    logoBuffer: Buffer | null,
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

      const contentWidth = width - 160;
      const contentX = (width - contentWidth) / 2;

      doc
        .rect(30, 30, width - 60, height - 60)
        .lineWidth(3)
        .stroke(green);
      doc
        .rect(36, 36, width - 72, height - 72)
        .lineWidth(1)
        .stroke('#d1d5db');

      if (logoBuffer) {
        try {
          const logoSize = 80;
          doc.image(logoBuffer, (width - logoSize) / 2, 50, {
            fit: [logoSize, logoSize],
          });
          doc.y = 50 + logoSize + 14;
        } catch {
          doc.y = 70;
        }
      } else {
        doc.y = 70;
      }

      doc.x = contentX;
      doc
        .font('Helvetica-Bold')
        .fontSize(24)
        .fillColor(green)
        .text(data.institutionName, { align: 'center', width: contentWidth });

      if (data.institutionSlogan) {
        doc.moveDown(0.2);
        doc.x = contentX;
        doc
          .font('Helvetica-Oblique')
          .fontSize(11)
          .fillColor(muted)
          .text(`"${data.institutionSlogan}"`, {
            align: 'center',
            width: contentWidth,
          });
      }

      if (data.institutionRuc) {
        doc.moveDown(0.2);
        doc.x = contentX;
        doc
          .font('Helvetica')
          .fontSize(10.5)
          .fillColor(muted)
          .text(`RUC: ${data.institutionRuc}`, {
            align: 'center',
            width: contentWidth,
          });
      }

      if (data.institutionAddress) {
        doc.moveDown(0.2);
        doc.x = contentX;
        doc
          .font('Helvetica')
          .fontSize(10.5)
          .fillColor(muted)
          .text(`Dirección: ${data.institutionAddress}`, {
            align: 'center',
            width: contentWidth,
          });
      }

      const contactParts: string[] = [];
      if (data.institutionPhone)
        contactParts.push(`Tel.: ${data.institutionPhone}`);
      if (data.institutionMobile)
        contactParts.push(`Cel.: ${data.institutionMobile}`);
      if (data.institutionEmail)
        contactParts.push(`Email: ${data.institutionEmail}`);
      if (data.institutionWebsite)
        contactParts.push(`Web: ${data.institutionWebsite}`);
      if (contactParts.length > 0) {
        doc.moveDown(0.2);
        doc.x = contentX;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor(muted)
          .text(contactParts.join('   |   '), {
            align: 'center',
            width: contentWidth,
          });
      }

      doc.moveDown(1.8);
      doc.x = contentX;
      doc
        .font('Helvetica')
        .fontSize(11.5)
        .fillColor(muted)
        .text(`${data.city}, ${this.formatDate(data.generatedAt)}`, {
          align: 'right',
          width: contentWidth,
        });

      doc.moveDown(2.5);
      doc.x = contentX;
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(slate)
        .text(title, { align: 'center', width: contentWidth });

      doc.moveDown(2);
      doc.x = contentX;
      doc.font('Helvetica').fontSize(12).fillColor(slate).lineGap(8);

      for (const paragraph of bodyParagraphs) {
        doc.x = contentX;
        doc.text(paragraph, { align: 'justify', width: contentWidth });
        doc.moveDown(1);
      }

      doc.x = contentX;
      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor(slate)
        .text(
          'Certificación que se emite a petición de la parte interesada, para los fines que crea conveniente.',
          { align: 'justify', width: contentWidth },
        );

      doc.moveDown(3);
      doc.x = contentX;
      doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .fillColor(slate)
        .text('Secretaría Académica', { align: 'center', width: contentWidth });

      doc.moveDown(4);
      doc.x = contentX;
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor(muted)
        .text(`Código de verificación: ${data.certificateCode}`, {
          align: 'center',
          width: contentWidth,
        });

      doc.end();
    });
  }

  private fetchImage(url: string, redirectsLeft = 3): Promise<Buffer | null> {
    return new Promise((resolve) => {
      try {
        const parsed = new URL(url);
        const client = parsed.protocol === 'http:' ? http : https;
        const req = client.get(parsed, (res) => {
          const status = res.statusCode ?? 0;
          const location = res.headers.location;
          if (status >= 300 && status < 400 && location && redirectsLeft > 0) {
            res.resume();
            resolve(
              this.fetchImage(new URL(location, parsed).toString(), redirectsLeft - 1),
            );
            return;
          }
          if (status !== 200) {
            res.resume();
            resolve(null);
            return;
          }
          const chunks: Buffer[] = [];
          res.on('data', (c: Buffer) => chunks.push(c));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', () => resolve(null));
        });
        req.on('error', () => resolve(null));
        req.setTimeout(5000, () => {
          req.destroy();
          resolve(null);
        });
      } catch {
        resolve(null);
      }
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
