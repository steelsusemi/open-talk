'use client';

import { useState } from 'react';
import ChatWindow from '@/components/ChatWindow';
import InputArea from '@/components/InputArea';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: string;
  audioData?: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('');
  const [useVoice, setUseVoice] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');

  const VOICE_OPTIONS = [
    { id: 'alloy', name: 'Alloy (중성적)', description: '중립적이고 균형 잡힌 목소리' },
    { id: 'echo', name: 'Echo (중성적)', description: '깊이 있고 안정적인 목소리' },
    { id: 'fable', name: 'Fable (남성)', description: '부드럽고 친근한 남성 목소리' },
    { id: 'onyx', name: 'Onyx (남성)', description: '권위 있고 전문적인 남성 목소리' },
    { id: 'nova', name: 'Nova (여성)', description: '전문적이고 친근한 여성 목소리' },
    { id: 'shimmer', name: 'Shimmer (여성)', description: '밝고 상냥한 여성 목소리' },
  ];

  const playAudioResponse = (audioData: string) => {
    const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
    audio.play();
  };

  const handleSendMessage = async (content: string, language?: string) => {
    if (language && language !== currentLanguage) {
      setCurrentLanguage(language);
    }

    const newUserMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString(),
      language: language || currentLanguage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          language: language || currentLanguage,
          useVoice,
          selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      
      const newAssistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toLocaleTimeString(),
        language: language || currentLanguage,
        audioData: data.audioData,
      };

      setMessages((prev) => [...prev, newAssistantMessage]);

      if (data.audioData) {
        playAudioResponse(data.audioData);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '죄송합니다. 메시지 처리 중 오류가 발생했습니다.',
        timestamp: new Date().toLocaleTimeString(),
        language: language || currentLanguage,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F]">
      {/* 우주적인 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/50 to-gray-900/80" />
        <div className="stars absolute inset-0" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 py-6 max-w-4xl">
        <nav className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="group relative px-4 py-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg" />
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
              <span>메인으로</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-gray-400 bg-gray-900/30 px-3 py-1.5 rounded-lg text-xs border border-gray-800/50">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>AI 시스템 온라인</span>
          </div>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI 인터랙티브 챗봇
            </span>
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            <span className="text-blue-400">AI 기술</span>로 구동되는 지능형 대화 시스템으로
            <span className="text-purple-400"> 음성 인식</span>과 함께 자연스러운 대화를 시작해보세요.
          </p>
        </header>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-lg" />
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-4 border border-gray-800/50 shadow-lg">
            <div className="flex items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-gray-400 text-sm">
                  <input
                    type="checkbox"
                    checked={useVoice}
                    onChange={(e) => setUseVoice(e.target.checked)}
                    className="form-checkbox h-3.5 w-3.5 text-blue-500 rounded border-gray-700 bg-gray-800 focus:ring-blue-400"
                  />
                  <span>음성 답변</span>
                </label>
                {useVoice && (
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="bg-gray-800/50 text-gray-300 text-sm rounded-lg border border-gray-700/50 px-3 py-1.5 focus:outline-none focus:border-blue-400"
                  >
                    {VOICE_OPTIONS.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {useVoice && (
                <div className="text-xs text-gray-500">
                  {VOICE_OPTIONS.find(v => v.id === selectedVoice)?.description}
                </div>
              )}
            </div>
            <ChatWindow messages={messages} />
            <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>

        <footer className="mt-6 text-center">
          <p className="text-xs text-gray-500 bg-gray-900/30 px-4 py-2 rounded-lg inline-block border border-gray-800/50">
            OpenAI GPT-3.5 기반 | AI 생성 응답
          </p>
        </footer>
      </div>
    </div>
  );
} 