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
      setStatus('녹음 중... 소리가 재생됩니다.');
      console.log('마이크 권한 획득 및 녹음 시작');

      // 4. 0.5초 뒤 테스트 사운드 재생 (녹음기가 켜진 후 소리가 나야 함)
      setTimeout(() => {
        testAudio.current.play().catch((e) => console.error('오디오 재생 실패', e));
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

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="flex flex-col items-center  flex-1 px-6">
        {/* 타이머 */}
        <div className="text-gray-400 text-xl font-mono mb-10">{timer}</div>

        {/* 파형 비주얼라이저 (더미 UI - 실제 연동하려면 Canvas 필요) */}
        <div className="w-full h-12 flex items-center justify-center gap-1 mb-20 overflow-hidden">
          {isRecording ? (
            /* 녹음 중일 때 움직이는 애니메이션 (CSS로 구현 가능) */
            Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-1 bg-red-400 animate-pulse" style={{ height: `${Math.random() * 100}%` }}></div>
            ))
          ) : (
            /* 대기 상태 점선 */
            <div className="text-red-300 tracking-widest">................................</div>
          )}
        </div>

        {/* 녹음 버튼 */}
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${
            isRecording ? 'border-gray-300 bg-white' : 'border-gray-300 bg-white'
          }`}>
          <div
            className={`rounded transition-all ${
              isRecording
                ? 'w-8 h-8 bg-red-500 rounded-sm' // 정지 아이콘 (네모)
                : 'w-10 h-10 bg-red-500 rounded-full' // 녹음 아이콘 (원)
            }`}
          />
        </button>
        <p className="mt-4 text-gray-500 text-sm">{status}</p>

        {/* 👇 [추가] 녹음이 끝나면 나타나는 확인용 플레이어 & 다운로드 버튼 */}
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
