# 두 기기 맞추기 — 라즈베리파이에 서버 올리기

태블릿에서 노래를 넣으면 파이에 올라가고, 폰은 열 때마다 받아온다.
테일스케일 안에서만 오가니 목록이 집 밖으로 안 나간다.

## 왜 https 여야 하나

앱은 `https://xichx22.github.io/MusicSCH/` 에서 열린다. https 로 열린 쪽에서
`http://...` 로 연결하면 브라우저가 **무조건 막는다**(혼합 콘텐츠 차단).
테일스케일이 진짜 인증서를 붙여주는 기능이 있으니 그걸 쓴다.

## 1. 테일스케일 관리자 화면에서 켜기 (한 번만)

<https://login.tailscale.com/admin/dns> 에서

1. **MagicDNS** 켜기
2. **HTTPS Certificates** 켜기

둘 다 켜져 있어야 파이가 인증서를 받는다.

## 2. 파일 올리고 서비스로 돌리기

```bash
# 내 컴퓨터에서 파이로 파일 보내기
scp server/sync-server.mjs xichx@xichx.tail433939.ts.net:~/

# 파이에 들어가서
ssh xichx@xichx.tail433939.ts.net

node --version            # v18 이상이면 됨. 없으면: sudo apt install nodejs
mkdir -p ~/jihan-songs
mv ~/sync-server.mjs ~/jihan-songs/

# 한 번 돌려보기
cd ~/jihan-songs && node sync-server.mjs
# '듣는 중: http://0.0.0.0:8787' 나오면 Ctrl+C
```

전원을 껐다 켜도 알아서 돌게 서비스로 등록한다.

```bash
sudo tee /etc/systemd/system/jihan-songs.service > /dev/null <<'EOF'
[Unit]
Description=지한이 노래 동기화
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=xichx
WorkingDirectory=/home/xichx/jihan-songs
Environment=PORT=8787
Environment=DATA=/home/xichx/jihan-songs/jihan-songs.json
# 열쇠를 걸고 싶으면 아래 줄 주석을 풀고 아무 긴 글자나 넣는다.
# 넣었으면 앱의 [열쇠] 칸에 똑같이 적어야 한다.
# Environment=TOKEN=아무거나긴글자
ExecStart=/usr/bin/node /home/xichx/jihan-songs/sync-server.mjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now jihan-songs
systemctl status jihan-songs --no-pager
```

`node` 가 `/usr/bin/node` 가 아니면 `which node` 로 확인해서 `ExecStart` 를 고친다.

## 3. 테일스케일로 https 붙이기

```bash
sudo tailscale serve --bg --https=443 localhost:8787
tailscale serve status
```

이러면 `https://xichx.tail433939.ts.net` 이 파이의 8787 로 연결된다.

전원을 껐다 켰을 때 이게 풀리는 버전이 있다. 한 번 재부팅해보고 풀려 있으면
아래를 넣어둔다.

```bash
sudo tee /etc/systemd/system/jihan-serve.service > /dev/null <<'EOF'
[Unit]
Description=지한이 노래 동기화 https 붙이기
After=tailscaled.service jihan-songs.service
Wants=tailscaled.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/tailscale serve --bg --https=443 localhost:8787

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now jihan-serve
```

## 4. 되는지 보기

폰 브라우저에서 (테일스케일 켠 채로)

```
https://xichx.tail433939.ts.net/health
```

`{"ok":true,"name":"지한이 노래 동기화","version":0}` 나오면 된 거다.

## 5. 앱에서 연결하기

두 기기 모두 **아빠 화면 → 두 기기 맞추기** 에서

| 칸 | 태블릿 | 지한이 폰 |
| --- | --- | --- |
| 파이 주소 | `https://xichx.tail433939.ts.net` | 같음 |
| 이 기기가 할 일 | 여기서 노래를 넣는다 | 듣기만 한다 |
| 열쇠 | TOKEN 걸었으면 같은 값 | 같음 |

태블릿에서 **[연결 확인]** → **[지금 올리기]**, 그다음 폰을 열면 알아서 받아온다.

그 뒤로는 태블릿에서 앨범을 넣거나 카드를 정리하면 **3초쯤 뒤 자동으로 올라가고**,
폰은 **앱을 열 때와 화면으로 돌아올 때 자동으로 받아온다**.

## 알아둘 것

- **카드와 노래만 오간다.** 하루 제한·볼륨·아빠 잠금 숫자·스포티파이 기기 선택은
  기기마다 따로다. 폰에서 고른 스피커가 태블릿 것으로 덮이면 곤란하니까.
- **파이가 꺼져 있어도 앱은 그냥 돈다.** 기기 안에 있는 목록으로 계속 논다.
  파이가 돌아오면 다음에 열 때 맞춰진다.
- **테일스케일이 꺼져 있으면** 동기화만 안 된다. 노래 재생은 스포티파이라 그대로 된다.
- 파이를 안 쓰고 한 번만 옮기고 싶으면 같은 화면의 **[파일로 내보내기] / [파일에서 가져오기]**
  를 쓰면 된다. 백업으로도 쓸 수 있다.

## 백업

목록은 `/home/xichx/jihan-songs/jihan-songs.json` 파일 하나다. 이것만 복사해두면 된다.

```bash
cp ~/jihan-songs/jihan-songs.json ~/jihan-songs-백업-$(date +%F).json
```
