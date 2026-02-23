import LoadingSkeleton from '@/components/LoadingSkeleton';

// 전역 로딩 UI
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-800 rounded w-48 animate-pulse" />
      <LoadingSkeleton count={6} />
    </div>
  );
}
