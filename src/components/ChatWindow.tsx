import { FC, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-6 h-[600px] overflow-hidden border border-gray-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-900/10 via-purple-900/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-900/10 via-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="h-full overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-xl animate-pulse delay-100" />
              <svg
                className="relative w-full h-full text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-xl font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI와 대화를 시작해보세요!
            </p>
            <p className="text-gray-500 mt-2">
              질문이나 대화를 입력하시면 AI가 답변해드립니다.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`relative max-w-[80%] group ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-l-2xl rounded-tr-2xl'
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 rounded-r-2xl rounded-tl-2xl border border-gray-700/50'
                  } p-4 shadow-lg transform hover:scale-[1.02] transition-all duration-200`}
                >
                  <div className={`absolute inset-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-400/10 to-purple-400/10'
                      : 'bg-gradient-to-br from-blue-900/5 to-purple-900/5'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl`} />
                  <div className="relative">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs mt-2 block opacity-70">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow; 