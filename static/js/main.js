const ANIME_SAMPLE = `2025년 봄 애니메이션 시즌이 본격적으로 시작되면서 다양한 신작이 팬들의 기대를 받고 있다. 이번 시즌에는 인기 만화를 원작으로 한 작품들이 다수 방영될 예정으로, 특히 소년 배틀 장르와 이세계물이 주를 이루고 있다. 업계 관계자는 "올해 봄 시즌은 역대급 풍작"이라며 높은 기대감을 나타냈다. 각 방송국과 스트리밍 플랫폼은 독점 방영권 확보를 위해 치열한 경쟁을 벌이고 있으며, 넷플릭스와 크런치롤 등 글로벌 플랫폼도 동시 방영 콘텐츠를 대폭 늘렸다. 애니메이션 전문 분석가들은 이번 시즌 시청률이 전년 동기 대비 20% 이상 상승할 것으로 전망하고 있다. 특히 원피스, 나루토 등 기존 장수 시리즈의 리메이크 발표도 이어지고 있어 올드팬들의 향수를 자극하고 있다. 한편 국내 OTT 플랫폼도 한국어 자막과 더빙 서비스를 강화하며 애니메이션 시청 환경 개선에 나서고 있다.`;

const STUDIO_SAMPLE = `교토 애니메이션(KyoAni)은 2025년 신작 라인업을 공개하며 본격적인 제작에 돌입했다고 밝혔다. 이번 신작은 인기 라이트노벨을 원작으로 하며, 총 24화 분량으로 제작될 예정이다. 교토 애니메이션은 뛰어난 작화 품질과 세밀한 캐릭터 묘사로 세계적인 명성을 얻고 있는 스튜디오로, 이번 작품 역시 높은 완성도를 자랑할 것으로 기대된다. 회사 측은 "작품의 원작 팬들이 만족할 수 있도록 최선을 다하겠다"고 전했다. 또한 해당 스튜디오는 신규 인력 채용을 확대하고 제작 환경 개선에도 투자를 아끼지 않고 있다. 2019년 발생한 방화 사건 이후 재건된 스튜디오는 더욱 강화된 안전 시설을 갖추고 있으며, 직원 복지 프로그램도 업계 최고 수준으로 운영 중이다. 제작사는 글로벌 배급사와의 협력을 강화하고 있으며, 해외 팬들을 위한 굿즈 및 이벤트 콘텐츠도 강화할 계획이라고 밝혔다.`;

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`panel-${tabName}`).classList.add('active');
}

function loadSample(panelId, sampleText) {
    const textarea = document.getElementById(panelId);
    textarea.value = sampleText;
    textarea.focus();
}

function clearPanel(textareaId, resultId, errorId, loadingId) {
    document.getElementById(textareaId).value = '';
    hideResult(resultId, errorId, loadingId);
}

function hideResult(resultId, errorId, loadingId) {
    document.getElementById(resultId).classList.remove('visible');
    document.getElementById(errorId).classList.remove('visible');
    if (loadingId) document.getElementById(loadingId).classList.remove('visible');
}

async function summarize(category) {
    const textareaId = `text-${category}`;
    const resultId = `result-${category}`;
    const errorId = `error-${category}`;
    const loadingId = `loading-${category}`;
    const btnId = `btn-${category}`;
    const numSentencesId = `sentences-${category}`;

    const text = document.getElementById(textareaId).value.trim();
    const numSentences = parseInt(document.getElementById(numSentencesId).value, 10);

    document.getElementById(errorId).classList.remove('visible');
    document.getElementById(resultId).classList.remove('visible');

    if (!text) {
        showError(errorId, '기사 내용을 입력해 주세요.');
        return;
    }

    const btn = document.getElementById(btnId);
    const loading = document.getElementById(loadingId);

    btn.disabled = true;
    loading.classList.add('visible');

    try {
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, category, num_sentences: numSentences }),
        });

        const data = await response.json();

        if (!response.ok) {
            showError(errorId, data.error || '요약 중 오류가 발생했습니다.');
            return;
        }

        showResult(category, data);
    } catch (err) {
        showError(errorId, '서버와 통신 중 오류가 발생했습니다.');
    } finally {
        btn.disabled = false;
        loading.classList.remove('visible');
    }
}

function showError(errorId, message) {
    const el = document.getElementById(errorId);
    el.textContent = message;
    el.classList.add('visible');
}

function showResult(category, data) {
    const resultId = `result-${category}`;
    const summaryEl = document.getElementById(`summary-text-${category}`);
    const metaEl = document.getElementById(`result-meta-${category}`);

    summaryEl.textContent = data.summary;
    metaEl.textContent = `원문 ${data.original_sentence_count}문장 → 요약 ${data.summary_sentence_count}문장`;

    const resultContent = summaryEl.closest('.result-content');
    if (category === 'studio') {
        resultContent.classList.add('studio-result');
    } else {
        resultContent.classList.remove('studio-result');
    }

    document.getElementById(resultId).classList.add('visible');
}

async function copyToClipboard(textId) {
    const text = document.getElementById(textId).textContent;
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert('클립보드에 복사되었습니다!');
    } else {
        prompt('아래 텍스트를 직접 복사해 주세요 (Ctrl+C):', text);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
});
