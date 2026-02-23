// 페이지 로딩 중 표시되는 스켈레톤 UI
// Next.js가 서버 컴포넌트를 로드하는 동안 자동으로 표시됩니다
import { StudioCardSkeleton } from '@/components/LoadingSkeleton';

export default function Loading() {
  return (
    <div>
      {/* 페이지 헤더 스켈레톤 */}
      <div className="mb-8 animate-pulse">
        <div className="h-9 w-64 bg-gray-700 rounded-lg mb-2"></div>
        <div className="h-5 w-48 bg-gray-800 rounded"></div>
      </div>

      {/* 카드 그리드 스켈레톤 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <StudioCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
