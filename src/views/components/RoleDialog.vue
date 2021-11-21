<template>
  <div>
    <audio id="dialogVoice"></audio>
    <img style="z-index: 1;" :src="dialogImage" alt="" @load="imageReady = true">
    <div class="name-block" v-show="imageReady">
      <span v-show="!isSystem">{{ name }}</span>
    </div>
    <div id="contentBlock" :class="contentBlockClass" v-show="imageReady">
      <span>{{ currentContent }}</span>
      <span id="diceSuffixText" style="opacity: 0;">{{ diceSuffix }}</span>
    </div>
  </div>
</template>

<script>
const MAX_CONTENT = 92

export default {
  name: 'RoleDialog',
  props: {
    id: {
      type: String,
      required: false
    },
    type: {
      type: String,
      validator (val) {
        return ['dice', 'system', 'normal', undefined].includes(val)
      }
    },
    name: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false,
      validator (val) {
        return val.length <= MAX_CONTENT
      }
    },
    dice: {
      type: Object,
      required: false,
      validator (val) {
        for (const key of ['max', 'num', 'check', 'value']) {
          if (val[key] === undefined) {
            return false
          }
        }

        return true
      }
    }
  },
  data () {
    return {
      dialogNormal: require('@/assets/对话框.png'),
      dialogSystem: require('@/assets/对话框-系统.png'),
      currentContent: '',
      diceSuffix: '',
      audio: undefined,
      typingEnd: false,
      audioEnd: true,
      imageReady: false
    }
  },
  computed: {
    isDice () {
      return this.type === 'dice'
    },
    isSystem () {
      return ['dice', 'system'].includes(this.type)
    },
    contentBlockClass () {
      let classString = 'content-block'
      if (this.isSystem) {
        classString += ' content-block-fix'
      }
      if (this.isDice) {
        classString += ' content-block-dice-fix'
      }
      return classString
    },
    playEnd () {
      return this.typingEnd && this.audioEnd
    },
    dialogImage () {
      return this.isSystem ? this.dialogSystem : this.dialogNormal
    }
  },
  watch: {
    isSystem () {
      // this.contentBlockFix()
    },
    content (val) {
      if (val && !this.isDice) {
        this.typeContentNormal()
        // this.playAudio()

        this.typingEnd = false
        this.audioEnd = true
      }
    },
    dice (val) {
      if (val && this.isDice) {
        this.typeContentDice()

        this.typingEnd = false
        this.audioEnd = true
      }
    },
    playEnd (val) {
      if (val) {
        console.log('playEnd')
        this.$emit('playEnd')
      }
    }
  },
  mounted () {
    this.audio = document.getElementById('dialogVoice')
  },
  methods: {
    getAudioById () {
      // TODO getAudioById
      return ''
    },
    typeContentNormal () {
      this.currentContent = ''
      this.diceSuffix = ''

      const timer = setInterval(() => {
        if (this.currentContent.length < this.content.length) {
          this.currentContent = this.content.slice(0, this.currentContent.length + 1)
        } else {
          // 等待阅读
          const delay = 500 + 120 * this.currentContent.length
          setTimeout(() => {
            this.typingEnd = true
          }, delay)
          clearInterval(timer)
        }
      }, 20)
    },
    typeContentDice () {
      const textElement = document.getElementById('diceSuffixText')
      // 使用透明文字占位维持布局
      textElement.style.opacity = '0'
      this.currentContent = ''
      this.diceSuffix = ''

      const dice = this.dice
      // 1D??? 时，1不显示
      dice.num = dice.num === 1 ? '' : dice.num

      let result
      let se
      if (dice.value >= 95) {
        result = '大失败'
        se = 'dice-fail'
      } else if (dice.value > dice.check) {
        result = '失败'
        se = 'dice-fail'
      } else if (dice.value <= dice.check) {
        result = '成功'
        se = 'dice-normal'
      } else if (dice.value <= 5) {
        result = '大成功'
        se = 'dice-great'
      }

      this.currentContent = `${dice.num}D${dice.max}(${dice.check}) = `
      this.diceSuffix = `${dice.value}（${result}）`

      const playDiceResult = () => {
        this.audio.src = require('@/assets/se/' + se + '.ogg')
        setTimeout(() => {
          textElement.style.opacity = '1'
          // 移除事件防止循环
          this.audio.removeEventListener('ended', playDiceResult)
          this.audio.play()

          setTimeout(() => {
            // 阅读结束
            this.typingEnd = true
          }, 1100)
        }, 600)
      }

      this.audio.addEventListener('ended', playDiceResult)
      this.playDice()
    },
    playDice () {
      this.audio.src = require('@/assets/se/dice.ogg')
      this.audio.play()
    },
    playAudio () {
      const audioSrc = this.getAudioById()
      if (!audioSrc) {
        this.audioEnd = true
      } else {
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
.name-block {
  position: relative;
  top: -360px;

  z-index: 1;
  height: 88px;
  padding: 16px 180px;
  line-height: 56px;
  font-size: 56px;
  color: black;
  font-weight: bolder;
  /*傻逼字体只适配常用字*/
  font-family: '萝莉体', serif;
}

.content-block {
  position: relative;
  top: -360px;

  z-index: 1;
  padding: 0 160px 0 60px;
  font-size: 40px;
  color: #E9A92D;
  font-family: '华康少女字体', serif;
}

.content-block-fix {
  margin-top: -20px;
}

.content-block-dice-fix {
  text-align: center;
  font-size: 60px;
  color: black;
  font-weight:bold
}
</style>
