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
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? '가게 이름으로 검색하세요'}
      className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 
                 bg-white/90 dark:bg-slate-900/90 px-4 py-2 text-sm shadow-lg
                 outline-none focus:ring-2 focus:ring-sky-500"
    />
  );
}
