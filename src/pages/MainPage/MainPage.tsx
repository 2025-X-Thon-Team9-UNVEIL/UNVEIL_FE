import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Text';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/location');
  };

  return (
    <div className="flex flex-col bg-white -mt-[47px]">
      <div className="flex flex-col items-center flex-1 pt-0">
        <Txt weight="bold" className="w-[341px] text-2xl mb-8 text-left">
          보이지 않던 자취 리스크,
          <br />
          이제는 미리 보고 고르세요.
        </Txt>

        <div className="w-[341px] rounded-xl bg-banner-purple p-6 mb-7 cursor-pointer" onClick={handleNext}>
          <div className="flex items-center justify-center mb-4">
            <img src="/icons/home.svg" alt="진단" className="w-30" />
          </div>
          <Txt weight="bold" className="text-xl mb-1 text-center block">
            자취방 진단하러 가기
          </Txt>

          <div className="space-y-2 text-center">
            <Txt weight="medium" className="text-sm">
              1단계: 소음 측정
            </Txt>
            <br />
            <Txt weight="medium" className="text-sm">
              2단계: 안전도 분석
            </Txt>
          </div>
        </div>

        <Button
          className="w-[341px] h-[67px] bg-banner-blue mb-7"
          textClassName="text-Hana-Black"
          onClick={() => navigate('/measure')}>
          측정 목록 보러가기
        </Button>

        <div className="w-[402px] h-[196px] bg-[#FFF5F8] p-6 pl-12">
          <div className="flex items-center gap-4 h-full">
            <img src="/icons/logo.svg" alt="로고" className="w-30" />
            <Txt weight="bold" className="text-xl text-left text-Semi-Red pt-13">
              소음, 위험 걱정없는
              <br />
              완벽한 방 구하기
            </Txt>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
