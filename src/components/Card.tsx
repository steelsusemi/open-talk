import Link from 'next/link';
import { FC } from 'react';

interface CardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const Card: FC<CardProps> = ({ title, description, icon, link }) => {
  return (
    <Link href={link} className="block group perspective-1000">
      <div className="relative transform-gpu transition-all duration-500 group-hover:rotate-y-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transform-gpu transition-transform duration-500 group-hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="relative p-8">
          <div className="absolute -top-6 -left-6 w-20 h-20">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50">
                <span className="absolute inset-0 flex items-center justify-center text-4xl">
                  {icon}
                </span>
              </div>
            </div>
          </div>
          <div className="ml-16 mt-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-500 mb-3">
              {title}
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-4 transform-gpu transition-all duration-500 group-hover:translate-x-2">
              {description}
            </p>
            <div className="flex items-center">
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-500">
                바로가기
              </span>
              <div className="relative ml-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
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
    </Link>
  );
};

export default Card; 