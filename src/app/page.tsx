import Card from '@/components/Card';

const features = [
  {
    title: '기본 챗봇',
    description: 'OpenAI와 실시간 대화를 즐겨보세요. 자연스러운 대화와 함께 다양한 주제에 대해 이야기해보세요.',
    icon: '🤖',
    link: '/chatbot'
  },
  {
    title: '특별 역할 AI',
    description: '전문가, 선생님, 코치 등 다양한 역할의 AI와 대화하며 전문적인 조언을 받아보세요.',
    icon: '👨‍🏫',
    link: '/special-ai'
  },
  {
    title: '블로그 글 생성',
    description: '원하는 주제에 대한 전문적이고 매력적인 블로그 글을 AI가 자동으로 작성해드립니다.',
    icon: '✍️',
    link: '/blog-ai'
  },
  {
    title: 'JSON 응답 UI',
    description: 'AI의 구조화된 응답을 시각적으로 확인하고 데이터를 효과적으로 활용해보세요.',
    icon: '🔄',
    link: '/json-ai'
  }
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F]">
      {/* 우주적인 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/50 to-gray-900/80" />
        <div className="stars absolute inset-0" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <header className="text-center mb-20">
          <div className="inline-block mb-8">
            <h1 className="relative text-6xl font-black">
              <span className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl" />
              <span className="relative bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                OpenAI 웹 앱
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed backdrop-blur-xl bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
            OpenAI API를 활용한 다양한 AI 기능을 경험해보세요. 
            실시간 대화부터 전문적인 콘텐츠 생성까지, 
            인공지능의 무한한 가능성을 체험하실 수 있습니다.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} {...feature} />
          ))}
        </div>

        <footer className="mt-32 text-center">
          <div className="inline-block backdrop-blur-xl bg-gray-900/50 p-8 rounded-2xl border border-gray-700/50">
            <p className="text-gray-400 mb-4 font-medium">
              © 2024 OpenAI 웹앱. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              이 웹앱은 Next.js 15와 OpenAI API를 활용하여 제작되었습니다.
              <br />최신 AI 기술을 실험하고 경험해보세요.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
