import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });

  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text
  });
}