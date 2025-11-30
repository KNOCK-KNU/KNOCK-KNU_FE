'use client';

type StoreSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function StoreSearchBar({
  value,
  onChange,
  placeholder,
}: StoreSearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '가게 이름으로 검색하세요'}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 
                   bg-white/90 dark:bg-slate-900/90 px-4 py-2 pr-9 text-sm shadow-lg
                   outline-none focus:ring-2 focus:ring-sky-500"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 
                     h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700
                     flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300
                     hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          aria-label="검색어 지우기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
