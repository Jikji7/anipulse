// 제작사 상세 페이지
import { notFound } from 'next/navigation';
import { getStudioById } from '@/lib/anilist';
import { getNewsForStudio } from '@/lib/news';
import AnimeCard from '@/components/AnimeCard';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StudioPageProps) {
  const { id } = await params;
  const studio = await getStudioById(Number(id));
  return {
    title: studio ? `${studio.name} | AniPulse` : '제작사 | AniPulse',
    description: studio ? `${studio.name}의 애니메이션 목록` : '',
  };
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { id } = await params;
  const studioId = Number(id);

  // 유효하지 않은 ID 처리
  if (isNaN(studioId)) {
    notFound();
  }

  // 제작사 정보와 관련 뉴스를 병렬로 가져오기
  const [studio] = await Promise.all([
    getStudioById(studioId),
    Promise.resolve([]), // 뉴스는 제작사 이름을 알고난 후 가져옴
  ]);

  // 제작사를 찾지 못한 경우
  if (!studio) {
    notFound();
  }

  // 제작사 관련 뉴스 가져오기
  const studioNews = await getNewsForStudio(studio.name);
  const animeList = studio.media?.nodes || [];

  return (
    <div>
      {/* 뒤로 가기 */}
      <Link
        href="/studios"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 mb-6 transition-colors"
      >
        ← 제작사 목록으로
      </Link>

      {/* 제작사 헤더 */}
      <div className="mb-8 p-6 bg-gray-800 rounded-2xl">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{studio.name}</h1>
            {studio.favourites && (
              <p className="text-gray-400">
                ❤️ {studio.favourites.toLocaleString()}명이 즐겨찾기
              </p>
            )}
            <p className="text-gray-400 mt-1">
              총 {animeList.length}개의 애니메이션
            </p>
          </div>
          {studio.siteUrl && (
            <a
              href={studio.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              공식 사이트 →
            </a>
          )}
        </div>
      </div>

      {/* 애니메이션 목록 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          🎬 애니메이션 작품 목록
        </h2>
        {animeList.length === 0 ? (
          <p className="text-gray-500 text-center py-8">작품 정보가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeList.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>

      {/* 관련 뉴스 */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">
          🗞️ {studio.name} 관련 뉴스
        </h2>
        {studioNews.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-500">
            <p className="text-3xl mb-2">📭</p>
            <p>관련 뉴스가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studioNews.slice(0, 6).map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
