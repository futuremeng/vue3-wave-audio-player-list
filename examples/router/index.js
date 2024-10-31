/*
 * @Author: be_loving@163.com
 * @Date: 2024-10-23 13:31:43
 * @LastEditors: be_loving@163.com
 * @LastEditTime: 2024-10-28 13:35:52
 * @FilePath: /vue3-wave-audio-player/examples/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(''),
  routes,
})

export default router
