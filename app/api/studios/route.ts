import { NextResponse } from 'next/server';
import { getStudios, FAMOUS_STUDIO_IDS } from '@/lib/anilist';
import type { Studio } from '@/lib/types';

export async function GET() {
  let studios: Studio[] = [];
  try {
    studios = await getStudios(FAMOUS_STUDIO_IDS.map((s) => s.id));
  } catch (error) {
    console.error('제작사 API 오류:', error);
  }

  if (studios.length === 0) {
    // AniList API 실패 시 정적 fallback 반환 (이름+ID만)
    const fallback = FAMOUS_STUDIO_IDS.map((s) => ({
      id: s.id,
      name: s.name,
      siteUrl: `https://anilist.co/studio/${s.id}`,
      media: { nodes: [] },
    }));
    return NextResponse.json({ studios: fallback, fallback: true });
  }

  return NextResponse.json({ studios });
}
