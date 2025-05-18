import { OpenAI } from 'openai';
import { createBlogPrompt } from '@/shared/ai/prompts/nichepress';
import { publishToCMS } from '@/shared/lib/publisher';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runNichePostSchedule(user: { niche: string; email: string }) {
  const prompt = createBlogPrompt(user.niche);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  const articles = response.choices[0]?.message.content;

  await publishToCMS({ content: articles, user });
}