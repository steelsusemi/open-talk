'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ColorCode {
  css_code: string;
  name?: string;
}

interface ColorResult {
  colors: ColorCode[];
}

export default function ColorGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [colorResult, setColorResult] = useState<ColorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState<{[key: number]: boolean}>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('텍스트를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCopySuccess({});

    try {
      const response = await fetch('/api/special-ai/color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          systemMessage: 'You will be provided with a description of a mood, and your task is to generate 3 different CSS colors that match it. Write your output in json with a key called "colors" containing an array of 3 objects. Each object should have a "css_code" key with the color value (hex, rgb, or hsl) and a "name" key with a short descriptive name for the color.'
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      
      try {
        // JSON 파싱 시도
        let parsedResult;
        if (typeof data.result === 'string') {
          parsedResult = JSON.parse(data.result);
        } else {
          parsedResult = data.result;
        }
        
        // 결과가 예상한 형식인지 확인
        if (!parsedResult.colors || !Array.isArray(parsedResult.colors)) {
          // 형식이 다르면 변환 시도
          if (parsedResult.css_code) {
            // 단일 색상 결과를 배열로 변환
            setColorResult({
              colors: [{ css_code: parsedResult.css_code, name: '생성된 색상' }]
            });
          } else {
            throw new Error('색상 데이터 형식이 올바르지 않습니다.');
          }
        } else {
          setColorResult(parsedResult);
        }
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        setError('색상 데이터 파싱 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('색상 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (cssCode: string, index: number) => {
    navigator.clipboard.writeText(cssCode)
      .then(() => {
        setCopySuccess(prev => ({ ...prev, [index]: true }));
        setTimeout(() => {
          setCopySuccess(prev => ({ ...prev, [index]: false }));
        }, 2000);
      })
      .catch(() => {
        setError('클립보드 복사에 실패했습니다.');
      });
  };

  // 색상 코드에서 RGB 값 추출
  const extractRgbValues = (cssCode: string) => {
    // HEX 코드인 경우
    if (cssCode.startsWith('#')) {
      const hex = cssCode.replace('#', '');
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return { r, g, b };
      } else if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
      }
    }
    
    // RGB 코드인 경우
    const rgbMatch = cssCode.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return { r, g, b };
    }
    
    // 기본값 반환
    return { r: 0, g: 0, b: 0 };
  };

  // 텍스트 색상 대비를 위한 밝기 계산
  const calculateBrightness = (r: number, g: number, b: number) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // 색상 결과 표시 스타일
  const getColorStyle = (cssCode: string) => {
    const { r, g, b } = extractRgbValues(cssCode);
    const brightness = calculateBrightness(r, g, b);
    
    return {
      backgroundColor: cssCode,
      color: brightness > 128 ? '#000000' : '#FFFFFF',
    };
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F]">
      {/* 우주적인 배경 효과 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-gray-900/50 to-gray-900/80" />
        <div className="stars absolute inset-0" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/5 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 py-6 max-w-4xl">
        <nav className="mb-10 flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center justify-between bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-800/50 px-4 py-2">
            <div className="w-32 flex justify-start">
              <Link
                href="/special-ai"
                className="group relative px-3 py-1.5 overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-indigo-600/10 rounded-lg" />
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
            
            <h2 className="text-base font-medium bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent px-2 py-1 border-b border-teal-500/30">
              컬러 생성기
            </h2>
            
            <div className="w-32 flex justify-end">
              <div className="flex items-center gap-2 text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-lg text-xs border border-gray-700/50">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                <span>AI 온라인</span>
              </div>
            </div>
          </div>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">
              컬러 팔레트 생성기 🎨
            </span>
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            텍스트를 입력하면 AI가 <span className="text-teal-400">텍스트의 분위기</span>를 분석하여
            <span className="text-indigo-400"> 어울리는 3가지 색상</span>을 생성합니다. 감정, 장소, 계절 등 다양한 키워드를 시도해보세요!
          </p>
        </header>

        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-600/10 to-indigo-600/10 rounded-3xl blur-lg" />
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-400 mb-2">
                  색상으로 표현할 분위기나 감정
                </label>
                <input
                  id="inputText"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="예: 차분한 바다, 따뜻한 가을, 활기찬 아침..."
                  className="w-full bg-gray-800/50 text-gray-200 rounded-xl border border-gray-700/50 p-4 focus:outline-none focus:border-teal-500/50 placeholder-gray-500"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-medium shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                  <div className="relative flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>생성 중...</span>
                      </>
                    ) : (
                      <>
                        <span>색상 팔레트 생성하기</span>
                        <span className="text-xl">🎭</span>
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

        {colorResult && colorResult.colors && colorResult.colors.length > 0 && (
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-600/10 to-indigo-600/10 rounded-3xl blur-lg" />
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-800/50 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-300">생성된 색상 팔레트</h3>
                <div className="text-sm text-gray-400">
                  <span className="bg-gray-800 px-3 py-1 rounded-lg border border-gray-700/50">
                    {inputText}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {colorResult.colors.map((color, index) => (
                  <div key={index} className="space-y-4">
                    <div 
                      className="rounded-xl overflow-hidden shadow-lg h-40 flex items-center justify-center transition-all duration-500 hover:shadow-2xl"
                      style={getColorStyle(color.css_code)}
                    >
                      <div className="text-center p-6">
                        <p className="text-xl font-bold mb-2">{color.name || `색상 ${index + 1}`}</p>
                        <p className="text-base opacity-80">{color.css_code}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-400">CSS 코드</h4>
                        <button
                          onClick={() => copyToClipboard(color.css_code, index)}
                          className="relative group px-2 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs border border-gray-700/50 transform transition-all duration-200 hover:scale-[1.05]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                          <div className="relative flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>{copySuccess[index] ? '복사됨!' : '복사'}</span>
                          </div>
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-2 font-mono text-xs overflow-x-auto">
                        <pre className="text-teal-400">background-color: <span className="text-indigo-400">{color.css_code};</span></pre>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-5 gap-1">
                        {[0.2, 0.4, 0.6, 0.8, 1].map((opacity, opIndex) => {
                          const { r, g, b } = extractRgbValues(color.css_code);
                          const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                          
                          return (
                            <div key={opIndex} className="flex flex-col items-center">
                              <div 
                                className="w-full h-6 rounded-md"
                                style={{ backgroundColor: rgbaColor }}
                              />
                              <span className="text-xs text-gray-500 mt-1">{opacity * 100}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                <h4 className="text-sm font-medium text-gray-300 mb-2">팔레트 활용 팁</h4>
                <p className="text-xs text-gray-400">
                  이 색상 팔레트는 웹 디자인, 그래픽 디자인, 인테리어 등 다양한 분야에서 활용할 수 있습니다. 
                  주요 색상으로 강조하고 보조 색상으로 균형을 맞추어 사용해보세요.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-900/30 rounded-xl p-6 border border-gray-800/50">
          <h3 className="text-lg font-medium text-gray-300 mb-3">사용 팁</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-teal-400 mt-0.5">•</span>
              <span>구체적인 감정이나 분위기를 입력할수록 더 정확한 색상이 생성됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 mt-0.5">•</span>
              <span>계절, 자연, 감정, 장소 등 다양한 키워드를 시도해보세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 mt-0.5">•</span>
              <span>생성된 3가지 색상은 서로 조화를 이루는 팔레트로 디자인에 활용할 수 있습니다.</span>
            </li>
          </ul>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-500 bg-gray-900/30 px-4 py-2 rounded-lg inline-block border border-gray-800/50">
            OpenAI GPT-4o 기반 | 컬러 팔레트 생성 AI
          </p>
        </footer>
      </div>
    </div>
  );
} 