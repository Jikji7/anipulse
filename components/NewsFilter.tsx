'use client';

// 뉴스 소스 필터 컴포넌트
import { NewsSource } from '@/lib/types';

interface NewsFilterProps {
  activeSource: NewsSource;
  onSourceChange: (source: NewsSource) => void;
}

// 뉴스 소스 옵션
const NEWS_SOURCES: { value: NewsSource; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ann', label: 'Anime News Network' },
  { value: 'crunchyroll', label: 'Crunchyroll' },
  { value: 'mal', label: 'MyAnimeList' },
];

export default function NewsFilter({ activeSource, onSourceChange }: NewsFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {NEWS_SOURCES.map(source => (
        <button
          key={source.value}
          onClick={() => onSourceChange(source.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeSource === source.value
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}
