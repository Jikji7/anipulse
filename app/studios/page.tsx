// 제작사 목록 페이지
import StudioCard from '@/components/StudioCard';
import { StudioCardSkeleton } from '@/components/LoadingSkeleton';
import { getFamousStudios } from '@/lib/anilist';

export const metadata = {
  title: '제작사 목록 | AniPulse',
  description: '유명 애니메이션 제작사 목록',
};

export default async function StudiosPage() {
  // 서버에서 제작사 데이터 가져오기
  const studios = await getFamousStudios();

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          🏢 애니메이션 제작사
        </h1>
        <p className="text-gray-400">
          유명 애니메이션 제작사들의 작품 목록을 확인하세요
        </p>
      </div>

      {/* 제작사 그리드 */}
      {studios.length === 0 ? (
        <div>
          <p className="text-gray-400 mb-4">데이터를 불러오는 중...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {studios.map(studio => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
}
