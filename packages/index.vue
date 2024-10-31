<template>
  <div
    class="audio-player-list-item"
    v-for="(item, index) in data"
    :key="index"
    :style="itemStyle"
  >
    <Vue3Wave
      :title="item.title"
      :src="item.src"
      :current-time="currentTime"
      :duration-time="durationTime"
      :index-self="index"
      :index-sync="indexSync"
      :disable-seeking="disableSeeking"
      :wave-options="waveOptions"
      :wave-animation="waveAnimation"
      :wave-type="waveType"
      :load-audio-onmount="loadAudioOnmount"
      :wave-width="waveWidth"
      :wave-height="waveHeight"
      :current-time-visible="currentTimeVisible"
      :duration-time-visible="durationTimeVisible"
      :circle="circle"
      @on-play="clickPlay"
      @on-pause="clickPause"
      @tried-to-seek-to="seekTo"
    ></Vue3Wave>
  </div>
  <audio
    ref="audio_tag"
    @ended="onFinish"
    @abort="$emit('onAbort', $event)"
    @canplay="$emit('onCanplay', $event)"
    @canplaythrough="$emit('onCanplaythrough', $event)"
    @durationchange="$emit('onDurationchange', $event)"
    @emptied="$emit('onEmptied', $event)"
    @error="$emit('onError', $event)"
    @loadeddata="$emit('onLoadeddata', $event)"
    @loadedmetadata="onLoadedmetadata"
    @loadstart="$emit('onLoadstart', $event)"
    @pause="$emit('onPause', $event)"
    @play="$emit('onPlay', $event)"
    @playing="$emit('onPlaying', $event)"
    @progress="$emit('onProgress', $event)"
    @ratechange="$emit('onRatechange', $event)"
    @seeked="$emit('onSeeked', $event)"
    @seeking="$emit('onSeeking', $event)"
    @stalled="$emit('onStalled', $event)"
    @suspend="$emit('onSuspend', $event)"
    @timeupdate="$emit('onTimeupdate', $event)"
    @volumechange="$emit('onVolumechange', $event)"
    @waiting="$emit('waiting', $event)"
  ></audio>
</template>

<script>
import Vue3Wave from './wave.vue'
export default {
  name: 'Vue3WaveAudioPlayerList',
  components: {
    Vue3Wave,
  },
  inheritAttrs: false,
  emits: [
    'tried_to_seek',
    'waiting',
    'onVolumechange',
    'onTimeupdate',
    'onSuspend',
    'onStalled',
    'onSeeking',
    'onSeeked',
    'onRatechange',
    'onProgress',
    'onPlaying',
    'onPlay',
    'onPause',
    'onLoadstart',
    'onLoadeddata',
    'onError',
    'onEmptied',
    'onDurationchange',
    'onCanplaythrough',
    'onCanplay',
    'onAbort',
    'onLoadedmetadata',
    'onEnded',
  ],
  props: {
    gutter: {
      type: Number,
      default: 20,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => {
        // [{title:'',src:'https://cdn.jsdelivr.net/gh/any89/any89.github.io@master/assets/audio/1.mp3'}]
        return []
      },
    },
    waveWidth: {
      type: Number,
      default: 200,
    },
    waveHeight: {
      type: Number,
      default: 40,
    },
    waveOptions: {
      type: Object,
      default: null,
    },
    waveAnimation: {
      type: Boolean,
      default: false,
    },
    waveType: {
      type: String,
      default: 'mirror',
    },
    loadAudioOnmount: {
      type: Boolean,
      default: true,
    },
    disableSeeking: {
      type: Boolean,
      default: false,
    },
    currentTimeVisible: {
      type: Boolean,
      default: true,
    },
    durationTimeVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      indexSync: 0,
      currentTime: 0,
      durationTime: 0,
      animation: false,
      playerOptions: {
        samples: 40,
        type: null,
        width: null,
        height: null,
        paths: [{ d: 'V', sy: 0, x: 50, ey: 100 }],
        channel: 0,
        top: 0,
        left: 0,
        animation: false,
        animationframes: 10,
        normalize: true,
      },
      audio: null,
      raf: null,
      seekRatio: 1,
    }
  },
  computed: {
    itemStyle() {
      return {
        margin: this.gutter + 'px 0',
      }
    },
  },
  beforeMount() {},
  mounted() {
    this.audio = this.$refs.audio_tag
  },
  methods: {
    onLoadedData($event) {
      // audio fetched in vue3wave
      console.log($event)
      this.audio.src = $event
    },
    clickPlay($event) {
      if (this.audio.src !== $event.src) {
        console.log($event)
        this.indexSync = $event.index
        this.audio.src = $event.src

        if ($event.ratio < 1) {
          this.seekRatio = $event.ratio
        } else {
          this.audio.currentTime = $event.seek
        }
      }
      this.$nextTick(() => {
        this.audio.play()
        this.raf = requestAnimationFrame(this.whilePlaying)
      })
    },
    onLoadedmetadata($event) {
      this.durationTime = this.audio.duration
      if (this.seekRatio < 1) {
        this.audio.currentTime = this.durationTime * this.seekRatio
      }
      this.$emit('onLoadedmetadata', $event)
    },
    clickPause() {
      this.audio.pause()
      cancelAnimationFrame(this.raf)
    },
    whilePlaying() {
      this.currentTime = this.audio.currentTime
      this.raf = requestAnimationFrame(this.whilePlaying)
    },
    seekTo($event) {
      this.audio.currentTime = $event
    },
    onFinish($event) {
      this.currentTime = this.durationTime
      cancelAnimationFrame(this.raf)
      this.$emit('onEnded', $event)
    },
  },
}
</script>
<style scoped></style>
