'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getPost,
  toggleLike,
  addComment,
  getSavedNickname,
  saveNickname,
  CommunityPost,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  timeAgo,
} from '@/lib/community';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [nickname, setNickname] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [likeError, setLikeError] = useState('');

  const loadPost = useCallback(() => {
    setPost(getPost(id));
  }, [id]);

  useEffect(() => {
    loadPost();
    setNickname(getSavedNickname());
  }, [loadPost]);

  if (!post) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-5xl mb-4">😢</p>
        <p className="text-lg">글을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/community')}
          className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
        >
          ← 목록으로
        </button>
      </div>
    );
  }

  const handleLike = () => {
    if (!nickname.trim()) {
      setLikeError('좋아요를 누르려면 댓글 닉네임을 먼저 입력해주세요.');
      return;
    }
    setLikeError('');
    toggleLike(post.id, nickname.trim());
    loadPost();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !commentContent.trim()) return;
    saveNickname(nickname.trim());
    addComment(post.id, { author: nickname.trim(), content: commentContent.trim() });
    setCommentContent('');
    loadPost();
  };

  const isLiked = nickname ? post.likedBy.includes(nickname) : false;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.push('/community')}
        className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
      >
        ← 목록으로
      </button>

      {/* 글 본문 */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category]}`}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
          <span className="text-gray-500 text-xs">{timeAgo(post.createdAt)}</span>
        </div>

        <h1 className="text-2xl font-bold text-white">{post.title}</h1>

        <p className="text-gray-400 text-sm">{post.author}</p>

        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{post.content}</p>

        {/* 좋아요 */}
        <div className="pt-2 border-t border-gray-700 space-y-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLiked
                ? 'bg-red-600/30 text-red-400 border border-red-600/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ❤️ {post.likes}
          </button>
          {likeError && <p className="text-red-400 text-xs">{likeError}</p>}
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-3">
        <h2 className="text-white font-semibold">💬 댓글 {post.comments.length}개</h2>
        {post.comments.length === 0 && (
          <p className="text-gray-500 text-sm">아직 댓글이 없습니다.</p>
        )}
        {post.comments.map((c) => (
          <div key={c.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-300">{c.author}</span>
              <span className="text-xs text-gray-500">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="text-gray-200 text-sm whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
      </div>

      {/* 댓글 작성 */}
      <form onSubmit={handleComment} className="bg-gray-800 border border-gray-700 rounded-2xl p-4 space-y-3">
        <h3 className="text-white font-medium text-sm">댓글 작성</h3>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          required
        />
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          댓글 작성
        </button>
      </form>
    </div>
  );
}
