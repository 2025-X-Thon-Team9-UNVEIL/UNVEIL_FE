import Txt from '@/components/atoms/Text';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import MeasureItem from './components/MeasureItem';
import { useEffect, useState } from 'react';
import { getLocationList } from '@/apis/location';

interface Measurement {
  id: number;
  address: string;
  noiseGrade: string;
  lightGrade: string;
  cctvGrade: string;
  totalGrade: string;
}

export default function MeasurePage() {
  const navigate = useNavigate();

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [, /*loading*/ setLoading] = useState(true);

  // const measurements = [
  //   {
  //     id: 1,
  //     address: '서울 중구 필동로1길 30',
  //     noiseGrade: 'A',
  //     lightGrade: 'B',
  //     cctvGrade: 'B',
  //     totalGrade: 'A',
  //   },
  //   {
  //     id: 2,
  //     address: '서울 중구 필동로1길 13',
  //     noiseGrade: 'C',
  //     lightGrade: 'B',
  //     cctvGrade: 'B',
  //     totalGrade: 'C',
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLocationList(0, 100);

        if (data && data.locationList) {
          // 서버 데이터(Level) -> 화면 데이터(Grade) 매핑
          const mappedData = data.locationList.map((item, index) => ({
            id: index,
            address: item.address,
            noiseGrade: item.noiseLevel,
            lightGrade: item.streetlightLevel,
            cctvGrade: item.cctvLevel,
            totalGrade: item.score,
          }));
          setMeasurements(mappedData);
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              lightGrade={measurement.lightGrade}
              cctvGrade={measurement.cctvGrade}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}
