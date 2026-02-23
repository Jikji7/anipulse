// TypeScript 타입 정의 파일

// 뉴스 아이템 타입
export interface NewsItem {
  id: string;
  title: string;
  snippet: string;
  source: string;
  url: string;
  publishedAt: string;
  thumbnail?: string;
}

// 제작사(스튜디오) 타입
export interface Studio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
  favourites?: number;
  siteUrl?: string;
  media?: {
    nodes: AnimeItem[];
  };
}

// 애니메이션 아이템 타입
export interface AnimeItem {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    large: string;
  };
  genres: string[];
  averageScore?: number;
  status: string;
  seasonYear?: number;
  description?: string;
  episodes?: number;
}

// 뉴스 소스 타입
export type NewsSource = 'all' | 'ann' | 'crunchyroll' | 'mal';

// 검색 결과 타입
export interface SearchResults {
  news: NewsItem[];
  studios: Studio[];
  anime: AnimeItem[];
}

// AniList API 응답 타입
export interface AniListStudioResponse {
  data: {
    Studio: Studio;
  };
}

export interface AniListStudiosResponse {
  data: {
    Page: {
      studios: Studio[];
    };
  };
}

export interface AniListAnimeSearchResponse {
  data: {
    Page: {
      media: AnimeItem[];
    };
  };
}
