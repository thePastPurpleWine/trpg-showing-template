<template>
  <div id="main" class="main">
    <audio id="bgm" muted></audio>
    <audio id="se" muted></audio>
    <display class="display-side"
             :filepath="pictureSide.filepath"
             :duration="pictureSide.duration"
             :waiting="pictureSide.waiting"
             :trigger="pictureSideTrigger"/>
    <div class="chatting-window">
      <div class="placeholder-top"/>
      <chatting-item v-for="(item, index) in chattingItemList"
                     :key="index"
                     :id="'chatting-item-' + item.index"
                     :head="item.head"
                     :nickname="item.nickname"
                     :content="item.content"
                     :type="item.type"
                     :is-continuous="item.isContinuous"
                     :picture="item.picture"
                     @mounted="discussMessageExecEnd(item.index)"
      />
    </div>
    <div class="main-stage">
      <display class="display"
               :filepath="picture.filepath"
               :duration="picture.duration"
               :waiting="picture.waiting"
               :trigger="pictureTrigger"/>
      <role-dialog class="role-dialog"
                   v-show="nowStoryMassage.id"
                   :voiceId="nowStoryMassage.voiceId"
                   :type="nowStoryMassage.type"
                   :name="nowStoryMassage.name"
                   :content="nowStoryMassage.content"
                   :dice="nowStoryMassage.dice"
                   :role="nowStoryMassage.role"
                   chapter="1"
                   @playFinish="storyMessageExecEnd"
      />
    </div>
    <div v-if="curtainVisible" id="curtain" class="curtain" @click="start"/>
  </div>
</template>
<script>
import ChattingItem from '@/views/components/ChattingItem'
import DiscussEvent from '@/assets/play/1-discuss-event.json'
import StoryEvent from '@/assets/play/1-story-event.json'
import DiscussPlay from '@/assets/play/1-discuss.json'
import StoryPlay from '@/assets/play/1-story.json'
import RoleDialog from '@/views/components/RoleDialog'
import Display from '@/views/components/Display'

