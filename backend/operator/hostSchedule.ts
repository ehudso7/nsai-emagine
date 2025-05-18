import { sendMail } from '@/shared/lib/mailer';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Reservation = {
  guestName: string;
  email: string;
  propertyId: string;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  specialRequests?: string;
};

type Property = {
  id: string;
  name: string;
  address: string;
  wifiPassword: string;
  cleanerContact: string;
  cleanerEmail: string;
  checkInTime: string;
  checkOutTime: string;
  localTips: string[];
};

export async function sendCheckInReminder(reservation: Reservation, property: Property) {
  const checkInDate = reservation.checkIn.toLocaleDateString();
  
  const prompt = `
You are an Airbnb host assistant. Create a friendly check-in reminder email for a guest.

Guest name: ${reservation.guestName}
Property: ${property.name}
Check-in date: ${checkInDate}
Check-in time: ${property.checkInTime}
Wi-Fi password: ${property.wifiPassword}
Address: ${property.address}

Include:
1. A warm welcome
2. Check-in instructions
3. Wi-Fi details
4. A brief mention of house rules
5. Your availability for questions
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  const emailContent = completion.choices[0]?.message.content;

  await sendMail({
    to: reservation.email,
    subject: `Your stay at ${property.name} is coming up!`,
    text: emailContent || `Looking forward to hosting you at ${property.name} on ${checkInDate}!`
  });

  return emailContent;
}

export async function notifyCleaner(reservation: Reservation, property: Property) {
  const checkOutDate = reservation.checkOut.toLocaleDateString();
  
  const message = `
Cleaning Required:
Property: ${property.name}
Address: ${property.address}
Date: ${checkOutDate}
Time: After ${property.checkOutTime}

Guest: ${reservation.guestName}
Special notes: ${reservation.specialRequests || 'None'}
  `.trim();

  await sendMail({
    to: property.cleanerEmail,
    subject: `Cleaning Required: ${property.name} on ${checkOutDate}`,
    text: message
  });

  return message;
}

export async function sendReviewReminder(reservation: Reservation, property: Property) {
  const prompt = `
You are an Airbnb host. Write a short, friendly message to a guest who just checked out, asking them to leave a review.

Guest name: ${reservation.guestName}
Property: ${property.name}

Keep it warm, personal, and brief.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  const emailContent = completion.choices[0]?.message.content;

  await sendMail({
    to: reservation.email,
    subject: `How was your stay at ${property.name}?`,
    text: emailContent || `We hope you enjoyed your stay at ${property.name}!`
  });

  return emailContent;
}