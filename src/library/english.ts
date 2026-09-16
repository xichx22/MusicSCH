/*
 * 영어 제목을 한글로 바꾼다.
 *
 * 타요 앨범은 스포티파이에 영어 제목으로 올라와 있다('Fire Truck Song').
 * 음원은 한국어인데 제목만 영어다. 그대로 두면 두 가지가 망가진다.
 *
 *  1. 주제 카드를 못 찾는다 — 카드 말은 한글('소방차')이다
 *  2. 알아서 카드를 만들 때 'Excavator' 같은 영어 카드가 생긴다.
 *     아빠도 읽기 불편하고, 그림(이모지)도 한글로만 짐작한다
 *
 * 그래서 제목을 먼저 한글로 바꿔놓고 시작한다. 사전에 없는 말은 그대로
 * 둔다. 잘못 바꾸느니 안 바꾸는 게 낫다.
 */

/** 영어 → 한글. 긴 말이 먼저 이기도록 아래에서 길이순으로 정렬한다. */
const DICT: [string, string][] = [
  /* 자동차 · 중장비 */
  ['fire truck', '소방차'], ['fire engine', '소방차'], ['firetruck', '소방차'],
  ['police car', '경찰차'], ['patrol car', '경찰차'], ['police', '경찰차'],
  ['ambulance', '구급차'], ['rescue team', '구조대'], ['rescue', '구조'],
  ['dump truck', '덤프트럭'], ['garbage truck', '청소차'], ['trash truck', '청소차'],
  ['tow truck', '견인차'], ['ladder truck', '사다리차'], ['ice cream truck', '아이스크림차'],
  ['monster truck', '몬스터트럭'], ['pickup truck', '픽업트럭'], ['truck', '트럭'],
  ['cement mixer', '레미콘'], ['concrete mixer', '레미콘'], ['mixer', '레미콘'],
  ['excavator', '포크레인'], ['digger', '포크레인'], ['power shovel', '포크레인'],
  ['bulldozer', '불도저'], ['road roller', '로드롤러'], ['steam roller', '로드롤러'],
  ['forklift', '지게차'], ['crane', '크레인'], ['tractor', '트랙터'],
  ['snow plow', '제설차'], ['street sweeper', '청소차'], ['sweeper', '청소차'],
  ['heavy equipment', '중장비'], ['heavy machine', '중장비'], ['heavy vehicle', '중장비'],
  ['construction', '공사'], ['school bus', '스쿨버스'], ['bus', '버스'],
  ['sports car', '스포츠카'], ['race car', '경주용차'], ['racing', '경주'], ['race', '경주'],
  ['taxi', '택시'], ['train', '기차'], ['subway', '지하철'],
  ['airplane', '비행기'], ['plane', '비행기'], ['helicopter', '헬리콥터'],
  ['rocket', '로켓'], ['submarine', '잠수함'], ['boat', '배'], ['ship', '배'],
  ['bicycle', '자전거'], ['bike', '자전거'], ['motorcycle', '오토바이'],
  ['car wash', '세차'], ['traffic light', '신호등'], ['gas station', '주유소'],
  ['tunnel', '터널'], ['bridge', '다리'], ['garage', '차고'], ['siren', '사이렌'],
  ['wheel', '바퀴'], ['engine', '엔진'], ['horn', '경적'],
  ['driver', '운전사'], ['driving', '운전'], ['drive', '운전'],
  ['repair', '수리'], ['fix', '수리'], ['emergency', '비상'],
  ['car', '자동차'], ['vehicle', '자동차'],

  /* 생활 습관 */
  ['brush your teeth', '양치'], ['toothbrush', '양치'], ['brushing', '양치'],
  ['teeth', '양치'], ['tooth', '양치'],
  ['bath time', '목욕'], ['bathtime', '목욕'], ['bath', '목욕'],
  ['wash your hands', '손씻기'], ['washing hands', '손씻기'], ['wash hands', '손씻기'],
  ['bedtime', '자장가'], ['good night', '자장가'], ['lullaby', '자장가'],
  ['sleeping', '자장가'], ['sleepy', '졸린'], ['sleep', '자장가'],
  ['potty', '응가'], ['poop', '응가'], ['diaper', '기저귀'],
  ['breakfast', '아침밥'], ['lunch', '점심'], ['dinner', '저녁'],
  ['snack', '간식'], ['food', '밥'], ['eat', '밥'],
  ['clean up', '정리'], ['cleaning', '청소'], ['clean', '청소'],
  ['hospital', '병원'], ['doctor', '병원'], ['dentist', '치과'],
  ['birthday', '생일'], ['christmas', '크리스마스'], ['halloween', '핼러윈'],

  /* 사람 · 마음 */
  ['family', '가족'], ['mommy', '엄마'], ['mama', '엄마'], ['mother', '엄마'],
  ['daddy', '아빠'], ['papa', '아빠'], ['father', '아빠'],
  ['grandma', '할머니'], ['grandpa', '할아버지'],
  ['baby', '아기'], ['friend', '친구'], ['friends', '친구'],
  ['hello', '인사'], ['goodbye', '인사'], ['thank you', '고마워'], ['sorry', '미안해'],
  ['happy', '행복한'], ['brave', '용감한'], ['strong', '힘센'], ['scared', '무서운'],

  /* 동물 · 자연 */
  ['dinosaur', '공룡'], ['baby shark', '아기상어'], ['shark', '상어'], ['elephant', '코끼리'], ['rabbit', '토끼'],
  ['three bears', '곰세마리'], ['bear', '곰'], ['puppy', '강아지'], ['dog', '강아지'], ['kitten', '고양이'],
  ['cat', '고양이'], ['pig', '돼지'], ['duck', '오리'], ['butterfly', '나비'],
  ['frog', '개구리'], ['penguin', '펭귄'], ['lion', '사자'], ['tiger', '호랑이'],
  ['monkey', '원숭이'], ['animal', '동물'], ['insect', '곤충'],
  ['rainbow', '무지개'], ['rain', '비'], ['snow', '눈'], ['wind', '바람'],
  ['cloud', '구름'], ['star', '별'], ['moon', '달'], ['flower', '꽃'], ['tree', '나무'],
  ['ocean', '바다'], ['sea', '바다'], ['beach', '바닷가'], ['mountain', '산'],
  ['space', '우주'], ['winter', '겨울'], ['summer', '여름'], ['spring', '봄'],

  /* 놀이 · 배우기 */
  ['hide and seek', '숨바꼭질'], ['playground', '놀이터'], ['playing', '놀이'],
  ['adventure', '모험'], ['surprise', '깜짝'], ['magic', '마법'], ['dream', '꿈'],
  ['dancing', '춤'], ['dance', '춤'], ['running', '달리기'], ['jumping', '점프'],
  ['number', '숫자'], ['counting', '숫자'], ['color', '색깔'], ['colour', '색깔'],
  ['shape', '모양'], ['alphabet', '알파벳'], ['fruit', '과일'], ['vegetable', '채소'],
  ['school bell', '학교종'], ['school', '학교'], ['park', '공원'], ['house', '집'], ['home', '집'], ['city', '도시'],

  /* 캐릭터 이름 — 한글로 바꿔야 '제목에서 캐릭터 이름 빼기' 가 먹는다 */
  ['tayo', '타요'], ['pororo', '뽀로로'], ['pinkfong', '핑크퐁'],
  ['bebefinn', '베베핀'], ['cheetahboo', '치타부'], ['tomtomi', '톰토미'],

  /* 움직임 */
  ['hurry up', '서둘러'], ['let us go', '출발'], ['ready', '준비'], ['start', '출발'],
  ['helper', '도우미'], ['working', '일하기'], ['team', '팀'],
  ['fast', '빠른'], ['slow', '느린'], ['big', '큰'], ['little', '작은'], ['small', '작은'],
]

/** 정규식에서 뜻을 갖는 글자를 막는다. */
function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/*
 * 긴 말부터 바꾼다. 'fire truck' 을 먼저 '소방차' 로 만들어야
 * 'truck' 이 끼어들어 '불 트럭' 이 되지 않는다.
 */
const RULES = DICT.sort((a, b) => b[0].length - a[0].length).map(([en, ko]) => [
  // 낱말 통째로만 바꾼다. 'car' 가 'carrot' 을 건드리면 안 된다.
  new RegExp(`(^|[^A-Za-z])${escape(en).replace(/ /g, '\\s+')}(?:e?s)?(?![A-Za-z])`, 'gi'),
  ko,
] as const)

/** 영어가 섞인 제목을 한글로. 사전에 없는 말은 그대로 둔다. */
export function toKorean(text: string): string {
  if (!/[A-Za-z]/.test(text)) return text
  let out = text
  // 'Let's go' 처럼 줄임표가 끼면 낱말이 갈라진다. 먼저 편다.
  out = out.replace(/let'?s\s+go/gi, ' 출발 ')
  for (const [re, ko] of RULES) out = out.replace(re, `$1 ${ko} `)
  return out.replace(/\s+/g, ' ').trim()
}