export default {
  name: 'Index',
  components: {
    ChattingItem,
    RoleDialog,
    Display
  },
  data () {
    return {
      started: false,
      curtainVisible: true,
      chattingItemList: [],
      storyMassage: {
        id: '',
        isSystem: false,
        name: '谢拉',
        content: '故事的起因，是宿舍中的谢拉被人杀害，死因、其他线索以及公园湖边的案发地点一概被警察封锁了',
        voice: '',
        delay: 500
      },
      bgmPlayer: undefined,
      sePlayer: undefined,
      picture: {
        filepath: undefined,
        waiting: false,
        duration: undefined
      },
      pictureTrigger: false,
      pictureSide: {
        filepath: undefined,
        waiting: false,
        duration: undefined
      },
      pictureSideTrigger: false,
      bgmEvent: {
        type: 'bgm',
        // param: [
        //   '0-ハッピー☆マテリアル(Acoustic Version).mp3',
        //   '0-Island Fortress.mp3',
        //   '0-Beautiful Morning.mp3'
        // ]
        param: [
          '1-消沈.mp3',
          '1-WS Town.mp3',
          '1-33.mp3',
          '1-ED6518.mp3',
          '1-冰之女王.mp3',
          '1-可靠的女人.mp3',
          '1-Nicedesuyo.mp3',
          '1-Konata no Theme.mp3'
        ]
      },
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
      nextStoryMassage: undefined,
      nowStoryMassage: {},
      // 节点同步参数
      waitingDiscuss: undefined,
      waitingStory: undefined,
      message: {
        index: Number, // 序号
        id: String, // 唯一id
        waiting: Boolean // 同步id
        // other
      },
      event: {
        index: Number, // 序号
        id: String, // 唯一id
        triggerId: String // 触发id
        // other
      },
      nowChattingItemMounted: false,
      finishFlag: {
        bgm: false,
        discuss: false,
        story: false
      }
    }
  },
  computed: {
    isFinished () {
      return this.finishFlag.discuss && this.finishFlag.story
    },
    allWaiting () {
      return this.waitingDiscuss && this.waitingStory
    }
  },
  mounted () {
    this.eventBackground('宿舍.png')
    const curtainElement = document.getElementById('curtain')
    curtainElement.style.opacity = '1'
    this.bgmPlayer = document.getElementById('bgm')
    this.bgmPlayer.loop = false
    this.sePlayer = document.getElementById('se')
    this.sePlayer.loop = false
  },
  watch: {
    allWaiting (val) {
      // 消息节点同步
      if (val) {
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
    start () {
      if (this.started) {
        return
      }

      this.theOpening()
      this.started = true
      setTimeout(() => {
        // this.eventExec(this.bgmEvent)
        // this.eventPictureSide({
        //   filepath: '1-theSnowTestament.jpg',
        //   waiting: true
        // })
      }, 5000)
      setTimeout(() => {
        this.storyMessageLoad(153)
      }, 4000)
      setTimeout(() => {
        this.discussMessageLoad(185)
        this.curtainVisible = false
      }, 6000)
    },
    /**
     * 开幕
     **/
    theOpening () {
      this.curtainVisible = true
      const curtainElement = document.getElementById('curtain')
      curtainElement.style.opacity = '0'
    },
    /**
     * 闭幕
     **/
    theConcluding () {
      this.curtainVisible = true
      setTimeout(() => {
        const curtainElement = document.getElementById('curtain')
        curtainElement.style.opacity = '1'
      }, 2000)
    },
    /**
     * 讨论消息加载
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
     **/
    discussMessageExec (message) {
      // 更新当前讨论节点id
      this.nowDiscussMassage = message
      // 新增讨论项
      this.chattingItemList.push(message)
    },
    /**
     * 讨论消息执行完毕
     **/
    discussMessageExecEnd () {
      // 滚动聊天栏到底部
      const theLastItem = document.getElementById('chatting-item-' + this.nowDiscussMassage.index)
      theLastItem.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
      // 阅读等待
      setTimeout(() => {
        this.discussMessageLoad(this.nowDiscussMassage.index + 1)
      }, this.nowDiscussMassage.delay)
    },
    /**
     * 讨论事件加载
     **/
    discussEventLoad (id) {
      const eventList = this.discussEventMap[id]
      if (eventList) {
        eventList.forEach((event) => {
          setTimeout(() => this.eventExec(event))
        })
      }
    },
    /**
     * 故事消息加载
     **/
    storyMessageLoad (index) {
      // 加载消息列表
      if (index >= this.storyMsgList.length) {
        this.finishFlag.story = true
        return
      }

      this.nextStoryMassage = this.storyMsgList[index]
      // 生产声音文件名
      function prefixZero (num, n) {
        return (Array(n).join(0) + num).slice(-n)
      }
      this.nextStoryMassage.voiceId = prefixZero(index, 3) + '-' + this.nextStoryMassage.id

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
     **/
    storyMessageExec (message) {
      // 更新当前故事节点id
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
      // }, this.nowStoryMassage.delay)
    },
    /**
     * 故事事件加载
     **/
    storyEventLoad (id) {
      const eventList = this.storyEventMap[id]
      if (eventList) {
        eventList.forEach((event) => {
          setTimeout(() => this.eventExec(event))
        })
      }
    },
    /**
     * 事件执行
     **/
    eventExec (event) {
      // 执行事件
      switch (event.type) {
        case 'bg':
          this.eventBackground(event.param)
          break
        case 'bgm':
          this.eventBGM(event.param)
          break
        case 'se':
          this.eventSE(event.param)
          break
        case 'pic':
          this.eventPicture(event.param)
          break
        case 'pic-disappear':
          this.eventPictureDisappear()
          break
        case 'pic-side':
          this.eventPictureSide(event.param)
          break
        case 'pic-side-disappear':
          this.eventPictureSideDisappear()
          break
      }
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
      const src = require('@/assets/background/' + imagePath)
      mainDiv.style.backgroundImage = 'url(' + src + ')'
    },
    /**
     * 展示图片
     * @param picture 图片事件参数
     **/
    eventPicture (picture) {
      this.picture = picture
      this.pictureTrigger = !this.pictureTrigger
    },
    /**
     * 消失图片
     **/
    eventPictureDisappear () {
      this.pictureTrigger = !this.pictureTrigger
    },
    /**
     * 播放音效
     * @param se 音效文件名
     **/
    eventSE (se) {
      this.sePlayer.src = require('@/assets/se/' + se + '.ogg')
      this.sePlayer.play()
    },
    /**
     * 边侧图片
     **/
    eventPictureSide (picture) {
      this.pictureSide = picture
      this.pictureSideTrigger = !this.pictureSideTrigger
    },
    /**
     * 边侧消失图片
     **/
    eventPictureSideDisappear () {
      this.pictureTrigger = !this.pictureTrigger
    },
    /**
     * 播放音乐
     * @param bgmList 音乐文件名列表
     **/
    eventBGM (bgmList) {
      let index = 0

      const interval = () => {
        setTimeout(() => playBgm(), 9000)
      }

      const playBgm = () => {
        if (index >= bgmList.length) {
          this.bgmPlayer.removeEventListener('ended', interval)
          this.finishFlag.bgm = true
          return
        }

        this.bgmPlayer.src = require('@/assets/bgm/' + bgmList[index])
        if (bgmList[index] === '1-33.mp3') {
          this.bgmPlayer.volume = 0.15
        } else if (bgmList[index] === '1-消沈.mp3') {
          this.bgmPlayer.volume = 0.4
        } else if (bgmList[index] === '1-可靠的女人.mp3') {
          this.bgmPlayer.volume = 0.2
        } else {
          this.bgmPlayer.volume = 0.25
        }
        this.bgmPlayer.play()
        index++
      }

      this.bgmPlayer.addEventListener('ended', interval)
      playBgm(0)
    }
  }
}
</script>
<style lang="less" scoped>
.curtain {
  width: 100%;
  height: 100%;
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
  height: 600px;
  margin-top: 30px;
  margin-left: 300px;
  position: absolute;
}

.display-side {
  position: absolute;
  width: 480px;
  height: 600px;
  z-index: 1;
  left: 100px;
}
</style>
