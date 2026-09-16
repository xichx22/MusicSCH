/*
 * 추천 앨범.
 *
 * 곡을 하나씩 링크 복사해 붙여넣는 게 너무 번거로워서, 웹에서 찾아 확인한
 * 스포티파이 앨범 주소를 미리 넣어둔다. 누르면 그 앨범의 진짜 수록곡을
 * 스포티파이에서 받아오므로, 곡 정보는 내 추측이 아니라 스포티파이가 준다.
 *
 * 앨범 자체가 잘못 짝지어졌을 수는 있다. 넣기 전에 곡 목록을 보여주고,
 * 넣은 뒤에도 앨범 단위로 되돌릴 수 있게 해둔다.
 *
 * 뽀로로는 웹 검색으로 스포티파이 앨범이 안 잡혔다(애플뮤직·벅스만 나온다).
 * 스포티파이에 곡은 있으니 앨범 링크는 아빠가 직접 복사해 넣어야 한다.
 */
export interface RecommendedAlbum {
  characterId: string
  /** 스포티파이 앨범 id */
  id: string
  title: string
}

export const RECOMMENDED_ALBUMS: RecommendedAlbum[] = [
  // 꼬마버스 타요 (Tayo the Little Bus)
  { characterId: 'c-tayo', id: '4spd3YKvh1Qezq85AGWhGG', title: '타요 자동차 동요' },
  { characterId: 'c-tayo', id: '4CTfzpn79ESyMiKM8Yc7Ld', title: '타요 유치원 동요' },
  { characterId: 'c-tayo', id: '2TbZfBSAAigtRJSArTgFh1', title: '타요 장난감 동요' },
  { characterId: 'c-tayo', id: '3iDwPXUgmJddprtUSKV67k', title: '베이비 타요 동요' },
  { characterId: 'c-tayo', id: '5Zj0IKR9cjmnJ3pIZoOr5U', title: '타요 키즈송 모음 1' },
  { characterId: 'c-tayo', id: '4Wkw9S3OQEfgPczaPmQpii', title: '레스큐 타요 장난감송' },

  // 핑크퐁
  { characterId: 'c-pinkfong', id: '2bKp91zTLQ5WTAWAbKS4ty', title: '핑크퐁 자동차 동요' },
  { characterId: 'c-pinkfong', id: '5Otq1xyZ5N6KWZuIT5MoIf', title: '핑크퐁 호기와 노래해요 4 (버스)' },
  { characterId: 'c-pinkfong', id: '3y735EbobaBbuaEDgEBBrB', title: '핑크퐁 동물 동요' },
  { characterId: 'c-pinkfong', id: '02ShtRpn0tQDigVqYxxEtF', title: '차에서 듣는 핑크퐁 인기동요 20곡' },
  { characterId: 'c-pinkfong', id: '4XvCFwFSqQo722etwhBtmx', title: '핑크퐁 인기동요 베스트' },

  // 베베핀
  { characterId: 'c-bebefinn', id: '7Hpgb25NdUyV5P0ShiLZml', title: '베베핀 인기동요' },
  { characterId: 'c-bebefinn', id: '3NITyRKGAz32iFHdG8HY95', title: '베베핀 인기동요 베스트' },
  { characterId: 'c-bebefinn', id: '5aRliuRMzaL8v7mLMvoS3z', title: '베베핀 유치원 놀이동요' },
  { characterId: 'c-bebefinn', id: '3I5TgjEr6qLhsa4wBP1vM4', title: '베베핀 학습동요' },

  // 치타부
  { characterId: 'c-cheetahboo', id: '2bK3ClsfnbR0hkdyC6NODC', title: '치타부 응가송 (생활 습관)' },

  // 톰토미
  { characterId: 'c-tomtomi', id: '0MS8HbDUmjxXHF20F4NCHa', title: '톰토미 기상송' },

  // 옛날 동요
  { characterId: 'c-twinkle', id: '5tqNCyxVO5lBI0Z6B0tyG5', title: '창의력 발달 어린이 인기 동요 180' },
]

export function albumUrl(id: string): string {
  return `https://open.spotify.com/album/${id}`
}
