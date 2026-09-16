# 지한이 노래 (MusicSCH)

글자를 못 읽는 아이가 **그림 카드**만 눌러서 듣고 싶은 노래를 찾는 앱.

`뽀로로 🐧` + `소방차 🚒` → `"뽀로로 소방차"` → 노래 재생.

**영상은 나오지 않는다.** 재생 화면은 안 움직이는 그림 한 장과 '그만' 버튼뿐이다.

---

## 왜 유튜브를 안 쓰나

처음엔 유튜브 뮤직에서 검색하려고 했는데, 영상 없이 소리만 쓰는 게 구글 정책상 불가능하다.

- [오디오만 분리해서 쓰는 것 금지](https://developers.google.com/youtube/terms/developer-policies)
- [플레이어를 가리거나 덮는 것 금지, 200×200 이상 계속 보여야 함](https://developers.google.com/youtube/terms/required-minimum-functionality)
- 백그라운드 재생 금지 (화면 끄면 멈춤)
- 유튜브 뮤직에는 애초에 공식 API가 없다

우회해서 만들면 언젠가 API 키가 정지되어 앱이 죽는다. 그래서 유튜브는 쓰지 않는다.

대신 **음원 소스를 갈아끼울 수 있는 구조**로 만들었다. 지금은 내 mp3 파일로 돌아가고,
스포티파이나 애플뮤직으로 바꾸고 싶으면 파일 하나만 추가하면 된다.

## A + B 구조

```
 그림 카드 2장 선택
        │
        ├─ A. 내 노래함        아빠가 확인해둔 곡. 바로 재생. 오프라인, 광고 0
        │
        └─ B. 검색             A에 없을 때만. 새 노래를 찾아준다
                 │
                 └─ 재생한 곡은 '확인 기다리는 노래'로 저장
                    → 아빠가 확인하면 A로 올라가고, 다음부터는 바로 나온다
```

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 배포용 빌드 -> dist/
```

태블릿에서 쓰려면 같은 와이파이에서 `http://<피시 IP>:5173` 으로 열고
크롬 메뉴 → **홈 화면에 추가**. 전체화면 앱처럼 뜬다.

## 노래 넣기

1. `public/songs/` 에 mp3 를 넣는다
2. `public/songs/manifest.json` 에 적는다 (형식은 `public/songs/README.md` 참고)
3. 앱에서 아빠 화면 → **public/songs 다시 읽기**

`tags` 가 카드 조합과 맞춰지는 부분이다. 카드에 적힌 말을 그대로 넣으면 된다.

> 음원 파일은 저작권이 있어서 git 에 올리지 않는다 (`.gitignore` 처리됨).
> 합법적으로 구하는 법: 멜론/벅스 등에서 **다운로드 구매**, 또는 가진 CD 리핑.

## 아빠 화면

오른쪽 아래 구석을 **2.5초 꾹** 누르면 숫자판이 뜬다. 기본 비밀번호 `1234`.

- 하루 듣기 제한 (기본 30분) · 최대 볼륨
- 검색에 쓸 음원 소스 고르기 / 검색 아예 끄기
- 노래 목록: 태그 고치기, 확인(A목록 승격), 삭제

## 음원 소스 바꾸기

`src/sources/` 아래에 소스가 하나씩 들어있다.

| 소스 | 파일 | 상태 |
|---|---|---|
| 내 mp3 | `local.ts` | 동작함 |
| 스포티파이 | `spotify/` | **동작함** (아래 설정 필요) |
| 애플뮤직 | `appleMusic.ts` | 껍데기만 — 파일 안에 붙이는 법 적어둠 |

새 소스를 붙이려면 `sources/types.ts` 의 `MusicSource` 를 구현하고
`sources/index.ts` 의 `SOURCES` 에 넣으면 끝이다. 화면 코드는 안 고쳐도 된다.

검색 소스가 아직 준비가 안 됐으면(로그인 전 등) 자동으로 내 mp3 에서 찾는다.
그래서 설정이 덜 됐어도 앱은 멀쩡히 돌아간다.

## 스포티파이 설정

재생하려면 **Premium 구독**이 필요하다 (무료 계정은 API 재생이 막혀 있다).

1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) 에서 앱 만들기
2. **Redirect URI** 등록 — 아빠 화면에 표시되는 주소를 **그대로** 복붙한다
3. Web API 와 Web Playback SDK 둘 다 체크
4. Settings → User Management 에 **내 스포티파이 계정 이메일 추가**
5. Client ID 복사 → 앱의 아빠 화면에 붙여넣기 → **로그인**

### Redirect URI 주의 (제일 많이 막히는 부분)

스포티파이는 [https 만 받는다](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri).
예외는 `http://127.0.0.1:포트` 뿐이고 **`localhost` 와 `http://192.168.x.x` 는 거부된다.**

| 상황 | 주소 | 됨? |
|---|---|---|
| PC 에서 개발 | `http://127.0.0.1:5173/` | 된다 |
| 태블릿에서 내 PC 접속 | `http://192.168.0.5:5173/` | **안 된다** |
| 배포된 주소 | `https://xichx22.github.io/MusicSCH/` | 된다 |

즉 **태블릿에서 쓰려면 https 로 배포해야 한다.** 그래서 GitHub Pages 에 올려뒀다.
스포티파이 대시보드의 Redirect URI 에 `https://xichx22.github.io/MusicSCH/` 를
**끝 슬래시까지 그대로** 등록하면 된다.

### 개발자 모드 제한

새로 만든 앱은 개발자 모드라 [허용 목록에 넣은 계정만](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)
쓸 수 있다. 가족끼리 쓰는 거라 상관없다. (지금은 개인이 이 제한을 풀 방법이 없다)

### 재생 방식 두 가지

- **이 태블릿에서 바로 재생** — 이 브라우저가 스피커가 된다 (Web Playback SDK)
- **다른 기기에서 재생 (리모컨)** — 태블릿의 스포티파이 앱이나 스피커로 소리를 보낸다.
  앱은 그림 카드만 보여주는 리모컨이 된다. 첫 번째 방식이 안 되면 이걸 쓰면 된다.

### 아이 안전

검색 결과에서 **성인 표시(explicit)된 곡은 아예 걸러낸다.** 검색은 한국 카탈로그(`market=KR`)로 한다.

## 애플뮤직

`src/sources/appleMusic.ts` 는 아직 껍데기다. 붙이는 순서는 파일 안 주석에 적어뒀다.

## 배포

`claude/image-based-youtube-music-app-lgmbzo` 에 푸시하면 GitHub Actions 가
자동으로 GitHub Pages 에 올린다 (`.github/workflows/deploy.yml`).

**주소: https://xichx22.github.io/MusicSCH/**

Pages 는 `https://<계정>.github.io/<레포>/` 처럼 하위 경로라서 빌드할 때
`BASE_PATH=/MusicSCH/` 를 넣는다. 로컬에서 똑같이 확인하려면:

```bash
BASE_PATH=/MusicSCH/ npm run build
BASE_PATH=/MusicSCH/ npm run preview   # http://localhost:4173/MusicSCH/
```

Client ID 를 매번 입력하기 싫으면 레포
Settings → Secrets and variables → Actions → **Variables** 에
`SPOTIFY_CLIENT_ID` 를 넣으면 빌드에 박혀서 나온다. (Client ID 는 브라우저에
어차피 드러나는 값이라 비밀이 아니다. **Client Secret 은 이 앱에서 아예 안 쓴다.**)

## 태블릿 세팅 (권장)

- **화면 고정 / 앱 고정(Screen Pinning)** 켜기 — 홈 버튼으로 못 빠져나간다
- 화면 회전 잠금 (가로)
- 기기 볼륨도 미리 낮춰두기 (앱 볼륨 상한은 그 위에서 한 번 더 제한한다)

## 앞으로 할 것

- [x] 음원 소스 정하기 → 내 mp3(A) + 스포티파이(B)
- [x] https 로 배포 (GitHub Pages)
- [ ] 이모지 대신 진짜 그림 넣기 (`Card.image`)
- [ ] 오프라인 캐시(서비스 워커)
- [ ] 음성으로 찾기 — 지한이가 "뽀뽀 소망차" 라고 해도 알아듣게 보정하기
