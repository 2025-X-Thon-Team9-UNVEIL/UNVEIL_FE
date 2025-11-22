import React from 'react';

export const lazyRoutes = {
  TestPage: React.lazy(() => import('../pages/TestPage/TestPage')),
  MainPage: React.lazy(() => import('../pages/MainPage/MainPage')),
  MyPage: React.lazy(() => import('../pages/MyPage/MyPage')),
  NotFoundPage: React.lazy(() => import('../pages/NotFoundPage/NotFoundPage')),
  LocationPage: React.lazy(() => import('../pages/LocationPage/LocationPage.tsx')),
  SafetyPage: React.lazy(() => import('../pages/SafetyPage/SafetyPage.tsx')),
  SigninPage: React.lazy(() => import('../pages/SigninPage/SigninPage')),
  SignupPage: React.lazy(() => import('../pages/SignupPage/SignupPage.tsx')),
  MeasurePage: React.lazy(() => import('../pages/MeasurePage/MeasurePage.tsx')),
  SoundPage: React.lazy(() => import('../pages/SoundPage/SoundPage.tsx')),
};
