import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazyRoutes } from './routes';
import HomeLayout from '@/layouts/HomeLayout';
import ProtectedLayout from '@/layouts/ProtectedLayout';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <lazyRoutes.NotFoundPage />,
    children: [
      { index: true, element: <lazyRoutes.MainPage /> },
      { path: 'test', element: <lazyRoutes.TestPage /> },
      { path: 'location', element: <lazyRoutes.LocationPage /> },
      { path: 'signin', element: <lazyRoutes.SigninPage /> },
      { path: 'signup', element: <lazyRoutes.SignupPage /> },
      { path: 'measure', element: <lazyRoutes.MeasurePage /> },
      { path: 'safety', element: <lazyRoutes.SafetyPage /> },
      { path: 'sound', element: <lazyRoutes.SoundPage /> },
      { path: 'result', element: <lazyRoutes.ResultPage /> },
      { path: 'onboarding', element: <lazyRoutes.OnboardingPage /> },
      { path: 'first', element: <lazyRoutes.FirstPage /> },
      { path: 'my', element: <lazyRoutes.MyPage /> },
    ],
  },
];

export const protectedRoutes: RouteObject[] = [
  {
    path: '/mypage',
    element: <ProtectedLayout />,
    children: [
      {
        path: 'my',
        element: <lazyRoutes.MyPage />,
      },
    ],
  },
];

export const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);
