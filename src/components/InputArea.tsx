import { FC, FormEvent, useState, useRef } from 'react';

interface InputAreaProps {
  onSendMessage: (message: string, detectedLanguage?: string) => void;
  isLoading: boolean;
}

const LANGUAGES = [
  { code: '', name: '자동 감지' },
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

const RECORDING_TIMES = [
  { value: 5000, label: '5초' },
  { value: 10000, label: '10초' },
  { value: 20000, label: '20초' },
];

const InputArea: FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(5000);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message, selectedLanguage);
      setMessage('');
    }
  };

  const updateProgress = (startTime: number) => {
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / recordingTime) * 100;
      setRecordingProgress(Math.min(progress, 100));

      if (elapsed >= recordingTime) {
        clearInterval(progressIntervalRef.current!);
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }
    }, 100);
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingProgress(0);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        } 
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        await handleSpeechToText(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        setRecordingProgress(0);
        setIsRecording(false);
      };

      mediaRecorder.start();
      updateProgress(Date.now());

      // 오디오 피드백 방지를 위해 오디오 요소 제거
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }

      // 선택된 시간 후 자동 종료
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, recordingTime);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
      setRecordingProgress(0);
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    if (!isRecording) return; // 녹음이 취소된 경우 처리하지 않음
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('language', selectedLanguage);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Speech to text failed');

      const data = await response.json();
      // 음성 인식 결과를 바로 전송
      if (data.text) {
        onSendMessage(data.text.trim(), data.detectedLanguage || selectedLanguage);
      }
    } catch (error) {
      console.error('Speech to text error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      // 녹음 중지 및 리소스 정리
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null; // 미디어 레코더 초기화
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // 상태 초기화
      setRecordingProgress(0);
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative mt-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl -z-10" />
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="relative bg-gray-900/50 text-gray-200 rounded-xl border border-gray-700/50 px-4 py-2 focus:outline-none focus:border-blue-500/50 backdrop-blur-xl"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <select
              value={recordingTime}
              onChange={(e) => setRecordingTime(Number(e.target.value))}
              className="relative bg-gray-900/50 text-gray-200 rounded-xl border border-gray-700/50 px-4 py-2 focus:outline-none focus:border-blue-500/50 backdrop-blur-xl"
            >
              {RECORDING_TIMES.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
            {isRecording ? (
              <div className="flex gap-2 flex-1">
                <button
                  type="button"
                  className="relative group flex-1"
                >
                  <div className="absolute inset-0 rounded-xl blur-md transition-opacity duration-200 group-hover:opacity-100 opacity-75 bg-red-600" />
                  <div className="relative px-4 py-2 rounded-xl transform transition-all duration-200 group-hover:translate-y-[-2px] group-hover:shadow-lg bg-red-600">
                    <div className="absolute bottom-0 left-0 h-1 bg-white rounded-full transition-all duration-200" style={{ width: `${recordingProgress}%` }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 to-red-400/0 group-hover:from-red-400/10 group-hover:to-red-400/10 rounded-xl transition-colors" />
                    <span className="relative flex items-center justify-center gap-2 text-white">
                      <span className="animate-pulse">녹음중... {Math.round((recordingTime - (recordingProgress / 100 * recordingTime)) / 1000)}초</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white animate-equalizer-1" />
                        <div className="w-1 h-4 bg-white animate-equalizer-2" />
                        <div className="w-1 h-4 bg-white animate-equalizer-3" />
                      </div>
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="relative group px-4"
                >
                  <div className="absolute inset-0 rounded-xl blur-md transition-opacity duration-200 group-hover:opacity-100 opacity-75 bg-gray-600" />
                  <div className="relative px-4 py-2 rounded-xl transform transition-all duration-200 group-hover:translate-y-[-2px] group-hover:shadow-lg bg-gray-600">
                    <span className="relative flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                disabled={isProcessing || isLoading}
                className="relative group flex-1"
              >
                <div className="absolute inset-0 rounded-xl blur-md transition-opacity duration-200 group-hover:opacity-100 opacity-75 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="relative px-4 py-2 rounded-xl transform transition-all duration-200 group-hover:translate-y-[-2px] group-hover:shadow-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-xl transition-colors" />
                  <span className="relative flex items-center justify-center gap-2 text-white">
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        변환중...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        음성 입력
                      </>
                    )}
                  </span>
                </div>
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur" />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="relative w-full p-4 bg-gray-900/50 text-gray-200 placeholder-gray-400 rounded-2xl border border-gray-700/50 focus:outline-none focus:border-blue-500/50 backdrop-blur-xl transition-colors"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md transition-opacity duration-200 group-hover:opacity-100 opacity-75" />
              <div className="relative px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl transform transition-all duration-200 group-hover:translate-y-[-2px] group-hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-xl transition-colors" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      전송 중...
                    </>
                  ) : (
                    <>
                      전송
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputArea; 