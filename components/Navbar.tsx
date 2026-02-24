'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 상단 네비게이션 바
export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '뉴스' },
    { href: '/studios', label: '제작사' },
    { href: '/community', label: '커뮤니티' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-400">AniPulse 🎌</span>
          </Link>

          {/* 네비게이션 링크 */}
          <div className="flex gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
