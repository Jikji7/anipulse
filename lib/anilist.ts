// AniList GraphQL API 호출 함수들
// API 문서: https://anilist.gitbook.io/anilist-apiv2-docs/

import { Studio, AnimeItem, AniListStudioResponse, AniListStudiosResponse, AniListAnimeSearchResponse } from './types';

const ANILIST_API_URL = 'https://graphql.anilist.co';

// GraphQL 요청을 보내는 헬퍼 함수
async function anilistQuery(query: string, variables?: Record<string, unknown>) {
  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // 1시간 캐시
  });

  if (!response.ok) {
    throw new Error(`AniList API 오류: ${response.status}`);
  }

  return response.json();
}

// 제작사 ID로 제작사 정보와 애니 목록 가져오기
export async function getStudioById(id: number): Promise<Studio | null> {
  const query = `
    query ($id: Int) {
      Studio(id: $id) {
        id
        name
        isAnimationStudio
        favourites
        siteUrl
        media(sort: POPULARITY_DESC, type: ANIME, perPage: 50) {
          nodes {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            genres
            averageScore
            status
            seasonYear
            description(asHtml: false)
            episodes
          }
        }
      }
    }
  `;

  try {
    const data: AniListStudioResponse = await anilistQuery(query, { id });
    return data.data.Studio;
  } catch (error) {
    console.error('제작사 정보 가져오기 실패:', error);
    return null;
  }
}

// 유명 제작사 목록 가져오기 (ID 목록으로 조회)
export async function getFamousStudios(): Promise<Studio[]> {
  // 유명 제작사들의 AniList ID
  const famousStudioIds = [
    { id: 561, name: 'MAPPA' },
    { id: 43, name: 'ufotable' },
    { id: 4, name: 'Bones' },
    { id: 44, name: 'Wit Studio' },
    { id: 64, name: 'A-1 Pictures' },
    { id: 2, name: 'Kyoto Animation' },
    { id: 858, name: 'TRIGGER' },
    { id: 11, name: 'Madhouse' },
    { id: 21, name: 'Studio Ghibli' },
    { id: 1836, name: 'CloverWorks' },
    { id: 30, name: 'Production I.G' },
    { id: 18, name: 'Toei Animation' },
  ];

  const query = `
    query ($id: Int) {
      Studio(id: $id) {
        id
        name
        isAnimationStudio
        favourites
        siteUrl
        media(sort: POPULARITY_DESC, type: ANIME, perPage: 3) {
          nodes {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            genres
            averageScore
            status
            seasonYear
          }
        }
      }
    }
  `;

  try {
    // 모든 제작사 정보를 병렬로 가져오기
    const studios = await Promise.allSettled(
      famousStudioIds.map(studio =>
        anilistQuery(query, { id: studio.id })
          .then((data: AniListStudioResponse) => data.data.Studio)
      )
    );

    return studios
      .filter((result): result is PromiseFulfilledResult<Studio> => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);
  } catch (error) {
    console.error('제작사 목록 가져오기 실패:', error);
    return [];
  }
}

// 애니메이션 제목으로 검색
export async function searchAnime(query: string): Promise<AnimeItem[]> {
  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 20) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          genres
          averageScore
          status
          seasonYear
        }
      }
    }
  `;

  try {
    const data: AniListAnimeSearchResponse = await anilistQuery(graphqlQuery, { search: query });
    return data.data.Page.media;
  } catch (error) {
    console.error('애니메이션 검색 실패:', error);
    return [];
  }
}

// 제작사 이름으로 검색
export async function searchStudios(query: string): Promise<Studio[]> {
  const graphqlQuery = `
    query ($search: String) {
      Page(perPage: 10) {
        studios(search: $search) {
          id
          name
          isAnimationStudio
          favourites
          siteUrl
          media(sort: POPULARITY_DESC, type: ANIME, perPage: 3) {
            nodes {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              status
              seasonYear
            }
          }
        }
      }
    }
  `;

  try {
    const data: AniListStudiosResponse = await anilistQuery(graphqlQuery, { search: query });
    return data.data.Page.studios;
  } catch (error) {
    console.error('제작사 검색 실패:', error);
    return [];
  }
}
