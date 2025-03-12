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
1. 제목 (H1 - # 사용)
2. 메타 설명 (SEO 최적화 시, 인용구 형태로 > 사용)
3. 도입부
4. 본문 (소제목으로 구분, H2는 ##, H3는 ###, H4는 #### 사용)
5. 결론

마크다운 형식을 최대한 활용하여 다음 요소들을 적절히 포함해주세요:
- **굵은 글씨**와 *기울임체*를 사용하여 중요한 부분 강조
- 순서 있는 목록(1. 2. 3.)과 순서 없는 목록(- * +) 적절히 활용
- 표를 사용하여 데이터나 비교 정보 정리 (예: | 항목 | 설명 | 특징 |)
- > 인용구를 사용하여 중요한 문장이나 인용 강조
- 필요시 코드 블록 사용 (기술 관련 주제인 경우)
- 구분선(---) 사용하여 섹션 구분
- [링크 텍스트](URL) 형식으로 관련 참고 자료 링크 제공

각 섹션은 읽기 쉽고 시각적으로 구분되도록 작성해주세요. 
독자의 관심을 끌고 정보를 효과적으로 전달할 수 있는 다양한 마크다운 요소를 창의적으로 활용해주세요.

특히 다음 사항을 지켜주세요:
1. 제목(H1)은 한 개만 사용하고, 소제목(H2, H3, H4)을 적절히 사용하여 계층 구조를 만들어주세요.
2. 각 섹션 사이에는 충분한 간격을 두어 가독성을 높여주세요.
3. 중요한 개념이나 키워드는 **굵은 글씨**로 강조해주세요.
4. 정의나 설명이 필요한 부분은 > 인용구를 활용해주세요.
5. 비교 정보나 데이터는 표로 정리해주세요.
6. 단계별 설명이나 목록은 순서 있는 목록과 순서 없는 목록을 적절히 활용해주세요.
7. 코드나 기술적 내용은 코드 블록으로 구분해주세요.
8. 결론 부분에서는 핵심 내용을 요약하고 독자에게 행동을 유도하는 문장을 포함해주세요.`;

    // 토큰 수 제한 및 온도 조정
    const maxTokens = length === '짧음' ? 800 : length === '중간' ? 1500 : 2500;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // gpt-4 대신 더 빠른 gpt-3.5-turbo 사용
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