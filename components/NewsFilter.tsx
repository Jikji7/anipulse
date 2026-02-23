'use client';

import { NewsCategory } from '@/lib/types';

// 뉴스 소스/카테고리 필터 탭 컴포넌트
type Source = 'ALL' | 'ANN' | 'MAL' | 'CR';

interface NewsFilterProps {
  activeSource: Source;
  onSourceChange: (source: Source) => void;
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const SOURCES: { key: Source; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'ANN', label: 'ANN' },
  { key: 'MAL', label: 'MAL' },
  { key: 'CR', label: 'Crunchyroll' },
];

const CATEGORIES: { key: NewsCategory; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'ANIME', label: '애니메이션' },
  { key: 'LIGHTNOVEL', label: '라이트노벨' },
  { key: 'MANGA', label: '만화' },
];

export default function NewsFilter({ activeSource, onSourceChange, activeCategory, onCategoryChange }: NewsFilterProps) {
  return (
    <div className="space-y-2">
      {/* 소스 필터 */}
      <div className="flex gap-2 flex-wrap">
        {SOURCES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSourceChange(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSource === key
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
