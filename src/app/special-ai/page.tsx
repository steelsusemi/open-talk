'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 특별 역할 AI 기능 목록
const specialAIFeatures = [
  {
    id: 'emoji-generator',
    title: '이모지 생성기',
    description: '텍스트를 입력하면 텍스트에 맞는 이모지를 생성합니다.',
    icon: '😀',
    systemMessage: 'You will be provided with text, and your task is to translate it into emojis. Do not use any regular text. Do your best with emojis only.'
  },
  {
    id: 'color-generator',
    title: '컬러 팔레트 생성기',
    description: '텍스트를 입력하면 분위기에 맞는 3가지 색상 팔레트를 생성하고 표시합니다.',
    icon: '🎨',
    systemMessage: 'You will be provided with a description of a mood, and your task is to generate 3 different CSS colors that match it. Write your output in json with a key called "colors" containing an array of 3 objects. Each object should have a "css_code" key with the color value (hex, rgb, or hsl) and a "name" key with a short descriptive name for the color.'
  },
  {
    id: 'translator',
    title: '번역 앱',
    description: '한국어를 영어, 일본어, 중국어, 프랑스어로 번역합니다.',
    icon: '🌐',
    systemMessage: 'You will be provided with a sentence in Korean, and your task is to translate it into the selected language.'
  },
  {
    id: 'custom-system',
    title: '사용자 정의 AI',
    description: '원하는 시스템 메시지를 직접 설정하여 AI의 역할을 정의합니다.',
    icon: '⚙️',
    systemMessage: ''
  }
];

export default function SpecialAIPage() {
  const router = useRouter();
  
  // 선택한 기능으로 이동하는 함수
  const navigateToFeature = (featureId: string) => {
    router.push(`/special-ai/${featureId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F]">
      {/* 우주적인 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900/50 to-gray-900/80" />
        <div className="stars absolute inset-0" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 py-6 max-w-6xl">
        <nav className="mb-10 flex items-center justify-center">
          <div className="w-full max-w-6xl flex items-center justify-between bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-800/50 px-4 py-2">
            <div className="w-32 flex justify-start">
              <Link
                href="/"
                className="group relative px-3 py-1.5 overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg" />
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
            </div>
            
            <h2 className="text-base font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent px-2 py-1 border-b border-purple-500/30">
              특별 역할 AI
            </h2>
            
            <div className="w-32 flex justify-end">
              <div className="flex items-center gap-2 text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-lg text-xs border border-gray-700/50">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                <span>AI 온라인</span>
              </div>
            </div>
          </div>
        </nav>

        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              특별 역할 AI
            </span>
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            다양한 역할을 가진 AI와 대화하며 특별한 경험을 해보세요.
            각 AI는 고유한 <span className="text-purple-400">시스템 메시지</span>로 프롬프팅되어 
            <span className="text-blue-400"> 특화된 기능</span>을 제공합니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {specialAIFeatures.map((feature) => (
            <div 
              key={feature.id}
              onClick={() => navigateToFeature(feature.id)}
              className="relative group cursor-pointer perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative transform-gpu transition-all duration-500 group-hover:rotate-y-6">
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-lg transform-gpu transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-start gap-6">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl blur-md" />
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 flex items-center justify-center">
                        <span className="text-4xl">{feature.icon}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center">
                        <span className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          시작하기
                        </span>
                        <div className="relative ml-2">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                          <svg 
                            className="relative w-5 h-5 transform-gpu transition-all duration-500 group-hover:translate-x-2"
                            fill="none" 
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: '#fff' }}
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M13 7l5 5m0 0l-5 5m5-5H6" 
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-center">
          <div className="inline-block backdrop-blur-xl bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
            <p className="text-gray-400 mb-3 font-medium">
              © 2024 OpenAI 웹앱. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              이 웹앱은 Next.js 15와 OpenAI API를 활용하여 제작되었습니다.
              <br />각 AI 기능은 특별한 시스템 메시지로 프롬프팅되어 있습니다.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 