import { NextRequest, NextResponse } from 'next/server';
import { createGuestReplyPrompt } from '@/shared/ai/prompts/hostflow';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const prompt = createGuestReplyPrompt(message);

  const res = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4
  });

  return NextResponse.json({ reply: res.choices[0]?.message.content });
}