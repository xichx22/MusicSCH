import { useMemo, useState } from 'react'
import { comboKey, type DB } from '../library/store'
import { hasIcon } from '../components/icons'

/**
 * 카드 목록 내보내기.
 *
 * 카드와 노래는 태블릿 안에만 있어서 나는 못 본다. 아빠가 이걸 눌러
 * 복사해서 보내주면, 어떤 카드에 그림이 없는지 보고 새로 그려줄 수 있다.
 * 그림이 없는 카드는 ✎ 로 표시해둔다.
 */
export function ExportList({ db }: { db: DB }) {
  const [copied, setCopied] = useState('')

  const text = useMemo(() => {
    const lines: string[] = []
    const topics = db.cards.filter((c) => c.kind === 'topic')

    for (const character of db.cards.filter((c) => c.kind === 'character')) {
      const mine = topics
        .map((t) => {
          const key = comboKey(character.id, t.id)
          return { t, n: db.songs.filter((s) => s.combo === key).length }
        })
        .filter((x) => x.n > 0)
      const waiting = db.songs.filter((s) => s.needsTopic === character.id)
      if (mine.length === 0 && waiting.length === 0) continue

      lines.push(`[${character.label ?? character.word}] 카드 ${mine.length}장`)
      for (const { t, n } of mine) {
        // 그려둔 그림이 없으면 ✎. 앨범 사진을 쓰는 카드는 📷.
        const mark = t.image ? '📷' : hasIcon(t.id, t.word) ? '  ' : '✎ '
        lines.push(`  ${mark}${t.label ?? t.word} (${n}곡)${t.emoji ? ` ${t.emoji}` : ''}`)
      }
      for (const s of waiting) lines.push(`  ? 주제없음: ${s.title}`)
      lines.push('')
    }
    lines.push(`노래 ${db.songs.length}곡 · 카드 ${db.cards.length}장`)
    return lines.join('\n')
  }, [db])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied('복사했어. 나한테 붙여넣어줘.')
    } catch {
      setCopied('복사가 안 되네. 아래 글을 길게 눌러서 직접 복사해줘.')
    }
  }

  return (
    <section>
      <h2>카드 목록 내보내기</h2>
      <p className="hint">
        태블릿 안에 뭐가 들었는지는 나는 못 봐. 이걸 복사해서 보내주면
        <strong> 그림 없는 카드(✎)</strong> 를 보고 새로 그려줄게.
      </p>
      <button onClick={() => void copy()}>목록 복사하기</button>
      {copied && <p className="hint">{copied}</p>}
      <textarea className="export-box" readOnly value={text} rows={12} />
    </section>
  )
}
