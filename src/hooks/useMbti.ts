import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export interface CompatibilityRequest {
  name1: string;
  mbti1: string;
  name2: string;
  mbti2: string;
}

export interface CompatibilityResponse {
  title: string;
  score: number;
  goodPoint: string;
  badPoint: string;
  advice: string;
}

const fetchCompatibility = async (
  data: CompatibilityRequest
): Promise<CompatibilityResponse> => {
  const response = await axiosInstance.post<CompatibilityResponse>(
    '/mbticomb',
    data
  );
  return response.data;
};

export const useMbti = () => {
  return useMutation({
    mutationFn: fetchCompatibility,
    onError: (error) => {
      console.error('MBTI 궁합 조회 실패:', error);
    },
  });
};
