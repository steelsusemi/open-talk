'use client';

import { useState } from 'react';
import BlogForm, { BlogFormData } from '@/components/BlogForm';
import BlogPreview from '@/components/BlogPreview';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface BlogResponse {
  content: string;
  topic: string;
  createdAt: string;
}

export default function BlogAiPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [blogResponse, setBlogResponse] = useState<BlogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<BlogFormData | null>(null);

  const handleGenerateBlog = async (formData: BlogFormData) => {
    setIsLoading(true);
    setError(null);
    setCurrentFormData(formData); // 현재 폼 데이터 저장
    
    try {
      // AbortController를 사용하여 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); // 55초 후 요청 중단
      
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId); // 타임아웃 해제
      
      // 응답이 JSON이 아닌 경우 처리
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('서버에서 유효한 응답을 받지 못했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '블로그 생성 중 오류가 발생했습니다.');
      }
      
      setBlogResponse(data);
    } catch (err) {
      console.error('블로그 생성 오류:', err);
      
      // 오류 메시지 개선
      let errorMessage = '블로그 생성 중 오류가 발생했습니다.';
      
      if (err instanceof DOMException && err.name === 'AbortError') {
        errorMessage = '요청 시간이 초과되었습니다. 더 짧은 길이로 다시 시도해주세요.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
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

      <div className="relative container mx-auto px-4 py-16">
        <nav className="mb-10 flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center justify-between bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-800/50 px-4 py-2">
            <div className="w-32 flex justify-start">
              <Link
                href="/"
                className="group relative px-3 py-1.5 overflow-hidden rounded-lg"
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
            </div>
            
            <h2 className="text-base font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-2 py-1 border-b border-blue-500/30">
              AI 블로그 작성기
            </h2>
            
            <div className="w-32 flex justify-end">
              <div className="flex items-center gap-2 text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-lg text-xs border border-gray-700/50">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>AI 온라인</span>
              </div>
            </div>
          </div>
        </nav>

        <header className="text-center mb-12">
          <div className="inline-block mb-6">
            <h1 className="relative text-4xl font-black">
              <span className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl" />
              <span className="relative bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI 블로그 작성기
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed backdrop-blur-xl bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
            주제, 톤, 길이 등을 설정하고 AI가 SEO에 최적화된 블로그 글을 자동으로 작성해드립니다.
            프로페셔널한 콘텐츠를 몇 분 안에 생성해보세요.
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="backdrop-blur-xl bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-200 mb-6">블로그 설정</h2>
              <BlogForm onSubmit={handleGenerateBlog} isLoading={isLoading} />
            </div>

            <div>
              {error && (
                <div className="backdrop-blur-xl bg-red-900/30 p-6 rounded-2xl border border-red-700/50 shadow-lg mb-6">
                  <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-red-200">오류 발생</h3>
                  </div>
                  <p className="mt-2 text-red-200">{error}</p>
                </div>
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  <div className="text-xl font-medium">블로그 생성 중...</div>
                  <div className="text-gray-500 max-w-md">
                    블로그 생성에는 약 30-60초가 소요될 수 있습니다. 
                    {currentFormData && (
                      <div className="mt-2">
                        <p>주제: {currentFormData.topic}</p>
                        <p>스타일: {currentFormData.tone}</p>
                        <p>길이: {currentFormData.length}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!isLoading && blogResponse && (
                <div className="mt-8">
                  <BlogPreview content={blogResponse.content} createdAt={blogResponse.createdAt} />
                </div>
              )}

              {!isLoading && !blogResponse && !error && (
                <div className="backdrop-blur-xl bg-gray-900/50 p-8 rounded-2xl border border-gray-700/50 shadow-lg flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 mb-6 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">
                    블로그 미리보기
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    왼쪽 설정 패널에서 블로그 주제와 옵션을 입력하고 생성 버튼을 클릭하면 
                    이 곳에 생성된 블로그가 표시됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center">
          <div className="inline-block backdrop-blur-xl bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
            <p className="text-gray-400 mb-2 font-medium">
              © 2024 AI 블로그 작성기. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              이 서비스는 OpenAI API를 활용하여 제작되었습니다.
              <br />생성된 콘텐츠는 추가 편집이 필요할 수 있습니다.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 