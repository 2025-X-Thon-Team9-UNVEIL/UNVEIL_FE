import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import Txt from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import profileIcon from '@/assets/icon-profile-gray.svg';

const MyPage = () => {
  const navigate = useNavigate();

  const isLoggedIn = useMemo(() => Boolean(localStorage.getItem('accessToken')), []);
  const userEmail = useMemo(() => localStorage.getItem('userEmail') ?? '로그인이 필요해요', []);

  const onLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    alert('로그아웃되었어요.');
    navigate('/signin');
  };

  return (
    <div className="flex min-h-screen flex-col w-[402px] bg-pink-50">
      <header className="fixed top-0 left-0 right-0 z-20 w-full bg-white">
        <div className="relative flex h-[56px] items-center justify-center">
          <button type="button" onClick={() => navigate(-1)} className="absolute left-4 flex items-center">
            <img src="/icons/back.svg" alt="뒤로가기" className="w-3" />
          </button>
          <Txt className="text-xl">마이페이지</Txt>
        </div>
      </header>

      <main className="flex-1 w-full pb-24 pt-8">
        <section className="relative bg-semi-pink p-5">
          <div className="relative flex items-center gap-4">
            <img src={profileIcon} alt="프로필" className="h-16 w-16" />
            <div className="flex flex-col gap-1">
              <Txt weight="bold" className="text-2xl">
                {isLoggedIn ? '반가워요!' : '어서오세요'}
              </Txt>
              <Txt className="text-sm text-black">{isLoggedIn ? userEmail : '로그인하고 이용하세요'}</Txt>
            </div>
          </div>

          <div className="relative mt-4 flex gap-2">
            <Button
              className="h-11 w-full bg-Semi-Red"
              textClassName="text-base"
              onClick={() => (isLoggedIn ? onLogout() : navigate('/signin'))}>
              {isLoggedIn ? '로그아웃' : '로그인하기'}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyPage;
