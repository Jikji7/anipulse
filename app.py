import re
import math
from collections import Counter
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


def tokenize(text):
    """Simple tokenizer that works for both Korean and other languages."""
    # Remove punctuation and split into words/chars
    tokens = re.findall(r'[가-힣]+|[a-zA-Z]+', text)
    return [t.lower() for t in tokens if len(t) > 1]


def split_sentences(text):
    """Split text into sentences, handling Korean sentence endings."""
    text = text.strip()
    sentences = re.split(r'(?<=[.!?。])\s+|(?<=[다요죠])\s+|(?<=\n)\s*', text)
    sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 5]
    return sentences


def summarize(text, num_sentences=3):
    """Extractive summarization using TF-IDF-like sentence scoring."""
    sentences = split_sentences(text)
    if not sentences:
        return text, []

    if len(sentences) <= num_sentences:
        return text, list(range(len(sentences)))

    # Build word frequency map
    all_tokens = tokenize(text)
    if not all_tokens:
        return '. '.join(sentences[:num_sentences]), list(range(num_sentences))

    word_freq = Counter(all_tokens)
    max_freq = max(word_freq.values()) if word_freq else 1

    # Normalize frequencies
    word_scores = {w: freq / max_freq for w, freq in word_freq.items()}

    # Score each sentence
    sentence_scores = []
    for i, sentence in enumerate(sentences):
        tokens = tokenize(sentence)
        if not tokens:
            sentence_scores.append((i, 0.0))
            continue
        score = sum(word_scores.get(t, 0) for t in tokens) / len(tokens)
        # Slight bonus for the first sentence (often contains the lead)
        position_bonus = 1.1 if i == 0 else 1.0
        sentence_scores.append((i, score * position_bonus))

    # Select top sentences and keep original order
    top_indices = sorted(
        sorted(sentence_scores, key=lambda x: x[1], reverse=True)[:num_sentences],
        key=lambda x: x[0]
    )
    top_indices_list = [idx for idx, _ in top_indices]
    summary = ' '.join(sentences[i] for i in top_indices_list)
    return summary, top_indices_list


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/summarize', methods=['POST'])
def api_summarize():
    data = request.get_json()
    if not data:
        return jsonify({'error': '요청 데이터가 없습니다.'}), 400

    text = data.get('text', '').strip()
    category = data.get('category', 'anime')  # 'anime' or 'studio'
    num_sentences = int(data.get('num_sentences', 3))

    if not text:
        return jsonify({'error': '텍스트를 입력해 주세요.'}), 400
    if len(text) < 20:
        return jsonify({'error': '요약하기에 텍스트가 너무 짧습니다.'}), 400

    num_sentences = max(1, min(num_sentences, 10))
    summary, highlighted = summarize(text, num_sentences)

    sentences = split_sentences(text)
    return jsonify({
        'summary': summary,
        'original_sentence_count': len(sentences),
        'summary_sentence_count': len(highlighted),
        'category': category,
    })


if __name__ == '__main__':
    import os
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=5000)
