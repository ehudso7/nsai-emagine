import { OpenAI } from 'openai';
import { createGrantSearchPrompt } from '@/shared/ai/prompts/grantbot';
import { sendMail } from '@/shared/lib/mailer';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runGrantSearch(user: {
  email: string;
  keyword: string;
}) {
  const prompt = createGrantSearchPrompt(user.keyword);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const summary = response.choices[0]?.message.content || 'No results.';

  await sendMail({
    to: user.email,
    subject: `New Grants for: ${user.keyword}`,
    text: summary
  });

  return summary;
}