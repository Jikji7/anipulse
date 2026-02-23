// 뉴스 카드 컴포넌트
'use client';

import { useState } from 'react';
import { NewsItem } from '@/lib/types';
import { truncateDescription } from '@/lib/news';
import Image from 'next/image';
import TranslateButton from './TranslateButton';

interface NewsCardProps {
  news: NewsItem;
}

// 소스별 배지 색상
const sourceBadgeColor: Record<string, string> = {
  ANN: 'bg-red-600',
  MAL: 'bg-blue-600',
  CR: 'bg-orange-600',
};

// 소스 전체 이름
const sourceFullName: Record<string, string> = {
  ANN: 'Anime News Network',
  MAL: 'MyAnimeList',
  CR: 'Crunchyroll',
};

export default function NewsCard({ news }: NewsCardProps) {
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);

  const displayTitle = translatedTitle ?? news.title;
  const displayDesc = translatedDesc ?? news.description;
  const isTranslated = translatedTitle !== null;

  const formattedDate = new Date(news.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 hover:scale-[1.02] transition-all duration-200 border border-gray-700 hover:border-purple-500 cursor-pointer"
    >
      {/* 썸네일 */}
      {news.thumbnail && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="p-4">
        {/* 출처 배지 + 날짜 + 번역 버튼 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${sourceBadgeColor[news.source] || 'bg-gray-600'}`}
              title={sourceFullName[news.source]}
            >
              {news.source}
            </span>
            <TranslateButton
              title={news.title}
              description={news.description}
              onTranslated={(t, d) => {
                setTranslatedTitle(t);
                setTranslatedDesc(d);
              }}
              onReset={() => {
                setTranslatedTitle(null);
                setTranslatedDesc(null);
              }}
              isTranslated={isTranslated}
            />
          </div>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>

        {/* 제목 */}
        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 leading-snug">
          {displayTitle}
        </h3>

        {/* 요약 */}
        <p className="text-gray-400 text-xs line-clamp-3">
          {truncateDescription(displayDesc)}
        </p>
      </div>
    </a>
  );
}
