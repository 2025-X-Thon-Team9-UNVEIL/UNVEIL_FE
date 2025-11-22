import Txt from '@/components/atoms/Text';

interface TriangleGradeCardProps {
  soundGrade: string;
  cctvGrade: string;
  lightGrade: string;
  totalGrade: string;
}

// 등급에 따른 색상
const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A':
      return 'bg-[#B0D2FF]';
    case 'B':
      return 'bg-[#C8B0FF]';
    case 'C':
      return 'bg-[#FFE682]';
    case 'D':
      return 'bg-[#FEAAAB]';
    case 'F':
      return 'bg-[#FF7070]';
    default:
      return 'bg-[#E5E7EB]';
  }
};

// 등급 점수 변환
const gradeToScore = (grade: string): number => {
  switch (grade) {
    case 'A':
      return 5;
    case 'B':
      return 4;
    case 'C':
      return 3;
    case 'D':
      return 2;
    case 'F':
      return 1;
    default:
      return 0;
  }
};

// 점수를 등급으로 변환
const scoreToGrade = (score: number): string => {
  const avg = score / 3;
  if (avg >= 4.5) return 'A';
  if (avg >= 3.5) return 'B';
  if (avg >= 2.5) return 'C';
  if (avg >= 1.5) return 'D';
  return 'F';
};

export default function TriangleGradeCard({ soundGrade, cctvGrade, lightGrade, totalGrade }: TriangleGradeCardProps) {
  return (
    <div className="relative w-full max-w-[350px] mx-auto py-8 px-4">
      {/* 삼각형 컨테이너 */}
      <div className="relative w-full h-[350px] max-w-[320px] mx-auto">
        {/* 삼각형 배경 (더 명확하게) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 173" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <polygon
            points="100,10 190,163 10,163"
            fill="url(#triangleGradient)"
            stroke="#FF5C7A"
            strokeWidth="1"
            className="opacity-60"
          />
        </svg>

        {/* 상단 꼭짓점 - 음향 등급 (정확한 위치) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
          <div
            className={`w-18 h-18 rounded-full ${getGradeColor(soundGrade)} flex items-center justify-center shadow-xl`}>
            <Txt weight="bold" className="text-2xl text-white">
              {soundGrade}
            </Txt>
          </div>
          <Txt weight="medium" className="text-sm text-Hana-Black text-center whitespace-nowrap">
            음향
          </Txt>
        </div>

        {/* 하단 왼쪽 꼭짓점 - CCTV 등급 (정확한 위치) */}
        <div className="absolute bottom-4 left-0 translate-x-2 translate-y-2 flex flex-col items-center gap-2 z-10">
          <div
            className={`w-18 h-18 rounded-full ${getGradeColor(cctvGrade)} flex items-center justify-center shadow-xl`}>
            <Txt weight="bold" className="text-2xl text-white">
              {cctvGrade}
            </Txt>
          </div>
          <Txt weight="medium" className="text-sm text-center whitespace-nowrap">
            CCTV
          </Txt>
        </div>

        {/* 하단 오른쪽 꼭짓점 - 가로등 등급 (정확한 위치) */}
        <div className="absolute bottom-4 right-0 -translate-x-2 translate-y-2 flex flex-col items-center gap-2 z-10">
          <div
            className={`w-18 h-18 rounded-full ${getGradeColor(lightGrade)} flex items-center justify-center shadow-xl`}>
            <Txt weight="bold" className="text-2xl text-white">
              {lightGrade}
            </Txt>
          </div>
          <Txt weight="medium" className="text-sm text-Hana-Black text-center whitespace-nowrap">
            가로등
          </Txt>
        </div>

        {/* 중앙 - 최종 등급 (더 크고 강조) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20">
          <div
            className={`w-28 h-28 rounded-full ${getGradeColor(totalGrade)} flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-gray-100`}>
            <Txt weight="bold" className="text-5xl text-white">
              {totalGrade}
            </Txt>
          </div>
          <Txt weight="bold" className="text-xl text-Hana-Black text-center">
            종합 등급
          </Txt>
        </div>

        {/* 연결선 (선택사항 - 더 명확한 삼각형 느낌) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 200 173"
          preserveAspectRatio="xMidYMid meet">
          <line
            x1="100"
            y1="10"
            x2="100"
            y2="90"
            stroke="#d1d5db"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.4"
          />
          <line
            x1="100"
            y1="10"
            x2="20"
            y2="163"
            stroke="#d1d5db"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.4"
          />
          <line
            x1="100"
            y1="10"
            x2="180"
            y2="163"
            stroke="#d1d5db"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}

// 최종 등급 계산 함수
export const calculateTotalGrade = (soundGrade: string, cctvGrade: string, lightGrade: string): string => {
  const soundScore = gradeToScore(soundGrade);
  const cctvScore = gradeToScore(cctvGrade);
  const lightScore = gradeToScore(lightGrade);

  const totalScore = soundScore + cctvScore + lightScore;
  return scoreToGrade(totalScore);
};
