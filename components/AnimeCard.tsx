// 애니메이션 카드 컴포넌트
import { AnimeItem } from '@/lib/types';
import Image from 'next/image';

interface AnimeCardProps {
  anime: AnimeItem;
}

// 방영 상태 한국어 변환
function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    FINISHED: '방영 완료',
    RELEASING: '방영 중',
    NOT_YET_RELEASED: '방영 예정',
    CANCELLED: '취소',
    HIATUS: '휴재 중',
  };
  return statusMap[status] || status;
}

// 방영 상태별 색상
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    FINISHED: 'text-gray-400',
    RELEASING: 'text-green-400',
    NOT_YET_RELEASED: 'text-blue-400',
    CANCELLED: 'text-red-400',
    HIATUS: 'text-yellow-400',
  };
  return colorMap[status] || 'text-gray-400';
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;

  return (
    <div className="group bg-gray-800 rounded-xl overflow-hidden hover:ring-1 hover:ring-purple-500/50 transition-all duration-200">
      {/* 포스터 이미지 */}
      <div className="relative w-full h-56 bg-gray-700">
        <Image
          src={anime.coverImage.large}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        {/* 평점 배지 */}
        {anime.averageScore && (
          <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-md">
            ⭐ {anime.averageScore}
          </div>
        )}
      </div>

      <div className="p-3">
        {/* 제목 */}
        <h3 className="text-sm font-semibold text-gray-100 mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>

        {/* 연도 & 방영 상태 */}
        <div className="flex items-center gap-2 mb-2">
          {anime.seasonYear && (
            <span className="text-xs text-gray-500">{anime.seasonYear}</span>
          )}
          <span className={`text-xs font-medium ${getStatusColor(anime.status)}`}>
            {getStatusLabel(anime.status)}
          </span>
        </div>

        {/* 장르 태그 */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 3).map(genre => (
              <span
                key={genre}
                className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
