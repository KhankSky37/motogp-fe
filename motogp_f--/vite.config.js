import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5137, // Cài đặt cổng cố định
    strictPort: true, // Ép buộc Vite chỉ chạy trên cổng 5173
  }
})
