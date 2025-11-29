'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { KakaoMap } from '@/components/KakaoMap';
import { StoreSearchBar } from '@/components/StoreSearchBar';
import { StoreDetailOverlay } from '@/components/StoreDetailOverlay';
import { Store, DoorType, StoreModifier, StoreCategory } from '@/types/store';
import { MapPin, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter } from 'next/navigation';

const DOOR_OPTIONS: DoorType[] = [
  '쪽문',
  '북문',
  '솔로문',
  '정문',
  '서문',
  '동문',
  '교내',
];

const MODIFIER_OPTIONS: StoreModifier[] = [
  '조용한',
  '사람이 많은',
  '가성비인',
  '복층',
  '넓은',
  '뷔페식',
  '복층인',
  '24시간 하는',
  '양이 많은',
];

const CATEGORY_OPTIONS: StoreCategory[] = [
  '음식점',
  '헬스장',
  '카페',
  '술집',
  '클라이밍',
];

const MOCK_STORES: Store[] = [
  {
    storeId: 1,
    latitude: 35.8861798993549,
    longitude: 128.610280129716,
    name: '더쪽',
    address: '대구 북구 대현로19길 46 1층',
    door: '쪽문',
    modifier: '넓은',
    category: '카페',
  },
  {
    storeId: 2,
    latitude: 35.8858748793861,
    longitude: 128.610265537186,
    name: '빈트',
    address: '대구 북구 대현로19길 38-1 1층',
    door: '쪽문',
    modifier: '24시간 하는',
    category: '카페',
  },
  {
    storeId: 3,
    latitude: 35.885777152616,
    longitude: 128.6102486089,
    name: '뽀근닥 경북대점',
    address: '대구 북구 경대로7길 34 1층',
    door: '쪽문',
    modifier: '사람이 많은',
    category: '음식점',
  },
  {
    storeId: 4,
    latitude: 35.8850900683466,
    longitude: 128.614983571372,
    name: '뉴비클라이밍',
    address: '대구 동구 경대로 48 3층',
    door: '정문',
    modifier: '조용한',
    category: '클라이밍',
  },
  {
    storeId: 5,
    latitude: 35.8937256702289,
    longitude: 128.609117171873,
    name: '깨꼬닭 본점',
    address: '대구 북구 산격로8길 35 1층',
    door: '북문',
    modifier: '사람이 많은',
    category: '음식점',
  },
  {
    storeId: 6,
    latitude: 35.8862955601879,
    longitude: 128.607081623016,
    name: '카페 콘크리트 본점',
    address: '대구 북구 대현로13길 29 1층',
    door: '솔로문',
    modifier: '조용한',
    category: '카페',
  },
  {
    storeId: 7,
    latitude: 35.8921782677163,
    longitude: 128.608294246608,
    name: '덮덮밥 대구본점',
    address: '대구 북구 대학로 71 1층',
    door: '북문',
    modifier: '양이 많은',
    category: '음식점',
  },
  {
    storeId: 8,
    latitude: 35.8880590981918,
    longitude: 128.606016737556,
    name: '학교 헬스장',
    address: '대구 북구 대현동 25',
    door: '교내',
    modifier: '가성비인',
    category: '헬스장',
  },
];

