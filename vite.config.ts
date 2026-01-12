import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
// import purgecss from 'vite-plugin-purgecss'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      vue(),
      viteCompression({
        algorithm: 'gzip', // 使用 Gzip 压缩
        ext: '.gz', // 生成的文件扩展名
        threshold: 1024, // 仅对大于 1KB 的文件进行压缩
        deleteOriginFile: false, // 是否删除原始文件（建议设置为 false）
      }),
      visualizer({
        open: false, // 打包完成后自动打开分析页面
        filename: 'stats.html', // 分析文件名称
        gzipSize: true, // 显示 Gzip 压缩后的大小
        brotliSize: true, // 显示 Brotli 压缩后的大小
      }),
      // purgecss({
      //   content: ['**/*.html', '**/*.vue', '**/*.jsx', '**/*.tsx'],
      // }),
    ],
    define: {
      'process.env': env,
    },
    server: {
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      sourcemap: false,
      cssCodeSplit: true, // 确保启用 CSS 拆分
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            axios: ['axios'], // 将 axios 拆分成单独的文件
            vendor: ['vue'], // 将 Vue 和 Vue Router 拆分成单独的文件
            router: ['vue-router'],
            // elementPlus: ['element-plus'],
            // elementIcon: ['@element-plus/icons-vue'],
            encryption: ['md5'],
            pinia: ['pinia'],
          },
        },
      },
    },
  }
})
