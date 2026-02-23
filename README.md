# AniPulse 🎌

애니메이션 뉴스 & 제작사 정보 모아보기 웹사이트

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **API**: AniList GraphQL API, RSS 뉴스 피드

## 기능

- 🗞️ **뉴스 피드**: Anime News Network, MyAnimeList, Crunchyroll의 최신 뉴스
- 🏢 **제작사 목록**: 유명 애니메이션 제작사 정보 (MAPPA, ufotable, Bones 등)
- 🔍 **검색**: 애니메이션 및 제작사 이름으로 검색
- 📱 **반응형**: 모바일/태블릿/데스크탑 지원
- 🌙 **다크 테마**: 보라색 accent

## 설치 방법

```bash
npm install
```

## 실행 방법

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

## 빌드

```bash
npm run build
npm start
```

## 배포 (Vercel)

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 자동 배포 완료!

또는 Vercel CLI를 사용:
```bash
npm i -g vercel
vercel
```

## 프로젝트 구조

```
anipulse/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 + Navbar
│   ├── page.tsx            # 메인: 뉴스 피드
│   ├── loading.tsx         # 로딩 UI
│   ├── error.tsx           # 에러 UI
│   ├── not-found.tsx       # 404 페이지
│   ├── studios/
│   │   └── page.tsx        # 제작사 목록
│   ├── studio/[id]/
│   │   └── page.tsx        # 제작사 상세
│   ├── search/
│   │   └── page.tsx        # 검색
│   └── api/news/
│       └── route.ts        # RSS 뉴스 API
├── components/             # 재사용 가능한 컴포넌트
├── lib/                    # 유틸리티 및 API 함수
└── public/                 # 정적 파일
```

## API

- **AniList API**: 무료 GraphQL API (API 키 불필요)
- **RSS 피드**: 서버사이드에서 파싱 (CORS 문제 없음)
