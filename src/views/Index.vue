<template>
  <div id="main" class="main">
    <audio id="bgm" muted></audio>
    <audio id="se" muted></audio>
    <display ref="pic-side" class="display-side"/>
    <div class="chatting-window">
      <div class="placeholder-top"/>
      <chatting-item v-for="(item) in chattingItemList"
                     :key="item.index"
                     :id="'chatting-item-' + item.index"
                     :ref="'chatting-item-' + item.index"
                     :avatar="item.avatar"
                     :type="item.type"
                     :nickname="item.nickname"
                     :content="item.content"
                     :is-continuous="item.isContinuous"
                     :picture="item.picture"
                     :is-mount="item.index > mountedChattingItemNum - MAX_MOUNTED_CHATTING_ITEM_NUM"
                     @mounted="discussMessageExecEnd(item.index)"
      />
    </div>
    <div class="main-stage">
      <display ref="pic" class="display"/>
      <display ref="pic-status" class="display-status"/>
      <role-dialog class="role-dialog"
                   v-show="nowStoryMassage.id"
                   :type="nowStoryMassage.type"
                   :role="nowStoryMassage.role"
                   :face="nowStoryMassage.face"
                   :voiceId="nowStoryMassage.voiceId"
                   :content="nowStoryMassage.content"
                   :dice="nowStoryMassage.dice"
                   :chapter="CHAPTER"
                   @playFinish="storyMessageExecEnd"
      />
    </div>
    <div v-if="curtainVisible" id="curtain" class="curtain" @click="start"/>
  </div>
</template>
<script>
import ChattingItem from '@/views/components/ChattingItem'
import RoleDialog from '@/views/components/RoleDialog'
import Display from '@/views/components/Display'
import ProjectConfig from '@/config/ProjectConfig.json'
import $ from 'jquery'

// 指定剧本
import DiscussPlay from '@/assets/play/6-discuss.json'
import StoryPlay from '@/assets/play/6-story.json'
// 指定剧本事件
import DiscussEvent from '@/assets/play/6-discuss-event.json'
import StoryEvent from '@/assets/play/6-story-event.json'

const projectConfig = ProjectConfig
// id 序号补全位数
const ID_DIGITS = projectConfig.idDigits
// 聊天消息窗口最大渲染消息数
const MAX_MOUNTED_CHATTING_ITEM_NUM = 15
// 故事章节，对应语音加载目录 src/assets/voice/CHAPTER
const CHAPTER = '6'
// 从第 x 项快速载入剧本，方便调试，推荐从同一 waiting 载入
const STORY_START_INDEX = 2
const DISCUSS_START_INDEX = 0
// 初始场景
const START_BACKGROUND = '医学楼走廊一楼.png'

