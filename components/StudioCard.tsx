// 제작사 카드 컴포넌트
import { Studio } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface StudioCardProps {
  studio: Studio;
}

export default function StudioCard({ studio }: StudioCardProps) {
  // 대표 애니메이션 포스터 (최대 3개)
  const previewAnime = studio.media?.nodes.slice(0, 3) || [];

  return (
    <Link href={`/studio/${studio.id}`} className="group block">
      <div className="bg-gray-800 rounded-xl overflow-hidden hover:ring-1 hover:ring-purple-500/50 transition-all duration-200 h-full">
        {/* 애니 포스터 미리보기 */}
        <div className="flex gap-0.5 h-32 bg-gray-700">
          {previewAnime.length > 0 ? (
            previewAnime.map((anime, index) => (
              <div
                key={anime.id}
                className={`relative bg-gray-600 flex-1 ${index === 0 ? 'flex-2' : ''}`}
              >
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-4xl">🏢</span>
            </div>
          )}
        </div>

        <div className="p-4">
          {/* 제작사 이름 */}
          <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
            {studio.name}
          </h3>

          {/* 즐겨찾기 수 */}
          {studio.favourites && (
            <p className="text-xs text-gray-400 mb-2">
              ❤️ {studio.favourites.toLocaleString()}명이 즐겨찾기
            </p>
          )}

          {/* 대표 애니 목록 */}
          {previewAnime.length > 0 && (
            <div className="space-y-1">
              {previewAnime.map(anime => (
                <p key={anime.id} className="text-xs text-gray-500 truncate">
                  • {anime.title.english || anime.title.romaji}
                </p>
              ))}
            </div>
          )}

          <div className="mt-3 text-xs text-purple-400/70 group-hover:text-purple-400">
            작품 목록 보기 →
          </div>
        </div>
      </div>
    </Link>
  );
}
