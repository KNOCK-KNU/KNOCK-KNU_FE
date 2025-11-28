'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

export type StoreMarker = {
  storeId: number;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
};

type KakaoMapProps = {
  stores: StoreMarker[]; // 여러 개 마커
  level?: number; // 기본 줌 레벨
  className?: string; // 스타일 커스터마이징
};

const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

let kakaoScriptLoadingPromise: Promise<void> | null = null;

function loadKakaoMapScript() {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.kakao && window.kakao.maps) {
    return Promise.resolve();
  }

  if (!kakaoScriptLoadingPromise) {
    kakaoScriptLoadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => resolve());
        } else {
          reject(new Error('Kakao map object not found'));
        }
      };
      script.onerror = () =>
        reject(new Error('Failed to load Kakao Map script'));
      document.head.appendChild(script);
    });
  }

  return kakaoScriptLoadingPromise;
}

export function KakaoMap({ stores, level = 5, className }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!stores || stores.length === 0) return;

    let mapInstance: any;

    loadKakaoMapScript().then(() => {
      if (!mapRef.current) return;

      const kakao = window.kakao;

      // 중심은 일단 첫 번째 가게 기준
      const first = stores[0];
      const center = new kakao.maps.LatLng(first.latitude, first.longitude);

      mapInstance = new kakao.maps.Map(mapRef.current, {
        center,
        level,
      });

      const bounds = new kakao.maps.LatLngBounds();

      // 여기서 map 함수로 가게 리스트 순회하면서 마커 생성
      stores.map((store) => {
        const position = new kakao.maps.LatLng(store.latitude, store.longitude);

        const marker = new kakao.maps.Marker({
          map: mapInstance,
          position,
        });

        bounds.extend(position);

        return marker;
      });

      // 모든 마커가 보이도록 Bounds 맞추기
      if (stores.length > 1) {
        mapInstance.setBounds(bounds);
      }
    });

    return () => {
      mapInstance = null;
    };
  }, [stores, level]);

  return (
    <div
      ref={mapRef}
      className={
        className ??
        'w-full h-[100vh] rounded-2xl border border-gray-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden'
      }
    />
  );
}
