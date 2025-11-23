import Txt from '@/components/atoms/Text';

interface MeasureItemProps {
  address: string;
  totalGrade: string;
  noiseGrade: string;
  lightGrade: string;
  cctvGrade: string;
}

export default function MeasureItem({ address, totalGrade, noiseGrade, lightGrade, cctvGrade }: MeasureItemProps) {
  return (
    <div className="w-[350px] h-full flex rounded-xl bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.15)] p-4 mb-6">
      <div className="flex items-center gap-5">
        {/* 등급 아이콘 */}
        <div className="w-[85px] h-[85px] rounded-xl bg-Semi-Red flex items-center justify-center flex-shrink-0">
          <Txt weight="bold" className="text-[50px] text-white">
            {totalGrade}
          </Txt>
        </div>

        {/* 주소 및 등급 정보 */}
        <div className="flex-1 flex flex-col gap-1">
          <Txt className="text-xl">{address}</Txt>
          <div className="flex flex-col gap-1">
            <Txt className="text-lg text-Semi-Red">소음 등급: {noiseGrade}</Txt>
            <Txt className="text-lg text-Semi-Red">가로등 등급: {lightGrade}</Txt>
            <Txt className="text-lg text-Semi-Red">안전도 등급: {cctvGrade}</Txt>
          </div>
        </div>
      </div>
    </div>
  );
}
