import { useState, FormEvent } from 'react';

interface BlogFormProps {
  onSubmit: (formData: BlogFormData) => void;
  isLoading: boolean;
}

export interface BlogFormData {
  topic: string;
  tone: string;
  length: string;
  keywords: string;
  targetAudience: string;
  seoOptimize: boolean;
}

const TONE_OPTIONS = [
  { id: '전문적', label: '전문적', description: '학술적이고 권위 있는 톤' },
  { id: '친근한', label: '친근한', description: '대화체로 편안한 느낌' },
  { id: '열정적', label: '열정적', description: '활기차고 에너지 넘치는 톤' },
  { id: '유머러스', label: '유머러스', description: '재미있고 가벼운 톤' },
  { id: '감성적', label: '감성적', description: '감정에 호소하는 톤' },
];

const LENGTH_OPTIONS = [
  { id: '짧음', label: '짧음', description: '약 500자 내외' },
  { id: '중간', label: '중간', description: '약 1000자 내외' },
  { id: '긴 글', label: '긴 글', description: '약 2000자 이상' },
];

const AUDIENCE_OPTIONS = [
  { id: '일반', label: '일반 독자', description: '특별한 배경지식 없는 일반인' },
  { id: '전문가', label: '전문가', description: '해당 분야의 전문 지식을 가진 사람' },
  { id: '초보자', label: '초보자', description: '해당 주제에 입문하는 사람' },
  { id: '학생', label: '학생', description: '학업 목적의 독자' },
  { id: '비즈니스', label: '비즈니스', description: '비즈니스 관련 의사 결정자' },
];

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<BlogFormData>({
    topic: '',
    tone: '전문적',
    length: '중간',
    keywords: '',
    targetAudience: '일반',
    seoOptimize: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-lg font-medium text-gray-200 mb-2">
            블로그 주제 <span className="text-red-400">*</span>
          </label>
          <textarea
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            placeholder="블로그 글의 주제를 입력하세요. 예: '인공지능의 미래와 윤리적 고려사항'"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tone" className="block text-lg font-medium text-gray-200 mb-2">
              글의 톤
            </label>
            <div className="relative">
              <select
                id="tone"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {TONE_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {TONE_OPTIONS.find(o => o.id === formData.tone)?.description}
            </p>
          </div>

          <div>
            <label htmlFor="length" className="block text-lg font-medium text-gray-200 mb-2">
              글의 길이
            </label>
            <div className="relative">
              <select
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {LENGTH_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {LENGTH_OPTIONS.find(o => o.id === formData.length)?.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="keywords" className="block text-lg font-medium text-gray-200 mb-2">
              키워드 (쉼표로 구분)
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="인공지능, 윤리, 미래기술"
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <p className="mt-1 text-sm text-gray-400">
              SEO에 중요한 키워드를 쉼표로 구분하여 입력하세요
            </p>
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-lg font-medium text-gray-200 mb-2">
              대상 독자
            </label>
            <div className="relative">
              <select
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {AUDIENCE_OPTIONS.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {AUDIENCE_OPTIONS.find(o => o.id === formData.targetAudience)?.description}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="seoOptimize"
            name="seoOptimize"
            checked={formData.seoOptimize}
            onChange={handleCheckboxChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
          />
          <label htmlFor="seoOptimize" className="ml-2 block text-lg font-medium text-gray-200">
            SEO 최적화
          </label>
          <div className="ml-2 group relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-gray-200 text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              검색 엔진 최적화를 위한 메타 설명, 제목 구조, 키워드 배치 등을 포함합니다.
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              블로그 생성 중...
            </>
          ) : (
            <>
              <span className="mr-2">✨</span>
              블로그 생성하기
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogForm; 