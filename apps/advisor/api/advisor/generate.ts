import { NextRequest, NextResponse } from 'next/server';
import { createAdvisorPrompt } from '@/shared/ai/prompts/advisor';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { userSummary } = await req.json();
  
  if (!userSummary) {
    return NextResponse.json(
      { error: 'User summary is required' },
      { status: 400 }
    );
  }

  const prompt = createAdvisorPrompt(userSummary);
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5
    });

    const advice = completion.choices[0]?.message.content;
    
    return NextResponse.json({ advice });
  } catch (error) {
    console.error('Error generating advice:', error);
    return NextResponse.json(
      { error: 'Failed to generate advice' },
      { status: 500 }
    );
  }
}