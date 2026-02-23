// 404 페이지 - 존재하지 않는 주소에 접근했을 때 표시
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* 이모지 아이콘 */}
      <p className="text-8xl mb-6">😵</p>

      {/* 에러 코드 */}
      <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
        404
      </h1>

      {/* 설명 */}
      <h2 className="text-xl font-semibold text-white mb-2">
        페이지를 찾을 수 없어요
      </h2>
      <p className="text-gray-400 mb-8 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>

      {/* 홈으로 돌아가기 */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
        >
          🏠 홈으로
        </Link>
        <Link
          href="/studios"
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-medium transition-colors"
        >
          🏢 제작사 목록
        </Link>
      </div>
    </div>
  );
}
