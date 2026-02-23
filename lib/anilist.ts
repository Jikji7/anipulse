// AniList GraphQL API 호출 유틸리티

const ANILIST_API = 'https://graphql.anilist.co';

// 유명 제작사 ID 목록
export const FAMOUS_STUDIO_IDS = [
  { id: 569, name: 'MAPPA', twitter: 'https://x.com/MAPPA_Info' },
  { id: 43, name: 'ufotable', twitter: 'https://x.com/ufotable' },
  { id: 4, name: 'Bones', twitter: 'https://x.com/ABORIONES' },
  { id: 858, name: 'Wit Studio', twitter: 'https://x.com/WIT_STUDIO' },
  { id: 6, name: 'A-1 Pictures', twitter: 'https://x.com/A1P_anime' },
  { id: 2, name: 'Kyoto Animation', twitter: 'https://x.com/kyaboruani' },
  { id: 803, name: 'TRIGGER', twitter: 'https://x.com/trigger_inc' },
  { id: 11, name: 'Madhouse', twitter: 'https://x.com/madaboruanime' },
  { id: 21, name: 'Studio Ghibli', twitter: 'https://x.com/JP_GHIBLI' },
  { id: 1835, name: 'CloverWorks', twitter: 'https://x.com/CloverWorks' },
  { id: 18, name: 'Toei Animation', twitter: 'https://x.com/ToeiAnimation' },
];

// GraphQL 쿼리 실행 함수 (최대 3회 재시도)
async function fetchAniList(query: string, variables: Record<string, unknown> = {}) {
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      let response: Response;
      try {
        response = await fetch(ANILIST_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query, variables }),
          cache: 'no-store',
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        throw new Error(`AniList API 오류: ${response.status}`);
      }

      const json = await response.json();
      if (json.errors) {
        throw new Error(`GraphQL 오류: ${json.errors[0].message}`);
      }

      return json.data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`fetchAniList 시도 ${attempt}/${MAX_RETRIES} 실패:`, lastError.message);
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      }
    }
  }

  throw lastError ?? new Error('AniList API 호출 실패');
}

// 제작사 상세 정보 가져오기
export async function getStudio(id: number) {
  const query = `
    query ($id: Int) {
      Studio(id: $id) {
        id
        name
        siteUrl
        media(sort: POPULARITY_DESC, type: ANIME, isMain: true, perPage: 20) {
          nodes {
            id
            title { romaji english native }
            coverImage { large medium }
            genres
            averageScore
            status
            seasonYear
            description
          }
        }
      }
    }
  `;
  return fetchAniList(query, { id });
}

// 여러 제작사 정보 가져오기 (GraphQL alias로 1회 요청, rate limit 회피)
export async function getStudios(ids: number[]) {
  const fragments = ids
    .map(
      (id, i) => `
    studio${i}: Studio(id: ${id}) {
      id
      name
      siteUrl
      media(sort: POPULARITY_DESC, type: ANIME, isMain: true, perPage: 4) {
        nodes {
          id
          title { romaji english native }
          coverImage { large medium }
          genres
          averageScore
          status
          seasonYear
        }
      }
    }`
    )
    .join('\n');

  const query = `query { ${fragments} }`;
  const data = await fetchAniList(query);
  return Object.values(data) as import('./types').Studio[];
}

// 애니메이션 검색
export async function searchAnime(query: string) {
  const gql = `
    query ($search: String) {
      Page(page: 1, perPage: 20) {
        media(search: $search, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large medium }
          genres
          averageScore
          status
          seasonYear
          description
        }
      }
    }
  `;
  const data = await fetchAniList(gql, { search: query });
  return data.Page.media;
}

// 제작사 검색
export async function searchStudios(query: string) {
  const gql = `
    query ($search: String) {
      Page(page: 1, perPage: 10) {
        studios(search: $search) {
          id
          name
          siteUrl
          media(sort: POPULARITY_DESC, type: ANIME, isMain: true, perPage: 3) {
            nodes {
              id
              title { romaji english native }
              coverImage { large medium }
              genres
              averageScore
              status
              seasonYear
              description
            }
          }
        }
      }
    }
  `;
  const data = await fetchAniList(gql, { search: query });
  return data.Page.studios;
}

// 장르로 애니메이션 검색
export async function searchAnimeByGenre(genre: string) {
  const gql = `
    query ($genre: String) {
      Page(page: 1, perPage: 20) {
        media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
          id
          title { romaji english native }
          coverImage { large medium }
          genres
          averageScore
          status
          seasonYear
          description
        }
      }
    }
  `;
  const data = await fetchAniList(gql, { genre });
  return data.Page.media;
}
