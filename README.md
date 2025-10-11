# 🚪 KNOCK-KNU (노크누)

> “Knock on KNU, break the ice together!”  
> 경북대학교 학생들을 위한 캠퍼스 소셜 & 유틸리티 플랫폼 🎓  
> 아이스브레이킹부터 메뉴 선택, MBTI 궁합, 지도 기반 맛집 탐색까지 한 곳에서!

---

## 🧊 서비스 소개

**KNOCK-KNU**는 경북대학교 학생들이 쉽게 친해지고, 소통하며, 함께 일상을 나눌 수 있도록 돕는 서비스입니다.  
친구들과의 **아이스브레이킹**, **밥약 메뉴 고르기**, **MBTI 궁합 보기**, **학교 주변 맛집 탐색**까지  
캠퍼스 생활을 더 즐겁게 만들어주는 기능들을 제공합니다.

---

## 💡 주요 기능

### 1️⃣ 아이스브레이킹 (Ice Breaking)
- 상황 선택: 밥약, 과팅, 팀플, 모꼬지 등 다양한 상황 중 선택
- OpenAI 기반 질문 자동 생성 (예: “처음 만난 사람에게 물어보면 좋은 질문은?”)
- 자연스럽게 대화를 시작할 수 있는 AI 추천 질문 제공

### 2️⃣ 메뉴 고르기 (Menu Picker)
- 최대 **10개**까지 메뉴 입력 가능  
- 선택 방식: 🎯 **룰렛** or 🪜 **사다리타기**
- 팀플, 밥약 등에서 “오늘 뭐 먹지?” 고민을 해결!

### 3️⃣ MBTI 궁합 보기 (MBTI Matching)
- MBTI 입력만으로 궁합 결과를 AI가 분석  
- OpenAI 기반으로 성향·대화 스타일까지 포함한 상세 궁합 설명 제공  

### 4️⃣ KNU 맵 (KNU Map)
- 지도 API를 활용해 **학교 반경 1km 내 식당, 카페, 편의시설** 표시  
- 리뷰, 혼잡도, 거리별 필터 기능 제공 예정

---

## 🧱 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | Next.js, TypeScript, React Query, TailwindCSS |
| **Backend** | Spring Boot, Java 17, JPA, MySQL |
| **AI Integration** | OpenAI API (GPT 모델 기반) |
| **Infra** | AWS EC2, RDS, S3 |
| **Map API** | Kakao Map API or Naver Map API |
| **Version Control** | GitHub, Git Flow 전략 |

---

## 🧭 시스템 아키텍처

```plaintext
[Next.js]  →  [Spring Boot REST API]  →  [OpenAI API]
                  ↓
             [MySQL / RDS]
                  ↓
             [Map API (Kakao/Naver)]
