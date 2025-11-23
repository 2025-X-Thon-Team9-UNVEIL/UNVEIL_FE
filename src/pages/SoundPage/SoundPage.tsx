import { useState, useRef, useEffect } from 'react';
import speakerIcon from '@/assets/icon-speaker.svg';
import arrowIcon from '@/assets/icon-arrow-left.svg';
import Record from './components/Record';
import RankCard from './components/RankCard';
import { useNavigate } from 'react-router-dom';
import Txt from '@/components/atoms/Text';

// 스타일링을 위한 컴포넌트들 (가정)
// import Header from '@/components/Header';
// import Button from '@/components/Button';

const SoundPage = () => {
  const [rank, setRank] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnalysisComplete = (newRank: string) => {
    setRank(newRank); // 상태가 업데이트되면 화면이 리렌더링되면서 RankCard가 보입니다.
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 헤더 (뒤로가기 등) */}
      <header className="fixed top-0 left-0 right-0 z-20 w-full bg-white">
        <div className="relative flex h-[56px] items-center justify-center">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-4 flex items-center">
            <img src="/icons/back.svg" alt="뒤로가기" className="w-3" />
          </button>
          <Txt className="text-xl">소음 측정</Txt>
        </div>
      </header>

      <main className="flex flex-col items-center  flex-1 px-6 mt-[56px]  mb-4">
        {/* 안내 박스 */}
        <div className="bg-semi-pink border border-Semi-Red rounded-xl p-4 w-full mb-[29px] mt-[31px]">
          <div className="flex items-center gap-[5px] mb-[4px]">
            <img src={speakerIcon} alt="Speaker Icon" className="w-[14px] h-[14px]" />
            <p className="text-Semi-Red font-bold">소음 측정 방법</p>
          </div>
          <p className="text-Semi-Red font-regular text-[15px]">
            조용한 상태에서 테스트를 시작하세요.
            <br />핑 소리를 재생하고 반향음을 분석하여 약 6초간 방의 방음 및 소음 수준을 측정합니다.
          </p>
        </div>
        <div className="w-full flex-1 flex flex-col items-center">
          {rank === null ? <Record onAnalysisComplete={handleAnalysisComplete} /> : <RankCard rank={rank} />}
        </div>
      </main>
    </div>
  );
};

export default SoundPage;
