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
        { role: 'system', content: systemMessage || 'You will be provided with a description of a mood, and your task is to generate 3 different CSS colors that match it. Write your output in json with a key called "colors" containing an array of 3 objects. Each object should have a "css_code" key with the color value (hex, rgb, or hsl) and a "name" key with a short descriptive name for the color.' },
        { role: 'user', content: text }
      ],
      temperature: 1,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    const result = completion.choices[0].message.content;
    if (!result) {
      throw new Error('AI 응답이 없습니다.');
    }

    // JSON 파싱 시도
    try {
      const parsedResult = JSON.parse(result);
      
      // 결과 형식 확인 및 변환
      if (!parsedResult.colors && parsedResult.css_code) {
        // 이전 형식의 응답을 새 형식으로 변환
        return NextResponse.json({ 
          result: {
            colors: [
              { css_code: parsedResult.css_code, name: '생성된 색상' }
            ]
          }
        });
      }
      
      return NextResponse.json({ result: parsedResult });
    } catch (parseError) {
      // JSON 파싱에 실패한 경우 원본 문자열 반환
      console.error('JSON 파싱 오류:', parseError);
      return NextResponse.json({ result });
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '색상 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 