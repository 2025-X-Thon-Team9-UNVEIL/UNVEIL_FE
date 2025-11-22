import { useMemo } from 'react';
import cctvDataRaw from '@/data/cctvData.json';
import lightDataRaw from '@/data/lightData.json';

type MapData = { id: number; lat: number; lng: number; type: string };
const cctvData = cctvDataRaw as MapData[];
const lightData = lightDataRaw as MapData[];

// 등급 타입
export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

// 등급 기준 상수
const GRADE_CRITERIA = {
  cctv: {
    A: 10,
    B: 6,
    C: 3,
    D: 1,
  },
  light: {
    A: 20,
    B: 10,
    C: 5,
    D: 1,
  },
} as const;

// 거리 계산 유틸리티 함수 (도(degree)를 라디안(radian)으로 변환)
const toRadian = (degree: number) => (degree * Math.PI) / 180;

// 두 좌표 간 거리 계산 (하버사인 공식)
export const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const earthRadius = 6371000; // 지구 반지름 (단위: m)

  // 1. 위도/경도를 라디안 단위로 변환
  const lat1Rad = toRadian(lat1);
  const lat2Rad = toRadian(lat2);
  // 2. 두 지점 사이의 차이 (거리)
  const latDiff = toRadian(lat2 - lat1);
  const lngDiff = toRadian(lng2 - lng1);
  // 3. 하버사인 공식 (Haversine Formula) 적용
  // a: 두 지점 사이의 거리의 제곱 반값 (중간 계산값)
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  // c: 각거리 (angular distance)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c; // 최종 거리 (미터)
};

// 등급 계산 함수
export const getGrade = (count: number, type: 'cctv' | 'light'): Grade => {
  const criteria = GRADE_CRITERIA[type];

  if (count >= criteria.A) return 'A';
  if (count >= criteria.B) return 'B';
  if (count >= criteria.C) return 'C';
  if (count >= criteria.D) return 'D';
  return 'F';
};

interface SafetyMeasurementResult {
  cctvCount: number;
  lightCount: number;
  cctvGrade: Grade;
  lightGrade: Grade;
}

// 안전도 측정 커스텀 훅
export const useSafetyMeasurement = (
  targetLocation: { lat: number; lng: number } | null,
  radius: number = 100,
): SafetyMeasurementResult => {
  return useMemo(() => {
    if (!targetLocation) {
      return {
        cctvCount: 0,
        lightCount: 0,
        cctvGrade: 'F',
        lightGrade: 'F',
      };
    }

    // 반경 내 CCTV 개수 계산
    const nearbyCCTV = cctvData.filter(
      (item) => getDistance(targetLocation.lat, targetLocation.lng, item.lat, item.lng) <= radius,
    ).length;

    // 반경 내 가로등 개수 계산
    const nearbyLights = lightData.filter(
      (item) => getDistance(targetLocation.lat, targetLocation.lng, item.lat, item.lng) <= radius,
    ).length;

    // 등급 계산
    const cctvGrade = getGrade(nearbyCCTV, 'cctv');
    const lightGrade = getGrade(nearbyLights, 'light');

    return {
      cctvCount: nearbyCCTV,
      lightCount: nearbyLights,
      cctvGrade,
      lightGrade,
    };
  }, [targetLocation, radius]);
};
