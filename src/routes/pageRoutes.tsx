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
      { path: 'map', element: <lazyRoutes.MapPage /> },
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
