import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message, language = 'ko', useVoice, selectedVoice } = await request.json();

    const systemMessage = language 
      ? `사용자의 메시지에 ${language}로 응답해주세요.`
      : '사용자의 메시지에 적절한 언어로 응답해주세요.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    if (!aiResponse) {
      throw new Error('AI 응답이 없습니다.');
    }

    // 음성 응답이 요청된 경우
    let audioResponse: string | null = null;
    if (useVoice) {
      const speechResponse = await openai.audio.speech.create({
        model: 'tts-1',
        voice: selectedVoice || 'alloy',
        input: aiResponse,
      });

      // 오디오 데이터를 Base64로 변환
      const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
      audioResponse = audioBuffer.toString('base64');
    }

    return NextResponse.json({ 
      message: aiResponse,
      audioData: audioResponse 
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '메시지 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 