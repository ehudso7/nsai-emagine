import { NextRequest, NextResponse } from 'next/server';
import { createBlogPrompt } from '@/shared/ai/prompts/nichepress';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const niche = body.niche || 'rare indoor plants';

  const prompt = createBlogPrompt(niche);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5
  });

  const output = response.choices[0]?.message.content || '';
  return NextResponse.json({ output });
}