<!--
 * @Author: be_loving@163.com
 * @Date: 2024-10-22 18:49:23
 * @LastEditors: be_loving@163.com 
 * @LastEditTime: 2024-10-31 10:22:13
 * @FilePath: /vue3-wave-audio-player-list/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# Vue 3 wave-audio-player-list

![Image demo](https://github.com/futuremeng/vue3-wave-audio-player-list/blob/main/preview.png)

## NPM install

```sh
npm i @futuremeng/vue3-wave-audio-player-list
```

### Import ans use

```html
<template>
  <div style="max-width: 250px">
    <Vue3WaveAudioPlayerList
      wave-type="mirror"
      :data="demo"
      :disable-seeking="true"
      :wave-animation="false"
      :current-time-visible="true"
      :duration-time-visible="true"
    />
  </div>
</template>
<script>
  import Vue3WaveAudioPlayerList from 'vue3-wave-audio-player-list'

  export default {
    name: 'App',
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
  }
</script>
```

### Attributes

| Name                  | Required | Type    | Description                                                                                                                                                                               |
| --------------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                  | True     | Array   | Array of objects with the following structure:{ title:'',src:''}                                                                                                                          |
| wave-width            | True     | Integer | Width of the Waves. (Not responsive, Also remember that the buttons and the timing strings will take extra ~250px. For example, if(container === 500px) => wave-width = 500 - 250 = 250 ) |
| wave-height           | True     | Integer | Height of the waves (Not Responsive)                                                                                                                                                      |
| wave-type             | False    | String  | Type of wave. (Not working yet)                                                                                                                                                           |
| wave-options          | False    | Object  | Set settings for the waves (Not working yet)                                                                                                                                              |
| load-audio-onmount    | False    | Boolean | Load the path and audio data on mounted                                                                                                                                                   |
| disable-seeking       | False    | Boolean | Disable time seeking                                                                                                                                                                      |
| current-time-visible  | False    | Boolean | Show current time                                                                                                                                                                         |
| duration-time-visible | False    | Boolean | Show duration time                                                                                                                                                                        |
| disable-seeking       | False    | Boolean | Disable seeking                                                                                                                                                                           |
| load-audio-onmount    | False    | Boolean | Load the path and audio data on mounted                                                                                                                                                   |
| circle                | False    | Boolean | Show circle button                                                                                                                                                                        |

### Events

I have added all the events that html has in the audio tag with a "on-" prefix.
Additional events:

| Name    | Required | Type | Return  | Description                              |
| ------- | -------- | ---- | ------- | ---------------------------------------- |
| on-play | False    | Func | Boolean | Triggered when user click on play button |

Check [MDN Doc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) for all the events.

### Report bug or Suggestion

please send a mail at <futuremeng@gmail.com>.
You can also open any issue in the [GitHub](https://github.com/futuremeng/vue3-wave-audio-player-list) page. Thanks for using this package.

### Inspired by

[vue3-wave-audio-player](https://github.com/futuremeng/vue3-wave-audio-player)
[wave-path-audio-player](https://www.npmjs.com/package/wave-audio-path-player) package
[waveform-path](https://jerosoler.github.io/waveform-path) package
