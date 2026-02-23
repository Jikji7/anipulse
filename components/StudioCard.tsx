// 제작사 카드 컴포넌트
import Link from 'next/link';
import Image from 'next/image';
import { Studio } from '@/lib/types';

interface StudioCardProps {
  studio: Studio;
}

export default function StudioCard({ studio }: StudioCardProps) {
  const coverAnime = studio.media?.nodes?.[0];

  return (
    <Link
      href={`/studio/${studio.id}`}
      className="block bg-gray-800 rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-200 border border-gray-700 hover:border-purple-500"
    >
      {/* 대표 애니 포스터 */}
      {coverAnime?.coverImage?.large ? (
        <div className="relative w-full h-48">
          <Image
            src={coverAnime.coverImage.large}
            alt={coverAnime.title?.romaji || studio.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 text-4xl">🏢</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-white font-bold text-lg">{studio.name}</h3>
        {coverAnime && (
          <p className="text-gray-400 text-xs mt-1">
            대표작: {coverAnime.title?.romaji || '정보 없음'}
          </p>
        )}
      </div>
    </Link>
  );
}
