'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EmojiGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [emojiResult, setEmojiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCopySuccess(false);

    try {
      const response = await fetch('/api/special-ai/emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          systemMessage: 'You will be provided with text, and your task is to translate it into emojis. Do not use any regular text. Do your best with emojis only.'
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      setEmojiResult(data.result);
    } catch (err) {
      console.error('Error:', err);
      setError('이모지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!emojiResult) return;
    
    navigator.clipboard.writeText(emojiResult)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(() => {
        setError('클립보드 복사에 실패했습니다.');
      });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F]">
      {/* 우주적인 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-gray-900/50 to-gray-900/80" />
        <div className="stars absolute inset-0" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 py-6 max-w-4xl">
        <nav className="mb-10 flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center justify-between bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-800/50 px-4 py-2">
            <div className="w-32 flex justify-start">
              <Link
                href="/special-ai"
                className="group relative px-3 py-1.5 overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-lg" />
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
            
            <h2 className="text-base font-medium bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent px-2 py-1 border-b border-yellow-500/30">
              이모지 생성기
            </h2>
            
            <div className="w-32 flex justify-end">
              <div className="flex items-center gap-2 text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-lg text-xs border border-gray-700/50">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                <span>AI 온라인</span>
              </div>
            </div>
          </div>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              이모지 생성기 🎭
            </span>
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            텍스트를 입력하면 AI가 <span className="text-yellow-400">텍스트의 의미</span>를 분석하여
            <span className="text-orange-400"> 이모지로 변환</span>합니다. 문장, 단어, 개념 등 다양한 텍스트를 시도해보세요!
          </p>
        </header>

        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-3xl blur-lg" />
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-400 mb-2">
                  변환할 텍스트
                </label>
                <textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="여기에 이모지로 변환할 텍스트를 입력하세요..."
                  className="w-full h-32 bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700/50 p-4 focus:outline-none focus:border-yellow-500/50 placeholder-gray-500 resize-none"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-medium shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                  <div className="relative flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>변환 중...</span>
                      </>
                    ) : (
                      <>
                        <span>이모지로 변환</span>
                        <span className="text-xl">✨</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-700/50 rounded-xl text-red-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {emojiResult && (
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-3xl blur-lg" />
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-300">변환 결과</h3>
                <button
                  onClick={copyToClipboard}
                  className="relative group px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-sm border border-gray-700/50 transform transition-all duration-200 hover:scale-[1.05]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                  <div className="relative flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>{copySuccess ? '복사됨!' : '복사하기'}</span>
                  </div>
                </button>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <p className="text-4xl leading-relaxed text-center break-words">
                  {emojiResult}
                </p>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                이모지는 텍스트의 의미를 기반으로 생성되었습니다. 결과가 마음에 들지 않으면 다른 텍스트로 시도해보세요.
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-900/30 rounded-xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-medium text-gray-300 mb-3">사용 팁</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>구체적인 문장이나 개념을 입력할수록 더 정확한 이모지가 생성됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>감정, 행동, 사물, 장소 등 다양한 주제를 시도해보세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>생성된 이모지는 복사하여 메시지나 소셜 미디어에 활용할 수 있습니다.</span>
            </li>
          </ul>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-500 bg-gray-900/30 px-4 py-2 rounded-lg inline-block border border-gray-800/50">
            OpenAI GPT-4o 기반 | 이모지 생성 AI
          </p>
        </footer>
      </div>
    </div>
  );
} 