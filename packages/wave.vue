<template>
  <div part="player" ref="player" class="player">
    <button id="play" part="play" ref="play" v-if="loadingAudioData">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        style="
          margin: auto;
          background: rgba(255, 255, 255, 0);
          display: block;
          shape-rendering: auto;
        "
        width="34px"
        height="34px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#858a8d"
          stroke-width="10"
          r="35"
          stroke-dasharray="164.93361431346415 56.97787143782138"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          ></animateTransform>
        </circle>
      </svg>
    </button>
    <button id="play" part="play" ref="play" v-else @click="playPause">
      <svg
        :viewBox="circle ? '0 0 1024 1024' : '0 0 34 34'"
        :width="circle ? 26 : 34"
        :height="circle ? 26 : 34"
        part="button"
        ref="button"
      >
        <path
          id="playPathButton"
          :d="
            audioPaused
              ? circle
                ? playCirclePath
                : playPath
              : circle
                ? pauseCirclePath
                : pausePath
          "
        ></path>
      </svg>
    </button>
    <div
      id="current-time"
      part="currenttime"
      ref="currenttime"
      v-show="currentTimeVisible"
    >
      {{ currentTimeContainer_textContent }}
    </div>
    <div id="slider" part="slider" ref="slider">
      <div id="title" v-show="title">
        {{ title }}
      </div>
      <svg
        id="svg"
        part="svg"
        ref="svg"
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="'0 0 ' + waveWidth + ' ' + waveHeight"
        :width="waveWidth"
        :height="waveHeight"
      >
        <!-- <template v-if="animation"> -->
        <defs>
          <clipPath :id="clipPathX">
            <rect
              x="-1"
              y="-100"
              :width="waveWidth + 2"
              :height="waveHeight + 200"
            >
              <animate
                id="animationsvgx"
                ref="animationsvgx"
                attributeName="x"
                :values="'-1;' + (waveWidth + 2)"
                :dur="animationsvgx_dur"
                fill="freeze"
              />
            </rect>
          </clipPath>
          <clipPath :id="clipPathA">
            <rect
              :x="-1 * (waveWidth + 2)"
              y="-100"
              :width="waveWidth + 2"
              :height="waveHeight + 200"
            >
              >
              <animate
                id="animationsvg"
                ref="animationsvg"
                attributeName="x"
                :values="animationsvg_val"
                :dur="animationsvg_dur"
                fill="freeze"
              />
            </rect>
          </clipPath>
        </defs>
        <path
          id="path1"
          ref="path1"
          stroke-width="2"
          :d="path1_d"
          :clip-path="'url(#' + clipPathX + ')'"
        ></path>
        <path
          id="path2"
          ref="path2"
          stroke-width="2"
          :d="path2_d"
          :clip-path="'url(#' + clipPathA + ')'"
          :style="{ display: path2_display }"
        ></path>
        <!-- </template> -->
        <!-- <template v-else> -->
        <!-- <path id="path1" ref="path1" stroke-width="2" style="display: none;"
                    :d="path1_d"
                    ></path>
                    <path 
                    id="path2" ref="path2" stroke-width="2" 
                    :style="{display: path2_display}"
                    :d="path2_d"
                    >
                        <animate 
                        id="animationsvg" ref="animationsvg" attributeName="d" 
                        :dur="animationsvg_dur" 
                        calcMode="linear" 
                        :values="animationsvg_val" 
                        fill="freeze"></animate>
                    </path> -->
        <!-- </template> -->
      </svg>
      <input
        type="range"
        part="input"
        id="seek-slider"
        max="100"
        value="0"
        step="any"
        :style="{
          height: waveHeight + 'px',
        }"
        @input="sliderInput"
        @change="sliderChange"
      />
    </div>
    <div id="duration" part="duration" v-show="durationTimeVisible">
      {{ durationContainer_textContent }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Vue3Wave',
  inheritAttrs: false,
  emits: [
    'triedToSeek',
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
    'triedToSeekTo',
  ],
  props: {
    circle: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    indexSync: {
      type: Number,
      default: null,
    },
    indexSelf: {
      type: Number,
      default: null,
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
    currentTime: {
      type: Number,
      default: 0,
    },
    currentTimeVisible: {
      type: Boolean,
      default: true,
    },
    durationTime: {
      type: Number,
      default: 0,
    },
    durationTimeVisible: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    indexSync(newVal) {
      if (newVal !== this.indexSelf) {
        this.svg.pauseAnimations()
        this.audioPaused = true
      }
    },
    currentTime(newVal) {
      if (this.indexSelf === this.indexSync) {
        if (newVal === this.durationTime) {
          this.seekSlider.value = this.seekSlider.max
          this.svg.setCurrentTime(this.durationTime)
          this.svg.pauseAnimations()
          this.audioPaused = true
        } else {
          this.whilePlaying()
        }
      } else {
        this.svg.pauseAnimations()
        this.audioPaused = true
      }
    },
    durationTime(newVal) {
      if (this.indexSelf === this.indexSync) {
        this.durationContainer_textContent = this.calculateTime(newVal)
        this.seekSlider.max = newVal
        this.svg.unpauseAnimations()
        this.animationsvg_dur = newVal + 's'
        if (!this.animation) {
          this.animationsvgx_dur = newVal + 's'
        }
        this.svg.pauseAnimations()
        this.svg.setCurrentTime(0)
      }
    },
  },
  data() {
    return {
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
      playCirclePath:
        'M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM383.232 287.616v448l384-223.104-384-224.896z',
      pauseCirclePath:
        'M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM320 320v384h128V320H320z m256 0v384h128V320H576z',
      playPath:
        'M8.5 8.7c0-1.7 1.2-2.4 2.6-1.5l14.4 8.3c1.4.8 1.4 2.2 0 3l-14.4 8.3c-1.4.8-2.6.2-2.6-1.5V8.7z',
      pausePath:
        'M9.2 25c0 .5.4 1 .9 1h3.6c.5 0 .9-.4.9-1V9c0-.5-.4-.9-.9-.9h-3.6c-.4-.1-.9.3-.9.9v16zm11-17c-.5 0-1 .4-1 .9V25c0 .5.4 1 1 1h3.6c.5 0 1-.4 1-1V9c0-.5-.4-.9-1-.9 0-.1-3.6-.1-3.6-.1z',
      playPathButton: null,
      svg: null,
      path1: null,
      path2: null,
      animationsvg: null,
      animationsvgx: null,
      audio: null,
      durationContainer: null,
      seekSlider: null,
      currentTimeContainer: null,
      playIconContainer: null,
      raf: null,
      audioData: null,

      durationContainer_textContent: '0:00',
      currentTimeContainer_textContent: '0:00',
      animationsvg_dur: '999s',
      animationsvgx_dur: '999s',
      audioPaused: true,
      path2_display: 'block',
      path1_d: null,
      path2_d: null,
      audioPathLoaded: false,
      animationsvg_val: '',

      clipPathX: 'left-to-right-x',
      clipPathA: 'left-to-right',
      audioContext: null,
      audioSource: null,
      loadingAudioData: false,
      loadedAudioData: false,
      canPlay: false,
      waiting: false,
      blobUrl: '',
    }
  },
  beforeMount() {
    //- setting up the options
    this.playerOptions.width = this.waveWidth
    this.playerOptions.height = this.waveHeight
    this.playerOptions.type = this.waveType
    if (this.waveOptions) {
      if (this.waveOptions.samples) {
        this.playerOptions.samples = this.waveOptions.samples
      }
      if (this.waveOptions.width) {
        this.playerOptions.width = this.waveOptions.width
      }
      if (this.waveOptions.height) {
        this.playerOptions.height = this.waveOptions.height
      }
    }
    if (this.waveAnimation) {
      this.animation = this.waveAnimation
    }
    //- finish seettings
    this.clipPathX += '-' + Math.random().toString(36).slice(2)
    this.clipPathA += '-' + Math.random().toString(36).slice(2)

    this.audioContext = new AudioContext()
    this.audioSource = this.audioContext.createBufferSource()
  },
  mounted() {
    this.playPathButton = this.$refs.player.querySelector('#playPathButton')
    this.svg = this.$refs.player.querySelector('#svg')
    this.path1 = this.$refs.player.querySelector('#path1')
    this.path2 = this.$refs.player.querySelector('#path2')
    this.animationsvg = this.$refs.animationsvg
    this.animationsvgx = this.$refs.animationsvgx
    this.durationContainer = this.$refs.player.querySelector('#duration')
    this.seekSlider = this.$refs.player.querySelector('#seek-slider')
    this.currentTimeContainer = this.$refs.player.querySelector('#current-time')
    this.playIconContainer = this.$refs.player.querySelector('#play')

    this.svg.pauseAnimations()
    this.animationsvg_val = '-' + (this.waveWidth + 2) + ';-1'

    if (this.loadAudioOnmount) this.runAudioPath()
  },
  methods: {
    async runAudioPath() {
      await this.getAudioData(this.src)
    },
    /**
     * Taken from the Wave file
     */
    getAudioData(url) {
      this.loadingAudioData = true
      return fetch(url)
        .then((res) => {
          return res.blob().then((raw) => {
            return raw
          })
        })
        .then((bl) => {
          this.waiting = false
          this.blobUrl = URL.createObjectURL(bl)
          this.$emit('onLoadeddata', this.blobUrl)
          let fileReader = new FileReader()
          fileReader.onloadend = () => {
            this.audioContext.decodeAudioData(
              fileReader.result,
              (bufferData) => {
                this.audioData = bufferData
                this.loadingAudioData = false
                this.loadedAudioData = true
                this.svgDraw()
              },
              (err) => {
                this.loadingAudioData = false
                this.$emit('onError', err)
              },
            )
          }
          fileReader.readAsArrayBuffer(bl)
        })
        .catch((err) => {
          this.loadingAudioData = false
          this.$emit('onError', err)
        })
    },
    svgDraw() {
      const path = this.linearPath(this.audioData, this.playerOptions)
      // console.log(path)
      if (!this.animation) {
        this.path1_d = path
        this.path2_d = path
      } else {
        this.animationsvg.setAttribute('values', path)
      }
      this.svg.setCurrentTime(this.seekSlider.value)
    },
    playPause() {
      if (!this.loadAudioOnmount && !this.loadedAudioData) {
        return this.runAudioPath()
      }
      if (this.audioPaused) {
        this.$emit('onPlay', {
          index: this.indexSelf,
          src: this.blobUrl,
          seek:
            this.seekSlider.value < this.seekSlider.max
              ? this.seekSlider.value
              : 0,
        })

        this.svg.unpauseAnimations()
        this.path2.style.display = 'block'
        this.audioPaused = false
      } else {
        this.$emit('onPause')

        this.svg.pauseAnimations()
        this.audioPaused = true
      }
    },
    sliderInput() {
      this.path2_display = 'block'
      this.currentTimeContainer_textContent = this.calculateTime(
        this.seekSlider.value,
      )
      this.svg.setCurrentTime(this.seekSlider.value)
    },
    sliderChange() {
      if (this.disableSeeking) {
        this.whilePlaying()
        return this.$emit('triedToSeek', false)
      }
      if (this.indexSelf === this.indexSync) {
        // this.path2_display = 'block'
        // this.svg.setCurrentTime(this.seekSlider.value)
        this.$emit('triedToSeek', true)
        this.$emit('triedToSeekTo', this.seekSlider.value)
      }
    },
    whilePlaying() {
      this.seekSlider.value = this.currentTime
      this.currentTimeContainer_textContent = this.calculateTime(
        this.seekSlider.value,
      )
      this.svg.setCurrentTime(this.seekSlider.value)
    },
    calculateTime(secs) {
      const minutes = Math.floor(secs / 60)
      const seconds = Math.floor(secs % 60)
      const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
      return `${minutes}:${returnedSeconds}`
    },
    linearPath(audioBuffer, options) {
      const {
        channel = 0,
        samples = audioBuffer.length,
        height = 100,
        width = 800,
        top = 0,
        left = 0,
        type = 'steps',
        paths = [{ d: 'Q', sx: 0, sy: 0, x: 50, y: 100, ex: 100, ey: 0 }],
        animation = false,
        animationframes = 10,
        normalize = true,
      } = options

      const framesData = this.getFramesData(
        audioBuffer,
        channel,
        animation,
        animationframes,
      )
      const filteredData = this.getFilterData(framesData, samples)
      const normalizeData = normalize
        ? this.getNormalizeData(filteredData)
        : filteredData

      let path = ``

      const fixHeight = type != 'bars' ? (height + top * 2) / 2 : height + top
      const fixWidth = width / samples
      const pathslength = paths.length
      const fixpathslength = type == 'mirror' ? pathslength * 2 : pathslength

      const normalizeDataLength = normalizeData.length

      for (let f = 0; f < normalizeDataLength; f++) {
        if (f > 0) {
          const pathlength = path.length
          const lastvalue = path.charAt(pathlength - 1)
          if (lastvalue == ';' || pathlength === 0) {
            path += ' M 0 0 ;'
          } else {
            path += ';'
          }
        }

        let last_pos_x = -9999
        let last_pos_y = -9999

        for (let i = 0; i < samples; i++) {
          const positive = type != 'bars' ? (i % 2 ? 1 : -1) : 1
          let mirror = 1
          for (let j = 0; j < fixpathslength; j++) {
            let k = j
            if (j >= pathslength) {
              k = j - pathslength
              mirror = -1
            }
            paths[k].minshow = paths[k].minshow ?? 0
            paths[k].maxshow = paths[k].maxshow ?? 1
            paths[k].normalize = paths[k].normalize ?? false
            const normalizeDataValue = paths[k].normalize
              ? 1
              : normalizeData[f][i]
            if (
              paths[k].minshow <= normalizeData[f][i] &&
              paths[k].maxshow >= normalizeData[f][i]
            ) {
              switch (paths[k].d) {
                // LineTo Commands
                case 'L': {
                  const pos_x =
                    i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
                  const pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].sy) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  //const end_pos_x = ((i+1) * fixWidth) - (fixWidth*(1-(paths[k].ex/100))) + left;
                  const end_pos_x =
                    i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
                  const end_pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].ey) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `L ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                case 'H': {
                  const pos_x =
                    i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
                  const pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].y) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  //const end_pos_x = ((i+1) * fixWidth) - (fixWidth*(1-(paths[k].ex/100))) + left;
                  const end_pos_x =
                    i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
                  const end_pos_y = pos_y

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `H ${end_pos_x} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                case 'V': {
                  const pos_x =
                    i * fixWidth + (fixWidth * paths[k].x) / 100 + left
                  const pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].sy) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  const end_pos_x = pos_x
                  const end_pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].ey) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `V ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // Cubic Bézier Curve Commands
                case 'C': {
                  const pos_x =
                    i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
                  const pos_y =
                    fixHeight - ((fixHeight * paths[k].sy) / 100) * positive

                  const center_pos_x =
                    i * fixWidth + (fixWidth * paths[k].x) / 100 + left
                  const center_pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].y) / 100) *
                      (type != 'bars' ? height : height * 2) *
                      -positive *
                      mirror

                  //const end_pos_x = ((i+1) * fixWidth) - (fixWidth*(1-(paths[k].ex/100))) + left;
                  const end_pos_x =
                    i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
                  const end_pos_y =
                    fixHeight - ((fixHeight * paths[k].ey) / 100) * positive

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `C ${pos_x} ${pos_y} ${center_pos_x} ${center_pos_y} ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // Quadratic Bézier Curve Commands
                case 'Q': {
                  const pos_x =
                    i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
                  const pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].sy) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  const center_pos_x =
                    i * fixWidth + (fixWidth * paths[k].x) / 100 + left
                  const center_pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].y) / 100) *
                      (type != 'bars' ? height : height * 2) *
                      -positive *
                      mirror

                  //const end_pos_x = ((i+1) * fixWidth) - (fixWidth*(1-(paths[k].ex/100))) + left;
                  const end_pos_x =
                    i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
                  const end_pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].ey) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `Q ${center_pos_x} ${center_pos_y} ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // Elliptical Arc Curve Commands
                case 'A': {
                  const pos_x =
                    i * fixWidth + (fixWidth * paths[k].sx) / 100 + left
                  const pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].sy) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  //const end_pos_x = ((i+1) * fixWidth) - (fixWidth*(1-(paths[k].ex/100))) + left;
                  const end_pos_x =
                    i * fixWidth + (fixWidth * paths[k].ex) / 100 + left
                  const end_pos_y =
                    fixHeight +
                    ((normalizeDataValue * paths[k].ey) / 100) *
                      (type != 'bars' ? height / 2 : height) *
                      -positive *
                      mirror

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }
                  const rx = (paths[k].rx * fixWidth) / 100
                  const ry = (paths[k].ry * fixWidth) / 100
                  let sweep = paths[k].sweep
                  if (positive == -1) {
                    if (sweep == 1) {
                      sweep = 0
                    } else {
                      sweep = 1
                    }
                  }
                  if (mirror == -1) {
                    if (sweep == 1) {
                      sweep = 0
                    } else {
                      sweep = 1
                    }
                  }
                  path += `A ${rx} ${ry} ${paths[k].angle} ${paths[k].arc} ${sweep} ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // ClosePath Commands
                case 'Z':
                  path += 'Z '
                  break

                default:
                  break
              }
            }
          }
        }
      }
      return path
    },
    polarPath(audioBuffer, options) {
      const {
        channel = 0,
        samples = audioBuffer.length,
        distance = 50,
        length = 100,
        top = 0,
        left = 0,
        type = 'steps',
        startdeg = 0,
        enddeg = 360,
        invertdeg = false,
        invertpath = false,
        paths = [{ d: 'Q', sdeg: 0, sr: 0, deg: 50, r: 100, edeg: 100, er: 0 }],
        animation = false,
        animationframes = 10,
        normalize = true,
      } = options

      const framesData = this.getFramesData(
        audioBuffer,
        channel,
        animation,
        animationframes,
      )
      const filteredData = this.getFilterData(framesData, samples)
      const normalizeData = normalize
        ? this.getNormalizeData(filteredData)
        : filteredData

      let path = ``
      const fixenddeg = enddeg < startdeg ? enddeg + 360 : enddeg
      const deg = !invertdeg
        ? (fixenddeg - startdeg) / samples
        : (startdeg - fixenddeg) / samples
      const fixOrientation = !invertdeg ? 90 + startdeg : 90 + startdeg + 180
      const invert = !invertpath ? 1 : -1
      const pathslength = paths.length
      const fixpathslength = type == 'mirror' ? pathslength * 2 : pathslength
      const pi180 = Math.PI / 180

      const normalizeDataLength = normalizeData.length

      for (let f = 0; f < normalizeDataLength; f++) {
        if (f > 0) {
          const pathlength = path.length
          const lastvalue = path.charAt(pathlength - 1)
          if (lastvalue == ';' || pathlength === 0) {
            path += ' M 0 0 ;'
          } else {
            path += ';'
          }
        }

        let last_pos_x = -9999
        let last_pos_y = -9999

        for (let i = 0; i < samples; i++) {
          const positive = type != 'bars' ? (i % 2 ? 1 : -1) : 1
          let mirror = 1
          for (let j = 0; j < fixpathslength; j++) {
            let k = j
            if (j >= pathslength) {
              k = j - pathslength
              mirror = -1
            }
            paths[k].minshow = paths[k].minshow ?? 0
            paths[k].maxshow = paths[k].maxshow ?? 1
            paths[k].normalize = paths[k].normalize ?? false
            const normalizeDataValue = paths[k].normalize
              ? 1
              : normalizeData[f][i]
            if (
              paths[k].minshow <= normalizeData[f][i] &&
              paths[k].maxshow >= normalizeData[f][i]
            ) {
              switch (paths[k].d) {
                // LineTo Commands
                case 'L': {
                  const angleStart =
                    (deg * (i + paths[k].sdeg / 100) - fixOrientation) * pi180
                  const angleEnd =
                    (deg * (i + paths[k].edeg / 100) - fixOrientation) * pi180

                  const pos_x =
                    left +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleStart)
                  const pos_y =
                    top +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleStart)

                  const end_pos_x =
                    left +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleEnd)
                  const end_pos_y =
                    top +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleEnd)

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `L ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // Cubic Bézier Curve Commands
                case 'C': {
                  const angleStart =
                    (deg * (i + paths[k].sdeg / 100) - fixOrientation) * pi180
                  const angle =
                    (deg * (i + paths[k].deg / 100) - fixOrientation) * pi180
                  const angleEnd =
                    (deg * (i + paths[k].edeg / 100) - fixOrientation) * pi180

                  const pos_x =
                    left +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleStart)
                  const pos_y =
                    top +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleStart)

                  const center_pos_x =
                    left +
                    (length *
                      (paths[k].r / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angle)
                  const center_pos_y =
                    top +
                    (length *
                      (paths[k].r / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angle)

                  const end_pos_x =
                    left +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleEnd)
                  const end_pos_y =
                    top +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleEnd)

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `C ${pos_x} ${pos_y} ${center_pos_x} ${center_pos_y} ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // Quadratic Bézier Curve Commands
                case 'Q': {
                  const angleStart =
                    (deg * (i + paths[k].sdeg / 100) - fixOrientation) * pi180
                  const angle =
                    (deg * (i + paths[k].deg / 100) - fixOrientation) * pi180
                  const angleEnd =
                    (deg * (i + paths[k].edeg / 100) - fixOrientation) * pi180

                  const pos_x =
                    left +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleStart)
                  const pos_y =
                    top +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleStart)

                  const center_pos_x =
                    left +
                    (length *
                      (paths[k].r / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angle)
                  const center_pos_y =
                    top +
                    (length *
                      (paths[k].r / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angle)

                  const end_pos_x =
                    left +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleEnd)
                  const end_pos_y =
                    top +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleEnd)

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  path += `Q ${center_pos_x} ${center_pos_y} ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // Elliptical Arc Curve Commands
                case 'A': {
                  const angleStart =
                    (deg * (i + paths[k].sdeg / 100) - fixOrientation) * pi180
                  const angleEnd =
                    (deg * (i + paths[k].edeg / 100) - fixOrientation) * pi180

                  const pos_x =
                    left +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleStart)
                  const pos_y =
                    top +
                    (length *
                      (paths[k].sr / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleStart)

                  const end_pos_x =
                    left +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.cos(angleEnd)
                  const end_pos_y =
                    top +
                    (length *
                      (paths[k].er / 100) *
                      normalizeDataValue *
                      positive *
                      mirror *
                      invert +
                      distance) *
                      Math.sin(angleEnd)

                  if (pos_x !== last_pos_x || pos_y !== last_pos_y) {
                    path += `M ${pos_x} ${pos_y} `
                  }

                  const angle = (deg * i * paths[k].angle) / 100
                  const rx = (paths[k].rx * deg) / 100
                  const ry = (paths[k].ry * deg) / 100

                  let sweep = paths[k].sweep
                  if (positive == -1) {
                    if (sweep == 1) {
                      sweep = 0
                    } else {
                      sweep = 1
                    }
                  }
                  if (mirror == -1) {
                    if (sweep == 1) {
                      sweep = 0
                    } else {
                      sweep = 1
                    }
                  }
                  path += `A ${rx} ${ry} ${angle} ${paths[k].arc} ${sweep} ${end_pos_x} ${end_pos_y} `

                  last_pos_x = end_pos_x
                  last_pos_y = end_pos_y
                  break
                }

                // ClosePath Commands
                case 'Z':
                  path += 'Z '
                  break

                default:
                  break
              }
            }
          }
        }
      }
      return path
    },
    getFramesData(audioBuffer, channel, animation, animationframes) {
      const rawData = audioBuffer.getChannelData(channel)

      const framesData = []
      if (animation) {
        const frames = audioBuffer.sampleRate / animationframes
        for (let index = 0; index < rawData.length; index += frames) {
          const partraw = rawData.slice(index, index + frames)
          framesData.push(partraw)
        }
      } else {
        framesData.push(rawData)
      }

      return framesData
    },
    getFilterData(framesData, samples) {
      const filteredData = []
      const framesDataLength = framesData.length
      for (let f = 0; f < framesDataLength; f++) {
        const blockSize = Math.floor(framesData[f].length / samples) // the number of samples in each subdivision
        const filteredDataBlock = []
        for (let i = 0; i < samples; i++) {
          let blockStart = blockSize * i // the location of the first sample in the block
          let sum = 0
          for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(framesData[f][blockStart + j]) // find the sum of all the samples in the block
          }
          filteredDataBlock.push(sum / blockSize) // divide the sum by the block size to get the average
        }
        filteredData.push(filteredDataBlock)
      }
      return filteredData
    },
    getNormalizeData(filteredData) {
      const multipliers = []
      const filteredDataLength = filteredData.length
      for (let i = 0; i < filteredDataLength; i++) {
        const multiplier = Math.max(...filteredData[i])
        multipliers.push(multiplier)
      }
      const maxMultiplier = Math.pow(Math.max(...multipliers), -1)

      const normalizeData = []
      for (let i = 0; i < filteredDataLength; i++) {
        const normalizeDataBlock = filteredData[i].map((n) => n * maxMultiplier)
        normalizeData.push(normalizeDataBlock)
      }
      return normalizeData
    },
  },
}
</script>
<style scoped>
*,
:after,
:before {
  box-sizing: border-box;
  margin: 0;
}
:host {
  display: flex;
}
.player {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#play {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0 0 0 10px;
  margin: 0px;
}
#play svg {
  fill: #858a8d;
  position: relative;
  transition: transform 0.3s;
  top: -0.5px;
}
#play svg:hover {
  transform: scale(1.2);
}
#play svg path {
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: 0.2s;
}
#title {
  position: absolute;
  left: 10px;
  top: 8px;
  color: #858a8d;
  margin: 0px 10px;
  font-size: 16px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow: visible;
}
#svg {
  margin: 0 10px;
  overflow: visible;
  stroke-width: 1px;
  fill: none;
}
#path1 {
  stroke: #f1f1f1;
  overflow: visible;
  stroke-linecap: round;
}
#path2 {
  stroke: #e6e6e6;
  overflow: visible;
  stroke-linecap: round;
}
#slider {
  position: relative;
}

#duration,
#current-time {
  position: relative;
  top: -1.1px;
  color: #858a8d;
  margin: 0px 10px;
  font-size: 16px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  min-width: 32px;
}
#seek-slider {
  position: absolute;
  width: 100%;
  left: 0;
}
input[type='range'] {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  padding: 0px;
  margin: 0px;
  border: 0px;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
}
input[type='range']:focus {
  outline: none;
}

input[type='range']::-ms-track {
  width: 100%;
  cursor: pointer;
  /* Hides the slider so custom styles can be added */
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  position: relative;
  /*top: -1.5px;*/
  height: 12.5px;
  width: 12.5px;
  border-radius: 50%;
  background: #4fc3f7;
  cursor: pointer;
  box-shadow: none;
}
input[type='range']::-webkit-slider-thumb {
  transition: transform 0.3s;
}
input[type='range']:active::-webkit-slider-thumb {
  transform: scale(1.5);
}
input[type='range']::-moz-range-thumb {
  height: 12.5px;
  width: 12.5px;
  border-radius: 50%;
  background: #4fc3f7;
  cursor: pointer;
  box-shadow: none;
  border: 0px;
}

input[type='range']:active::-moz-range-thumb {
  transform: scale(1.5);
}
span {
  color: red;
}
</style>
