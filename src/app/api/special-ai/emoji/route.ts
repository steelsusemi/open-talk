import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, systemMessage } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: '텍스트가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage || 'You will be provided with text, and your task is to translate it into emojis. Do not use any regular text. Do your best with emojis only.' },
        { role: 'user', content: text }
      ],
      temperature: 0.8,
      max_tokens: 256,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('AI 응답이 없습니다.');
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '이모지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 