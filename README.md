# AniPulse 🎌

애니메이션 뉴스와 제작사 정보를 한곳에서 모아볼 수 있는 웹사이트입니다.

## 📋 주요 기능

- **🗞️ 애니 뉴스 피드**: 최신 애니메이션 뉴스를 카드 형태로 표시
- **🏢 제작사 목록**: MAPPA, ufotable 등 유명 제작사 정보
- **🎬 제작사 상세**: 각 제작사의 애니메이션 작품 목록
- **🔍 통합 검색**: 뉴스, 제작사, 애니메이션 통합 검색

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**:
  - [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/) (GraphQL) - 애니메이션 & 제작사 정보
  - [AniNewsAPI](https://aninewsapi.vercel.app) - 애니 뉴스

## 🚀 시작하기

### 사전 요구 사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/Jikji7/anipulse.git
cd anipulse

# 의존성 설치
npm install
```

### 실행 방법

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

## 📁 프로젝트 구조

```
anipulse/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (네비게이션 포함)
│   ├── page.tsx            # 메인 페이지 (뉴스 피드)
│   ├── globals.css         # 전역 스타일
│   ├── studios/
│   │   └── page.tsx        # 제작사 목록
│   ├── studio/
│   │   └── [id]/
│   │       └── page.tsx    # 제작사 상세
│   ├── search/
│   │   └── page.tsx        # 검색 페이지
│   └── api/
│       ├── news/           # 뉴스 API
│       └── search/         # 검색 API
├── components/
│   ├── Navbar.tsx          # 네비게이션 바
│   ├── NewsCard.tsx        # 뉴스 카드
│   ├── StudioCard.tsx      # 제작사 카드
│   ├── AnimeCard.tsx       # 애니메이션 카드
│   ├── SearchBar.tsx       # 검색 바
│   ├── NewsFilter.tsx      # 뉴스 필터
│   └── LoadingSkeleton.tsx # 로딩 스켈레톤
└── lib/
    ├── anilist.ts          # AniList API 함수
    ├── news.ts             # 뉴스 API 함수
    └── types.ts            # TypeScript 타입
```

## 🌐 배포 (Vercel)

이 프로젝트는 Vercel 배포에 최적화되어 있습니다.

1. [Vercel](https://vercel.com)에 가입하고 GitHub 저장소 연결
2. 추가 환경 변수 설정 불필요 (무료 API 사용)
3. 자동 배포 완료!

## 📝 API 정보

### AniList API
- **URL**: https://graphql.anilist.co
- **타입**: GraphQL
- **인증**: 불필요 (무료 공개 API)

### AniNewsAPI
- **URL**: https://aninewsapi.vercel.app/api/news
- **타입**: REST
- **인증**: 불필요

## 🎨 디자인

- 다크 테마 기반
- 보라색/파란색 accent 컬러
- 반응형 디자인 (모바일/태블릿/데스크탑)
