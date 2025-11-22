import Txt from '@/components/atoms/Text';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import MeasureItem from './components/MeasureItem';

export default function MeasurePage() {
  const navigate = useNavigate();

  const measurements = [
    {
      id: 1,
      address: '서울 중구 필동로1길 30',
      noiseGrade: 'A',
      safetyGrade: 'B',
      totalGrade: 'A',
    },
    {
      id: 2,
      address: '서울 중구 필동로1길 13',
      noiseGrade: 'C',
      safetyGrade: 'C',
      totalGrade: 'C',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-20 w-full bg-white">
        <div className="relative flex h-[56px] items-center justify-center">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-4 flex items-center">
            <img src="/icons/back.svg" alt="뒤로가기" className="w-3" />
          </button>
          <Txt className="text-xl">측정 목록</Txt>
        </div>
      </header>

      {/* 측정 목록 */}
      <main className="flex-1 px-5 pt-18 pb-20">
        {measurements.length === 0 ? (
          <Txt weight="medium" className="text-xl">
            측정한 내역이 없습니다
          </Txt>
        ) : (
          measurements.map((measurement) => (
            <MeasureItem
              key={measurement.id}
              address={measurement.address}
              totalGrade={measurement.totalGrade}
              noiseGrade={measurement.noiseGrade}
              safetyGrade={measurement.safetyGrade}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}
