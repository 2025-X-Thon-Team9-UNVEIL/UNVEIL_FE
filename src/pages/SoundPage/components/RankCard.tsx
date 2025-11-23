import mikeIcon from '@/assets/icon-rankcard-mike.svg'; // 사용자가 제공한 아이콘 경로
import { useLocation, useNavigate } from 'react-router-dom';

interface RankCardProps {
  rank: string; // 1: A등급, 2: B등급, 3: C등급, 4: D등급 (가정)
}

// 등급별로 보여줄 텍스트와 색상 정보를 정의합니다.
const RANK_DETAILS: Record<
  string,
  {
    grade: string;
    title: string;
    desc: string;
    color: string; // 텍스트 색상 (Tailwind 클래스)
    bgColor: string; // (선택사항) 배경이나 테두리 색상
  }
> = {
  A: {
    grade: 'A',
    title: '흡음 환경 (Safe)',
    desc: '소음이 잘 차단되는 매우 조용한 방입니다!',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  B: {
    grade: 'B',
    title: '콘크리트/조적벽',
    desc: '일반적인 수준의 무난한 방음 성능입니다.',
    color: 'text-Semi-Red',
    bgColor: 'bg-red-50',
  },
  C: {
    grade: 'C',
    title: '가벽/중공벽 의심',
    desc: '벽이 얇아 웅웅거림이 심하고 이웃 소음이 들릴 수 있습니다.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  D: {
    grade: 'D',
    title: '반사성 표면 (Glass/Tile)',
    desc: '욕실이나 창가처럼 소리가 날카롭게 많이 울립니다.',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

const RankCard = ({ rank }: RankCardProps) => {
  const currentRank = RANK_DETAILS[rank];

  const location = useLocation();
  const Address = location.state?.address || '주소정보 없음';

  const navigate = useNavigate();

  const handleGoToResult = () => {
    // 다음 페이지 전송 정보
    navigate('/safety', {
      state: {
        address: Address,
        noiseLevel: rank,
      },
    });
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <div className="relative flex w-full  flex-col items-center justify-center rounded-[20px] border border-gray-100 bg-white p-8 shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] mt-[29px]">
        <div className="mb-6 animate-bounce-slow">
          <img src={mikeIcon} alt="Rank Icon" className="h-24 w-24 object-contain" />
        </div>
        <div className={`mb-4 text-xl font-bold ${currentRank.color}`}>소음 등급: {currentRank.grade}</div>

        <div className={`mb-6 text-lg font-bold ${currentRank.color}`}>{currentRank.title}</div>

        <div className={`break-keep text-center text-sm font-medium leading-relaxed ${currentRank.color}`}>
          {currentRank.desc}
        </div>
      </div>

      <button className="flex flex-col gap-[1px] w-full text-center text-white bg-Semi-Red rounded-[10px] py-4 mt-6" onClick={handleGoToResult}>
        <p className="text-white text-[20px]">안전도 분석 하러가기</p>
        <p className="text-white text-[14px]">가로등과 CCTV가 없는 위치를 확인하세요</p>
      </button>
    </div>
  );
};

export default RankCard;
