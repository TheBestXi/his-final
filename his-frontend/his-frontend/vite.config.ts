import { viteMockServe } from 'vite-plugin-mock'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableMock = command === 'serve' && env.VITE_USE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      viteMockServe({
        mockPath: 'src/mocks',
        enable: enableMock, // Only enable if explicitly set to true
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          // We do NOT rewrite path because backend @RequestMapping includes /api
          // If backend was just /auth, we would use: rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