export default {
  name: 'Index',
  components: {
    ChattingItem,
    RoleDialog,
    Display
  },
  data () {
    return {
      CHAPTER,
      MAX_MOUNTED_CHATTING_ITEM_NUM,
      started: false,
      curtainVisible: true,
      chattingItemList: [],
      mountedChattingItemNum: 0,
      bgmPlayer: undefined,
      sePlayer: undefined,
      // 幕布元素
      curtainElement: undefined,
      // 讨论信息列表
      discussMsgList: DiscussPlay,
      // 故事信息列表
      storyMsgList: StoryPlay,
      // 讨论事件列表
      discussEventMap: DiscussEvent,
      // 故事事件列表
      storyEventMap: StoryEvent,
      nextDiscussMassage: undefined,
      nowDiscussMassage: undefined,
      nextStoryMassage: {},
      nowStoryMassage: {},
      // 结束标记组
      finishFlag: {
        bgm: false,
        discuss: false,
        story: false
      },
      // 节点同步参数
      waitingDiscuss: undefined,
      waitingStory: undefined,
      storyMassageClass: {
        index: Number, // 序号
        id: String, // 唯一id
        waiting: String, // 阻塞同步id

        type: String, // 消息类型 normal roll
        role: String, // 角色
        face: String, // 表情
        content: String, // 内容
        dice: Object // 骰子信息
      },
      discussMassageClass: {
        index: Number, // 序号
        id: String, // 唯一id
        waiting: String, // 阻塞同步id

        type: String, // 消息类型 normal info
        avatar: String, // 头像文件
        nickname: String, // 昵称
        content: String, // 内容
        picture: String, // 消息图片
        isContinuous: Boolean, // 是否与上一人相同
        delay: Number, // 阅读延迟
        preDelay: Number // 载入延迟
      },
      eventItemClass: {
        preDelay: Number, // 载入延迟
        type: String, // 事件类型
        param: Object // 事件参数
      },
      // 计时器
      startTime: undefined
    }
  },
  computed: {
    // 标记：故事节点与讨论节点均加载完毕，剧本结束
    isFinished () {
      return this.finishFlag.discuss && this.finishFlag.story
    },
    // 标记：故事节点与讨论节点是否均到达等待节点
    allWaiting () {
      return this.waitingDiscuss && this.waitingStory
    }
  },
  mounted () {
    this.eventBackground(START_BACKGROUND)
    this.curtainElement = document.getElementById('curtain')
    this.curtainElement.style.opacity = '1'
    this.bgmPlayer = document.getElementById('bgm')
    this.bgmPlayer.loop = false
    this.sePlayer = document.getElementById('se')
    this.sePlayer.loop = false
  },
  watch: {
    allWaiting (val) {
      // 消息节点同步
      if (val) {
        this.timeLog('同步等待', `discuss waiting: ${this.nextDiscussMassage.waiting}, discuss waiting: ${this.nextStoryMassage.waiting}`)
        this.discussMessageExec(this.nextDiscussMassage)
        this.storyMessageExec(this.nextStoryMassage)
        this.waitingStory = undefined
        this.waitingDiscuss = undefined
      }
    },
    nowStoryMassage (message) {
      // 执行事件
      this.storyEventLoad(message.id)
    },
    nowDiscussMassage (message) {
      // 执行事件
      this.discussEventLoad(message.id)
    },
    isFinished (val) {
      if (val) {
        this.theConcluding()
      }
    }
  },
  methods: {
    /**
     * 鼠标点击开始
     **/
    start () {
      if (this.started) {
        return
      }

      this.startTime = new Date().getTime()
      console.log('计时开始: 00:00.000')

      this.theOpening()
      this.started = true
      this.finishFlag = {
        bgm: false,
        discuss: false,
        story: false
      }
      setTimeout(() => {
        this.storyMessageLoad(STORY_START_INDEX)
      }, 3000)
      setTimeout(() => {
        this.discussMessageLoad(DISCUSS_START_INDEX)
        this.curtainVisible = false
      }, 3000)
    },
    /**
     * 开幕
     **/
    theOpening () {
      this.curtainVisible = true
      this.curtainElement.style.opacity = '0'
    },
    /**
     * 闭幕
     **/
    theConcluding () {
      this.curtainVisible = true
      setTimeout(() => {
        this.curtainElement.style.opacity = '1'
        this.eventBgmOut()
      }, 1000)
      setTimeout(() => {
        const mainElement = document.getElementById('main')
        mainElement.style.transition = 'background-image 0s linear'
        this.eventBackground('Fin.png')
        this.started = false
      }, 3000)
      setTimeout(() => {
        this.curtainElement.style.transition = 'opacity 4s linear'
        this.curtainElement.style.opacity = '0'
      }, 3500)
    },
    /**
     * 讨论消息加载
     * @param index 讨论节点序号
     **/
    discussMessageLoad (index) {
      // 加载消息列表
      if (index >= this.discussMsgList.length) {
        this.finishFlag.discuss = true
        return
      }
      this.nextDiscussMassage = this.discussMsgList[index]
      if (!this.nextDiscussMassage) {
        this.discussMessageLoad(index + 1)
        return
      }

      if (this.nextDiscussMassage.waiting) {
        // 设置等待故事
        this.waitingStory = true
      } else {
        // 无需等待同步时，立即执行
        this.discussMessageExec(this.nextDiscussMassage)
      }
    },
    /**
     * 讨论消息执行
     * @param message 讨论节点 discussMassageClass
     **/
    discussMessageExec (message) {
      // 延迟加载
      const { preDelay } = message
      setTimeout(() => {
        this.timeLog('讨论节点', message.content)
        // 更新当前讨论节点id
        this.nowDiscussMassage = message
        // 新增讨论项
        this.chattingItemList.push(message)
      }, preDelay || 0)
    },
    /**
     * 讨论消息执行完毕执行的操作
     **/
    discussMessageExecEnd () {
      // 滚动聊天栏到底部
      const theLastItem = document.getElementById('chatting-item-' + this.nowDiscussMassage.index)
      theLastItem.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
      // 阅读等待
      setTimeout(() => {
        this.mountedChattingItemNum++
        this.discussMessageLoad(this.nowDiscussMassage.index + 1)
      }, this.nowDiscussMassage.delay)
    },
    /**
     * 讨论事件加载
     * @param id 讨论id
     **/
    discussEventLoad (id) {
      const eventList = this.discussEventMap[id]
      if (eventList) {
        eventList.forEach((event) => {
          setTimeout(() => this.eventExec(event, id))
        })
      }
    },
    /**
     * 故事消息加载
     * @param index 故事序号
     **/
    storyMessageLoad (index) {
      // 加载消息列表
      if (index >= this.storyMsgList.length) {
        this.finishFlag.story = true
        return
      }

      if (!this.storyMsgList[index]) {
        this.storyMessageLoad(index + 1)
        return
      }
      this.nextStoryMassage = this.storyMsgList[index]

      // 生产声音文件名
      this.nextStoryMassage.voiceId = this.prefixZero(index, ID_DIGITS) + '-' + this.nextStoryMassage.id

      if (this.nextStoryMassage.waiting) {
        // 设置等待故事id
        this.waitingDiscuss = true
      } else {
        // 无需等待同步时，立即执行
        this.storyMessageExec(this.nextStoryMassage)
      }
    },
    /**
     * 故事消息执行
     * @param message 故事节点 storyMassageClass
     **/
    storyMessageExec (message) {
      // 更新当前故事节点id
      this.timeLog('故事节点', message.content || 'roll')
      this.nowStoryMassage = message
      this.finishFlag.storyPlay = false
    },
    /**
     * 故事消息执行完毕
     **/
    storyMessageExecEnd () {
      // 阅读等待
      setTimeout(() => {
        this.storyMessageLoad(this.nowStoryMassage.index + 1)
      }, 0)
    },
    /**
     * 故事事件加载
     * @param id 故事id
     **/
    storyEventLoad (id) {
      const eventList = this.storyEventMap[id]
      if (eventList) {
        eventList.forEach((event) => {
          setTimeout(() => this.eventExec(event, id))
        })
      }
    },
    /**
     * 事件执行
     * @param eventItem 事件项信息 eventItemClass
     * @param id 讨论/故事节点id
     **/
    eventExec (eventItem, id) {
      // 延迟加载
      const { preDelay } = eventItem
      setTimeout(() => {
        this.timeLog('触发事件', eventItem.type + ' ' + id)
        switch (eventItem.type) {
          case 'bg':
            this.eventBackground(eventItem.param)
            break
          case 'bgm-list':
            this.eventBgmList(eventItem.param)
            break
          case 'bgm':
            this.eventBgm(eventItem.param)
            break
          case 'bgm-out':
            this.eventBgmOut()
            break
          case 'se':
            this.eventSE(eventItem.param)
            break
          case 'pic':
            this.eventPicture(eventItem.param)
            break
          case 'pic-disappear':
            this.eventPictureDisappear()
            break
          case 'pic-side':
            this.eventPictureSide(eventItem.param)
            break
          case 'pic-side-disappear':
            this.eventPictureSideDisappear()
            break
          case 'pic-status':
            this.eventPictureStatus(eventItem.param)
            break
          case 'pic-status-disappear':
            this.eventPictureStatusDisappear()
            break
          case 'revoke':
            this.eventRevoke(eventItem.param)
            break
        }
      }, preDelay || 0)
    },
    /**
     * 事件列表
     **/
    /**
     * 更换背景图片
     * @param imagePath 图片位于 assets 中的相对路径
     **/
    eventBackground (imagePath) {
      const mainDiv = document.getElementById('main')
      const img = new Image()
      const src = require('@/assets/background/' + imagePath)
      img.onload = () => {
        mainDiv.style.backgroundImage = 'url(' + src + ')'
      }
      img.src = src
    },
    /**
     * 展示图片
     * @param picture 图片事件参数
     **/
    eventPicture (picture) {
      this.$refs.pic.showImage(picture)
    },
    /**
     * 消失图片
     **/
    eventPictureDisappear () {
      this.$refs.pic.hideImage()
    },
    /**
     * 播放音效
     * @param se 音效文件名
     **/
    eventSE (se) {
      this.sePlayer.src = require('@/assets/se/' + se)
      this.sePlayer.play()
    },
    /**
     * 边侧图片
     **/
    eventPictureSide (picture) {
      this.$refs['pic-side'].showImage(picture)
    },
    /**
     * 边侧消失图片
     **/
    eventPictureSideDisappear () {
      this.$refs['pic-side'].hideImage()
    },
    /**
     * 状态图片
     **/
    eventPictureStatus (picture) {
      this.$refs['pic-status'].showImage(picture)
    },
    /**
     * 状态消失图片
     **/
    eventPictureStatusDisappear () {
      this.$refs['pic-status'].hideImage()
    },
    /**
     * 播放音乐
     * @param event 音乐事件
     **/
    eventBgm (event) {
      const { filename, volume } = event
      this.bgmPlayer.pause()
      this.bgmPlayer.src = require('@/assets/bgm/' + filename)
      this.bgmPlayer.volume = volume
      this.bgmPlayer.play()
    },
    /**
     * 淡出音乐
     **/
    eventBgmOut () {
      $('#bgm').animate({ volume: 0 }, 5000)
    },
    /**
     * 播放音乐
     * @param bgmList 音乐文件名列表
     **/
    eventBgmList (bgmList) {
      let index = 0

      const interval = () => {
        setTimeout(() => playBgm(), 10000)
      }

      const playBgm = () => {
        if (index >= bgmList.length) {
          this.bgmPlayer.removeEventListener('ended', interval)
          this.finishFlag.bgm = true
          return
        }

        this.bgmPlayer.src = require('@/assets/bgm/' + bgmList[index])
        this.bgmPlayer.play()
        index++
      }

      this.bgmPlayer.addEventListener('ended', interval)
      playBgm()
    },
    /**
     * 撤回讨论消息
     * @param discussIndex 讨论消息序号
     **/
    eventRevoke (discussIndex) {
      const vueComponents = this.$refs['chatting-item-' + discussIndex]
      if (vueComponents.length) {
        vueComponents[0].revoke()
      }
    },
    /**
     * 补零
     * @param num 数字
     * @param n 位数
     **/
    prefixZero (num, n) {
      return (Array(n).join('0') + num).slice(-n)
    },
    /**
     * 日志记录
     * @param type 类型（推荐8个半角字符）
     * @param content 内容
     **/
    timeLog (type, content) {
      const diff = new Date().getTime() - this.startTime
      const milliseconds = this.prefixZero(diff % 1000, 3)
      const seconds = this.prefixZero(((diff / 1000) % 60).toFixed(0), 2)
      const minutes = this.prefixZero(((diff / 1000) / 60).toFixed(0), 2)
      console.log(`${type}: ${minutes}:${seconds}.${milliseconds}: ${content}`)
    }
  }
}
</script>
<style lang="less" scoped>
.curtain {
  width: 1920px;
  height: 1080px;
  position: absolute;
  background: black;
  margin-top: -20px;
  z-index: 1;
  opacity: 0;
  transition: opacity 2s linear;
}

