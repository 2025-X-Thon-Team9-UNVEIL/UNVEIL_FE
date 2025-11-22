import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Text';
import { useNavigate, useLocation } from 'react-router-dom';
import TriangleGradeCard, { calculateTotalGrade } from './components/TriangleGradeCard';
import Footer from '@/components/Footer';

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // SafetyPage에서 전달받은 데이터
  const address = (location.state as { address?: string } | null)?.address || '';
  const cctvGrade = (location.state as { cctvGrade?: string } | null)?.cctvGrade || 'F';
  const lightGrade = (location.state as { lightGrade?: string } | null)?.lightGrade || 'F';

  // 음향 등급 더미 데이터 (실제로는 음향 측정 결과를 받아와야 함)
  const soundGrade = 'B'; // 더미 데이터

  // 최종 등급 계산
  const totalGrade = calculateTotalGrade(soundGrade, cctvGrade, lightGrade);

  // 측정 목록에 추가 핸들러
  const handleAddToList = () => {
    if (isSaved || isLoading) return;

    setIsLoading(true);

    // TODO: 백엔드 연결
    // 백엔드로 데이터 전송
    // await axiosInstance.post('/measurements', {
    //   address,
    //   soundGrade,
    //   cctvGrade,
    //   lightGrade,
    //   totalGrade,
    // });

    // 임시로 성공 처리
    setTimeout(() => {
      setIsSaved(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-[402px] bg-white">
      <header className="fixed top-0 left-0 right-0 z-20 w-full bg-white">
        <div className="relative flex h-[56px] items-center justify-center">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-4 flex items-center">
            <img src="/icons/back.svg" alt="뒤로가기" className="w-3" />
          </button>
          <Txt className="text-xl">최종 결과</Txt>
        </div>
      </header>

      {/* 주소 표시 */}
      <div className="fixed top-[56px] left-0 right-0 z-20 w-full px-4 pt-4 pb-2 bg-white">
        <Button className="w-full bg-button-pink border border-semi-red text-white">{address}</Button>
      </div>

      {/* 삼각형 등급 카드 */}
      <div className="pt-[170px] pb-8">
        <TriangleGradeCard
          soundGrade={soundGrade}
          cctvGrade={cctvGrade}
          lightGrade={lightGrade}
          totalGrade={totalGrade}
        />
      </div>

      <div className="px-4 pb-8">
        <Button
          className={`w-full mt-4 ${isSaved ? 'bg-Box-Line text-white cursor-not-allowed' : 'bg-Semi-Red text-white'}`}
          onClick={handleAddToList}
          disabled={isSaved || isLoading}>
          {isLoading ? '추가 중...' : isSaved ? '추가 완료' : '측정 목록에 추가'}
        </Button>
      </div>
      <Footer />
    </div>
  );
}
