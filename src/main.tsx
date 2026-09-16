import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { completeLoginFromUrl } from './sources/spotify'
import './styles.css'

function render() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// 스포티파이 로그인하고 돌아왔으면 주소에 붙은 code 를 토큰으로 바꾼 뒤에 앱을 띄운다.
// (top-level await 는 빌드 타깃에서 안 돌아가서 then 으로 쓴다)
completeLoginFromUrl().catch(() => {}).then(render)
