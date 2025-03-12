import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '메시지가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 시스템 메시지가 있는지 확인
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    if (!hasSystemMessage) {
      return NextResponse.json(
        { error: '시스템 메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages.map(({ role, content }) => ({ role, content })),
      temperature: 0.7,
      max_tokens: 2048,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('AI 응답이 없습니다.');
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '메시지 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 