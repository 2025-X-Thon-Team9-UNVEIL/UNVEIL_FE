import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Txt from '@/components/atoms/Text';
import { useState, type FormEvent } from 'react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인 검증
    if (password !== secondPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    // ✅ 여기서부터는 실제 API 연동 시에만 작성
    // 예: signup(name, email, password) 호출 후 navigate('/signin') 등
    console.log('회원가입 폼 값:', { name, email, password });
    alert('검증만 통과한 상태입니다. 실제 연동 로직은 TODO 입니다.');
  };

  return (
    <main className="flex flex-col items-center min-h-screen pt-[47px]">
      {/* 로고 */}
      <div className="flex items-center gap-2 mb-11">
        <img src="/icons/logo.svg" alt="로고" className="w-45" />
      </div>

      {/* 폼 컨테이너 */}
      <div className="w-[300px]">
        <form className="flex flex-col gap-2" onSubmit={onSubmit}>
          {/* 이름 */}
          <div>
            <label className="block">
              <Txt className="block pb-2 text-xl">이름</Txt>
            </label>
            <Input
              type="text"
              placeholder="이름을 입력해주세요"
              required
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-Hana-Black placeholder:text-Icon-Detail mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block">
              <Txt className="block pb-2 text-xl">이메일</Txt>
            </label>
            <Input
              type="email"
              placeholder="이메일을 입력해주세요"
              autoComplete="email"
              required
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-Hana-Black placeholder:text-Icon-Detail mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block">
              <label className="block">
                <Txt className="block pb-2 text-xl">비밀번호</Txt>
              </label>
            </label>
            <Input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              autoComplete="new-password"
              required
              maxLength={50}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-Hana-Black placeholder:text-Icon-Detail h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block">
              <Input
                type="password"
                placeholder="비밀번호를 확인해주세요"
                autoComplete="new-password"
                required
                maxLength={50}
                value={secondPassword}
                onChange={(e) => setSecondPassword(e.target.value)}
                className="text-Hana-Black placeholder:text-Icon-Detail mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg"
              />
            </label>
          </div>
           {/* 전화번호 */}
          <div>
            <label className="block">
              <Txt className="block pb-2 text-xl">전화번호</Txt>
            </label>
            <Input
              type="text"
              placeholder="전화번호를 입력해주세요"
              required
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-Hana-Black placeholder:text-Icon-Detail mb-5 h-[50px] w-full pl-5 font-[AppleSDGothicNeoM] text-lg placeholder:font-[AppleSDGothicNeoM] placeholder:text-lg"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-2 rounded-md bg-red-50 p-3">
              <Txt weight="medium" className="text-sm text-red-600">
                {error}
              </Txt>
            </div>
          )}

          {/* 회원가입 버튼 */}
          <Button className="h-11 w-75 text-xl bg-Semi-Red" type="submit">
            회원가입
          </Button>

          {/* 로그인으로 이동 */}
          <div className="flex items-center justify-center pt-4">
            <Txt weight="medium" className="text-Icon-Detail text-base">
              가입한 계정이 이미 있으신가요?
            </Txt>
            <Link to="/signin" className="pb-1 pl-5">
              <Txt weight="medium" className="text-Icon-Detail align-middle text-base underline underline-offset-2">
                로그인
              </Txt>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
