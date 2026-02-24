'use client';

import { useState, useEffect, useCallback } from 'react';
import PostCard from '@/components/PostCard';
import PostForm from '@/components/PostForm';
import { getPosts, CommunityPost } from '@/lib/community';

type Category = 'all' | CommunityPost['category'];
type SortOrder = 'latest' | 'popular';

const TABS: { value: Category; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'free', label: '자유' },
  { value: 'recommend', label: '추천' },
  { value: 'question', label: '질문' },
  { value: 'review', label: '리뷰' },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [category, setCategory] = useState<Category>('all');
  const [sort, setSort] = useState<SortOrder>('latest');
  const [showForm, setShowForm] = useState(false);

  const loadPosts = useCallback(() => {
    setPosts(getPosts());
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filtered = posts
    .filter((p) => category === 'all' || p.category === category)
    .sort((a, b) =>
      sort === 'popular'
        ? b.likes - a.likes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">💬 커뮤니티</h1>
          <p className="text-gray-400">애니메이션 이야기를 자유롭게 나눠보세요</p>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              category === value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 정렬 */}
      <div className="flex gap-2">
        <button
          onClick={() => setSort('latest')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            sort === 'latest'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          최신순
        </button>
        <button
          onClick={() => setSort('popular')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            sort === 'popular'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          인기순
        </button>
      </div>

      {/* 글 목록 */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-lg">아직 글이 없습니다. 첫 번째 글을 작성해보세요!</p>
        </div>
      )}

      {/* 글쓰기 FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg transition-colors z-40"
        title="글쓰기"
      >
        ✏️
      </button>

      {/* 글쓰기 모달 */}
      {showForm && (
        <PostForm
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            loadPosts();
          }}
        />
      )}
    </div>
  );
}
