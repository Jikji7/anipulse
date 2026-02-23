// Next.js API Route: 번역 (Google Translate 무료 API 사용)
import { NextRequest, NextResponse } from 'next/server';

async function translateText(text: string, targetLang: string): Promise<string> {
  // Google Translate 무료 비공식 API
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!response.ok) {
    throw new Error(`번역 API 오류: ${response.status}`);
  }

  const data = await response.json();
  return (data[0] as Array<[string]>).map((segment) => segment[0]).join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetLang = 'ko' } = body;

    // 단일 텍스트: { text: string }
    if (typeof body.text === 'string') {
      if (!body.text) {
        return NextResponse.json({ error: '번역할 텍스트가 없습니다.' }, { status: 400 });
      }
      const translated = await translateText(body.text, targetLang);
      return NextResponse.json({ translated });
    }

    // 여러 텍스트 배열: { texts: string[] }
    if (Array.isArray(body.texts)) {
      const results = await Promise.all(
        body.texts.map((t: string) => (t ? translateText(t, targetLang) : Promise.resolve('')))
      );
      return NextResponse.json({ translated: results });
    }

    return NextResponse.json({ error: '번역할 텍스트가 없습니다.' }, { status: 400 });
  } catch (error) {
    console.error('번역 실패:', error);
    return NextResponse.json(
      { error: '번역에 실패했습니다.' },
      { status: 500 }
    );
  }
}
