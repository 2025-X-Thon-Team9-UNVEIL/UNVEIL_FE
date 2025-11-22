import Button from '@/components/atoms/Button';
import Txt from '@/components/atoms/Text';
import { Link, useNavigate } from 'react-router-dom';

export default function FirstPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-col items-center">
        <img src="/icons/logo.svg" alt="로고" className="w-40" />
        <Txt className="text-xl mt-12">로그인하고</Txt>
        <Txt weight="bold" className="text-xl mt-1 mb-8">
          더양한 서비스를 이용하세요.
        </Txt>
      </div>
      <Button
        className="w-[300px] bg-Semi-Red text-white mt-4"
        onClick={() => {
          navigate('/signin', {});
        }}>
        @ 이메일로 로그인 하기
      </Button>
      <div className="flex items-center justify-center pt-6">
        <Txt weight="medium" className="text-Icon-Detail text-base">
          가입한 계정이 이미 있으신가요?
        </Txt>
        <Link to="/signup" className="ml-11.5 pb-1">
          <Txt
            weight="medium"
            className="text-Icon-Detail align-middle text-base leading-none underline underline-offset-2">
            회원가입
          </Txt>
        </Link>
      </div>
    </div>
  );
}
