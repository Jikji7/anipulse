'use client';

// 뉴스 소스 필터 탭 컴포넌트
type Source = 'ALL' | 'ANN' | 'MAL' | 'CR';

interface NewsFilterProps {
  active: Source;
  onChange: (source: Source) => void;
}

const SOURCES: { key: Source; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'ANN', label: 'ANN' },
  { key: 'MAL', label: 'MAL' },
  { key: 'CR', label: 'Crunchyroll' },
];

export default function NewsFilter({ active, onChange }: NewsFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SOURCES.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === key
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
