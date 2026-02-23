// 뉴스 API 라우트 핸들러
import { NextRequest, NextResponse } from 'next/server';
import { fetchNewsFromAPI } from '@/lib/news';
import { NewsSource } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') as NewsSource | null;

  try {
    const news = await fetchNewsFromAPI(source || 'all');
    return NextResponse.json(news);
  } catch {
    return NextResponse.json(
      { error: '뉴스를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
