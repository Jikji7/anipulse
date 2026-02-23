// 루트 레이아웃 - 모든 페이지에 공통으로 적용
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'AniPulse - 애니메이션 뉴스 & 제작사 정보',
  description: '최신 애니메이션 뉴스와 제작사 정보를 한곳에서 모아보세요',
  keywords: ['애니메이션', '뉴스', '제작사', '애니', 'anime', 'news'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-gray-900 text-gray-100 min-h-screen font-sans">
        {/* 네비게이션 바 */}
        <Navbar />

        {/* 메인 콘텐츠 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* 푸터 */}
        <footer className="mt-16 border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} AniPulse - 애니메이션 뉴스 & 제작사 정보</p>
            <p className="mt-1">
              데이터 제공: <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">AniList</a>
              {' & '}
              <a href="https://aninewsapi.vercel.app" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">AniNewsAPI</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
