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
        return feed.items.map((item, idx) => ({
          id: `${source}-${idx}-${Date.now()}`,
          title: item.title || '제목 없음',
          description: item.contentSnippet || item.content || item.summary || '',
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
