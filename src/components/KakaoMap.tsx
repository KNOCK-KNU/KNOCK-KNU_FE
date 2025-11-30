'use client';

import { useEffect, useRef, useState, memo } from 'react';
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

function KakaoMapInner({
  stores,
  className,
  selectedStore,
  onMarkerClick,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [kakaoReady, setKakaoReady] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // 0) Kakao SDK 로딩될 때까지 기다리기 (새로고침 레이스 해결)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const check = () => {
      if (cancelled) return;
      if (window.kakao && window.kakao.maps) {
        setKakaoReady(true);
      } else {
        // SDK가 아직이면 조금 있다가 다시 체크
        setTimeout(check, 100);
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  // 1) 지도는 딱 한 번만 생성
  useEffect(() => {
    if (!kakaoReady) return; // SDK 준비 안 됐으면 대기
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // 이미 있으면 재생성 X

    const kakao = window.kakao;

    kakao.maps.load(() => {
      if (!mapRef.current) return;

      const centerLat = stores[0]?.latitude ?? 35.888;
      const centerLng = stores[0]?.longitude ?? 128.61;

      const center = new kakao.maps.LatLng(centerLat, centerLng);

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      });

      mapInstanceRef.current = map;
      setIsMapReady(true); // ✅ 이때부터 마커 렌더링 가능
    });

    // cleanup
    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
    // kakaoReady가 true 될 때 한 번 실행
  }, [kakaoReady, stores]); // stores는 center 초기값 설정용으로만 읽는 거라 빼도 되는데, 있어도 큰 문제는 없음

  // 2) 마커 렌더링
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady) return;
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
  }, [stores, onMarkerClick, isMapReady]); // ✅ isMapReady도 의존성에 추가

  // 3) 선택된 매장 포커스
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady) return;
    if (!map || !window.kakao?.maps) return;
    if (!selectedStore) return;

    const kakao = window.kakao;
    const center = new kakao.maps.LatLng(
      selectedStore.latitude,
      selectedStore.longitude
    );

    map.setLevel(1);
    map.panTo(center);
  }, [selectedStore, isMapReady]);

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

// 부모에서 props 안 바뀌면 재렌더도 막기
export const KakaoMap = memo(KakaoMapInner);
