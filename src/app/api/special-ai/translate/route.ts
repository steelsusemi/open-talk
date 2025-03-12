import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, targetLanguage, systemMessage } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: '번역할 텍스트가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 언어 코드에 따른 시스템 메시지 설정
    let finalSystemMessage = systemMessage;
    if (!finalSystemMessage) {
      const languageMap: Record<string, string> = {
        'en': 'English',
        'ja': 'Japanese',
        'zh': 'Chinese',
        'fr': 'French'
      };
      
      const targetLanguageName = languageMap[targetLanguage] || 'English';
      finalSystemMessage = `You will be provided with a sentence in Korean, and your task is to translate it into ${targetLanguageName}.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: finalSystemMessage },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('AI 응답이 없습니다.');
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '번역 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 