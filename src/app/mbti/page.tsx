'use client';

import { useState } from 'react';

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
  const [person1Name, setPerson1Name] = useState('');
  const [person1Mbti, setPerson1Mbti] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [person2Mbti, setPerson2Mbti] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('제출 데이터:', {
      person1: { name: person1Name, mbti: person1Mbti },
      person2: { name: person2Name, mbti: person2Mbti },
    });

    // TODO: 여기서 궁합 분석 API 호출 or 결과 페이지로 이동
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* 헤더 영역 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            MBTI 궁합 보기
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-slate-300 max-w-xl mx-auto">
            이름과 MBTI를 입력하면 두 사람의 궁합을 AI가 분석해드립니다. 성향과
            대화 스타일까지 포함한 상세 궁합 설명을 받아보세요.
          </p>
        </div>

        {/* 카드 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg shadow-slate-900/10 backdrop-blur p-6 md:p-8 space-y-7"
        >
          {/* 사람 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-100/70 dark:border-brand-900/40">
                사람 1
              </span>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                첫 번째 인물 정보
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 이름 */}
              <div className="md:col-span-2 space-y-1.5">
                <label
                  htmlFor="person1-name"
                  className="text-xs font-medium text-gray-700 dark:text-slate-300"
                >
                  이름
                </label>
                <input
                  id="person1-name"
                  type="text"
                  placeholder="이름을 입력해주세요"
                  value={person1Name}
                  onChange={(e) => setPerson1Name(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              {/* MBTI 드롭다운 */}
              <div className="space-y-1.5">
                <label
                  htmlFor="person1-mbti"
                  className="text-xs font-medium text-gray-700 dark:text-slate-300"
                >
                  MBTI
                </label>
                <select
                  id="person1-mbti"
                  value={person1Mbti}
                  onChange={(e) => setPerson1Mbti(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 이름 */}
              <div className="md:col-span-2 space-y-1.5">
                <label
                  htmlFor="person2-name"
                  className="text-xs font-medium text-gray-700 dark:text-slate-300"
                >
                  이름
                </label>
                <input
                  id="person2-name"
                  type="text"
                  placeholder="이름을 입력해주세요"
                  value={person2Name}
                  onChange={(e) => setPerson2Name(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              {/* MBTI 드롭다운 */}
              <div className="space-y-1.5">
                <label
                  htmlFor="person2-mbti"
                  className="text-xs font-medium text-gray-700 dark:text-slate-300"
                >
                  MBTI
                </label>
                <select
                  id="person2-mbti"
                  value={person2Mbti}
                  onChange={(e) => setPerson2Mbti(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
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

          {/* 버튼 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 text-white text-sm font-semibold py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={
                !person1Name || !person1Mbti || !person2Name || !person2Mbti
              }
            >
              궁합 분석하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
