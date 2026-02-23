// 뉴스 카드 컴포넌트
import { NewsItem } from '@/lib/types';
import { formatDate } from '@/lib/news';
import Image from 'next/image';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 hover:ring-1 hover:ring-purple-500/50 transition-all duration-200"
    >
      {/* 썸네일 */}
      {news.thumbnail && (
        <div className="relative w-full h-48 bg-gray-700">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      )}

      <div className="p-4">
        {/* 소스 & 날짜 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
            {news.source}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(news.publishedAt)}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-sm font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {news.title}
        </h3>

        {/* 요약 */}
        {news.snippet && (
          <p className="text-xs text-gray-400 line-clamp-3">
            {news.snippet}
          </p>
        )}

        {/* 외부 링크 표시 */}
        <div className="mt-3 flex items-center gap-1 text-xs text-purple-400/70 group-hover:text-purple-400">
          <span>기사 보기</span>
          <span>↗</span>
        </div>
      </div>
    </a>
  );
}
