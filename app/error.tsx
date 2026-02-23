'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// 전역 에러 UI
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <div className="text-6xl">😔</div>
      <h2 className="text-2xl font-bold text-white">오류가 발생했습니다</h2>
      <p className="text-gray-400 max-w-md">{error.message || '알 수 없는 오류가 발생했습니다.'}</p>
      <button
        onClick={reset}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
