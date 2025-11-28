"use client";

import { useState, useRef, useEffect } from "react";
import { Utensils, Plus, X, Target, GitBranch, Home, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with react-custom-roulette
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

type View = "input" | "roulette" | "ladder" | "result";

interface RouletteData {
  option: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

export default function MenuPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("input");
  const [menus, setMenus] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  // Roulette states
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // Ladder states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ladderData, setLadderData] = useState<number[][]>([]);
  const [selectedStart, setSelectedStart] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  const handleAddMenu = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) return;

    if (menus.length >= 10) return;

    // Check for duplicates (case-insensitive)
    if (menus.some(menu => menu.toLowerCase() === trimmedValue.toLowerCase())) {
      alert("이미 추가된 메뉴입니다!");
      return;
    }

    setMenus([...menus, trimmedValue]);
    setInputValue("");
  };

  const handleRemoveMenu = (index: number) => {
    setMenus(menus.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddMenu();
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleBackToInput = () => {
    setView("input");
    setSelectedMenu("");
    setMustSpin(false);
    setPrizeNumber(0);
    setSelectedStart(null);
    setLadderData([]);
    setIsAnimating(false);
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleStartRoulette = () => {
    setView("roulette");
  };

  const handleStartLadder = () => {
    // Reset ladder state before starting
    setSelectedStart(null);
    setIsAnimating(false);
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
    }
    setView("ladder");
    generateLadder();
  };

  // Roulette functions
  const getRouletteColors = () => {
    return [
      "#EF4444", // red-500
      "#F97316", // orange-500
      "#10B981", // emerald-500
      "#8B5CF6", // purple-500
      "#F59E0B", // amber-500
      "#3B82F6", // blue-500
      "#EC4899", // pink-500
      "#14B8A6", // teal-500
      "#6366F1", // indigo-500
      "#84CC16", // lime-500
    ];
  };

  const getRouletteData = (): RouletteData[] => {
    const colors = getRouletteColors();
    return menus.map((menu, index) => ({
      option: menu,
      style: {
        backgroundColor: colors[index % colors.length],
        textColor: "white",
      },
    }));
  };

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * menus.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setSelectedMenu(menus[prizeNumber]);
    setTimeout(() => {
      setView("result");
    }, 500);
  };

  // Ladder functions
  const generateLadder = () => {
    const numLines = menus.length;
    const numLevels = Math.max(15, numLines * 3);
    const ladder: number[][] = [];

    for (let level = 0; level < numLevels; level++) {
      const bridges: number[] = [];
      // Randomly add bridges (30% chance per position)
      if (Math.random() > 0.3) {
        const pos = Math.floor(Math.random() * (numLines - 1));
        bridges.push(pos);
      }
      ladder.push(bridges);
    }

    setLadderData(ladder);
  };

  const drawLadder = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const numLines = menus.length;
    const padding = 50;
    const width = canvas.width;
    const height = canvas.height;
    const lineSpacing = (width - padding * 2) / (numLines - 1);
    const levelHeight = 25;

    ctx.clearRect(0, 0, width, height);

    // Draw vertical lines
    ctx.strokeStyle = "#10B981"; // emerald-500
    ctx.lineWidth = 3;
    for (let i = 0; i < numLines; i++) {
      const x = padding + i * lineSpacing;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ladderData.length * levelHeight);
      ctx.stroke();
    }

    // Draw horizontal bridges
    ctx.strokeStyle = "#14B8A6"; // teal-500
    ctx.lineWidth = 3;
    ladderData.forEach((bridges, level) => {
      bridges.forEach((pos) => {
        const x1 = padding + pos * lineSpacing;
        const x2 = padding + (pos + 1) * lineSpacing;
        const y = level * levelHeight + levelHeight / 2;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      });
    });
  };

  const animateLadderPath = (startPos: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const numLines = menus.length;
    const padding = 50;
    const width = canvas.width;
    const lineSpacing = (width - padding * 2) / (numLines - 1);
    const levelHeight = 25;

    let currentLevel = 0;
    let currentPos = startPos;
    let segmentProgress = 0;
    let currentSegment = 0; // 0: down to bridge, 1: horizontal, 2: down from bridge (or just 0 for straight down)
    const pixelsPerFrame = 1.5; // Constant speed in pixels per frame

    const animate = () => {
      if (currentLevel >= ladderData.length) {
        setSelectedMenu(menus[currentPos]);
        setIsAnimating(false);
        setTimeout(() => {
          setView("result");
        }, 500);
        return;
      }

      // Clear previous ball
      drawLadder();

      // Check if there's a bridge at current position
      const bridges = ladderData[currentLevel];
      let nextPos = currentPos;

      if (bridges.includes(currentPos)) {
        nextPos = currentPos + 1;
      } else if (bridges.includes(currentPos - 1)) {
        nextPos = currentPos - 1;
      }

      let currentX, currentY;
      const hasBridge = currentPos !== nextPos;

      if (hasBridge) {
        // There's a bridge - move in three segments
        const segment1Distance = levelHeight / 2; // down to bridge
        const segment2Distance = Math.abs(lineSpacing); // horizontal
        const segment3Distance = levelHeight / 2; // down from bridge

        if (currentSegment === 0) {
          // Segment 1: Move down to bridge level
          currentX = padding + currentPos * lineSpacing;
          currentY = currentLevel * levelHeight + segmentProgress;

          segmentProgress += pixelsPerFrame;
          if (segmentProgress >= segment1Distance) {
            segmentProgress = 0;
            currentSegment = 1;
          }
        } else if (currentSegment === 1) {
          // Segment 2: Move horizontally across bridge
          const direction = nextPos > currentPos ? 1 : -1;
          currentX = padding + currentPos * lineSpacing + segmentProgress * direction;
          currentY = currentLevel * levelHeight + levelHeight / 2;

          segmentProgress += pixelsPerFrame;
          if (segmentProgress >= segment2Distance) {
            segmentProgress = 0;
            currentSegment = 2;
          }
        } else {
          // Segment 3: Move down from bridge to next level
          currentX = padding + nextPos * lineSpacing;
          currentY = currentLevel * levelHeight + levelHeight / 2 + segmentProgress;

          segmentProgress += pixelsPerFrame;
          if (segmentProgress >= segment3Distance) {
            segmentProgress = 0;
            currentSegment = 0;
            currentPos = nextPos;
            currentLevel++;
          }
        }
      } else {
        // No bridge - just move straight down at constant speed
        currentX = padding + currentPos * lineSpacing;
        currentY = currentLevel * levelHeight + segmentProgress;

        segmentProgress += pixelsPerFrame;
        if (segmentProgress >= levelHeight) {
          segmentProgress = 0;
          currentLevel++;
        }
      }

      // Draw ball
      ctx.fillStyle = "#F59E0B"; // amber-500
      ctx.beginPath();
      ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.arc(currentX, currentY + 2, 8, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const handleLadderStart = (startPos: number) => {
    setSelectedStart(startPos);
    setIsAnimating(true);
    animateLadderPath(startPos);
  };

  useEffect(() => {
    if (view === "ladder" && canvasRef.current && ladderData.length > 0) {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(container.clientWidth - 40, 800);
        canvas.height = ladderData.length * 25;
      }
      drawLadder();
    }

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, ladderData]);

  const isAddDisabled = !inputValue.trim() || menus.length >= 10;
  const isSelectionDisabled = menus.length < 2;

  // Render Input View
  if (view === "input") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="pt-4 px-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            <Home className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">홈으로</span>
          </button>
        </div>

        <header className="pt-8 pb-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Utensils className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              메뉴 고르기
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              최대 10개까지 메뉴를 입력하고
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              룰렛 또는 사다리타기로 오늘의 메뉴를 결정하세요!
            </p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 pb-16">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                메뉴 입력
              </h2>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {menus.length}/10
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메뉴 이름을 입력하세요"
                maxLength={20}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-all"
              />
              <button
                onClick={handleAddMenu}
                disabled={isAddDisabled}
                className={`px-4 py-3 rounded-xl font-medium transition-transform ${
                  isAddDisabled
                    ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md active:scale-95"
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {menus.length > 0 ? (
              <div className="space-y-2">
                {menus.map((menu, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border border-orange-200 dark:border-orange-800/30 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 dark:text-white font-medium">
                        {menu}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveMenu(index)}
                      className="p-1 rounded-lg text-red-500 bg-red-50 dark:bg-red-900/20 active:scale-90 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">메뉴를 추가해주세요</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-4">
              선택 방식
            </h2>

            <button
              onClick={handleStartRoulette}
              disabled={isSelectionDisabled}
              className={`relative w-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-transform ${
                isSelectionDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "active:scale-98"
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white text-left">
                룰렛
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-left">
                돌고 돌아 선택되는 재미! 운에 맡겨보세요
              </p>

              {!isSelectionDisabled && (
                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
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
              )}
            </button>

            <button
              onClick={handleStartLadder}
              disabled={isSelectionDisabled}
              className={`relative w-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-transform ${
                isSelectionDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "active:scale-98"
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <GitBranch className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white text-left">
                사다리타기
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-left">
                사다리를 타고 내려가 메뉴를 선택하세요
              </p>

              {!isSelectionDisabled && (
                <div className="mt-4 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
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
              )}
            </button>

            {isSelectionDisabled && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                메뉴를 최소 2개 이상 입력해주세요
              </p>
            )}
          </div>
        </main>

        <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Made with ❤️ for KNU Students</p>
        </footer>
      </div>
    );
  }

  // Render Roulette View
  if (view === "roulette") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="pt-4 px-4">
          <button
            onClick={handleBackToInput}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            <Home className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">처음으로</span>
          </button>
        </div>

        <main className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              룰렛 돌리기
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              버튼을 눌러 룰렛을 돌려보세요!
            </p>
          </div>

          <div className="flex justify-center items-center mb-8">
            <div className="w-full max-w-sm aspect-square flex items-center justify-center">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={getRouletteData()}
                onStopSpinning={handleStopSpinning}
                backgroundColors={["#3e3e3e", "#df3428"]}
                textColors={["#ffffff"]}
                outerBorderColor="#374151"
                outerBorderWidth={5}
                innerBorderColor="#6B7280"
                innerBorderWidth={5}
                innerRadius={20}
                radiusLineColor="#374151"
                radiusLineWidth={2}
                fontSize={16}
                perpendicularText={false}
                textDistance={60}
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSpinClick}
              disabled={mustSpin}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-transform ${
                mustSpin
                  ? "bg-gray-300 dark:bg-slate-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg active:scale-95"
              }`}
            >
              {mustSpin ? "돌리는 중..." : "룰렛 돌리기"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Render Ladder View
  if (view === "ladder") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="pt-4 px-4">
          <button
            onClick={handleBackToInput}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95 transition-transform"
          >
            <Home className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">처음으로</span>
          </button>
        </div>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              사다리타기
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedStart === null ? "출발 위치를 선택하세요" : "사다리를 타고 있습니다..."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-6">
            {/* Start Buttons */}
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {menus.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleLadderStart(index)}
                  disabled={selectedStart !== null || isAnimating}
                  className={`px-6 py-3 rounded-xl font-bold transition-transform ${
                    selectedStart === index
                      ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white scale-105 shadow-lg"
                      : selectedStart !== null
                      ? "bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md active:scale-95"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Canvas */}
            <div className="overflow-x-auto">
              <canvas
                ref={canvasRef}
                className="mx-auto"
                style={{ maxWidth: "100%" }}
              />
            </div>

            {/* Result Menus */}
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              {menus.map((menu, index) => (
                <div
                  key={index}
                  className="px-4 py-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold text-center text-sm min-w-[80px]"
                >
                  {menu}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Render Result View
  if (view === "result") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl mb-8">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6">
                  <Utensils className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
                  오늘의 메뉴는...
                </h2>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {selectedMenu}
                </h1>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setView("input");
                  setSelectedMenu("");
                  setMustSpin(false);
                  setPrizeNumber(0);
                  setSelectedStart(null);
                  setLadderData([]);
                  setIsAnimating(false);
                  if (animationRef.current !== undefined) {
                    cancelAnimationFrame(animationRef.current);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold shadow-md active:scale-95 transition-transform"
              >
                <RotateCcw className="w-5 h-5" />
                다시 하기
              </button>
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold shadow-lg active:scale-95 transition-transform"
              >
                <Home className="w-5 h-5" />
                홈으로
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
