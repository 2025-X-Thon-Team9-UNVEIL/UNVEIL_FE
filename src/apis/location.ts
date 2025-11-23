import { api } from './axios';

export interface LocationData {
  address: string;
  noiseLevel: string;
  streetlightLevel: string;
  cctvLevel: string;
  score: string;
}
export interface LocationResult {
  locationList: LocationData[];
  listSize: number;
  totalPage: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface LocationListResponse {
  errorCode: string | null;
  message: string;
  result: LocationResult;
}

// 1. [GET] 내 위치 목록 조회
export const getLocationList = async (page = 0, size = 10) => {
  const response = await api.get<LocationListResponse>('/api/locations', {
    params: { page, size },
  });
  return response.data;
};

// 2. [POST] 위치 정보 등록
export const registerLocation = async (data: LocationData) => {
  const response = await api.post<LocationData>('/api/locations', data);
  return response.data;
};
