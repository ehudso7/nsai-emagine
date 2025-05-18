import { NextRequest, NextResponse } from 'next/server';
import { createResumePrompt } from '@/shared/ai/prompts/hireedge';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { role, bio } = await req.json();
  const prompt = createResumePrompt(role, bio);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4
  });

  return NextResponse.json({
    output: completion.choices[0]?.message.content
  });
}