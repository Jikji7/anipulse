// Next.js API Route: RSS 뉴스 파싱 (서버사이드)
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS } from '@/lib/news';
import { NewsItem } from '@/lib/types';

const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail'],
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
    ],
  },
});

// 에피소드 업데이트 제목 패턴 (뉴스가 아닌 시청 링크)
const EPISODE_PATTERNS = [
  /- Episode \d/i,
  /- \d+화/,
  /Episode \d+/i,
  /\(러시아어/,
  /\(독일어/,
  /\(영어 더빙\)/,
  /Season \d+ - \d+/i,
  /[\u0400-\u04FF]/, // 키릴 문자 (러시아어 등)
  /[\u0600-\u06FF]/, // 아랍 문자
];

// 제목이 에피소드 업데이트인지 확인
function isEpisodeTitle(title: string): boolean {
  return EPISODE_PATTERNS.some((pattern) => pattern.test(title));
}

// HTML 태그 및 엔티티 제거
function stripHtml(text: string): string {
  // HTML 태그 반복 제거 (중첩 난독화 방지)
  let result = text;
  let prev = '';
  while (result !== prev) {
    prev = result;
    result = result.replace(/<[^>]*>/g, '');
  }
  // HTML 엔티티를 단일 패스로 디코드 (이중 디코딩 방지)
  result = result.replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[\da-fA-F]+);/gi, (_match, entity) => {
    switch (entity.toLowerCase()) {
      case 'amp': return '&';
      case 'lt': return '<';
      case 'gt': return '>';
      case 'quot': return '"';
      case 'apos': return "'";
      case 'nbsp': return ' ';
      default:
        if (entity.startsWith('#x')) return String.fromCharCode(parseInt(entity.slice(2), 16));
        if (entity.startsWith('#')) return String.fromCharCode(parseInt(entity.slice(1), 10));
        return _match;
    }
  });
  return result.replace(/\s+/g, ' ').trim();
}

// 각 RSS 피드 아이템에서 썸네일 추출
function extractThumbnail(item: Record<string, unknown>): string | undefined {
  if (item.mediaThumbnail && typeof item.mediaThumbnail === 'object') {
    const mt = item.mediaThumbnail as Record<string, unknown>;
    if (mt.$ && typeof mt.$ === 'object') {
      const attrs = mt.$ as Record<string, unknown>;
      if (typeof attrs.url === 'string') return attrs.url;
    }
  }
  if (item.mediaContent && typeof item.mediaContent === 'object') {
    const mc = item.mediaContent as Record<string, unknown>;
    if (mc.$ && typeof mc.$ === 'object') {
      const attrs = mc.$ as Record<string, unknown>;
      if (typeof attrs.url === 'string') return attrs.url;
    }
  }
  if (item.enclosure && typeof item.enclosure === 'object') {
    const enc = item.enclosure as Record<string, unknown>;
    if (typeof enc.url === 'string') return enc.url;
  }
  // content에서 img 태그 추출
  const content = (item.content || item['content:encoded'] || '') as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  return undefined;
}

export async function GET() {
  try {
    const allNews: NewsItem[] = [];

    // 모든 RSS 피드를 병렬로 가져오기
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async ({ url, source }) => {
        const feed = await parser.parseURL(url);
        return feed.items
          .filter((item) => !isEpisodeTitle(item.title || ''))
          .map((item, idx) => ({
            id: `${source}-${idx}-${Date.now()}`,
            title: item.title || '제목 없음',
            description: stripHtml(item.contentSnippet || item.content || item.summary || ''),
            link: item.link || '#',
            source,
            date: item.pubDate || item.isoDate || new Date().toISOString(),
            thumbnail: extractThumbnail(item as unknown as Record<string, unknown>),
          }));
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
      }
    }

    // 날짜 기준 최신순 정렬
    allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ news: allNews }, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('뉴스 가져오기 실패:', error);
    return NextResponse.json(
      { error: '뉴스를 불러오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}
