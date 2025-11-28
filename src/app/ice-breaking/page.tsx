"use client";

import { useState } from "react";
import { MessageCircle, Home, Shuffle, HelpCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Category = "meal" | "date" | "team" | "gathering" | null;

interface QuestionData {
  [key: string]: string[];
}

const questions: QuestionData = {
  meal: [
    "요즘 제일 좋아하는 음식은?",
    "인생 맛집 하나만 추천해주세요!",
    "먹방 vs 쿡방, 어떤 게 더 재밌어요?",
    "매운 음식 잘 먹는 편이에요?",
    "아침에 밥 vs 빵, 뭐 드세요?",
    "커피 vs 차, 어떤 걸 더 좋아해요?",
    "혼밥 vs 함께 먹기, 어떤 게 더 좋아요?",
    "디저트로 뭐 먹는 게 제일 좋아요?",
    "단 거 vs 짠 거, 어떤 간식을 더 좋아해요?",
    "좋아하는 음식은 빨리 먹는 편? 아껴 먹는 편?",
    "평생 한 가지 음식만 먹어야 한다면?",
    "요리 할 줄 알아요? 제일 자신있는 요리는?",
    "회식이나 모임에서 음식 주문 잘 하는 편이에요?",
    "편의점 음식 중에 제일 좋아하는 거?",
    "새로운 음식 도전하는 거 좋아해요?",
    "음식 사진 찍는 편이에요?",
  ],
  date: [
    "MBTI가 뭐예요?",
    "취미가 뭐예요?",
    "요즘 관심있는 거 있어요?",
    "여행 좋아하세요? 가본 곳 중 어디가 제일 좋았어요?",
    "주말 보통 어떻게 보내세요?",
    "좋아하는 영화/드라마 장르가 뭐예요?",
    "운동 좋아하세요?",
    "반려동물 키우거나 키워본 적 있어요?",
    "어릴 때 장래 희망은 뭐였어요?",
    "받았던 선물 중에서 가장 기억에 남는 건?",
    "하나의 초능력을 가질 수 있다면 어떤 능력?",
    "인생에서 가장 보람찼던 일은?",
    "최근에 제일 행복했던 순간은?",
    "스트레스 받을 때 주로 뭐 해요?",
    "좋아하는 계절이 있어요?",
    "아침형 인간이에요, 저녁형 인간이에요?",
    "바다 vs 산, 어디가 더 좋아요?",
    "요즘 가장 하고 싶은 것은?",
    "인생 영화나 책 하나만 추천해주세요!",
    "10년 후 나는 뭐하고 있을 것 같아요?",
  ],
  team: [
    "어떤 역할 맡는 거 좋아하세요?",
    "팀플할 때 제일 중요한 건 뭐라고 생각하세요?",
    "선호하는 작업 시간대가 있나요?",
    "온라인 vs 오프라인 회의, 어떤 게 더 좋아요?",
    "아이디어 회의할 때 적극적으로 의견 내는 편이에요?",
    "완벽주의 vs 실용주의, 어느 쪽에 가까워요?",
    "마감 직전 vs 여유있게, 어떤 스타일이에요?",
    "팀플 경험담 중에 기억에 남는 거 있어요?",
    "진정한 팀워크를 위해 가장 필요한 건?",
    "팀원들과 소통할 때 선호하는 방식은?",
    "프로젝트 시작 전 vs 진행하면서, 언제 계획 세우는 걸 선호해요?",
    "혼자 집중해서 vs 같이 모여서, 어떤 작업 환경이 좋아요?",
    "팀플에서 제일 스트레스 받는 상황은?",
    "좋은 리더의 조건이 뭐라고 생각해요?",
    "팀플 중 의견 충돌 생기면 어떻게 해요?",
    "발표 vs 자료 제작, 뭐가 더 자신있어요?",
    "팀플 성공 경험 중 가장 뿌듯했던 순간은?",
    "지금까지 했던 팀플 중 최악/최고는?",
  ],
  gathering: [
    "주말에 뭐 하는 거 좋아해요?",
    "최근에 본 영화/드라마 추천해주세요!",
    "스트레스는 어떻게 푸세요?",
    "노래방 가면 주로 뭐 부르세요?",
    "실내 vs 실외 활동, 어떤 게 더 좋아요?",
    "요즘 빠진 게임이나 앱 있어요?",
    "버킷리스트 중에 하나만 말해주세요!",
    "요즘 제일 핫한 거 뭐라고 생각해요?",
    "가장 유명한 사람을 만났던 경험이 있어요?",
    "어렸을 때 제일 좋아했던 만화는?",
    "어릴 때 가장 황당했던 두려움은?",
    "만약 우주여행을 갈 수 있다면 어디로?",
    "'오늘 하루 잘 보냈다' 싶은 하루는 어떤 하루예요?",
    "요즘 가장 웃겼던 일은?",
    "나만의 특별한 루틴이 있어요?",
    "인생에서 가장 소중한 가치는?",
    "요즘 제일 듣는 노래나 가수는?",
    "완전 자유로운 하루가 주어진다면 뭐 할 거예요?",
    "이루지 못한 꿈에 대한 아쉬움이 있나요?",
    "최근에 새로 시작한 것이 있어요?",
  ],
};

const categories = [
  { id: "meal" as Category, emoji: "🍔", label: "밥약", color: "from-orange-500 to-amber-500" },
  { id: "date" as Category, emoji: "🎉", label: "과팅", color: "from-pink-500 to-rose-500" },
  { id: "team" as Category, emoji: "💼", label: "팀플", color: "from-purple-500 to-indigo-500" },
  { id: "gathering" as Category, emoji: "🎊", label: "모꼬지", color: "from-green-500 to-emerald-500" },
];

export default function IceBreakingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([]);

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setFlippedCards(new Set());
    if (category) {
      const categoryQuestions = questions[category];
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
      setCurrentQuestions(shuffled.slice(0, 3));
    }
  };

  const handleCardFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleShuffle = () => {
    if (selectedCategory) {
      const categoryQuestions = questions[selectedCategory];
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
      setCurrentQuestions(shuffled.slice(0, 3));
      setFlippedCards(new Set());
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setFlippedCards(new Set());
    setCurrentQuestions([]);
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <div className="pt-4 px-4">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
        >
          <Home className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">홈으로</span>
        </button>
      </div>

      {/* Header */}
      <header className="pt-8 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            아이스브레이킹
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            상황을 선택하고 대화를 시작해보세요!
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            카드를 탭하면 질문이 나타납니다
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pb-16">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            /* Category Selection */
            <motion.div
              key="category-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-6">
                상황 선택
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-transform active:scale-98"
                  >
                    <div className="text-5xl mb-3">{category.emoji}</div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {category.label}
                    </h3>
                    <div className="flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
                      시작하기
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Question Cards */
            <motion.div
              key="question-cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Selected Category Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg">
                  <span className="text-3xl">{selectedCategoryData?.emoji}</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">
                    {selectedCategoryData?.label}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-6 mb-8">
                {currentQuestions.map((question, index) => {
                  const isFlipped = flippedCards.has(index);
                  return (
                    <div
                      key={`${selectedCategory}-${index}-${question}`}
                      className="perspective-1000"
                      onClick={() => handleCardFlip(index)}
                    >
                      <motion.div
                        className="relative w-full h-48 cursor-pointer"
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* Card Front (? Icon) */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl flex flex-col items-center justify-center p-6"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                          }}
                        >
                          <HelpCircle className="w-16 h-16 text-white mb-3 opacity-80" />
                          <p className="text-white text-lg font-medium">탭해서 질문 보기</p>
                        </div>

                        {/* Card Back (Question) */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center p-8"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <p className="text-xl font-bold text-gray-800 dark:text-white text-center leading-relaxed">
                            {question}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleShuffle}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold shadow-lg active:scale-95 transition-transform"
                >
                  <Shuffle className="w-5 h-5" />
                  다른 질문 보기
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold shadow-md active:scale-95 transition-transform"
                >
                  처음으로
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Made with ❤️ for KNU Students</p>
      </footer>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
