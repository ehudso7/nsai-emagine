import { createAdvisorPrompt } from '@/shared/ai/prompts/advisor';
import { OpenAI } from 'openai';
import { sendMail } from '@/shared/lib/mailer';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runAdvisorAudit(userSummary: string, email: string) {
  const prompt = createAdvisorPrompt(userSummary);
  const res = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  const report = res.choices[0]?.message.content;
  await sendMail({
    to: email,
    subject: 'Your Weekly NSAI Advisor Report',
    text: report
  });

  return report;
}