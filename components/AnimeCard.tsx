// 애니메이션 카드 컴포넌트
import Image from 'next/image';
import { Anime } from '@/lib/types';

interface AnimeCardProps {
  anime: Anime;
}

// 방영 상태 한국어 변환
const statusKo: Record<string, string> = {
  FINISHED: '완결',
  RELEASING: '방영중',
  NOT_YET_RELEASED: '방영예정',
  CANCELLED: '취소됨',
  HIATUS: '휴방',
};

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-200 hover:scale-[1.02]">
      {/* 포스터 */}
      {anime.coverImage?.large ? (
        <div className="relative w-full h-60">
          <Image
            src={anime.coverImage.large}
            alt={anime.title?.romaji || ''}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-60 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 text-4xl">🎬</span>
        </div>
      )}

      <div className="p-4">
        {/* 제목 */}
        <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
          {anime.title?.romaji}
        </h3>
        {anime.title?.english && anime.title.english !== anime.title.romaji && (
          <p className="text-gray-400 text-xs mb-2 line-clamp-1">{anime.title.english}</p>
        )}

        {/* 정보 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {anime.averageScore && (
            <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">
              ⭐ {anime.averageScore / 10}
            </span>
          )}
          {anime.seasonYear && (
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
              {anime.seasonYear}
            </span>
          )}
          {anime.status && (
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
              {statusKo[anime.status] || anime.status}
            </span>
          )}
        </div>

        {/* 장르 */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
