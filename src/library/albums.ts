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
 * 아티스트 이름을 잘못 짚으면 없는 줄 안다. 뽀로로는 한동안 '없다' 고
 * 적어뒀었는데, 스포티파이에서는 'Pororo the little penguin' 이라는
 * 이름으로 앨범이 잔뜩 올라와 있었다.
 *
 * 앨범 이름은 스포티파이에 적힌 그대로 둔다. 한글로 번역해 적었더니
 * 한국어 앨범인 줄 알고 눌렀다가 영어 제목이 나와서 헷갈렸다.
 */
export interface RecommendedAlbum {
  characterId: string
  /** 스포티파이 앨범 id */
  id: string
  /** 스포티파이에 적힌 이름 그대로. 번역하지 않는다. */
  title: string
  /** 눌러보기 전에 알아야 할 것 (한국어 음원인지 등) */
  note?: string
}

export const RECOMMENDED_ALBUMS: RecommendedAlbum[] = [
  /*
   * 뽀롱뽀롱 뽀로로.
   * 스포티파이 아티스트 이름은 'Pororo the little penguin' 이다.
   * 앨범 이름은 영어가 많지만 음원은 한국어다.
   */
  { characterId: 'c-pororo', id: '1ijw1FFDB0bL33hrqQzXkb', title: 'Pororo Car Songs', note: '2021 · 6곡 · 자동차' },
  { characterId: 'c-pororo', id: '0a4XHU7gWoVQ4bhOFwTSw3', title: 'Pororo Best Kids Songs (Korean Ver.)', note: '2022 · 9곡 · 한국어 음원' },
  { characterId: 'c-pororo', id: '6l8Qi5EXL8PmQmAtlbCgSA', title: '뽀로로 시즈널 동요', note: '2022 · 8곡 · 이름도 곡도 한글' },
  { characterId: 'c-pororo', id: '1eUCvWCjgbP2vWXTwmBVrs', title: 'Pororo Dinosaur Songs', note: '2023 · 9곡 · 공룡' },
  { characterId: 'c-pororo', id: '70SmX9neLjD56oPZzaXgJP', title: 'Pororo Job Songs', note: '2022 · 8곡 · 직업' },
  { characterId: 'c-pororo', id: '748jVIRz6criOthqfPVNLG', title: 'Pororo Animal Songs', note: '2022 · 10곡 · 동물' },
  { characterId: 'c-pororo', id: '3TMBjze71RL3vrotP7ZG7d', title: 'Pororo Shark Songs', note: '2020 · 10곡 · 상어' },
  { characterId: 'c-pororo', id: '7yDFEu6zWJ19e7dA9Af6ki', title: 'Pororo Baby Songs', note: '2022 · 9곡' },
  { characterId: 'c-pororo', id: '2DUAcOKzsIsG0gLey73N1x', title: 'Pororo NEW singalong', note: '2025 · 15곡' },
  { characterId: 'c-pororo', id: '3zkFkz9AlLhghjabvmuKbt', title: 'Pororo Rap Chant', note: '2021 · 28곡' },
  { characterId: 'c-pororo', id: '3aC2Q8SEfEMi6BqStC9yqk', title: 'Pororo Singalong Lullabies', note: '2026 · 40곡 · 자장가' },

  /*
   * 꼬마버스 타요.
   * 스포티파이에서는 앨범 이름이 영어다. '(Korean Version)' 이 붙은 것이
   * 한국어 음원이다. 전에 내가 이걸 한글로 번역해 적어놨더니, 한국어
   * 앨범인 줄 알고 눌렀다가 영어 제목이 나와서 헷갈렸다. 스포티파이에
   * 적힌 이름 그대로 쓴다.
   */
  { characterId: 'c-tayo', id: '4spd3YKvh1Qezq85AGWhGG', title: 'Tayo Car Songs (Korean Version)', note: '한국어 음원 · 곡 제목은 영어' },
  { characterId: 'c-tayo', id: '4CTfzpn79ESyMiKM8Yc7Ld', title: 'Tayo Preschool Songs (Korean Version)', note: '한국어 음원 · 곡 제목은 영어' },
  { characterId: 'c-tayo', id: '2TbZfBSAAigtRJSArTgFh1', title: 'Tayo Toy Story Songs (Korean Version)', note: '한국어 음원 · 곡 제목은 영어' },
  { characterId: 'c-tayo', id: '3iDwPXUgmJddprtUSKV67k', title: 'Baby Tayo Songs (Korean Version)', note: '한국어 음원 · 곡 제목은 영어' },

  // 핑크퐁 — 앨범도 곡도 한글이다.
  { characterId: 'c-pinkfong', id: '2bKp91zTLQ5WTAWAbKS4ty', title: '핑크퐁 자동차 동요' },
  { characterId: 'c-pinkfong', id: '5Otq1xyZ5N6KWZuIT5MoIf', title: '핑크퐁 호기와 노래해요 4 (버스 동요)' },
  { characterId: 'c-pinkfong', id: '3y735EbobaBbuaEDgEBBrB', title: '핑크퐁 동물 동요' },
  { characterId: 'c-pinkfong', id: '02ShtRpn0tQDigVqYxxEtF', title: '차에서 듣는 신나는 핑크퐁 인기동요 20곡' },
  { characterId: 'c-pinkfong', id: '4XvCFwFSqQo722etwhBtmx', title: '신나는 핑크퐁 인기동요 베스트 100분' },

  // 베베핀
  { characterId: 'c-bebefinn', id: '7Hpgb25NdUyV5P0ShiLZml', title: '베베핀 인기동요' },
  { characterId: 'c-bebefinn', id: '3NITyRKGAz32iFHdG8HY95', title: '베베핀 인기동요 베스트' },
  { characterId: 'c-bebefinn', id: '5aRliuRMzaL8v7mLMvoS3z', title: '베베핀 유치원 놀이동요' },
  { characterId: 'c-bebefinn', id: '3I5TgjEr6qLhsa4wBP1vM4', title: '베베핀 학습동요' },

  // 치타부
  { characterId: 'c-cheetahboo', id: '2bK3ClsfnbR0hkdyC6NODC', title: '치타부 응가송 - 생활 습관 동요' },

  // 톰토미
  { characterId: 'c-tomtomi', id: '0MS8HbDUmjxXHF20F4NCHa', title: '톰토미 기상송' },

  // 옛날 동요
  { characterId: 'c-twinkle', id: '5tqNCyxVO5lBI0Z6B0tyG5', title: '창의력 발달 어린이 인기 동요 베스트 180' },
]

export function albumUrl(id: string): string {
  return `https://open.spotify.com/album/${id}`
}
