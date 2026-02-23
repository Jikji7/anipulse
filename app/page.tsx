'use client';

import { useEffect, useState, useCallback } from 'react';
import NewsCard from '@/components/NewsCard';
import NewsFilter from '@/components/NewsFilter';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { NewsItem } from '@/lib/types';

type Source = 'ALL' | 'ANN' | 'MAL' | 'CR';
type Lang = 'KR' | 'EN' | 'JP';

const PAGE_SIZE = 12;

const LANG_LABELS: Record<Lang, string> = {
  KR: '🇰🇷 KR',
  EN: '🇺🇸 EN',
  JP: '🇯🇵 JP',
};

const LANG_CODES: Record<Lang, string> = {
  KR: 'ko',
  EN: 'en',
  JP: 'ja',
};

// 메인 뉴스 피드 페이지
export default function HomePage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<Source>('ALL');
  const [page, setPage] = useState(1);
  const [globalLang, setGlobalLang] = useState<Lang | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translatedNews, setTranslatedNews] = useState<Map<string, { title: string; description: string }>>(new Map());

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('뉴스를 불러오는 데 실패했습니다.');
      const data = await res.json();
      setAllNews(data.news || []);
      setTranslatedNews(new Map());
      setGlobalLang(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleGlobalLang = async (lang: Lang) => {
    if (globalLang === lang) {
      setGlobalLang(null);
      setTranslatedNews(new Map());
      return;
    }

    setGlobalLang(lang);
    setTranslating(true);

    const targetCode = LANG_CODES[lang];
    const newMap = new Map<string, { title: string; description: string }>();

    // 현재 페이지에 표시되는 뉴스만 번역 (최대 5개씩 병렬 처리)
    const filtered = activeSource === 'ALL' ? allNews : allNews.filter((n) => n.source === activeSource);
    const visible = filtered.slice(0, page * PAGE_SIZE);
    const CHUNK_SIZE = 5;

    for (let i = 0; i < visible.length; i += CHUNK_SIZE) {
      const chunk = visible.slice(i, i + CHUNK_SIZE);
      await Promise.allSettled(
        chunk.map(async (item) => {
          try {
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ texts: [item.title, item.description], targetLang: targetCode }),
            });
            const data = await res.json();
            if (!data.error && Array.isArray(data.translated)) {
              newMap.set(item.id, {
                title: data.translated[0] || item.title,
                description: data.translated[1] || item.description,
              });
            }
          } catch (err) {
            console.error(`번역 실패 (id: ${item.id}):`, err);
          }
        })
      );
    }

    setTranslatedNews(newMap);
    setTranslating(false);
  };

  // 소스 필터 적용
  const filtered = activeSource === 'ALL'
    ? allNews
    : allNews.filter((n) => n.source === activeSource);

  // 페이지네이션
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  const handleSourceChange = (source: Source) => {
    setActiveSource(source);
    setPage(1);
  };

  // 전체 번역이 적용된 뉴스 목록
  const displayNews = paginated.map((item) => {
    const t = translatedNews.get(item.id);
    if (!t) return item;
    return { ...item, title: t.title, description: t.description };
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">🗞️ 애니 뉴스</h1>
          <p className="text-gray-400">최신 애니메이션 뉴스를 한눈에 확인하세요</p>
        </div>

        {/* 전체 번역 토글 */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1 border border-gray-700">
          {(Object.keys(LANG_LABELS) as Lang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleGlobalLang(lang)}
              disabled={translating}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                globalLang === lang
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {translating && globalLang === lang ? '번역 중...' : LANG_LABELS[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* 필터 */}
      <NewsFilter active={activeSource} onChange={handleSourceChange} />

      {/* 에러 */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center space-y-3">
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchNews}
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 로딩 */}
      {loading && <LoadingSkeleton count={12} type="news" />}

      {/* 뉴스 그리드 */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4">📰</p>
              <p>해당 소스의 뉴스가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}

          {/* 더 보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                더 보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
