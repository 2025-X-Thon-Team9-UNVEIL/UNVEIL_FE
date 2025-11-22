import Txt from '@/components/atoms/Text';

interface SafetyScoreCardProps {
  lightGrade: string;
  cctvGrade: string;
}

export default function SafetyScoreCard({ lightGrade, cctvGrade }: SafetyScoreCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-[0_0_4px_0_rgba(0,0,0,0.15)] p-6">
      <div className="flex items-center justify-between gap-4">
        {/* 가로등 */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="w-20 h-16 flex items-center justify-center">
            <img src="/icons/lamp.svg" alt="가로등" className="w-90 h-90" />
          </div>
          <Txt className="text-xl text-Hana-Black">가로등: {lightGrade}</Txt>
        </div>
        {/* 구분선 */}
        <div className="w-px h-30 bg-Box-Line flex-shrink-0"></div>
        {/* CCTV */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="w-25 h-16 flex items-center justify-center">
            <img src="/icons/cctv.svg" alt="CCTV" className="w-90 h-90" />
          </div>
          <Txt className="text-xl text-Hana-Black">CCTV: {cctvGrade}</Txt>
        </div>
      </div>
    </div>
  );
}
