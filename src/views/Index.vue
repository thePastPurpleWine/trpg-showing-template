<template>
  <div id="main" class="main">
    <audio id="bgm" muted></audio>
    <audio id="se" muted></audio>
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
      <role-image v-show="false" class="role-image"/>
      <role-dialog class="role-dialog"
                   v-show="nowStoryMassage.id"
                   :id="nowStoryMassage.id"
                   :type="nowStoryMassage.type"
                   :name="nowStoryMassage.name"
                   :content="nowStoryMassage.content"
                   :dice="nowStoryMassage.dice"
                   @playEnd="storyMessageExecEnd"
      />
    </div>
    <div id="curtain" class="curtain" @click="start"/>
  </div>
</template>
<script>
import ChattingItem from '@/views/components/ChattingItem'
import DiscussEvent from '@/assets/play/0-discuss-event.json'
import DiscussPlay from '@/assets/play/0-discuss.json'
import RoleImage from '@/views/components/RoleImage'
import RoleDialog from '@/views/components/RoleDialog'
import Display from '@/views/components/Display'

export default {
  name: 'Index',
  components: {
    ChattingItem,
    RoleImage,
    RoleDialog,
    Display
  },
  data () {
    return {
      curtainVisible: true,
      backgroundImageUrl: 'background.png',
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
      bgmEvent: {
        type: 'bgm',
        param: [
          '0-ハッピー☆マテリアル(Acoustic Version).mp3',
          '0-Island Fortress.mp3',
          '0-Beautiful Morning.mp3'
        ]
      },
      // 讨论信息列表
      discussMsgList: DiscussPlay,
      // 故事信息列表
      storyMsgList: [
        {
          index: 0,
          id: '11',
          name: '谢拉',
          // content: '故事的起因，是宿舍中的谢拉被人杀害，死因、其他线索以及公园湖边的案发地点一概被警察封锁了',
          voice: '',
          delay: 500,
          type: 'dice',
          dice: {
            num: 1,
            max: 100,
            value: 60,
            check: 50
          }
        }
      ],
      // 讨论事件列表
      discussEventMap: DiscussEvent,
      // 故事事件列表
      storyEventMap: {},
      nextDiscussMassage: undefined,
      nowDiscussMassage: undefined,
      nextStoryMassage: undefined,
      nowStoryMassage: {},
      // 节点同步参数
      awaitDiscussSyncTag: undefined,
      awaitStorySyncTag: undefined,
      message: {
        index: Number, // 序号
        id: String, // 唯一id
        syncTag: String // 同步id
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
    backgroundImageStyle () {
      return `background-image: url("${this.backgroundImageUrl}")`
    },
    isFinished () {
      return this.finishFlag.discuss && this.finishFlag.story
    }
  },
  mounted () {
    this.eventBackground('background.png')
    this.bgmPlayer = document.getElementById('bgm')
    this.bgmPlayer.loop = false
    this.sePlayer = document.getElementById('se')
    this.sePlayer.loop = false
  },
  watch: {
    nowStoryMassage (message) {
      // 消息节点同步
      if (this.awaitStorySyncTag && this.awaitStorySyncTag === message.syncTag) {
        this.discussMessageExec(this.nextDiscussMassage)
        this.awaitStorySyncTag = undefined
      }
    },
    nowDiscussMassage (message) {
      // 消息节点同步
      if (this.awaitDiscussSyncTag && this.awaitDiscussSyncTag === message.syncTag) {
        this.storyMessageExec(this.nextStoryMassage)
        this.awaitDiscussSyncTag = undefined
      }
      // 执行事件
      this.discussEventLoad(message.id)
    },
    isFinished (val) {
      if (val) {
        setTimeout(() => this.theConcluding(), 2000)
      }
    }
  },
  methods: {
    start () {
      this.eventExec(this.bgmEvent)
      this.theOpening().then(() => {
        setTimeout(() => {
          this.discussMessageLoad(0)
          this.storyMessageLoad(0)
          // this.finishFlag.bgm = true
          this.finishFlag.story = true
        }, 2000)
      })
    },
    /**
     * 开幕
     **/
    theOpening () {
      this.curtainVisible = true
      const curtainElement = document.getElementById('curtain')
      let opacity = 1
      return new Promise((resolve) => {
        const id = setInterval(() => {
          if (opacity > 0) {
            opacity -= 0.03
            curtainElement.style.opacity = opacity
          } else {
            curtainElement.style.opacity = '0'
            this.curtainVisible = false
            clearInterval(id)
            resolve()
          }
        }, 50)
      })
    },
    /**
     * 闭幕
     **/
    theConcluding () {
      this.curtainVisible = true
      const curtainElement = document.getElementById('curtain')
      let opacity = 0
      const id = setInterval(() => {
        if (opacity < 1) {
          opacity += 0.02
          curtainElement.style.opacity = opacity
        } else {
          curtainElement.style.opacity = '1'
          clearInterval(id)
        }
      }, 50)
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
      if (this.nextDiscussMassage.syncTag && this.nowStoryMassage.syncTag !== this.nextDiscussMassage.syncTag) {
        // 设置等待故事id
        this.awaitStorySyncTag = this.nextDiscussMassage.syncTag
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
      if (!!this.nextStoryMassage.syncTag && this.nowDiscussMassage.syncTag !== this.nextStoryMassage.syncTag) {
        // 设置等待故事id
        this.awaitDiscussSyncTag = this.nextStoryMassage.syncTag
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
    },
    /**
     * 故事消息执行完毕
     **/
    storyMessageExecEnd () {
      // 阅读等待
      setTimeout(() => {
        this.storyMessageLoad(this.nowStoryMassage.index + 1)
      }, this.nowStoryMassage.delay)
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
      const src = require('@/assets/' + imagePath)
      const mainDiv = document.getElementById('main')
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
     * 播放音乐
     * @param bgmList 音乐文件名列表
     **/
    eventBGM (bgmList) {
      let index = 0

      const interval = () => {
        setTimeout(playBgm(), 5000)
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
      // playBgm(0)
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
}

@padding-size: 20px;

.main {
  width: 1920px;
  height: 1080px;
  display: flex;

  padding: @padding-size 0;
}

.chatting-window {
  width: 31%;
  height: 85%;
  max-width: 31%;
  max-height: 100%;

  padding-left: 20px;
  padding-right: 5px;
  //padding-bottom: 180px;

  overflow: hidden;

  .placeholder-top {
    width: 32%;
    height: 20px;
  }
}

.main-stage {
  width: 1200px;
  height: 100%;
}

.role-image {
  z-index: 0;
  margin-bottom: -50px;
  opacity: 1;
  margin-top: 240px
}

.role-dialog {
  height: 360px;
  word-break: break-all;
  font-weight: lighter;
}

// 间章
//.display {
//  width: 1200px;
//  height: 800px;
//  margin-top: 30px;
//  position: absolute;
//}

// 正文
.display {
  width: 960px;
  height: 600px;
  margin-top: 30px;
  margin-left: 240px;
  position: absolute;
}
</style>
