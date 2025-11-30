'use client';

import { useEffect, useRef } from 'react';
import { Store } from '@/types/store';

declare global {
  interface Window {
    kakao: any;
  }
}

type KakaoMapProps = {
  stores: Store[];
  className?: string;
  selectedStore?: Store | null;
  onMarkerClick?: (store: Store) => void;
};

export function KakaoMap({
  stores,
  className,
  selectedStore,
  onMarkerClick,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  // 1) 지도 생성
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      const kakao = window.kakao;
      const center = new kakao.maps.LatLng(
        stores[0]?.latitude ?? 35.888,
        stores[0]?.longitude ?? 128.61
      );

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      });

      mapInstanceRef.current = map;

      // 마커 찍기
      stores.forEach((store) => {
        const pos = new kakao.maps.LatLng(store.latitude, store.longitude);
        const marker = new kakao.maps.Marker({ map, position: pos });

        if (onMarkerClick) {
          kakao.maps.event.addListener(marker, 'click', () =>
            onMarkerClick(store)
          );
        }
      });
    });
  }, [stores, onMarkerClick]);

  // 2) 선택된 매장 포커스
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao?.maps) return;
    if (!selectedStore) return;

    const kakao = window.kakao;
    const center = new kakao.maps.LatLng(
      selectedStore.latitude,
      selectedStore.longitude
    );

    map.setLevel(1);
    map.panTo(center);
  }, [selectedStore]);

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
