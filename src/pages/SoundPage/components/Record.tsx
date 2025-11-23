import { useState, useRef, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios'; // 또는 사용 중인 axiosInstance
import bad_audio from '@/assets/audio/test_bad_room.wav';
import good_audio from '@/assets/audio/test_good_room.wav';
import normal_audio from '@/assets/audio/test_normal_room.wav';
import test_audio from '@/assets/audio/measurement_signal_5s.wav';
import speakerIcon from '@/assets/icon-speaker.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import arrowIcon from '@/assets/icon-arrow-left.svg';

import { Mic, AudioLines, RotateCcw } from 'lucide-react';

const COLORS = {
  primary: '#FF6B6B', // 메인 코랄 핑크
  primarySoft: 'rgba(13, 9, 9, 0.2)', // 연한 파동 색상
  secondary: '#FF8E8E',
  bg: '#FFFFFF',
  text: '#333333',
  gray: '#F3F4F6',
};

const RecordingVisualizer = ({ isRecording, progress }: { isRecording: boolean; progress: number }) => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* 배경 파동 애니메이션 (토스 스타일의 은은한 퍼짐) */}
      {isRecording && (
        <>
          <div className="absolute w-full h-full rounded-full bg-red-400 opacity-20 animate-ping-slow" />
          <div className="absolute w-[80%] h-[80%] rounded-full bg-red-400 opacity-20 animate-ping-slower delay-75" />
        </>
      )}

      {/* 6초 프로그레스 서클 (SVG) */}
      <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke={COLORS.gray} strokeWidth="4" />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="289.02" // 2 * PI * r (46)
          strokeDashoffset={289.02 - (289.02 * progress) / 100}
          className="transition-all duration-100 ease-linear"
        />
      </svg>
    </div>
  );
};

// 스타일링을 위한 컴포넌트들 (가정)
// import Header from '@/components/Header';
// import Button from '@/components/Button';
interface RecordProps {
  onAnalysisComplete: (rank: string) => void;
}

