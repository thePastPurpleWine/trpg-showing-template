<template>
  <div class="main-dialog">
    <img v-if="image" style="z-index: 1;" :src="image">
    <div class="name-block">
      <span v-show="!isSystem">{{ name }}</span>
    </div>
    <div id="contentBlock" :class="contentBlockClass">
      <span>{{ currentContent }}</span>
    </div>
  </div>
</template>

<script>
const MAX_CONTENT = 92

export default {
  name: 'RoleDialog',
  props: {
    id: {
      type: Boolean
    },
    isSystem: {
      type: Boolean
    },
    name: {
      type: String,
      required: false
    },
    content: {
      type: String,
      validator (val) {
        return val.length <= MAX_CONTENT
      }
    }
  },
  data () {
    return {
      image: undefined,
      currentContent: '',
      audio: undefined,
      typingEnd: false,
      audioEnd: false
    }
  },
  watch: {
    isSystem () {
      this.contentBlockFix()
      this.imageImport()
    },
    content () {
      this.typeContent()
      this.playAudio()

      this.typingEnd = false
      this.audioEnd = false
    },
    typingEnd () {
      if (this.typingEnd && this.audioEnd) {
        this.$emit('playEnd')
      }
    },
    audioEnd () {
      if (this.typingEnd && this.audioEnd) {
        this.$emit('playEnd')
      }
    }
  },
  mounted () {
    this.imageImport()
    this.typeContent()
    this.contentBlockFix()
    this.playAudio()
  },
  computed: {
    contentBlockClass () {
      return 'content-block ' + (this.isSystem ? 'content-block-fix' : '')
    }
  },
  methods: {
    getAudioById () {
      // TODO getAudioById
      return ''
    },
    imageImport () {
      this.image = require('@/assets/' + (this.isSystem ? '对话框-系统.png' : '对话框.png'))
    },
    typeContent () {
      this.currentContent = ''
      const timer = setInterval(() => {
        if (this.currentContent.length < this.content.length) {
          this.currentContent = this.content.slice(0, this.currentContent.length + 1)
        } else {
          this.typingEnd = true
          clearInterval(timer)
        }
      }, 20)
    },
    playAudio () {
      const audioSrc = this.getAudioById()
      if (!audioSrc) {
        this.audioEnd = true
      } else {
        this.audio = new Audio(audioSrc)
        this.audio.addListener('ended', (ended) => {
          if (ended) {
            this.audioEnd = true
          }
        })
        this.audio.load()
        this.audio.play()
      }
    },
    contentBlockFix () {
      const e = document.getElementById('contentBlock')

      if (this.isSystem) {
        e.style.marginTop = '-20px'
      } else {
        e.style.marginTop = ''
      }
    }
  }
}
</script>

<style scoped>
.main-dialog {
  height: 360px;
  word-break: break-all;
  font-weight: lighter;
}

.name-block {
  position: relative;
  top: -360px;

  z-index: 2;
  height: 88px;
  padding: 16px 180px;
  line-height: 56px;
  font-size: 56px;
  color: black;
  font-family: '华康海报体W12(P)', serif;
}

.content-block {
  position: relative;
  top: -360px;

  z-index: 2;
  padding: 0 160px 0 60px;
  font-size: 40px;
  color: #E9A92D;
  font-family: '华康少女字体', serif;
}

.content-block-fix {
  margin-top: -20px;
}
</style>
