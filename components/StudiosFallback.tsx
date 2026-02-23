'use client';

// 제작사 페이지 API 오류 fallback UI
export default function StudiosFallback({ message }: { message: string }) {
  return (
    <div className="bg-red-900/50 border border-red-700 rounded-xl p-8 text-center space-y-4">
      <p className="text-4xl">🏢</p>
      <p className="text-red-300 font-medium">API 오류가 발생했습니다</p>
      <p className="text-gray-400 text-sm">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm transition-colors"
      >
        🔄 다시 시도
      </button>
    </div>
  );
}
