import { OpenAI } from 'openai';
import { sendMail } from '@/shared/lib/mailer';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateGuestReview(guestName: string, staySummary: string) {
  const prompt = `
Write a polite and helpful Airbnb guest review based on this summary:

Guest Name: ${guestName}
Summary: ${staySummary}

Keep it short and positive if applicable.
`;

  const result = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  const review = result.choices[0]?.message.content;

  await sendMail({
    to: 'host@email.com',
    subject: `Suggested Review for ${guestName}`,
    text: review
  });

  return review;
}