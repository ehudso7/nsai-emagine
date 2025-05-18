import { NextRequest, NextResponse } from 'next/server';
import { createMonetizationPrompt } from '@/shared/ai/prompts/monetizer';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { niche, content } = await req.json();
  
  if (!niche || !content) {
    return NextResponse.json(
      { error: 'Niche and content are required' },
      { status: 400 }
    );
  }

  const prompt = createMonetizationPrompt(niche, content);
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const suggestions = completion.choices[0]?.message.content;
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating monetization suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate monetization suggestions' },
      { status: 500 }
    );
  }
}