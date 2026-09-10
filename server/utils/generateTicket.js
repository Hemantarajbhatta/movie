import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateTicketPDF = async (booking) => {
  const uploadsDir = path.join(__dirname, '../uploads/tickets');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const filename = `ticket-${booking.bookingId}.pdf`;
  const filepath = path.join(uploadsDir, filename);

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A5', margin: 30 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // QR Code data
      const qrData = JSON.stringify({
        bookingId: booking.bookingId,
        movie: booking.movieId?.title,
        date: booking.showDate,
        time: booking.showTime,
        seats: booking.seats.map(s => `${s.row}${s.number}`),
      });
      const qrDataURL = await QRCode.toDataURL(qrData);
      const qrBuffer = Buffer.from(qrDataURL.split(',')[1], 'base64');

      // ---- PDF Design ----
      // Header
      doc.rect(0, 0, doc.page.width, 80).fill('#14171f');
      doc.fontSize(24).fillColor('#1da1f2').font('Helvetica-Bold')
        .text('CINEMATIX', 30, 25, { align: 'left' });
      doc.fontSize(10).fillColor('#8b95a5').font('Helvetica')
        .text('MOVIE TICKET', 30, 55, { align: 'left' });

      // Booking ID
      doc.fillColor('#ffffff').fontSize(10)
        .text(`Booking ID: ${booking.bookingId}`, 0, 30, { align: 'right' });

      // Divider
      doc.moveTo(30, 90).lineTo(doc.page.width - 30, 90).strokeColor('#1da1f2').lineWidth(2).stroke();

      // Movie Info
      doc.moveDown(2);
      doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
        .text(booking.movieId?.title || 'Movie', 30, 110);

      doc.fillColor('#8b95a5').fontSize(11).font('Helvetica')
        .text(`Cinema: ${booking.cinemaId?.name || 'N/A'}`, 30, 140)
        .text(`Location: ${booking.cinemaId?.location || 'N/A'}`, 30, 158)
        .text(`Date: ${new Date(booking.showDate).toDateString()}`, 30, 176)
        .text(`Time: ${booking.showTime}`, 30, 194);

      // Seats
      doc.fillColor('#1da1f2').fontSize(12).font('Helvetica-Bold')
        .text('Seats:', 30, 220);
      const seatsList = booking.seats.map(s => `${s.row}${s.number} (${s.type})`).join(', ');
      doc.fillColor('#ffffff').fontSize(11).font('Helvetica')
        .text(seatsList, 30, 238, { width: 250 });

      // Total
      doc.fillColor('#8b95a5').fontSize(11)
        .text(`Total Paid:`, 30, 270);
      doc.fillColor('#22c55e').fontSize(16).font('Helvetica-Bold')
        .text(`Rs. ${booking.totalPrice}`, 30, 288);

      // Passenger
      doc.fillColor('#8b95a5').fontSize(10).font('Helvetica')
        .text(`Booked by: ${booking.userId?.name || 'Guest'}`, 30, 315)
        .text(`Email: ${booking.userId?.email || ''}`, 30, 330);

      // QR Code
      doc.image(qrBuffer, doc.page.width - 150, 110, { width: 120, height: 120 });
      doc.fillColor('#8b95a5').fontSize(8)
        .text('Scan to verify', doc.page.width - 150, 235, { width: 120, align: 'center' });

      // Footer
      doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill('#14171f');
      doc.fillColor('#8b95a5').fontSize(9).font('Helvetica')
        .text('Thank you for booking with Cinematix! Please show this ticket at the entrance.', 30, doc.page.height - 35, { align: 'center', width: doc.page.width - 60 });

      doc.end();

      stream.on('finish', () => resolve(`/uploads/tickets/${filename}`));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

export default generateTicketPDF;
