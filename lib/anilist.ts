// AniList GraphQL API 호출 유틸리티

const ANILIST_API = 'https://graphql.anilist.co';

// 유명 제작사 ID 목록
export const FAMOUS_STUDIO_IDS = [
  { id: 569, name: 'MAPPA' },
  { id: 43, name: 'ufotable' },
  { id: 4, name: 'Bones' },
  { id: 858, name: 'Wit Studio' },
  { id: 6, name: 'A-1 Pictures' },
  { id: 2, name: 'Kyoto Animation' },
  { id: 803, name: 'TRIGGER' },
  { id: 11, name: 'Madhouse' },
  { id: 21, name: 'Studio Ghibli' },
  { id: 1835, name: 'CloverWorks' },
  { id: 18, name: 'Toei Animation' },
];

// GraphQL 쿼리 실행 함수 (최대 3회 재시도)
async function fetchAniList(query: string, variables: Record<string, unknown> = {}) {
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(ANILIST_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
      });

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

// 여러 제작사 정보 가져오기
export async function getStudios(ids: number[]) {
  const results = await Promise.allSettled(ids.map((id) => getStudio(id)));
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<{ Studio: import('./types').Studio }>).value.Studio);
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
