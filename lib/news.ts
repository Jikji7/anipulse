// 뉴스 API 및 RSS 피드 호출 함수들

import { NewsItem, NewsSource } from './types';

const ANI_NEWS_API = 'https://aninewsapi.vercel.app/api/news';

// AniNewsAPI에서 뉴스 가져오기
export async function fetchNewsFromAPI(source?: NewsSource): Promise<NewsItem[]> {
  try {
    const url = source && source !== 'all'
      ? `${ANI_NEWS_API}?source=${source}`
      : ANI_NEWS_API;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!response.ok) {
      throw new Error(`뉴스 API 오류: ${response.status}`);
    }

    const data = await response.json();

    // API 응답 형식에 맞게 파싱
    if (Array.isArray(data)) {
      return data.map((item: Record<string, string>, index: number) => ({
        id: item.id || `news-${index}`,
        title: item.title || '제목 없음',
        snippet: item.snippet || item.description || item.summary || '',
        source: item.source || '알 수 없음',
        url: item.url || item.link || '#',
        publishedAt: item.publishedAt || item.date || item.pubDate || new Date().toISOString(),
        thumbnail: item.thumbnail || item.image || item.imageUrl,
      }));
    }

    // 응답이 객체인 경우 (items 또는 articles 필드)
    const items = data.items || data.articles || data.news || [];
    return items.map((item: Record<string, string>, index: number) => ({
      id: item.id || `news-${index}`,
      title: item.title || '제목 없음',
      snippet: item.snippet || item.description || item.summary || '',
      source: item.source || '알 수 없음',
      url: item.url || item.link || '#',
      publishedAt: item.publishedAt || item.date || item.pubDate || new Date().toISOString(),
      thumbnail: item.thumbnail || item.image || item.imageUrl,
    }));
  } catch (error) {
    console.error('AniNewsAPI 호출 실패:', error);
    return [];
  }
}

// 뉴스 제목으로 검색
export async function searchNews(query: string): Promise<NewsItem[]> {
  try {
    const allNews = await fetchNewsFromAPI();
    const lowerQuery = query.toLowerCase();
    return allNews.filter(
      news =>
        news.title.toLowerCase().includes(lowerQuery) ||
        news.snippet.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('뉴스 검색 실패:', error);
    return [];
  }
}

// 제작사 이름으로 관련 뉴스 필터링
export async function getNewsForStudio(studioName: string): Promise<NewsItem[]> {
  try {
    const allNews = await fetchNewsFromAPI();
    const lowerName = studioName.toLowerCase();
    return allNews.filter(
      news =>
        news.title.toLowerCase().includes(lowerName) ||
        news.snippet.toLowerCase().includes(lowerName)
    );
  } catch (error) {
    console.error('제작사 관련 뉴스 가져오기 실패:', error);
    return [];
  }
}

// 날짜 형식 변환 (한국어)
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
