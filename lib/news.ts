// 뉴스 관련 유틸리티
import { NewsCategory, NewsItem } from './types';

// RSS 피드 URL 목록
export const RSS_FEEDS = [
  { url: 'https://www.animenewsnetwork.com/all/rss.xml', source: 'ANN' as const },
  { url: 'https://myanimelist.net/rss/news.xml', source: 'MAL' as const },
  { url: 'https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss', source: 'CR' as const },
];

// 제목/설명에서 카테고리 자동 분류
export function detectCategory(title: string, description: string): NewsCategory {
  const text = (title + ' ' + description).toLowerCase();

  // 게임 관련 키워드가 있고, 애니/만화/라노벨 키워드가 없으면 GAME으로 분류
  const gameKeywords = /\b(game|gaming|console|playstation|ps[45]|xbox|nintendo|steam|pc game|developer walkthrough|gameplay|gamer)\b/;
  const animeKeywords = /anime|animation|アニメ|manga|manhwa|manhua|light novel|\bnovel\b/;
  if (gameKeywords.test(text) && !animeKeywords.test(text)) return 'GAME';

  if (/manga|manhwa|manhua|chapter|マンガ|漫画/.test(text)) return 'MANGA';
  if (/light novel|\bnovel\b|\bln\b|ライトノベル|라노벨/.test(text)) return 'LIGHTNOVEL';
  if (/anime|animation|episode|season|アニメ/.test(text)) return 'ANIME';
  return 'ANIME';
}

// 뉴스 제목/내용에서 제작사 이름으로 필터링
export function filterNewsByStudio(news: NewsItem[], studioName: string): NewsItem[] {
  const lower = studioName.toLowerCase();
  return news.filter(
    (item) =>
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower)
  );
}

// 설명 텍스트 자르기
export function truncateDescription(desc: string, maxLength = 150): string {
  // HTML 태그 제거
  const clean = desc.replace(/<[^>]*>/g, '').trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength) + '...';
}
