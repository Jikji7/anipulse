'use client';

import { useState, useEffect } from 'react';
import {
  createPost,
  getSavedNickname,
  saveNickname,
  CATEGORY_LABELS,
  CommunityPost,
} from '@/lib/community';

interface PostFormProps {
  onClose: () => void;
  onCreated: (post: CommunityPost) => void;
}

const CATEGORIES = (
  Object.keys(CATEGORY_LABELS) as CommunityPost['category'][]
);

export default function PostForm({ onClose, onCreated }: PostFormProps) {
  const [nickname, setNickname] = useState('');
  const [category, setCategory] = useState<CommunityPost['category']>('free');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setNickname(getSavedNickname());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !title.trim() || !content.trim()) return;
    saveNickname(nickname.trim());
    const post = createPost({
      title: title.trim(),
      content: content.trim(),
      author: nickname.trim(),
      category,
    });
    onCreated(post);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">✍️ 글쓰기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 닉네임 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">닉네임 *</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">카테고리</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">제목 *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">내용 *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={5}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 resize-none"
              required
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 text-sm transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
            >
              작성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
