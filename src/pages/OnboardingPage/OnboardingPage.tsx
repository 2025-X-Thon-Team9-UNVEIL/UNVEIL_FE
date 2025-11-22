import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Txt from '@/components/atoms/Text';

export default function OnboardingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/first');
    }, 5000); // 5초 후 FirstPage로 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <div className="flex flex-col items-center">
        <img src="/icons/logo.svg" alt="로고" className="w-40" />
        <Txt className="text-xl mt-12 mb-8 text-modal-font">보이지 않는 위험의 베일을 벗긴다</Txt>
      </div>
    </div>
  );
}