@padding-size: 20px;

.main {
  width: 1920px;
  height: 1080px;
  display: flex;
  background-color: black;

  padding: @padding-size 0;
  transition: background-image 2s linear;
}

.chatting-window {
  width: 31%;
  height: 85%;
  max-width: 31%;
  max-height: 100%;

  padding-left: 20px;
  padding-right: 5px;
  //padding-bottom: 180px;
  margin-left: 40px;

  overflow: hidden;

  .placeholder-top {
    width: 32%;
    height: 20px;
  }
}

.main-stage {
  position: relative;
  width: 1200px;
  height: 100%;
}

.role-dialog {
  bottom: -255px;
  position: relative;
  word-break: break-all;
  font-weight: lighter;
}

// 间章
//.display {
//  width: 1000px;
//  height: 800px;
//  margin-top: 30px;
//  position: absolute;
//}

// 正剧
.display {
  width: 920px;
  height: 540px;
  margin-top: 30px;
  margin-left: 300px;
  position: absolute;
}

.display-status {
  width: 900px;
  height: 80px;
  margin-top: 580px;
  margin-left: 320px;
  position: absolute;
  z-index: 1;
}

.display-side {
  position: absolute;
  width: 460px;
  height: 410px;
  z-index: 1;
  left: 100px;
}
</style>
