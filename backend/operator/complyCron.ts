import { OpenAI } from 'openai';
import { createPolicyPrompt } from '@/shared/ai/prompts/comply';
import { sendMail } from '@/shared/lib/mailer';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runMonthlyComplianceCheck(user: {
  email: string;
  businessType: string;
  dataCollected: string[];
  region: string;
}) {
  const prompt = createPolicyPrompt({
    businessType: user.businessType,
    dataCollected: user.dataCollected,
    region: user.region
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  const policy = response.choices[0]?.message.content;

  await sendMail({
    to: user.email,
    subject: 'Your Updated Privacy Policy',
    text: `Here is your updated policy:\n\n${policy}`
  });

  return policy;
}