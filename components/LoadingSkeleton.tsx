// 로딩 스켈레톤 UI 컴포넌트

// 뉴스 카드 스켈레톤
export function NewsCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-700"></div>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <div className="w-20 h-4 bg-gray-700 rounded-full"></div>
          <div className="w-24 h-4 bg-gray-700 rounded-full"></div>
        </div>
        <div className="w-full h-4 bg-gray-700 rounded mb-1"></div>
        <div className="w-3/4 h-4 bg-gray-700 rounded mb-3"></div>
        <div className="w-full h-3 bg-gray-700 rounded mb-1"></div>
        <div className="w-full h-3 bg-gray-700 rounded mb-1"></div>
        <div className="w-2/3 h-3 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

// 제작사 카드 스켈레톤
export function StudioCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-32 bg-gray-700"></div>
      <div className="p-4">
        <div className="w-32 h-5 bg-gray-700 rounded mb-2"></div>
        <div className="w-24 h-3 bg-gray-700 rounded mb-3"></div>
        <div className="w-full h-3 bg-gray-700 rounded mb-1"></div>
        <div className="w-full h-3 bg-gray-700 rounded mb-1"></div>
        <div className="w-3/4 h-3 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

// 애니 카드 스켈레톤
export function AnimeCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-gray-700"></div>
      <div className="p-3">
        <div className="w-full h-4 bg-gray-700 rounded mb-1"></div>
        <div className="w-2/3 h-4 bg-gray-700 rounded mb-2"></div>
        <div className="flex gap-2 mb-2">
          <div className="w-10 h-3 bg-gray-700 rounded-full"></div>
          <div className="w-16 h-3 bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex gap-1">
          <div className="w-14 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-14 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-14 h-5 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// 그리드 스켈레톤 (여러 카드)
interface GridSkeletonProps {
  count?: number;
  type?: 'news' | 'studio' | 'anime';
}

export default function LoadingSkeleton({ count = 8, type = 'news' }: GridSkeletonProps) {
  const SkeletonComponent = {
    news: NewsCardSkeleton,
    studio: StudioCardSkeleton,
    anime: AnimeCardSkeleton,
  }[type];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}
