'use client';

import { useState, useCallback } from 'react';
import AnimeCard from '@/components/AnimeCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { searchAnime, searchAnimeByGenre } from '@/lib/anilist';
import { Anime } from '@/lib/types';

const GENRES = [
  'Action', 'Romance', 'Fantasy', 'Comedy', 'Drama',
  'Sci-Fi', 'Horror', 'Slice of Life', 'Sports', 'Mecha',
  'Isekai', 'Music', 'Mystery', 'Thriller', 'Supernatural',
  'Adventure', 'Ecchi', 'Shounen', 'Shoujo', 'Seinen',
];

// 검색 페이지 (클라이언트 컴포넌트) - 텍스트 + 장르 태그 검색
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (text: string, genre: string | null) => {
    if (!text && !genre) {
      setAnimes([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let results: Anime[];
      if (genre) {
        results = await searchAnimeByGenre(genre);
        if (text.trim()) {
          const lower = text.toLowerCase();
          results = results.filter(
            (a) =>
              a.title.romaji?.toLowerCase().includes(lower) ||
              (a.title.english?.toLowerCase().includes(lower) ?? false)
          );
        }
      } else {
        results = await searchAnime(text);
      }
      setAnimes(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : '검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query, selectedGenre);
  };

  const handleGenreClick = (genre: string) => {
    const next = selectedGenre === genre ? null : genre;
    setSelectedGenre(next);
    if (next !== null) {
      runSearch(query, next);
    } else if (query.trim()) {
      runSearch(query, null);
    } else {
      setAnimes([]);
    }
  };

  const hasSearch = !!query.trim() || !!selectedGenre;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">🔍 검색</h1>
        <p className="text-gray-400">애니메이션 제목 또는 장르 태그로 검색하세요</p>
      </div>

      {/* 검색 바 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="애니메이션 제목 검색..."
          className="flex-1 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          검색
        </button>
      </form>

      {/* 장르 태그 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selectedGenre === genre
                ? 'bg-purple-600 border-purple-600 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* 로딩 */}
      {loading && (
        <LoadingSkeleton count={10} type="anime" />
      )}

      {/* 검색 결과 */}
      {!loading && hasSearch && !error && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            📺 애니메이션 ({animes.length}건)
            {selectedGenre && <span className="text-purple-400 ml-2 text-base font-normal">#{selectedGenre}</span>}
          </h2>
          {animes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {animes.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          )}
        </div>
      )}

      {/* 초기 상태 */}
      {!loading && !hasSearch && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-xl">검색어를 입력하거나 장르를 선택하세요</p>
        </div>
      )}
    </div>
  );
}
