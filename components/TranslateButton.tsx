'use client';

import { useState } from 'react';

interface TranslateButtonProps {
  title: string;
  description: string;
  onTranslated: (title: string, description: string) => void;
  onReset: () => void;
  isTranslated: boolean;
}

// 개별 뉴스 카드 한국어 번역 버튼
export default function TranslateButton({
  title,
  description,
  onTranslated,
  onReset,
  isTranslated,
}: TranslateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleTranslate = async () => {
    if (isTranslated) {
      onReset();
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: [title, description],
          targetLang: 'ko',
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const [translatedTitle, translatedDesc] = data.translated as string[];
      onTranslated(translatedTitle || title, translatedDesc || description);
    } catch (err) {
      console.error('번역 실패:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleTranslate();
      }}
      disabled={loading}
      title={error ? '번역 실패. 다시 시도하세요.' : isTranslated ? '원문 보기' : '한국어로 번역'}
      className={`text-xs px-2 py-0.5 rounded-full transition-colors border ${
        error
          ? 'border-red-500 text-red-400 hover:bg-red-900/30'
          : isTranslated
          ? 'border-green-500 text-green-400 hover:bg-green-900/30'
          : 'border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400'
      } disabled:opacity-50`}
    >
      {loading ? '...' : error ? '❌' : isTranslated ? '🔤 원문' : '🌐 번역'}
    </button>
  );
}
