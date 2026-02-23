'use client';

// 전역 에러 경계 - 예상치 못한 오류가 발생했을 때 표시
import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  // 에러 로그 (개발 환경에서 디버깅용)
  useEffect(() => {
    console.error('앱 오류 발생:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* 이모지 아이콘 */}
      <p className="text-8xl mb-6">⚡</p>

      {/* 에러 제목 */}
      <h1 className="text-2xl font-bold text-white mb-2">
        앗, 문제가 발생했어요
      </h1>
      <p className="text-gray-400 mb-8 max-w-md">
        예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해보세요.
      </p>

      {/* 다시 시도 버튼 */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
        >
          🔄 다시 시도
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-colors"
        >
          🏠 홈으로
        </Link>
      </div>
    </div>
  );
}
