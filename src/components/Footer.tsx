import { Link } from 'react-router-dom';
import Txt from '@/components/atoms/Text';

export default function Footer() {
  const navItems = [
    {
      path: '/main',
      label: '홈',
      icon: '/icons/homefoot.svg',
    },
    {
      path: '/measure',
      label: '측정 목록',
      icon: '/icons/measure.svg',
    },
    {
      path: '/my',
      label: '마이',
      icon: '/icons/my.svg',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-white py-3 z-50 shadow-[0_0_4px_rgba(0,0,0,0.15)]">
      {navItems.map((item) => {
        return (
          <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 cursor-pointer">
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <Txt weight="medium" className="text-xs">
              {item.label}
            </Txt>
          </Link>
        );
      })}
    </nav>
  );
}
