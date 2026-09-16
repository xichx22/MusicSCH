import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 는 https://<계정>.github.io/<레포>/ 처럼 하위 경로로 서비스된다.
// 배포할 때 BASE_PATH=/MusicSCH/ 를 넣어준다. 로컬 개발은 그냥 '/' 다.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: { host: true },
})
