import { useState } from 'react';
import axiosInstance from '@/lib/axios';

interface LuckRequest {
  name: string;
  birth: string;
  mbti: string;
  type: string;
}

interface LuckResponse {
  response: string;
}

export const useLuck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const getLuck = async (data: LuckRequest): Promise<string> => {
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post<LuckResponse>('/luck', data);
      return response.data.response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '운세를 불러오는데 실패했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    getLuck,
    loading,
    error,
  };
};
