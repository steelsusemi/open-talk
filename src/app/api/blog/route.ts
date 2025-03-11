import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Vercel Edge 함수의 최대 실행 시간 설정
export const maxDuration = 60; // 최대 60초로 설정

export async function POST(request: Request) {
  try {
    const { 
      topic, 
      tone = '전문적', 
      length = '중간', 
      keywords = '', 
      targetAudience = '일반',
      seoOptimize = true
    } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '주제는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 블로그 생성을 위한 프롬프트 구성
    const systemPrompt = `당신은 전문적인 블로그 작가입니다. 
SEO에 최적화된 고품질 블로그 글을 작성해주세요.
다음 가이드라인을 따라주세요:

1. 주제: ${topic}
2. 톤: ${tone}
3. 길이: ${length} (짧음: 500자 내외, 중간: 1000자 내외, 긴 글: 2000자 이상)
4. 키워드: ${keywords || '주제와 관련된 키워드 자유롭게 사용'}
5. 대상 독자: ${targetAudience}
6. SEO 최적화: ${seoOptimize ? '필요' : '불필요'}

${seoOptimize ? `
SEO 최적화를 위해 다음 요소를 포함해주세요:
- 매력적인 제목 (H1)
- 소제목 (H2, H3)
- 키워드가 자연스럽게 포함된 문단
- 독자의 관심을 끄는 도입부
- 명확한 결론
- 메타 설명 제안 (150-160자)
` : ''}

글의 구조는 다음과 같이 작성해주세요:
1. 제목 (H1)
2. 메타 설명 (SEO 최적화 시)
3. 도입부
4. 본문 (소제목으로 구분)
5. 결론

마크다운 형식으로 작성해주세요.`;

    // 토큰 수 제한 및 온도 조정
    const maxTokens = length === '짧음' ? 800 : length === '중간' ? 1500 : 2500;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // gpt-4 대신 더 빠른 gpt-3.5-turbo 사용
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `"${topic}"에 대한 블로그 글을 작성해주세요.` }
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    const blogContent = completion.choices[0].message.content;
    if (!blogContent) {
      throw new Error('블로그 콘텐츠 생성에 실패했습니다.');
    }

    return NextResponse.json({ 
      content: blogContent,
      topic,
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // 오류 메시지 개선
    let errorMessage = '블로그 생성 중 오류가 발생했습니다.';
    let statusCode = 500;
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT' || error.message?.includes('timeout')) {
      errorMessage = '블로그 생성 시간이 초과되었습니다. 더 짧은 길이로 다시 시도해주세요.';
      statusCode = 504;
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
      statusCode = 429;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 