import { NextResponse } from 'next/server';
import { getStudios, FAMOUS_STUDIO_IDS } from '@/lib/anilist';

export async function GET() {
  try {
    const studios = await getStudios(FAMOUS_STUDIO_IDS.map((s) => s.id));
    return NextResponse.json({ studios });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '제작사 정보를 불러오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}
