// MBTI Types
export type MBTIType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

// Ice Breaking Types
export type IceBreakingCategory = "밥약" | "과팅" | "팀플" | "모꼬지";

export interface IceBreakingQuestion {
  id: string;
  category: IceBreakingCategory;
  question: string;
}

// Menu Picker Types
export type MenuSelectionMode = "룰렛" | "사다리타기";

export interface MenuItem {
  id: string;
  name: string;
}

// MBTI Matching Types
export interface MBTIMatchResult {
  score: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

// Fortune Types
export interface FortuneResult {
  date: string;
  mbti: MBTIType;
  birthDate: string;
  fortune: string;
  luckyItem?: string;
  luckyColor?: string;
}

// Map Types (placeholder for future implementation)
export interface MapLocation {
  id: string;
  name: string;
  category: "식당" | "카페" | "편의시설";
  latitude: number;
  longitude: number;
  distance?: number;
  rating?: number;
  reviewCount?: number;
}
