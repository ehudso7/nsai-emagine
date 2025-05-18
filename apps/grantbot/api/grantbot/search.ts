import { NextRequest, NextResponse } from 'next/server';
import { createGrantSearchPrompt } from '@/shared/ai/prompts/grantbot';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();

  const prompt = createGrantSearchPrompt(keyword);

  const result = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  return NextResponse.json({
    output: result.choices[0]?.message.content
  });
}