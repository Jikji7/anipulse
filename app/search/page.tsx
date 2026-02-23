import SearchBar from '@/components/SearchBar';
import AnimeCard from '@/components/AnimeCard';
import StudioCard from '@/components/StudioCard';
import { searchAnime, searchStudios } from '@/lib/anilist';
import { Anime, Studio } from '@/lib/types';

interface SearchPageProps {
  searchParams: { q?: string };
}

// 검색 페이지 (서버 컴포넌트)
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  let animes: Anime[] = [];
  let studios: Studio[] = [];
  let error: string | null = null;

  if (query) {
    try {
      [animes, studios] = await Promise.all([
        searchAnime(query),
        searchStudios(query),
      ]);
    } catch (e) {
      error = e instanceof Error ? e.message : '검색 중 오류가 발생했습니다.';
    }
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">🔍 검색</h1>
        <p className="text-gray-400">애니메이션 제목 또는 제작사 이름으로 검색하세요</p>
      </div>

      {/* 검색 바 */}
      <SearchBar defaultValue={query} />

      {/* 에러 */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* 검색 결과 */}
      {query && !error && (
        <>
          {/* 애니메이션 결과 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              📺 애니메이션 ({animes.length}건)
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

          {/* 제작사 결과 */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              🏢 제작사 ({studios.length}건)
            </h2>
            {studios.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {studios.map((studio) => (
                  <StudioCard key={studio.id} studio={studio} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400">검색 결과가 없습니다.</p>
            )}
          </div>
        </>
      )}

      {/* 초기 상태 */}
      {!query && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-xl">검색어를 입력하세요</p>
        </div>
      )}
    </div>
  );
}
