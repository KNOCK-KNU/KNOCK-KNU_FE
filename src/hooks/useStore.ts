import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Store, DoorType, StoreModifier, StoreCategory } from '@/types/store';

export interface TypeResponse {
  doors: string[];
  modifiers: string[];
  categories: string[];
}

const fetchStores = async (): Promise<Store[]> => {
  const response = await axiosInstance.get<Store[]>('/store');
  return response.data;
};

const fetchTypes = async (): Promise<TypeResponse> => {
  const response = await axiosInstance.get<TypeResponse>('/store/types');
  return response.data;
};

export const useStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const useStoreTypes = () => {
  return useQuery({
    queryKey: ['storeTypes'],
    queryFn: fetchTypes,
    staleTime: 30 * 60 * 1000, // 30분 (필터 옵션은 자주 변경되지 않음)
    select: (data) => ({
      doorOptions: data.doors as DoorType[],
      modifierOptions: data.modifiers as StoreModifier[],
      categoryOptions: data.categories as StoreCategory[],
    }),
  });
};