export default function MapPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [doorFilter, setDoorFilter] = useState<DoorType | 'ALL'>('ALL');
  const [modifierFilter, setModifierFilter] = useState<StoreModifier | 'ALL'>(
    'ALL'
  );
  const [categoryFilter, setCategoryFilter] = useState<StoreCategory | 'ALL'>(
    'ALL'
  );
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [resetToken, setResetToken] = useState(0);

  // ✅ 검색 결과 박스 열림/닫힘 상태
  const [showResults, setShowResults] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  // ✅ 바깥 클릭 시 검색 결과 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredByDropdown = MOCK_STORES.filter((store) => {
    const doorOk = doorFilter === 'ALL' || store.door === doorFilter;
    const modifierOk =
      modifierFilter === 'ALL' || store.modifier === modifierFilter;
    const categoryOk =
      categoryFilter === 'ALL' || store.category === categoryFilter;
    return doorOk && modifierOk && categoryOk;
  });

  const searchResults =
    search.trim().length === 0
      ? filteredByDropdown
      : filteredByDropdown.filter((store) =>
          store.name.toLowerCase().includes(search.toLowerCase())
        );

  const filterSentence = (() => {
    if (
      doorFilter === 'ALL' &&
      modifierFilter === 'ALL' &&
      categoryFilter === 'ALL'
    ) {
      return '전체 매장';
    }

    const doorText = doorFilter === 'ALL' ? '' : `${doorFilter}에 있는 `;
    const modifierText = modifierFilter === 'ALL' ? '' : `${modifierFilter} `;
    const categoryText = categoryFilter === 'ALL' ? '' : `${categoryFilter}`;

    return `${doorText}${modifierText}${categoryText}`.trim();
  })();

  const handleSelectStore = useCallback((store: Store) => {
    setSelectedStore(store);
    setShowResults(false); // ✅ 결과 클릭 시 닫기
  }, []);

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Compact Header with Back Button */}
      <div className="pt-4 px-4 pb-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            <Home className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">홈으로</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              주변 맛집 지도
            </h1>
          </div>

          <ThemeToggle />
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 pb-8">
        <section
          className="
            relative
            w-full
            h-[calc(100vh-10rem)]
            rounded-2xl
            border border-gray-200 dark:border-slate-700
            bg-slate-100 dark:bg-slate-800
            overflow-hidden
            shadow-lg
          "
        >
          {/* 지도 */}
          <KakaoMap
            stores={filteredByDropdown}
            className="w-full h-full"
            selectedStore={selectedStore}
            onMarkerClick={handleSelectStore}
            resetToken={resetToken}
          />

          {/* 상단 검색 + 결과 리스트 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full px-4 flex justify-center pointer-events-none">
            <div
              ref={searchBoxRef}
              className="w-full max-w-md space-y-2 pointer-events-auto"
              onClick={() => setShowResults(true)} // ✅ 검색 영역 클릭하면 열림
            >
              <StoreSearchBar
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setShowResults(true); // 입력 시작하면 자동으로 열기
                }}
                placeholder="가게 이름으로 검색하세요 (예: 덮덮밥)"
              />

              {showResults &&
                search.trim().length > 0 &&
                searchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto rounded-xl bg-white/95 dark:bg-slate-900/95 shadow-lg border border-slate-200 dark:border-slate-700">
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                      {searchResults.map((store) => (
                        <li
                          key={store.storeId}
                          className="px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                          onClick={() => handleSelectStore(store)}
                        >
                          <div className="font-medium">{store.name}</div>
                          <div className="text-xs text-slate-500">
                            {store.address} · {store.door} · {store.category} ·{' '}
                            {store.modifier}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {showResults &&
                search.trim().length > 0 &&
                searchResults.length === 0 && (
                  <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-500">
                    검색 결과가 없습니다.
                  </div>
                )}
            </div>
          </div>

          {/* 하단 필터 드롭다운 바 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full px-4 flex justify-center pointer-events-none">
            <div className="w-full max-w-md rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-lg border border-slate-200 dark:border-slate-700 p-4 pointer-events-auto">
              <div className="flex flex-col gap-3 text-sm">
                {/* 출입문 */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">출입문</span>
                  <select
                    value={doorFilter}
                    onChange={(e) =>
                      setDoorFilter(
                        e.target.value === 'ALL'
                          ? 'ALL'
                          : (e.target.value as DoorType)
                      )
                    }
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                  >
                    <option value="ALL">전체</option>
                    {DOOR_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 분위기 */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">분위기</span>
                  <select
                    value={modifierFilter}
                    onChange={(e) =>
                      setModifierFilter(
                        e.target.value === 'ALL'
                          ? 'ALL'
                          : (e.target.value as StoreModifier)
                      )
                    }
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                  >
                    <option value="ALL">전체</option>
                    {MODIFIER_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 카테고리 */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500">카테고리</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(
                        e.target.value === 'ALL'
                          ? 'ALL'
                          : (e.target.value as StoreCategory)
                      )
                    }
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                  >
                    <option value="ALL">전체</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                현재 보기: <span className="font-medium">{filterSentence}</span>
              </div>
            </div>
          </div>

          {/* 처음 위치로 보기 버튼 */}
          <button
            type="button"
            onClick={() => {
              setSelectedStore(null);
              setResetToken((prev) => prev + 1);
              setDoorFilter('ALL');
              setModifierFilter('ALL');
              setCategoryFilter('ALL');
              setSearch('');
              setShowResults(false);
            }}
            className="
              absolute 
              right-4 
              bottom-60
              z-20 
              px-3 py-1.5 
              rounded-full 
              bg-white/90 dark:bg-slate-900/90
              border border-slate-200 dark:border-slate-700 
              text-xs 
              shadow-md
              hover:bg-slate-50 dark:hover:bg-slate-800
            "
          >
            처음 위치로 보기
          </button>

          {/* 상세 말풍선 */}
          {selectedStore && (
            <StoreDetailOverlay
              store={selectedStore}
              onClose={() => setSelectedStore(null)}
            />
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Made with ❤️ for KNU Students</p>
      </footer>
    </div>
  );
}
