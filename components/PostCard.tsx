'use client';

import Link from 'next/link';
import {
  CommunityPost,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  timeAgo,
} from '@/lib/community';

interface PostCardProps {
  post: CommunityPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/community/${post.id}`}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-purple-500 transition-all duration-200 cursor-pointer">
        <div className="flex items-start gap-3 mb-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${CATEGORY_COLORS[post.category]}`}
          >
            {CATEGORY_LABELS[post.category]}
          </span>
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-1 flex-1">
            {post.title}
          </h3>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{post.content}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{post.author}</span>
            <span>·</span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              ❤️ <span>{post.likes}</span>
            </span>
            <span className="flex items-center gap-1">
              💬 <span>{post.comments.length}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
