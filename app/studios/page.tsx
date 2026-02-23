'use client';

import { useEffect, useState } from 'react';
import StudioCard from '@/components/StudioCard';
import StudiosFallback from '@/components/StudiosFallback';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { FAMOUS_STUDIO_IDS } from '@/lib/anilist';
import { Studio } from '@/lib/types';

// 제작사 목록 페이지 (클라이언트 컴포넌트)
export default function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudios() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/studios');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '제작사 정보를 불러오는 데 실패했습니다.');
        setStudios(data.studios || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : '제작사 정보를 불러오는 데 실패했습니다.');
        console.error('제작사 페이지 로딩 오류:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStudios();
  }, []);

  const twitterMap = Object.fromEntries(FAMOUS_STUDIO_IDS.map((s) => [s.id, s.twitter]));

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">🏢 애니메이션 제작사</h1>
        <p className="text-gray-400">유명 애니메이션 제작사들의 대표작을 확인하세요</p>
      </div>

      {/* 로딩 스켈레톤 */}
      {loading && (
        <LoadingSkeleton count={11} type="studio" />
      )}

      {/* 에러 fallback UI */}
      {!loading && error && <StudiosFallback message={error} />}

      {/* 제작사 그리드 */}
      {!loading && !error && studios.length === 0 && (
        <StudiosFallback message="제작사 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요." />
      )}

      {!loading && !error && studios.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} twitter={twitterMap[studio.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
