// 로딩 스켈레톤 UI 컴포넌트

interface LoadingSkeletonProps {
  count?: number;
  type?: 'news' | 'studio' | 'anime';
}

export default function LoadingSkeleton({ count = 6, type = 'news' }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-xl overflow-hidden animate-pulse"
        >
          {/* 이미지 플레이스홀더 */}
          {type !== 'news' && (
            <div className="w-full h-48 bg-gray-700" />
          )}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            {type === 'news' && (
              <div className="h-3 bg-gray-700 rounded w-1/3" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
