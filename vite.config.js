/*
 * @Author: be_loving@163.com 
 * @Date: 2024-10-22 18:49:23
 * @LastEditors: be_loving@163.com 
 * @LastEditTime: 2024-10-23 14:17:34
 * @FilePath: /vue3-wave-audio-player/vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: 'examples',
  // build: {
  //   lib: {
  //     entry: resolve(__dirname, 'packages/index.js'),
  //     name: 'Vue3WaveAudioPlayer',
  //     fileName: (format) => `vue3-wave-audio-player.${format}.js`,
  //   },

  //   rollupOptions: {
  //     // 确保外部化处理那些你不想打包进库的依赖
  //     external: ['vue', 'vue-router'],
  //     output: {
  //       // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
  //       globals: {
  //         vue: 'Vue',
  //       },
  //     },
  //   },

  //   outDir: resolve(__dirname + '/lib'),
  // },

  server: {
    host: '0.0.0.0',
  },
})
