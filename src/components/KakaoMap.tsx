'use client';

import { useEffect, useRef, useState } from 'react';
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
  resetToken?: number; // ✅ 초기 위치로 되돌릴 때 쓰는 트리거
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

const INITIAL_LEVEL = 5;
const SELECTED_LEVEL = 1;

export function KakaoMap({
  stores,
  className,
  selectedStore,
  onMarkerClick,
  resetToken,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasFitBounds, setHasFitBounds] = useState(false); // ✅ 초기/리셋 시에만 bounds 맞추기

  // 0) resetToken 변경되면 다시 초기 위치로 맞출 준비
  useEffect(() => {
    if (resetToken !== undefined) {
      setHasFitBounds(false);
    }
  }, [resetToken]);

  // 1) 지도 초기화 (한 번만)
  useEffect(() => {
    if (!mapRef.current) return;
    if (!stores || stores.length === 0) return;

    let cancelled = false;

    loadKakaoMapScript().then(() => {
      if (!mapRef.current || cancelled) return;
      const kakao = window.kakao;

      const first = stores[0];
      const center = new kakao.maps.LatLng(first.latitude, first.longitude);

      const map = new kakao.maps.Map(mapRef.current, {
        center,
        level: INITIAL_LEVEL,
      });

      mapInstanceRef.current = map;
      setIsMapReady(true);
    });

    return () => {
      cancelled = true;
      mapInstanceRef.current = null;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 1회만

  // 2) 마커 렌더링 (필터/스토어 변화 전용)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady) return;
    if (!map || !window.kakao?.maps) return;
    if (!stores || stores.length === 0) return;

    const kakao = window.kakao;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();

    stores.forEach((store) => {
      const position = new kakao.maps.LatLng(store.latitude, store.longitude);

      const marker = new kakao.maps.Marker({
        map,
        position,
      });

      if (onMarkerClick) {
        kakao.maps.event.addListener(marker, 'click', () => {
          onMarkerClick(store);
        });
      }

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // ✅ hasFitBounds가 false일 때만 "초기 화면"으로 맞춰줌
    if (!hasFitBounds) {
      if (stores.length > 1) {
        map.setBounds(bounds);
      } else if (stores.length === 1) {
        map.setCenter(
          new kakao.maps.LatLng(stores[0].latitude, stores[0].longitude)
        );
        map.setLevel(INITIAL_LEVEL);
      }
      setHasFitBounds(true);
    }
  }, [stores, isMapReady, onMarkerClick, hasFitBounds]);

  // 3) 선택된 매장 클릭/검색 전용 카메라 제어
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

    map.setLevel(SELECTED_LEVEL);
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
