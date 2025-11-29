'use client';

import { useState } from 'react';
import { Sparkles, Home, Loader2, RotateCcw } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter } from 'next/navigation';
import { useLuck } from '@/hooks/useLuck';

const MBTI_TYPES = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

const FORTUNE_TYPES = ['연애운', '금전운'];

export default function LuckPage() {
  const router = useRouter();
  const { getLuck, loading, error } = useLuck();
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [mbti, setMbti] = useState('');
  const [type, setType] = useState('');
  const [fortune, setFortune] = useState('');

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleReset = () => {
    setFortune('');
    setName('');
    setBirth('');
    setMbti('');
    setType('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await getLuck({
        name,
        birth,
        mbti,
        type,
      });
      setFortune(result);
    } catch (err) {
      // 에러는 useLuck 훅에서 처리됨
    }
  };

  const formatBirthInput = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '');
    // 최대 8자리까지만
    return numbers.slice(0, 8);
  };

  const handleBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBirthInput(e.target.value);
    setBirth(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header with Back Button and Theme Toggle */}
      <div className="pt-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            <Home className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              홈으로
            </span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Header */}
      <header className="pt-8 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            오늘의 운세
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            MBTI와 생년월일로 오늘의 운세를 확인해보세요!
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            AI가 당신의 하루를 분석해드립니다
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        {!fortune ? (
          /* Input Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-6 md:p-8 space-y-6"
          >
            {/* 이름 */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-slate-300"
              >
                이름
              </label>
              <input
                id="name"
                type="text"
                placeholder="이름을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            {/* 생년월일 */}
            <div className="space-y-2">
              <label
                htmlFor="birth"
                className="text-sm font-medium text-gray-700 dark:text-slate-300"
              >
                생년월일
              </label>
              <input
                id="birth"
                type="text"
                placeholder="YYYYMMDD (예: 19990927)"
                value={birth}
                onChange={handleBirthChange}
                maxLength={8}
                className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
              {birth.length > 0 && birth.length < 8 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  8자리를 입력해주세요 ({birth.length}/8)
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MBTI */}
              <div className="space-y-2">
                <label
                  htmlFor="mbti"
                  className="text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  MBTI
                </label>
                <select
                  id="mbti"
                  value={mbti}
                  onChange={(e) => setMbti(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="" disabled>
                    MBTI를 선택하세요
                  </option>
                  {MBTI_TYPES.map((mbtiType) => (
                    <option key={mbtiType} value={mbtiType}>
                      {mbtiType}
                    </option>
                  ))}
                </select>
              </div>

              {/* 운세 타입 */}
              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  운세 타입
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="" disabled>
                    운세를 선택하세요
                  </option>
                  {FORTUNE_TYPES.map((fortuneType) => (
                    <option key={fortuneType} value={fortuneType}>
                      {fortuneType}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading || !name || birth.length !== 8 || !mbti || !type}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-semibold py-3 shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  운세 확인 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  오늘의 운세 보기
                </>
              )}
            </button>
          </form>
        ) : (
          /* Fortune Result */
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-8 md:p-10">
              {/* Result Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {name}님의 {type}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  생년월일: {birth.slice(0, 4)}년 {birth.slice(4, 6)}월{' '}
                  {birth.slice(6, 8)}일 · MBTI: {mbti}
                </p>
              </div>

              {/* Fortune Content */}
              <div className="relative">
                <div className="absolute top-0 left-0 text-6xl text-purple-200 dark:text-purple-900 leading-none">
                  "
                </div>
                <div className="absolute bottom-0 right-0 text-6xl text-purple-200 dark:text-purple-900 leading-none">
                  "
                </div>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 px-8 py-4 text-center whitespace-pre-wrap">
                  {fortune}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold shadow-md active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                다시 보기
              </button>
              <button
                onClick={handleBackToHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-bold shadow-lg active:scale-95 transition-transform"
              >
                <Home className="w-5 h-5" />
                홈으로
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Made with ❤️ for KNU Students</p>
      </footer>
    </div>
  );
}
