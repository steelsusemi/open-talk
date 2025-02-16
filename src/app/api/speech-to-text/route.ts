import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file') as Blob;
    const language = formData.get('language') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: '오디오 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 파일을 Buffer로 변환
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // OpenAI Whisper API 호출
    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], 'audio.mp3', { type: 'audio/mp3' }),
      model: 'whisper-1',
      language: language || undefined,
      response_format: 'verbose_json',
    });

    // 언어가 지정되지 않은 경우 감지된 언어 사용
    const detectedLanguage = language || transcription.language;

    return NextResponse.json({
      text: transcription.text,
      detectedLanguage: detectedLanguage,
    });
  } catch (error) {
    console.error('Speech to text error:', error);
    return NextResponse.json(
      { error: '음성 인식 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 