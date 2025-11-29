import Link from "next/link";
import {
  MessageCircle,
  Utensils,
  Heart,
  Sparkles,
  Map,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    title: "아이스브레이킹",
    description: "밥약, 과팅, 팀플 등 다양한 상황에서 대화를 시작해보세요",
    icon: MessageCircle,
    href: "/ice-breaking",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "메뉴 고르기",
    description: "룰렛과 사다리타기로 오늘의 메뉴를 결정하세요",
    icon: Utensils,
    href: "/menu",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "MBTI 궁합",
    description: "MBTI로 상대방과의 궁합을 확인해보세요",
    icon: Heart,
    href: "/mbti",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "KNU 맵",
    description: "학교 주변 식당, 카페, 편의시설을 찾아보세요",
    icon: Map,
    href: "/map",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "오늘의 운세",
    description: "MBTI와 생년월일로 오늘의 운세를 알아보세요",
    icon: Sparkles,
    href: "/luck",
    color: "from-purple-500 to-indigo-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header with Theme Toggle */}
      <header className="pt-4 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-8">
            <ThemeToggle />
          </div>

          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              KNOCK-KNU
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              경북대학교 캠퍼스 소셜 플랫폼
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Knock on KNU, break the ice together!
            </p>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <main className="max-w-2xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient Border Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow Icon */}
                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                  시작하기
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Made with ❤️ for KNU Students</p>
      </footer>
    </div>
  );
}
