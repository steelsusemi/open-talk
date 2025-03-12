import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Image from 'next/image';
import { ReactNode } from 'react';

interface BlogPreviewProps {
  content: string;
  createdAt: string;
}

// 타입 정의 개선
type CodeProps = {
  inline?: boolean;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
};

type ComponentProps = {
  [key: string]: unknown;
  children?: ReactNode;
};

const BlogPreview: React.FC<BlogPreviewProps> = ({ content, createdAt }) => {
  const [copied, setCopied] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
  };

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="relative bg-gray-900/70 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden"
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm text-gray-400 mb-1">생성된 블로그</div>
            <div className="text-sm text-gray-500">{formattedDate}</div>
          </div>
          <button
            onClick={handleCopy}
            className={`${
              showCopyButton || copied ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-200 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg flex items-center space-x-2`}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>복사됨</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>복사하기</span>
              </>
            )}
          </button>
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              code({ inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="my-4 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                      {match[1]}
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-200" {...props}>
                    {children}
                  </code>
                );
              },
              h1: (props: ComponentProps) => (
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 mt-8 pb-2 border-b border-gray-800" {...props} />
              ),
              h2: (props: ComponentProps) => (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mt-10 mb-4 pb-1 border-b border-gray-800/50" {...props} />
              ),
              h3: (props: ComponentProps) => (
                <h3 className="text-xl md:text-2xl font-semibold text-gray-200 mt-8 mb-3" {...props} />
              ),
              h4: (props: ComponentProps) => (
                <h4 className="text-lg md:text-xl font-semibold text-gray-300 mt-6 mb-2" {...props} />
              ),
              p: (props: ComponentProps) => (
                <p className="text-gray-300 leading-relaxed mb-4" {...props} />
              ),
              ul: (props: ComponentProps) => (
                <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2" {...props} />
              ),
              ol: (props: ComponentProps) => (
                <ol className="list-decimal pl-6 mb-6 text-gray-300 space-y-2" {...props} />
              ),
              li: (props: ComponentProps) => (
                <li className="mb-1" {...props} />
              ),
              blockquote: (props: ComponentProps) => (
                <blockquote className="border-l-4 border-purple-500 pl-4 py-3 my-6 bg-gray-800/50 rounded-r-lg text-gray-300 italic" {...props} />
              ),
              a: (props: ComponentProps) => (
                <a className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer" {...props} />
              ),
              img: (props: ComponentProps) => {
                const { alt, ...rest } = props;
                const altText = typeof alt === 'string' ? alt : '블로그 이미지';
                
                return (
                  <div className="my-6 rounded-lg overflow-hidden bg-gray-800/50 p-1 border border-gray-700/50">
                    <img 
                      className="max-w-full rounded-lg mx-auto" 
                      alt={altText}
                      width={800}
                      height={600}
                      loading="lazy"
                      {...rest} 
                    />
                    {altText !== "블로그 이미지" && (
                      <p className="text-center text-sm text-gray-400 mt-2">{altText}</p>
                    )}
                  </div>
                );
              },
              table: (props: ComponentProps) => (
                <div className="my-8 overflow-x-auto rounded-lg border border-gray-700/50">
                  <table className="min-w-full divide-y divide-gray-700 bg-gray-800/30" {...props} />
                </div>
              ),
              thead: (props: ComponentProps) => (
                <thead className="bg-gray-800" {...props} />
              ),
              th: (props: ComponentProps) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />
              ),
              td: (props: ComponentProps) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-t border-gray-700/30" {...props} />
              ),
              tr: (props: ComponentProps) => (
                <tr className="bg-transparent even:bg-gray-800/20" {...props} />
              ),
              hr: (props: ComponentProps) => (
                <hr className="my-10 border-gray-700/50 border-dashed" {...props} />
              ),
              strong: (props: ComponentProps) => (
                <strong className="font-bold text-blue-300" {...props} />
              ),
              em: (props: ComponentProps) => (
                <em className="italic text-purple-300" {...props} />
              ),
              del: (props: ComponentProps) => (
                <del className="line-through text-gray-500" {...props} />
              ),
              // 추가 마크다운 요소 지원
              sup: (props: ComponentProps) => (
                <sup className="text-xs text-gray-400" {...props} />
              ),
              sub: (props: ComponentProps) => (
                <sub className="text-xs text-gray-400" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview; 