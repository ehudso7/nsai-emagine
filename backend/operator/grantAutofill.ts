import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function autofillGrantApplication({
  orgName,
  mission,
  grantTitle,
  questions
}: {
  orgName: string;
  mission: string;
  grantTitle: string;
  questions: string[];
}) {
  const prompt = `
You are a grant writing assistant.

Create short, compelling answers to the following application questions for a grant titled "${grantTitle}".
Organization: ${orgName}
Mission: ${mission}

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Respond clearly and concisely.
  `.trim();

  const res = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  return res.choices[0]?.message.content;
}