// 애니메이션 검색 API 라우트
import { NextRequest, NextResponse } from 'next/server';
import { searchAnime } from '@/lib/anilist';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchAnime(query);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: '애니메이션 검색에 실패했습니다.' },
      { status: 500 }
    );
  }
}
