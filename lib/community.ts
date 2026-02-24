'use client';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'free' | 'recommend' | 'question' | 'review';
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

const STORAGE_KEY = 'anipulse_community_posts';
const NICKNAME_KEY = 'anipulse_nickname';

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: 'sample-1',
    title: '올해 최고의 애니는?',
    content: '올해 정말 좋은 애니가 많이 나왔는데, 여러분은 어떤 작품이 최고였나요? 저는 개인적으로 작화나 스토리 완성도 면에서 뛰어난 작품들이 많았다고 생각합니다. 댓글로 추천해주세요!',
    author: '애니팬123',
    category: 'recommend',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes: 12,
    likedBy: [],
    comments: [
      {
        id: 'c1',
        author: '오타쿠99',
        content: '저는 단연 주술회전이죠!',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
  {
    id: 'sample-2',
    title: '주술회전 2기 어떻게 생각하시나요?',
    content: '주술회전 2기 보셨나요? 1기에 비해 작화가 더 좋아진 것 같고 스토리도 더 깊어진 느낌이라 개인적으로 매우 만족스러웠습니다. 특히 시부야 편은 정말 압도적이었어요. 여러분의 리뷰도 듣고 싶어요!',
    author: '리뷰어',
    category: 'review',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 8,
    likedBy: [],
    comments: [],
  },
  {
    id: 'sample-3',
    title: '애니 입문자 추천 부탁드립니다!',
    content: '최근에 애니에 관심이 생겼는데 어디서부터 시작해야 할지 모르겠어요. 부담 없이 볼 수 있는 입문작을 추천해주시면 정말 감사하겠습니다. 장르는 가리지 않습니다!',
    author: '뉴비뉴비',
    category: 'question',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likes: 5,
    likedBy: [],
    comments: [
      {
        id: 'c2',
        author: '선배오타쿠',
        content: '귀멸의 칼날이나 나의 히어로 아카데미아 추천드려요!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
      {
        id: 'c3',
        author: '애니마스터',
        content: '진격의 거인도 꼭 보세요. 처음엔 좀 무겁지만 정말 명작입니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
    ],
  },
  {
    id: 'sample-4',
    title: '자유롭게 수다떨어요~',
    content: '오늘 뭐 보셨나요? 저는 오늘 오래된 애니를 다시 보고 있는데 역시 명작은 영원하네요. 최근에 본 것들, 보고 있는 것들 자유롭게 이야기해봐요!',
    author: '수다쟁이',
    category: 'free',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likes: 3,
    likedBy: [],
    comments: [],
  },
];

export function getPosts(): CommunityPost[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_POSTS));
    return SAMPLE_POSTS;
  }
  try {
    return JSON.parse(raw) as CommunityPost[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_POSTS));
    return SAMPLE_POSTS;
  }
}

export function getPost(id: string): CommunityPost | null {
  const posts = getPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export function createPost(
  post: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments'>
): CommunityPost {
  const posts = getPosts();
  const newPost: CommunityPost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    comments: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newPost, ...posts]));
  return newPost;
}

export function toggleLike(postId: string, nickname: string): void {
  const posts = getPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    const alreadyLiked = p.likedBy.includes(nickname);
    return {
      ...p,
      likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
      likedBy: alreadyLiked
        ? p.likedBy.filter((n) => n !== nickname)
        : [...p.likedBy, nickname],
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function addComment(
  postId: string,
  comment: Omit<Comment, 'id' | 'createdAt'>
): void {
  const posts = getPosts();
  const newComment: Comment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = posts.map((p) =>
    p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSavedNickname(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(NICKNAME_KEY) ?? '';
}

export function saveNickname(nickname: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NICKNAME_KEY, nickname);
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export const CATEGORY_LABELS: Record<CommunityPost['category'], string> = {
  free: '자유',
  recommend: '추천',
  question: '질문',
  review: '리뷰',
};

export const CATEGORY_COLORS: Record<CommunityPost['category'], string> = {
  free: 'bg-gray-600 text-gray-200',
  recommend: 'bg-green-600 text-green-100',
  question: 'bg-blue-600 text-blue-100',
  review: 'bg-yellow-600 text-yellow-100',
};
