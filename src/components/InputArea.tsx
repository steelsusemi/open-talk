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
      // 이전 상태 초기화
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      // 마이크 권한 요청 전에 상태 변경하지 않음
      setMessage(''); // 이전 메시지 초기화

      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        } 
      });

      // 권한이 승인된 후에 녹음 상태 변경
      setIsRecording(true);
      setRecordingProgress(0);
      setIsProcessing(false);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        // 실제 데이터가 있는 경우에만 저장
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          stream.getTracks().forEach(track => track.stop());
          
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          
          // 충분한 오디오 데이터가 있는 경우에만 처리
          if (audioChunks.length > 0) {
            const totalSize = audioChunks.reduce((size, chunk) => size + chunk.size, 0);
            if (totalSize > 5000) { // 5KB 이상의 데이터가 있는 경우만 처리
              const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
              await handleSpeechToText(audioBlob);
            } else {
              setMessage("음성이 감지되지 않았습니다. 다시 시도해주세요.");
            }
          } else {
            setMessage("음성이 감지되지 않았습니다. 다시 시도해주세요.");
          }
        } finally {
          setRecordingProgress(0);
          setIsRecording(false);
          mediaRecorderRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      updateProgress(Date.now());

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, recordingTime);
    } catch (error: unknown) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
      setRecordingProgress(0);
      setIsProcessing(false);
      
      // 권한 거부 또는 기타 오류에 대한 구체적인 메시지
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setMessage('마이크 사용 권한이 거부되었습니다. 권한을 허용해주세요.');
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setMessage('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
        } else {
          setMessage('마이크 접근 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } else {
        setMessage('마이크 접근 중 오류가 발생했습니다. 다시 시도해주세요.');
      }

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
      }
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // 음성 데이터 크기가 매우 작은 경우 (무음) 처리하지 않음
      if (audioBlob.size < 5000) {  // 5KB 미만인 경우 실제 음성이 없다고 판단
        setMessage("음성이 감지되지 않았습니다. 다시 시도해주세요.");
        return;
      }

      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('language', selectedLanguage);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Speech to text failed');

      const data = await response.json();
      
      // 실제 의미 있는 텍스트가 있는 경우에만 처리
      if (data.text && data.text.trim() && data.text.trim().length > 1) {
        onSendMessage(data.text.trim(), data.detectedLanguage || selectedLanguage);
      } else {
        setMessage("음성이 정확하게 인식되지 않았습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error('Speech to text error:', error);
      setMessage('음성 인식 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
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
                <div className="relative group flex-1">
                  <div className="absolute inset-0 rounded-xl blur-md transition-opacity duration-200 group-hover:opacity-100 opacity-75 bg-[conic-gradient(at_top_right,_#FF0080,_#7928CA,_#FF0080)]" />
                  <div className="absolute inset-0 rounded-xl opacity-50 mix-blend-overlay bg-gradient-to-br from-white/10 to-white/5 animate-pulse" />
                  <div className="relative px-4 py-2 rounded-xl transform transition-all duration-200 group-hover:translate-y-[-2px] group-hover:shadow-lg bg-[conic-gradient(at_top_right,_#FF0080,_#7928CA,_#FF0080)]">
                    <div className="absolute bottom-0 left-0 h-1.5 bg-white/90 rounded-full transition-all duration-200 backdrop-blur-sm shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ width: `${recordingProgress}%` }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] rounded-xl" />
                    <span className="relative flex items-center justify-center gap-3 text-white">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span className="font-semibold tracking-wide">녹음중... {Math.round((recordingTime - (recordingProgress / 100 * recordingTime)) / 1000)}초</span>
                      </span>
                      <div className="flex gap-1.5 ml-2">
                        <div className="w-1 h-6 bg-gradient-to-t from-white to-white/80 rounded-full animate-equalizer-1 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        <div className="w-1 h-6 bg-gradient-to-t from-white to-white/80 rounded-full animate-equalizer-2 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        <div className="w-1 h-6 bg-gradient-to-t from-white to-white/80 rounded-full animate-equalizer-3 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        <div className="w-1 h-6 bg-gradient-to-t from-white to-white/80 rounded-full animate-equalizer-1 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        <div className="w-1 h-6 bg-gradient-to-t from-white to-white/80 rounded-full animate-equalizer-2 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                      </div>
                    </span>
                  </div>
                </div>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 group-hover:from-white/10 group-hover:to-white/20 rounded-xl transition-colors" />
                  <span className="relative flex items-center justify-center gap-2 text-white font-medium">
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