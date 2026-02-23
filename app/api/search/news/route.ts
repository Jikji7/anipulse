// 뉴스 검색 API 라우트
import { NextRequest, NextResponse } from 'next/server';
import { searchNews } from '@/lib/news';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchNews(query);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: '뉴스 검색에 실패했습니다.' },
      { status: 500 }
    );
  }
}
