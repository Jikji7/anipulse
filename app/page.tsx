'use client';

// 메인 페이지 - 최신 애니 뉴스 피드
import { useState, useEffect, useCallback } from 'react';
import NewsCard from '@/components/NewsCard';
import NewsFilter from '@/components/NewsFilter';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { NewsItem, NewsSource } from '@/lib/types';

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [activeSource, setActiveSource] = useState<NewsSource>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // 뉴스 데이터 불러오기
  const fetchNews = useCallback(async (source: NewsSource) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = source === 'all' ? '/api/news' : `/api/news?source=${source}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('뉴스를 불러오는데 실패했습니다.');
      const data = await response.json();
      setNews(data);
      setFilteredNews(data);
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setNews([]);
      setFilteredNews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로딩
  useEffect(() => {
    fetchNews('all');
  }, [fetchNews]);

  // 소스 필터 변경
  const handleSourceChange = (source: NewsSource) => {
    setActiveSource(source);
    fetchNews(source);
  };

  // 현재 페이지 뉴스
  const paginatedNews = filteredNews.slice(0, page * itemsPerPage);
  const hasMore = paginatedNews.length < filteredNews.length;

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          🗞️ 최신 애니메이션 뉴스
        </h1>
        <p className="text-gray-400">
          최신 애니메이션 소식을 한곳에서 모아보세요
        </p>
      </div>

      {/* 소스 필터 */}
      <div className="mb-6">
        <NewsFilter activeSource={activeSource} onSourceChange={handleSourceChange} />
      </div>

      {/* 에러 상태 */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-center mb-6">
          <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
          <button
            onClick={() => fetchNews(activeSource)}
            className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 로딩 스켈레톤 */}
      {isLoading && <LoadingSkeleton count={12} type="news" />}

      {/* 뉴스 그리드 */}
      {!isLoading && !error && (
        <>
          {filteredNews.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg">뉴스가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedNews.map(item => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>

              {/* 더 보기 버튼 */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
                  >
                    더 보기 ({filteredNews.length - paginatedNews.length}개 남음)
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
