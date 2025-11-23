import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Txt from '@/components/atoms/Text';
import { useState, type FormEvent } from 'react';
import { login } from '@/apis/auth';

export default function SigninPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, /*error*/ setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      // console.log('서버 응답 데이터:', data);

      const { accessToken, refreshToken } = data.result;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', email);

      navigate('/main');
    } catch (err) {
      console.error(err);
      setError('이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen pt-[91px]">
      {/* 로고 */}
      <div className="flex items-center gap-2 ">
        <img src="/icons/logo.svg" alt="로고" className="w-40" />
      </div>

      {/* 폼 컨테이너 */}
      <div className="mt-11 w-[300px]">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* 이메일 */}
          <div>
            <label className="block">
              <Txt weight="semibold" className="text-Hana-Black text-xl">
                이메일
              </Txt>
            </label>
            <Input
              type="email"
              placeholder="이메일"
              autoComplete="email"
              required
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-Hana-Black placeholder:text-Icon-Detail mt-2.5 mb-[35px] h-12 w-75 pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block">
              <Txt weight="semibold" className="text-Hana-Black text-xl">
                비밀번호
              </Txt>
            </label>
            <Input
              type="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              required
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-Hana-Black placeholder:text-Icon-Detail mt-2.5 mb-12.5 h-12 w-75 pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg"
            />
          </div>

          {/* 로그인 버튼 */}
          <Button className="h-11 w-75 text-xl bg-Semi-Red" type="submit">
            로그인
          </Button>

          {/* 회원가입으로 이동 */}
          <div className="flex items-center justify-center pt-[64px]">
            <Txt weight="medium" className="text-Icon-Detail text-base leading-none">
              계정이 없으신가요?
            </Txt>

            <Link to="/signup" className="ml-11.5 pb-1">
              <Txt
                weight="medium"
                className="text-Icon-Detail align-middle text-base leading-none underline underline-offset-2">
                회원가입
              </Txt>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
