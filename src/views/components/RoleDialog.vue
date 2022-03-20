<template>
  <div>
    <audio id="dialogVoice"></audio>
<!--    角色图片-->
    <role-image class="role-image" :roleImageSrc="roleImageSrc" @loaded="roleImageReady = true"/>
    <div class="dialog-block">
<!--    对话框背景图片-->
      <img class="dialog-image" :src="dialogNormalSrc" alt="" @load="dialogImageReady = true">

      <div class="dialog-content-block" v-show="roleImageReady && dialogImageReady">
        <div class="name">
          <span>{{ roleData.name }}</span>
        </div>
<!--        掷骰文本-->
        <div class="content-normal content-kp content-roll" v-if="isRoll">
          <span>{{ currentContent }}</span>
          <span id="diceSuffixText" :style="{ 'opacity': diceResultOpacity, 'color': '#dd0000' }">{{ diceSuffix }}</span>
        </div>
<!--        一般文本-->
        <div class="content-normal" v-else>
          <span :style="{ 'color': roleData.color }">{{ currentContent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RoleImage from '@/views/components/RoleImage'
import RoleConfig from '@/config/RoleConfig.json'
import ProjectConfig from '@/config/ProjectConfig.json'

const roleConfig = RoleConfig
const projectConfig = ProjectConfig
const GREAT_SUCCESS = ProjectConfig.dice.greatSuccessValue
const GREAT_FAIL = ProjectConfig.dice.greatFailValue

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
    },
    face: {
      type: String
    },
    delay: {
      type: Number
    }
  },
  data () {
    return {
      // 对话框样式图片
      dialogNormalSrc: undefined,
      // dialogSystem: require('@/assets/system/对话框-系统.png'),
      // 骰子音效
      diceAudio: {
        rollSrc: undefined,
        resultNormalSrc: undefined,
        resultGreatSuccessSrc: undefined,
        resultSuccessSrc: undefined,
        resultFailSrc: undefined,
        resultGreatFailSrc: undefined
      },
      currentContent: '',
      diceSuffix: '',
      audio: undefined,
      dialogImageReady: false,
      roleImageReady: false,
      diceResultOpacity: '0',
      typeStatus: {
        // 文本打印准备
        ready: false,
        // 文本打印中
        typing: false,
        // 文本打印结束
        typeEnd: false,
        // 文本语音播放中
        playing: false,
        // 文本语音播放结束
        playEnd: false
      },
      rollStatus: {
        // 掷骰准备
        ready: false,
        // 掷骰演出中
        rolling: false,
        // 掷骰演出结束
        end: false
      },
      roleClass: {
        // 角色名称
        name: String,
        // 角色文本颜色
        color: String,
        // 角色语音音量
        volume: Number,
        // 角色立绘所在目录
        roleDir: String
      },
      diceClass: {
        // 骰子数量
        num: Number,
        // 骰子最大值
        max: Number,
        // 项目检定值
        check: Number,
        // 检定项目
        project: String,
        // 骰子值
        value: Number
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
    roleData () {
      // roleClass
      return roleConfig[this.role] || {}
    },
    contentReady () {
      return this.roleImageReady && this.dialogImageReady && (this.rollStatus.ready || this.typeStatus.ready)
    },
    roleImageSrc () {
      try {
        return require('@/assets/role/' + this.roleData.roleDir + '/' + this.face + '.png')
      } catch (e) {
        return ''
      }
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
        this.$emit('playFinish')
      }
    },
    role () {
      this.roleImageReady = false
    },
    face () {
      this.roleImageReady = false
    }
  },
  created () {
    this.dialogNormalSrc = require('@/assets/system/' + projectConfig.dialogNormalImage)
    this.diceAudio.rollSrc = require('@/assets/se/' + projectConfig.dice.rollSe)
    this.diceAudio.resultNormalSrc = require('@/assets/se/' + projectConfig.dice.resultNormalSe)
    this.diceAudio.resultFailSrc = require('@/assets/se/' + projectConfig.dice.resultFailSe)
    this.diceAudio.resultSuccessSrc = require('@/assets/se/' + projectConfig.dice.resultSuccessSe)
    this.diceAudio.resultGreatFailSrc = require('@/assets/se/' + projectConfig.dice.resultGreatFailSe)
    this.diceAudio.resultGreatSuccessSrc = require('@/assets/se/' + projectConfig.dice.resultGreatSuccessSe)
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
          setTimeout(() => {
            this.typeStatus.typeEnd = true
          }, this.delay)
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

      const dice = this.dice // diceClass
      const isNormal = !dice.check || dice.value === 0
      // nDX，n为1时，1不显示
      if (dice.num === 1) {
        dice.num = ''
      }

      // 检定类掷骰结果音效
      let result = ''
      let seSrc = ''
      if (dice.value >= GREAT_SUCCESS) {
        result = '（大失败）'
        seSrc = this.diceAudio.resultGreatFailSrc
      } else if (dice.value > dice.check) {
        result = '（失败）'
        seSrc = this.diceAudio.resultFailSrc
      } else if (dice.value <= GREAT_FAIL) {
        result = '（大成功）'
        seSrc = this.diceAudio.resultGreatSuccessSrc
      } else if (dice.value <= dice.check) {
        result = '（成功）'
        seSrc = this.diceAudio.resultSuccessSrc
      }

      // 一般数值类掷骰结果音效
      if (isNormal) {
        result = ''
        seSrc = this.diceAudio.resultNormalSrc
      }

      // 0代表暗骰
      if (dice.max === 0) {
        dice.max = '??'
      }

      if (dice.value === 0) {
        dice.value = '??'
      }

      let check
      if (!dice.check) {
        check = ''
      } else {
        check = `(${dice.check})`
      }

      this.currentContent = `${dice.project} : ${dice.num}D${dice.max}${check} = `
      this.diceSuffix = `${dice.value}${result}`

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
      this.audio.src = this.diceAudio.rollSrc
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
        this.audio.volume = this.roleData.volume
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
  padding: 16px 120px;
  line-height: 56px;
  font-size: 56px;
  color: black;
  font-weight: bolder;
  font-family: '萝莉体', serif;
}

.content-normal {
  font-size: 40px;
  font-family: '华康少女字体', serif;
}

.content-kp {
  margin-top: 24px;
}

.content-roll {
  text-align: center;
  font-size: 60px;
  color: black;
  font-weight:bold
}

</style>
