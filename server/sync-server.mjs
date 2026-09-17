/*
 * 지한이 노래 앱 동기화 서버.
 *
 * 라즈베리파이에서 돌린다. 하는 일은 딱 하나 — 카드와 노래 목록을
 * 파일 하나에 넣어두고, 태블릿이 올리면 받아 적고 폰이 달라고 하면 준다.
 *
 * 외부 라이브러리를 안 쓴다. 파이에 node 만 있으면 그대로 돈다.
 * npm install 이 필요 없으면 몇 년 뒤에 켜도 그냥 돈다.
 *
 *   node sync-server.mjs
 *
 * 환경변수
 *   PORT   기본 8787
 *   DATA   저장할 파일. 기본 ./jihan-songs.json
 *   TOKEN  정하면 이 값을 X-Sync-Token 으로 보내야 받아준다
 */
import { createServer } from 'node:http'
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const PORT = Number(process.env.PORT ?? 8787)
const DATA = resolve(process.env.DATA ?? './jihan-songs.json')
const TOKEN = process.env.TOKEN ?? ''
/** 노래가 400곡쯤 되면 200KB 안팎이다. 넉넉하게 8MB 까지 받는다. */
const MAX_BODY = 8 * 1024 * 1024

/** 비어 있는 상태. 아직 아무도 안 올렸을 때. */
let store = { version: 0, updatedAt: 0, db: null }

async function loadStore() {
  try {
    store = JSON.parse(await readFile(DATA, 'utf8'))
    console.log(`불러왔어: ${DATA} (version ${store.version}, 노래 ${store.db?.songs?.length ?? 0}곡)`)
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
    console.log(`아직 저장된 게 없어. 처음 올리면 ${DATA} 에 만든다.`)
  }
}

/*
 * 쓰다가 전원이 나가도 파일이 반쯤 쓰인 채로 남지 않게, 옆에 새로 쓰고
 * 이름을 바꿔치기한다. 목록이 통째로 날아가면 아빠가 다시 다 넣어야 한다.
 */
async function saveStore() {
  await mkdir(dirname(DATA), { recursive: true })
  const tmp = `${DATA}.tmp`
  await writeFile(tmp, JSON.stringify(store))
  await rename(tmp, DATA)
}

function cors(res) {
  // 태블릿과 폰만 닿는 테일넷 안이라 출처는 안 따진다.
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Sync-Token')
  res.setHeader('Access-Control-Max-Age', '86400')

  // 앱은 공개 주소(github.io)에서 열리는데 파이는 테일스케일 사설대역
  // (100.64.0.0/10)이다. 크롬은 "공개 페이지 → 사설망" 요청을 기본으로 막고,
  // 서버가 이 헤더로 허락해야만 통과시킨다(Private Network Access).
  // 이게 없으면 주소창으로 열 때는 되는데 앱에서만 "파이에 못 닿아" 가 난다 —
  // 주소창 이동은 이 검사를 안 받기 때문이다.
  res.setHeader('Access-Control-Allow-Private-Network', 'true')
}

function send(res, code, body) {
  cors(res)
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((ok, fail) => {
    let n = 0
    const chunks = []
    req.on('data', (c) => {
      n += c.length
      if (n > MAX_BODY) {
        fail(new Error('너무 커'))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on('end', () => ok(Buffer.concat(chunks).toString('utf8')))
    req.on('error', fail)
  })
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')

  // 들어온 요청을 한 줄씩 남긴다. 예전엔 저장에 성공했을 때만 기록해서,
  // "앱이 파이에 못 닿는다" 고 할 때 요청이 여기까지 왔는지조차 알 수 없었다.
  // 테일스케일 serve 를 거치면 진짜 기기 주소는 x-forwarded-for 에 담겨 온다.
  const from = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?'
  const origin = req.headers['origin'] ? ` origin=${req.headers['origin']}` : ''
  const pna = req.headers['access-control-request-private-network'] ? ' [사설망요청]' : ''
  console.log(`${req.method} ${url.pathname} ← ${from}${origin}${pna}`)

  if (req.method === 'OPTIONS') {
    cors(res)
    res.writeHead(204)
    res.end()
    return
  }

  if (TOKEN && req.headers['x-sync-token'] !== TOKEN) {
    send(res, 401, { error: '열쇠가 안 맞아' })
    return
  }

  // 살아 있는지만 보는 곳. 주소가 맞는지 확인할 때 쓴다.
  if (req.method === 'GET' && url.pathname === '/health') {
    send(res, 200, { ok: true, name: '지한이 노래 동기화', version: store.version })
    return
  }

  // 받아올 게 있는지만 싸게 확인한다. 200KB 를 매번 내려받을 필요는 없다.
  if (req.method === 'GET' && url.pathname === '/version') {
    send(res, 200, { version: store.version, updatedAt: store.updatedAt })
    return
  }

  if (req.method === 'GET' && url.pathname === '/db') {
    send(res, 200, store)
    return
  }

  if (req.method === 'PUT' && url.pathname === '/db') {
    let body
    try {
      body = JSON.parse(await readBody(req))
    } catch {
      send(res, 400, { error: '못 읽겠어' })
      return
    }
    if (!body || typeof body.db !== 'object' || body.db === null) {
      send(res, 400, { error: 'db 가 없어' })
      return
    }
    /*
     * 내가 알던 번호와 다르면 그 사이에 누가 올린 것이다. 덮어쓰지 않고
     * 지금 것을 돌려준다. 목록을 통째로 잃는 것보다 한 번 물어보는 게 낫다.
     * 일부러 덮어쓰려면 force 를 붙인다.
     */
    if (!body.force && typeof body.version === 'number' && body.version !== store.version) {
      send(res, 409, { error: '그 사이에 바뀌었어', version: store.version, updatedAt: store.updatedAt })
      return
    }
    store = { version: store.version + 1, updatedAt: Date.now(), db: body.db }
    try {
      await saveStore()
    } catch (e) {
      send(res, 500, { error: `저장 실패: ${e.message}` })
      return
    }
    const n = store.db?.songs?.length ?? 0
    console.log(`${new Date().toLocaleString('ko-KR')} 저장 (version ${store.version}, 노래 ${n}곡)`)
    send(res, 200, { version: store.version, updatedAt: store.updatedAt })
    return
  }

  send(res, 404, { error: '그런 건 없어' })
})

await loadStore()
server.listen(PORT, () => console.log(`듣는 중: http://0.0.0.0:${PORT}`))
