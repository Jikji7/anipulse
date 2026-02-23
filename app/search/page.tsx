'use client';

// 통합 검색 페이지
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';
import StudioCard from '@/components/StudioCard';
import AnimeCard from '@/components/AnimeCard';
import { NewsItem, Studio, AnimeItem } from '@/lib/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'news' | 'studios' | 'anime'>('news');
  const [isLoading, setIsLoading] = useState(false);
  const [newsResults, setNewsResults] = useState<NewsItem[]>([]);
  const [studioResults, setStudioResults] = useState<Studio[]>([]);
  const [animeResults, setAnimeResults] = useState<AnimeItem[]>([]);

  // 검색 실행
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);

    try {
      // 뉴스, 제작사, 애니 동시 검색
      const [newsRes, studiosRes, animeRes] = await Promise.allSettled([
        fetch(`/api/search/news?q=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
        fetch(`/api/search/studios?q=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
        fetch(`/api/search/anime?q=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
      ]);

      setNewsResults(newsRes.status === 'fulfilled' ? newsRes.value : []);
      setStudioResults(studiosRes.status === 'fulfilled' ? studiosRes.value : []);
      setAnimeResults(animeRes.status === 'fulfilled' ? animeRes.value : []);
    } catch (error) {
      console.error('검색 오류:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // URL에 쿼리가 있으면 자동 검색
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  const tabs = [
    { id: 'news' as const, label: '뉴스', count: newsResults.length },
    { id: 'studios' as const, label: '제작사', count: studioResults.length },
    { id: 'anime' as const, label: '애니메이션', count: animeResults.length },
  ];

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🔍 통합 검색</h1>
        <p className="text-gray-400">뉴스, 제작사, 애니메이션을 검색해보세요</p>
      </div>

      {/* 검색 바 */}
      <div className="mb-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          placeholder="애니메이션, 제작사, 뉴스 검색..."
        />
      </div>

      {/* 검색 결과 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">검색 중...</p>
          </div>
        </div>
      ) : query && (newsResults.length > 0 || studioResults.length > 0 || animeResults.length > 0) ? (
        <div>
          {/* 탭 메뉴 */}
          <div className="flex gap-2 mb-6 border-b border-gray-800">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-purple-400'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'news' && (
            <div>
              {newsResults.length === 0 ? (
                <p className="text-gray-500 text-center py-8">뉴스 결과가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {newsResults.map(news => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'studios' && (
            <div>
              {studioResults.length === 0 ? (
                <p className="text-gray-500 text-center py-8">제작사 결과가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {studioResults.map(studio => (
                    <StudioCard key={studio.id} studio={studio} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'anime' && (
            <div>
              {animeResults.length === 0 ? (
                <p className="text-gray-500 text-center py-8">애니메이션 결과가 없습니다.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {animeResults.map(anime => (
                    <AnimeCard key={anime.id} anime={anime} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : query ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">&quot;{query}&quot;에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">검색어를 입력하세요</p>
          <p className="text-sm mt-2">뉴스, 제작사, 애니메이션을 검색할 수 있습니다</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">로딩 중...</div>}>
      <SearchContent />
    </Suspense>
  );
}
