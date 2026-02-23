import StudioCard from '@/components/StudioCard';
import { getStudios, FAMOUS_STUDIO_IDS } from '@/lib/anilist';
import { Studio } from '@/lib/types';

// 제작사 목록 페이지 (서버 컴포넌트)
export default async function StudiosPage() {
  let studios: Studio[] = [];
  let error: string | null = null;

  try {
    studios = await getStudios(FAMOUS_STUDIO_IDS.map((s) => s.id));
  } catch (e) {
    error = e instanceof Error ? e.message : '제작사 정보를 불러오는 데 실패했습니다.';
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">🏢 애니메이션 제작사</h1>
        <p className="text-gray-400">유명 애니메이션 제작사들의 대표작을 확인하세요</p>
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* 제작사 그리드 */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
}
