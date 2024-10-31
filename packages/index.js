/*
 * @Author: be_loving@163.com 
 * @Date: 2024-10-23 13:29:04
 * @LastEditors: be_loving@163.com 
 * @LastEditTime: 2024-10-23 13:30:48
 * @FilePath: /vue3-wave-audio-player/packages/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue3WaveAudioPlayer from './index.vue'

Vue3WaveAudioPlayer.install = (Vue) => {
  Vue.component(Vue3WaveAudioPlayer.name, Vue3WaveAudioPlayer)
}

export default Vue3WaveAudioPlayer
