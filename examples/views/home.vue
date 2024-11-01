<!--
 * @Author: be_loving@163.com 
 * @Date: 2024-10-23 13:32:11
 * @LastEditors: be_loving@163.com 
 * @LastEditTime: 2024-11-01 16:58:12
 * @FilePath: /vue3-wave-audio-player/examples/views/home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <Vue3WaveAudioPlayerList
      wave-type="mirror"
      :data="demo"
      :disable-seeking="false"
      :wave-animation="false"
      :current-time-visible="true"
      :duration-time-visible="true"
    />
  </div>
</template>

<script>
import Vue3WaveAudioPlayerList from '../../packages/index.vue'

export default {
  name: 'HomePage',
  components: {
    Vue3WaveAudioPlayerList,
  },
  data() {
    return {
      example_options: {
        samples: 50,
        type: 'steps',
        paths: [
          { d: 'V', sy: 0, x: 0, ey: 100 },
          {
            d: 'A',
            sx: 0,
            sy: 100,
            ex: 100,
            ey: 100,
            rx: 10,
            ry: 10,
            angle: 180,
            arc: 1,
            sweep: 1,
          },
          { d: 'V', sy: 0, x: 100, ey: 100 },
        ],
      },
      index: 0,
      demo: [
        {
          title: '国风1',
          src: 'https://one-ywcbs-static.oss-cn-beijing.aliyuncs.com/abc.mp3',
        },
        {
          title: '国风2',
          src: 'https://one-ywcbs-static.oss-cn-beijing.aliyuncs.com/2.mp3',
        },
        {
          title: '国风3',
          src: 'https://one-ywcbs-static.oss-cn-beijing.aliyuncs.com/3.mp3',
        },
      ],
    }
  },
  methods: {
    onError(e) {
      console.log(e)
    },
    tried_to_seek(didSkip) {
      if (didSkip) console.log('Player skipped')
      else console.log('Player skip blocked')
    },
  },
}
</script>
