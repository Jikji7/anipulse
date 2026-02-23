'use client';

// 네비게이션 바 컴포넌트
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 검색 제출 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // 현재 페이지 링크 스타일
  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === href
        ? 'text-purple-400 bg-purple-400/10'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AniPulse
            </span>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className={linkClass('/')}>
              🗞️ 뉴스
            </Link>
            <Link href="/studios" className={linkClass('/studios')}>
              🏢 제작사
            </Link>
            <Link href="/search" className={linkClass('/search')}>
              🔍 검색
            </Link>
          </div>

          {/* 검색 바 (데스크탑) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="애니, 뉴스, 제작사 검색..."
              className="w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-r-lg transition-colors"
            >
              검색
            </button>
          </form>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current mb-1"></div>
            <div className="w-5 h-0.5 bg-current"></div>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-800">
            <div className="flex flex-col gap-1 mb-3">
              <Link href="/" className={linkClass('/')} onClick={() => setIsMenuOpen(false)}>
                🗞️ 뉴스
              </Link>
              <Link href="/studios" className={linkClass('/studios')} onClick={() => setIsMenuOpen(false)}>
                🏢 제작사
              </Link>
              <Link href="/search" className={linkClass('/search')} onClick={() => setIsMenuOpen(false)}>
                🔍 검색
              </Link>
            </div>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-r-lg"
              >
                검색
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
