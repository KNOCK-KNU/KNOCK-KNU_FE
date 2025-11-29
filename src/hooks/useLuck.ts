import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export interface FortuneRequest {
  name: string;
  birth: string;
  gender: string;
  mbti: string;
}

export interface FortuneResponse {
  title: string;
  grandFortune: string;
  loveFortune: string;
  wealthFortune: string;
  studyFortune: string;
  score: number;
  luckyItem: string;
}

const fetchFortune = async (data: FortuneRequest): Promise<FortuneResponse> => {
  const response = await axiosInstance.post<FortuneResponse>('/luck', data);
  return response.data;
};

export const useLuck = () => {
  return useMutation({
    mutationFn: fetchFortune,
    onError: (error) => {
      console.error('운세 조회 실패:', error);
    },
  });
};
