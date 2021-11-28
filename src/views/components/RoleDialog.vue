<template>
  <div>
    <audio id="dialogVoice"></audio>
    <role-image class="role-image" :role="role" @loaded="roleImageReady = true"/>
    <div class="dialog-block">
      <img class="dialog-image" v-show="!isKP" :src="dialogNormal" alt="" @load="dialogImageReady = true">
      <img class="dialog-image" v-show="isKP" :src="dialogSystem" alt="" @load="dialogImageReady = true">

      <div class="dialog-content-block" v-if="isKP" v-show="roleImageReady && dialogImageReady">
        <div class="content-normal content-kp content-roll" v-if="isRoll">
          <span>{{ currentContent }}</span>
          <span id="diceSuffixText" :style="{ 'opacity': diceResultOpacity, 'color': '#dd0000' }">{{ diceSuffix }}</span>
        </div>

        <div class="content-normal content-kp" v-else>
          <span :style="{ 'color': roleConfig.color }">{{ currentContent }}</span>
        </div>
      </div>

      <div class="dialog-content-block" v-else v-show="roleImageReady && dialogImageReady">
        <div class="name">
          <span v-show="!isKP">{{ name }}</span>
        </div>
        <div class="content-normal">
          <span :style="{ 'color': roleConfig.color }">{{ currentContent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RoleImage from '@/views/components/RoleImage'
const RoleConfigMap = {
  小梺: {
    color: '#F3C800',
    volume: 0.9
  },
  谢拉: {
    color: '#2B2B2F',
    volume: 0.9
  },
  大姐: {
    color: '#93B9D4',
    volume: 0.9
  },
  花怡: {
    color: '#E79598',
    volume: 0.9
  },
  桃子: {
    color: '#8B7FAB',
    volume: 1
  },
  阿娟: {
    color: '#F399E3',
    volume: 0.9
  },
  小猴: {
    color: '#8B5900',
    volume: 0.9
  },
  小黑: {
    color: '#7D005B',
    volume: 0.9
  },
  晓磊: {
    color: '#5DA4CD',
    volume: 0.9
  }
}

export default {
  name: 'RoleDialog',
  components: {
    RoleImage
  },
  props: {
    voiceId: {
      type: String,
      required: false
    },
    type: {
      type: String,
      validator (val) {
        return ['roll', 'kp', 'normal', undefined].includes(val)
      }
    },
    name: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    },
    dice: {
      type: Object,
      required: false
    },
    chapter: {
      type: String
    },
    role: {
      type: String
    }
  },
  data () {
    return {
      dialogNormal: require('@/assets/system/对话框.png'),
      dialogSystem: require('@/assets/system/对话框-系统.png'),
      currentContent: '',
      diceSuffix: '',
      audio: undefined,
      dialogImageReady: false,
      roleImageReady: false,
      roleConfigMap: RoleConfigMap,
      diceAudioSrc: {
        roll: require('@/assets/se/dice.ogg'),
        resultNormal: require('@/assets/se/dice-normal.ogg'),
        resultGreatSuccess: require('@/assets/se/dice-great.ogg'),
        resultSuccess: require('@/assets/se/dice-normal.ogg'),
        resultFail: require('@/assets/se/dice-fail.ogg'),
        resultGreatFail: require('@/assets/se/dice-fail.ogg')
      },
      diceResultOpacity: '0',
      typeStatus: {
        ready: false,
        typing: false,
        typeEnd: false,

        playing: false,
        playEnd: false
      },
      rollStatus: {
        ready: false,
        rolling: false,
        end: false
      }
    }
  },
  computed: {
    isRoll () {
      return this.type === 'roll'
    },
    isKP () {
      return ['roll', 'kp'].includes(this.type)
    },
    playFinish () {
      return this.typeStatus.playEnd && this.typeStatus.typeEnd && this.rollStatus.end
    },
    roleConfig () {
      if (this.roleConfigMap[this.name] === undefined) {
        return {}
      } else {
        return this.roleConfigMap[this.name]
      }
    },
    contentReady () {
      return this.roleImageReady && this.dialogImageReady && (this.rollStatus.ready || this.typeStatus.ready)
    }
  },
  watch: {
    contentReady (val) {
      if (this.typeStatus.ready && val) {
        this.typeContentNormal()
      }

      if (this.rollStatus.ready && val) {
        this.typeContentDice()
      }
    },
    content (val) {
      if (val && !this.isRoll) {
        console.log('contentChange', val)
        this.typeStatus.ready = true
        this.rollStatus.end = true
      }
    },
    dice (val) {
      if (val && this.isRoll) {
        this.rollStatus.ready = true
        this.typeStatus.typeEnd = true
        this.typeStatus.playEnd = true
      }
    },
    playFinish (val) {
      if (val) {
        console.log('playFinish')
        this.$emit('playFinish')
      }
    },
    role () {
      this.roleImageReady = false
    }
  },
  mounted () {
    this.audio = document.getElementById('dialogVoice')
  },
  methods: {
    getAudioById () {
      return require('@/assets/voice' + `/${this.chapter}/${this.voiceId}.wav`)
    },
    typeContentNormal () {
      this.currentContent = ''
      this.diceSuffix = ''
      this.typeStatus.ready = false
      this.typeStatus.typeEnd = false

      this.playAudio()
      const timer = setInterval(() => {
        if (this.currentContent.length < this.content.length) {
          this.currentContent = this.content.slice(0, this.currentContent.length + 1)
          this.typeStatus.typing = true
        } else {
          this.typeStatus.typing = false
          clearInterval(timer)
          // 等待阅读
          // const delay = 500 + 120 * this.currentContent.length
          setTimeout(() => {
            this.typeStatus.typeEnd = true
          }, 1000)
        }
      }, 20)
    },
    typeContentDice () {
      this.rollStatus.ready = false
      this.rollStatus.end = false
      // 使用透明文字占位维持布局
      this.diceResultOpacity = '0'
      this.currentContent = ''
      this.diceSuffix = ''

      const dice = this.dice
      // 1D??? 时，1不显示
      dice.num = dice.num === 1 ? '' : dice.num

      let result
      let seSrc
      if (dice.value >= 95) {
        result = '大失败'
        seSrc = this.diceAudioSrc.resultGreatFail
      } else if (dice.value > dice.check) {
        result = '失败'
        seSrc = this.diceAudioSrc.resultFail
      } else if (dice.value <= 5) {
        result = '大成功'
        seSrc = this.diceAudioSrc.resultGreatSuccess
      } else if (dice.value <= dice.check) {
        result = '成功'
        seSrc = this.diceAudioSrc.resultSuccess
      }

      this.currentContent = `${dice.num}D${dice.max}(${dice.check}) = `
      this.diceSuffix = `${dice.value}（${result}）`

      const playDiceResult = () => {
        this.audio.src = seSrc
        setTimeout(() => {
          setTimeout(() => {
            // 阅读结束
            this.rollStatus.end = true
          }, 1100)
          this.diceResultOpacity = '1'
          this.audio.removeEventListener('ended', playDiceResult)
          this.audio.play()
        }, 600)
      }

      this.audio.addEventListener('ended', playDiceResult)
      this.audio.src = this.diceAudioSrc.roll
      this.audio.play()
    },
    playAudio () {
      const voiceEnd = () => {
        setTimeout(() => {
          this.typeStatus.playEnd = true
          this.typeStatus.playing = false
          this.audio.removeEventListener('ended', voiceEnd)
        }, 400)
      }
      const audioSrc = this.getAudioById()
      if (!audioSrc) {
        this.typeStatus.playEnd = true
      } else {
        this.audio.addEventListener('ended', voiceEnd)
        this.audio.src = audioSrc
        this.audio.volume = this.roleConfig.volume
        try {
          this.audio.play()
          this.typeStatus.playing = true
          this.typeStatus.playEnd = false
        } catch (e) {
          console.error(e)
          this.typeStatus.playEnd = true
        }
      }
    }
  }
}
</script>

<style scoped lang="less">

.role-image {
  z-index: 0;
  margin-bottom: -50px;
  opacity: 1;
  margin-left: -10px;
  width: 400px;
  height: 480px;
}

.dialog-block {
  position: relative;

  .dialog-image {
    width: 1200px;
    height: 360px;
    position: absolute;
  }

  .dialog-content-block {
    width: 1200px;
    height: 360px;
    position: absolute;
    padding: 0 160px 0 60px;
  }
}

.name {
  padding: 16px 130px;
  line-height: 56px;
  font-size: 56px;
  color: black;
  font-weight: bolder;
  /*傻逼字体只适配常用字*/
  font-family: '萝莉体', serif;
}

.content-normal {
  font-size: 40px;
  font-family: '华康少女字体', serif;
}

.content-kp {
  margin-top: 64px;
}

.content-roll {
  text-align: center;
  font-size: 60px;
  color: black;
  font-weight:bold
}

</style>
