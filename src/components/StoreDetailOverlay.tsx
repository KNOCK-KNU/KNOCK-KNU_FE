'use client';

import { Store } from '@/types/store';

type StoreDetailOverlayProps = {
  store: Store;
  onClose: () => void;
};

export function StoreDetailOverlay({
  store,
  onClose,
}: StoreDetailOverlayProps) {
  return (
    // ✅ 바깥 영역 클릭 시 onClose
    <div
      className="absolute inset-0 z-20 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 말풍선 카드 */}
      <div
        className="
          pointer-events-auto 
          bg-white dark:bg-slate-900 
          rounded-2xl shadow-xl 
          border border-slate-200 dark:border-slate-700 
          px-4 py-3 
          min-w-[260px] max-w-sm 
          relative
          transform -translate-y-30
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xs text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>

        <div className="space-y-1 pr-5">
          <div className="text-sm font-semibold">{store.name}</div>
          <div className="text-[11px] text-slate-500">{store.address}</div>
          <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              {store.modifier}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {store.door}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              {store.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
