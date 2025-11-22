import React from 'react';

export const lazyRoutes = {
  TestPage: React.lazy(() => import('../pages/TestPage/TestPage')),
  MainPage: React.lazy(() => import('../pages/MainPage/MainPage')),
  MyPage: React.lazy(() => import('../pages/MyPage/MyPage')),
  NotFoundPage: React.lazy(() => import('../pages/NotFoundPage/NotFoundPage')),
<<<<<<< HEAD
  MapPage: React.lazy(() => import('../pages/MapPage/MapPage')),
=======
  SigninPage: React.lazy(() => import('../pages/SigninPage/SigninPage')),
  SignupPage: React.lazy(() => import('../pages/SignupPage/SignupPage.tsx')),
>>>>>>> b94630386b81fa1131d298c78593a26964c1405e
};
