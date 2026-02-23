'use client';

// 검색 바 컴포넌트
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, onSubmit, placeholder }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '검색어를 입력하세요...'}
        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-r-xl transition-colors"
      >
        🔍 검색
      </button>
    </form>
  );
}
