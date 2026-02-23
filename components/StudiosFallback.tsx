'use client';

import { FAMOUS_STUDIO_IDS } from '@/lib/anilist';

// 제작사 페이지 API 오류 fallback UI
export default function StudiosFallback({ message }: { message: string }) {
  return (
    <div className="space-y-6">
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

      {/* 정적 fallback: 제작사 이름 + AniList 링크 */}
      <div>
        <p className="text-gray-400 text-sm mb-3">AniList에서 직접 확인하세요:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {FAMOUS_STUDIO_IDS.map((studio) => (
            <a
              key={studio.id}
              href={`https://anilist.co/studio/${studio.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-xl p-4 text-center transition-colors"
            >
              <p className="text-2xl mb-1">🏢</p>
              <p className="text-white font-medium text-sm">{studio.name}</p>
              <p className="text-purple-400 text-xs mt-1">AniList →</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
