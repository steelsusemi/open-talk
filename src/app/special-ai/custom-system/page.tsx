'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export default function CustomSystemPage() {
  const [systemMessage, setSystemMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemMessageSet, setSystemMessageSet] = useState(false);
  const router = useRouter();

  const handleSetSystemMessage = () => {
    if (!systemMessage.trim()) {
      setError('시스템 메시지를 입력해주세요.');
      return;
    }

    setSystemMessageSet(true);
    setMessages([{ role: 'system', content: systemMessage }]);
    setError('');
  };

  const handleResetSystemMessage = () => {
    setSystemMessageSet(false);
    setMessages([]);
    setError('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }

    if (!systemMessageSet) {
      setError('먼저 시스템 메시지를 설정해주세요.');
      return;
    }

    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/special-ai/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(({ role, content }) => ({ role, content }))
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      
      const newAssistantMessage: Message = {
        role: 'assistant',
        content: data.result,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
      setUserMessage('');
    } catch (err) {
      console.error('Error:', err);
      setError('메시지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F]">
      {/* 우주적인 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-gray-900/50 to-gray-900/80" />
        <div className="stars absolute inset-0" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 py-6 max-w-4xl">
        <nav className="mb-10 flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center justify-between bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-800/50 px-4 py-2">
            <div className="w-32 flex justify-start">
              <Link
                href="/special-ai"
                className="group relative px-3 py-1.5 overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-purple-600/10 rounded-lg" />
                <div className="relative flex items-center gap-2 text-gray-300 text-sm">
                  <svg
                    className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span>뒤로가기</span>
                </div>
              </Link>
            </div>
            
            <h2 className="text-base font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent px-2 py-1 border-b border-pink-500/30">
              사용자 정의 AI
            </h2>
            
            <div className="w-32 flex justify-end">
              <div className="flex items-center gap-2 text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-lg text-xs border border-gray-700/50">
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" />
                <span>AI 온라인</span>
              </div>
            </div>
          </div>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              사용자 정의 AI ⚙️
            </span>
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            AI의 <span className="text-pink-400">역할과 행동</span>을 직접 정의해보세요.
            원하는 <span className="text-purple-400">시스템 메시지</span>를 설정하여 맞춤형 AI 경험을 만들어보세요.
          </p>
        </header>

        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/10 to-purple-600/10 rounded-3xl blur-lg" />
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 shadow-lg">
            <div className="mb-6">
              <label htmlFor="systemMessage" className="block text-sm font-medium text-gray-400 mb-2">
                시스템 메시지 (AI의 역할 정의)
              </label>
              <div className="relative">
                <textarea
                  id="systemMessage"
                  value={systemMessage}
                  onChange={(e) => setSystemMessage(e.target.value)}
                  placeholder="예: 당신은 친절한 영어 선생님입니다. 사용자의 영어 문장을 교정해주고 더 자연스러운 표현을 제안해주세요."
                  className={`w-full h-32 bg-gray-800/50 text-gray-200 rounded-xl border ${systemMessageSet ? 'border-pink-500/50' : 'border-gray-700/50'} p-4 focus:outline-none focus:border-pink-500/50 placeholder-gray-500 resize-none ${systemMessageSet ? 'opacity-70' : ''}`}
                  disabled={systemMessageSet}
                />
                {systemMessageSet && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 rounded-xl backdrop-blur-sm">
                    <div className="bg-gray-800 px-4 py-2 rounded-lg border border-pink-500/50 text-sm text-gray-300 flex items-center gap-2">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>시스템 메시지가 설정되었습니다</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                {!systemMessageSet ? (
                  <button
                    type="button"
                    onClick={handleSetSystemMessage}
                    className="relative group overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-medium shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                    <div className="relative flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>시스템 메시지 설정하기</span>
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetSystemMessage}
                    className="relative group overflow-hidden px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-sm font-medium border border-gray-700 shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-red-400/10 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                    <div className="relative flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>시스템 메시지 초기화</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {systemMessageSet && (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label htmlFor="userMessage" className="block text-sm font-medium text-gray-400 mb-2">
                    메시지 입력
                  </label>
                  <textarea
                    id="userMessage"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="AI에게 메시지를 입력하세요..."
                    className="w-full h-24 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700/50 p-4 focus:outline-none focus:border-pink-500/50 placeholder-gray-500 resize-none"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                    <div className="relative flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>처리 중...</span>
                        </>
                      ) : (
                        <>
                          <span>메시지 보내기</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {messages.length > 1 && (
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/10 to-purple-600/10 rounded-3xl blur-lg" />
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 shadow-lg">
              <h3 className="text-lg font-medium text-gray-300 mb-4">대화 내용</h3>
              
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {messages.filter(msg => msg.role !== 'system').map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`relative max-w-[80%] group ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-l-2xl rounded-tr-2xl'
                          : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 rounded-r-2xl rounded-tl-2xl border border-gray-700/50'
                      } p-4 shadow-lg transform hover:scale-[1.02] transition-all duration-200`}
                    >
                      <div className={`absolute inset-0 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-pink-400/10 to-purple-400/10'
                          : 'bg-gradient-to-br from-pink-900/5 to-purple-900/5'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl`} />
                      <div className="relative">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.timestamp && (
                          <span className="text-xs mt-2 block opacity-70">
                            {message.timestamp}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-900/30 rounded-xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-medium text-gray-300 mb-3">시스템 메시지 예시</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="font-medium text-pink-400 mb-1">영어 선생님</p>
              <p>당신은 친절한 영어 선생님입니다. 사용자의 영어 문장을 교정해주고 더 자연스러운 표현을 제안해주세요. 문법적 오류를 지적하고 개선된 문장을 제시해주세요.</p>
            </li>
            <li className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="font-medium text-pink-400 mb-1">요리 전문가</p>
              <p>당신은 요리 전문가입니다. 사용자가 요리에 관한 질문을 하면 상세한 레시피와 조리 방법, 팁을 알려주세요. 재료 대체 방법과 영양 정보도 함께 제공해주세요.</p>
            </li>
            <li className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <p className="font-medium text-pink-400 mb-1">심리 상담사</p>
              <p>당신은 공감 능력이 뛰어난 심리 상담사입니다. 사용자의 감정을 이해하고 지지해주세요. 판단하지 말고 경청하며, 도움이 될 수 있는 조언을 제공해주세요.</p>
            </li>
          </ul>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-500 bg-gray-900/30 px-4 py-2 rounded-lg inline-block border border-gray-800/50">
            OpenAI GPT-4o 기반 | 사용자 정의 AI
          </p>
        </footer>
      </div>
    </div>
  );
} 