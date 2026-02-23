// 뉴스 카테고리 타입
export type NewsCategory = 'ALL' | 'ANIME' | 'LIGHTNOVEL' | 'MANGA';

// 뉴스 아이템 타입
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  source: 'ANN' | 'MAL' | 'CR';
  date: string;
  thumbnail?: string;
  category?: NewsCategory;
}

// 애니메이션 타입
export interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  genres: string[];
  averageScore: number | null;
  status: string;
  seasonYear: number | null;
  description: string | null;
}

// 제작사 타입
export interface Studio {
  id: number;
  name: string;
  siteUrl: string;
  media: {
    nodes: Anime[];
  };
}

// 제작사 목록 아이템 타입 (간략 버전)
export interface StudioListItem {
  id: number;
  name: string;
  coverAnime?: Anime;
}
