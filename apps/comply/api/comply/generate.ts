import { NextRequest, NextResponse } from 'next/server';
import { createCompliancePrompt } from '@/shared/ai/prompts/comply';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const industry = body.industry || 'healthcare';
  const regulations = body.regulations || [];

  const prompt = createCompliancePrompt(industry, regulations);

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5
  });

  const output = response.choices[0]?.message.content || '';
  return NextResponse.json({ output });
}