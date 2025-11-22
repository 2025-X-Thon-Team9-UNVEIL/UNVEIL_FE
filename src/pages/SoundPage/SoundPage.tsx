import { useState, useRef, useEffect } from 'react';
import speakerIcon from '@/assets/icon-speaker.svg';
import arrowIcon from '@/assets/icon-arrow-left.svg';
import Record from './components/Record';
import RankCard from './components/RankCard';

// 스타일링을 위한 컴포넌트들 (가정)
// import Header from '@/components/Header';
// import Button from '@/components/Button';

const SoundPage = () => {
  const [rank, setRank] = useState<string | null>(null);

  const handleAnalysisComplete = (newRank: string) => {
    setRank(newRank); // 상태가 업데이트되면 화면이 리렌더링되면서 RankCard가 보입니다.
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 상단 헤더 (뒤로가기 등) */}
      <header className="flex items-center p-4 mb-[31px]">
        <button className="text-xl">
          <img src={arrowIcon} alt="Back" className="w-[8px] h-[16px]" />
        </button>
        <h1 className="ml-[135px] text-[20px]">소음 측정</h1>
      </header>

      <main className="flex flex-col items-center  flex-1 px-6">
        {/* 안내 박스 */}
        <div className="bg-semi-pink border border-Semi-Red rounded-xl p-4 w-full mb-[90px]">
          <div className="flex items-center gap-[5px] mb-[4px]">
            <img src={speakerIcon} alt="Speaker Icon" className="w-[14px] h-[14px]" />
            <p className="text-Semi-Red font-bold">소음 측정 방법</p>
          </div>
          <p className="text-Semi-Red text-[15px]">
            조용한 상태에서 테스트를 시작하세요.
            <br />핑 소리를 재생하고 반향음을 분석하여 방의 방음 및 소음 수준을 측정합니다.
          </p>
        </div>
        <div className="w-full flex-1 flex flex-col items-center">
          {rank === null ? (
            <Record onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <div className="flex flex-col items-center px-6 mb-10">
              <RankCard rank={rank} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SoundPage;