const Record = ({ onAnalysisComplete }: RecordProps) => {
  const show_download = false; // 다운로드 버튼 표시 여부 조절용 플래그

  // 🔊 [추가] 녹음된 오디오 URL을 저장할 state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState('00:00.00');
  const [status, setStatus] = useState('측정 대기 중');


   const RECORDING_DURATION = 5700;
  // 레퍼런스 설정
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  // 🔊 테스트용 사운드 파일 로드 (경로는 실제 파일 위치에 맞게 수정)
  const testAudio = useRef(new Audio(test_audio));

  // 타이머 로직
  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const diff = now - startTimeRef.current;

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      const milliseconds = Math.floor((diff % 1000) / 10);

      setTimer(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`,
      );
    }, 10);
  };

  //uuiu
   const [progress, setProgress] = useState(0); // 0 ~ 100%

  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      setTimer('00:00.00');
    }
  };

  // 🎤 녹음 시작 핸들러
  const handleStartRecording = async () => {
    try {
      setStatus('마이크 초기화 중...');

      // 1. 마이크 권한 획득 (반향 분석을 위한 핵심 설정)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // 🔥 필수: 에코 캔슬링 끔 (반향 녹음 위해)
          noiseSuppression: false, // 🔥 필수: 잡음 제거 끔
          autoGainControl: false, // 🔥 필수: 자동 볼륨 조절 끔
          sampleRate: 44100, // 고음질 (일부 모바일 호환성 위해 생략 가능)
        },
      });

      streamRef.current = stream;

      // 2. RecordRTC 설정 (WAV 포맷)
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder, // WAV 생성을 위한 설정
        numberOfAudioChannels: 1, // 분석용은 모노(1)로 충분 (용량 절약)
        desiredSampRate: 44100, // CD 음질
      });

      // 3. 녹음 시작
      recorderRef.current.startRecording();
      startTimer();
      setIsRecording(true);
      setStatus('데이터 수집 중... 잠시만 기다려주세요.');
      console.log('마이크 권한 획득 및 녹음 시작');

      // 4. 0.5초 뒤 테스트 사운드 재생 (녹음기가 켜진 후 소리가 나야 함)
      setTimeout(() => {
        testAudio.current.play().catch((e) => console.error('오디오 재생 실패', e));

        setTimeout(() => {
          // 테스트 사운드가 재생되고 5.2초 뒤 실행 (녹음 종료)
          handleStopRecording();
        }, 5200);
      }, 500);
      console.log('녹음 시작');
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      setStatus('마이크 권한이 필요합니다.');
    }
  };

  // ⏹️ 녹음 종료 및 전송 핸들러
  const handleStopRecording = () => {
    if (!recorderRef.current) return;

    setStatus('녹음 종료. 파일 변환 중...');
    stopTimer();
    setIsRecording(false);

    // 녹음 중지
    recorderRef.current.stopRecording(() => {
      // 1. Blob 추출 (WAV 형식)
      const blob = recorderRef.current!.getBlob();

      // 2. File 객체로 변환
      const file = new File([blob], 'room_acoustics.wav', { type: 'audio/wav' });

      // ==========================================================
      // 👇 [핵심] 백엔드 전송 대신, 브라우저에서 바로 확인하는 로직
      // ==========================================================

      // 1. 브라우저에서 재생 가능한 URL 생성
      const url = URL.createObjectURL(blob);
      setAudioUrl(url); // state에 저장해서 UI에 표시

      console.log(`파일 생성 완료: ${file.size} bytes`);

      // 2. 콘솔에 파일 정보 출력 (WAV인지, 용량이 잡히는지 확인)
      console.log('=== 녹음 파일 정보 ===');
      console.log('파일명:', file.name);
      console.log('파일 타입:', file.type); // 'audio/wav' 여야 함
      console.log('파일 크기:', file.size, 'bytes'); // 0이면 녹음 안 된 것

      // 3. 스트림 정리 (마이크 끄기)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // 4. 백엔드 전송
      sendToBackend(file);
    });
  };

  // 🚀 백엔드 전송 함수
  const sendToBackend = async (file: File) => {
    setStatus('서버로 전송 중...');

    const formData = new FormData();
    formData.append('body', file); // 백엔드에서 받을 키 이름 ('file')

    try {
      // 실제 API 엔드포인트로 변경해주세요
      const response = await axios.post(
        'https://port-0-unveil-ai-mia4sbpyf7bf2574.sel3.cloudtype.app/api/noise',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      console.log('업로드 성공:', response.data);
      const resultRank = response.data.result.grade;
      console.log('등급:', resultRank);
      onAnalysisComplete(resultRank); // 부모 컴포넌트에 등급 전달
      setStatus('분석 완료!');
    } catch (error) {
      console.error('업로드 실패:', error);
      setStatus('전송 실패. 다시 시도해주세요.');
    }
  };

  const handleReset = () => {
    setAudioUrl(null);
    setProgress(0);
    setStatus('버튼을 눌러 측정을 시작하세요');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans overflow-hidden relative px-6">
      <style>{`
        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ping-slower {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slower { animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>

      <header className="flex items-center p-6 pb-2">
        <button className="text-gray-400 text-lg">←</button>
      </header>

      <main className="flex flex-col items-center  flex-1 px-6">
        {/* 타이머 */}
        <div className="text-gray-400 text-xl font-mono mb-10">{timer}</div>
        {/* 메인 인터랙티브 UI 영역 */}
        <div className="relative flex items-center justify-center">
          {/* 1. 배경 비주얼라이저 (녹음 중일 때만 파동 & 타이머 보임) */}
          <div className={`absolute transition-opacity duration-500 ${isRecording ? 'opacity-100' : 'opacity-0'}`}>
            <RecordingVisualizer isRecording={isRecording} progress={progress} />
          </div>

          {/* 2. 중앙 메인 버튼 */}
          <button
            onClick={audioUrl ? handleReset : handleStartRecording}
            disabled={isRecording}
            className={`
              relative z-10 w-24 h-24 rounded-full flex items-center justify-center
              transition-all duration-300
              ${
                isRecording
                  ? 'bg-white border-4 border-[#FF6B6B] shadow-none cursor-default scale-95' // 녹음 중: 그림자 제거, 크기 약간 축소, 클릭 금지 커서
                  : audioUrl
                    ? 'bg-[#FF6B6B] text-white shadow-xl hover:scale-105 active:scale-95' // 완료
                    : 'bg-[#FF6B6B] text-white shadow-xl hover:scale-105 active:scale-95' // 대기
              }
            `}>
            {/* 아이콘 스위칭 */}
            {isRecording ? (
              // 녹음 중일 때: 정지 버튼(네모) 대신 '소리 파형' 아이콘 사용
              <AudioLines size={32} fill="#FF6B6B" color="#FF6B6B" className="animate-pulse opacity-80" />
            ) : audioUrl ? (
              <AudioLines size={32} /> // 다시하기 아이콘
            ) : (
              <Mic size={36} />
            )}
          </button>
        </div>

        {/* 하단 설명 텍스트 (녹음 중일 때 페이드 인) */}
        {/*  녹음이 끝나면 나타나는 확인용 플레이어 & 다운로드 버튼 */}
        {show_download && audioUrl && (
          <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center gap-4">
            <p className="font-bold text-sm text-gray-600">녹음 결과 확인 (백엔드 전송 전)</p>

            {/* 1. 바로 들어보기 */}
            <audio src={audioUrl} controls className="w-60" />

            {/* 👇 새 탭에서 열기 버튼 */}
            <button
              className="text-blue-500 underline text-sm"
              onClick={() => {
                const newWindow = window.open(audioUrl, '_blank');
                if (!newWindow) alert('팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.');
              }}>
              WAV 파일 새 탭에서 열기
            </button>

            {/* 2. 내 컴퓨터/폰으로 다운로드해서 확인하기 */}
            <a href={audioUrl} download="room_acoustics.wav" className="text-blue-500 underline text-sm">
              WAV 파일 다운로드
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default Record;
