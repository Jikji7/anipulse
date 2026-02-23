import Link from 'next/link';

// 404 페이지
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <div className="text-8xl font-bold text-gray-700">404</div>
      <h2 className="text-2xl font-bold text-white">페이지를 찾을 수 없습니다</h2>
      <p className="text-gray-400">요청하신 페이지가 존재하지 않습니다.</p>
      <Link
        href="/"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
