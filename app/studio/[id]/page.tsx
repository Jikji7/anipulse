import { notFound } from 'next/navigation';
import AnimeCard from '@/components/AnimeCard';
import NewsCard from '@/components/NewsCard';
import { getStudio, FAMOUS_STUDIO_IDS } from '@/lib/anilist';
import { filterNewsByStudio } from '@/lib/news';
import { NewsItem, Studio } from '@/lib/types';

interface Params {
  params: Promise<{ id: string }>;
}

// 제작사 상세 페이지 (서버 컴포넌트)
export default async function StudioDetailPage({ params }: Params) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const studioMeta = FAMOUS_STUDIO_IDS.find((s) => s.id === id);
  let studio: Studio | undefined;
  let relatedNews: NewsItem[] = [];

  try {
    const data = await getStudio(id);
    studio = data.Studio;
  } catch {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center">
        <p className="text-red-300">제작사 정보를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  if (!studio) notFound();

  // 뉴스 가져오기 (관련 뉴스 필터링)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      const data = await res.json();
      relatedNews = filterNewsByStudio(data.news || [], studio.name);
    }
  } catch {
    // 뉴스 실패해도 페이지는 표시
  }

  return (
    <div className="space-y-8">
      {/* 제작사 헤더 */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center text-4xl border border-gray-700">
          🏢
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{studio.name}</h1>
          {studio.siteUrl && (
            <a
              href={studio.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-sm mt-1 inline-block"
            >
              공식 홈페이지 →
            </a>
          )}
          {studioMeta?.twitter && (
            <a
              href={studioMeta.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 text-sm mt-1 ml-4 inline-block"
            >
              🐦 공식 X(트위터) →
            </a>
          )}
        </div>
      </div>

      {/* 애니메이션 목록 */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          📺 작품 목록 ({studio.media?.nodes?.length || 0}편)
        </h2>
        {studio.media?.nodes && studio.media.nodes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {studio.media.nodes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">작품 정보가 없습니다.</p>
        )}
      </div>

      {/* 관련 뉴스 */}
      {relatedNews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            🗞️ 관련 뉴스 ({relatedNews.length}건)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedNews.slice(0, 6).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
