'use client';

import { KakaoMap } from '@/components/KakaoMap';

type Store = {
  storeId: number;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
};

// 목 데이터 (예시)
const MOCK_STORES: Store[] = [
  {
    storeId: 1,
    latitude: 35.8882,
    longitude: 128.6108,
    name: '키아누',
    address: '대구 동구 대현로 17길 15',
  },
  {
    storeId: 2,
    latitude: 35.8889,
    longitude: 128.612,
    name: '꾸브라꼬 치킨',
    address: '대구 동구 대학로 80',
  },
  {
    storeId: 3,
    latitude: 35.8875,
    longitude: 128.6095,
    name: '캠퍼스 카페',
    address: '대구 동구 대현로 15길 10',
  },
];

export default function MapPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 ">
      <div className="w-full max-w-5xl">
        <section>
          {/* 여기서 mock data를 그대로 KakaoMap에 넘김 */}
          <KakaoMap
            stores={MOCK_STORES}
            level={5}
            className="w-full h-[100vh] rounded-2xl border border-gray-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden"
          />
        </section>
      </div>
    </div>
  );
}
