'use client';

import { useEffect, useRef, memo } from 'react';
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

// 🔹 진짜 구현부는 이 컴포넌트
function KakaoMapInner({
  stores,
  className,
  selectedStore,
  onMarkerClick,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]); // 마커들 따로 관리

  // 1) 지도는 딱 한 번만 생성
  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.kakao?.maps) return;
    if (mapInstanceRef.current) return; // 이미 있으면 재생성 X

    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

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
    });

    // 언마운트 시 정리
    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ❗ stores 넣지 말기 (한 번만 실행)

  // 2) stores 변경될 때마다 마커만 다시 렌더
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao?.maps) return;

    const kakao = window.kakao;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (!stores || stores.length === 0) return;

    stores.forEach((store) => {
      const pos = new kakao.maps.LatLng(store.latitude, store.longitude);
      const marker = new kakao.maps.Marker({ map, position: pos });

      if (onMarkerClick) {
        kakao.maps.event.addListener(marker, 'click', () =>
          onMarkerClick(store)
        );
      }

      markersRef.current.push(marker);
    });
  }, [stores, onMarkerClick]);

  // 3) 선택된 매장 포커스
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

// 🔹 props가 안 바뀌면 다시 렌더 안 되게 메모이제이션
export const KakaoMap = memo(KakaoMapInner);
