/*
 * @Author: be_loving@163.com
 * @Date: 2024-10-23 14:20:21
 * @LastEditors: be_loving@163.com
 * @LastEditTime: 2024-10-28 13:27:43
 * @FilePath: /vue3-wave-audio-player/examples/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import Vue3WaveAudioPlayer from '@futuremeng/vue3-wave-audio-player';

const app = createApp(App)

// app.use(Vue3WaveAudioPlayer)
app.use(router)
app.mount('#app')
