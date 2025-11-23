import { api } from './axios';

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TockenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface AuthResponse {
  errorCode: string | null;
  message: string;
  result: TockenData;
}

export const signUp = async (data: SignUpRequest) => {
  const response = await api.post<AuthResponse>('/api/signup', data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>('/api/login', data);
  return response.data;
};
