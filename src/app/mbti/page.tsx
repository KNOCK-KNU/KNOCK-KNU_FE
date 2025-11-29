'use client';

import { useState } from 'react';
import { Users, Home, Loader2, Heart, ThumbsUp, ThumbsDown, Lightbulb } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter } from 'next/navigation';
import { useMbti } from '@/hooks/useMbti';

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

export default function MBTIPage() {
  const router = useRouter();
  const { mutate, isPending, error, data } = useMbti();
  const [name1, setName1] = useState('');
  const [mbti1, setMbti1] = useState('');
  const [name2, setName2] = useState('');
  const [mbti2, setMbti2] = useState('');

  // 제출된 데이터 저장용
  const [submittedData, setSubmittedData] = useState<{
    name1: string;
    mbti1: string;
    name2: string;
    mbti2: string;
  } | null>(null);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 제출된 데이터 저장
    setSubmittedData({
      name1,
      mbti1,
      name2,
      mbti2,
    });
    mutate({
      name1,
      mbti1,
      name2,
      mbti2,
    });
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            MBTI 궁합 보기
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            이름과 MBTI를 입력하면 두 사람의 궁합을 AI가 분석해드립니다.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            성향과 대화 스타일까지 포함한 상세 궁합 설명을 받아보세요
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        {!data ? (
          /* Input Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-6 space-y-7"
          >
            {/* 사람 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border border-pink-100/70 dark:border-pink-900/40">
                  사람 1
                </span>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  첫 번째 인물 정보
                </h2>
              </div>

              <div className="space-y-4">
                {/* 이름 */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name1"
                    className="text-xs font-medium text-gray-700 dark:text-slate-300"
                  >
                    이름
                  </label>
                  <input
                    id="name1"
                    type="text"
                    placeholder="이름을 입력해주세요"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>

                {/* MBTI 드롭다운 */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="mbti1"
                    className="text-xs font-medium text-gray-700 dark:text-slate-300"
                  >
                    MBTI
                  </label>
                  <select
                    id="mbti1"
                    value={mbti1}
                    onChange={(e) => setMbti1(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  >
                    <option value="" disabled>
                      MBTI를 선택하세요
                    </option>
                    {MBTI_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* 구분선 */}
            <div className="h-px bg-gray-100 dark:bg-slate-800" />

            {/* 사람 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  사람 2
                </span>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  두 번째 인물 정보
                </h2>
              </div>

              <div className="space-y-4">
                {/* 이름 */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name2"
                    className="text-xs font-medium text-gray-700 dark:text-slate-300"
                  >
                    이름
                  </label>
                  <input
                    id="name2"
                    type="text"
                    placeholder="이름을 입력해주세요"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>

                {/* MBTI 드롭다운 */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="mbti2"
                    className="text-xs font-medium text-gray-700 dark:text-slate-300"
                  >
                    MBTI
                  </label>
                  <select
                    id="mbti2"
                    value={mbti2}
                    onChange={(e) => setMbti2(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  >
                    <option value="" disabled>
                      MBTI를 선택하세요
                    </option>
                    {MBTI_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* 에러 메시지 */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error.message || '궁합 분석에 실패했습니다.'}
                </p>
              </div>
            )}

            {/* 버튼 */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || !name1 || !mbti1 || !name2 || !mbti2}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold py-3 shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    궁합 분석 중...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    궁합 분석하기
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Result View */
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-6 space-y-6">
            {/* Result Header */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {data.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {submittedData?.name1} ({submittedData?.mbti1}) ♥ {submittedData?.name2} ({submittedData?.mbti2})
              </p>

              {/* Score */}
              <div className="flex items-center justify-center gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  {data.score}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  / 100
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="h-px bg-gray-100 dark:bg-slate-800" />

            {/* 좋은점 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <ThumbsUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  좋은 점
                </h3>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {data.goodPoint}
                </p>
              </div>
            </section>

            {/* 나쁜점 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                  <ThumbsDown className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  주의할 점
                </h3>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {data.badPoint}
                </p>
              </div>
            </section>

            {/* 조언 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  조언
                </h3>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {data.advice}
                </p>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleBackToHome}
                className="w-full px-8 py-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
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
