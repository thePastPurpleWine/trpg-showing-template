<template>
  <div class="main">
    <div class="chatting-window">
      <div class="placeholder-top"/>
      <chatting-item v-for="(item, index) in chattingItemList"
                     :key="index"
                     :id="'chatting-item-' + index"
                     :head="item.head"
                     :nickname="item.nickname"
                     :content="item.content"
                     :type="item.type"
                     :is-continuous="item.isContinuous"
                     :picture="item.picture"
                     @mounted="discussMessageExecEnd(index)"
      />
    </div>
    <div class="main-stage" v-if="nowStoryMassage">
      <display style="width: 1200px; height: 40%; position: absolute;"/>
      <role-image style="margin-top: 240px"/>
      <role-dialog :id="nowStoryMassage.id"
                   :is-system="nowStoryMassage.isSystem"
                   :name="nowStoryMassage.name"
                   :content="nowStoryMassage.content"
                   @playEnd="storyMessageExecEnd"
      />
    </div>
  </div>
</template>
<script>
import ChattingItem from '@/views/components/ChattingItem'
import ChapterStart from '@/assets/chattingData/ChapterStart.json'
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
      chattingItemList: [],
      storyMassage: {
        id: '',
        isSystem: false,
        name: '谢拉',
        content: '故事的起因，是宿舍中的谢拉被人杀害，死因、其他线索以及公园湖边的案发地点一概被警察封锁了',
        voice: '',
        delay: 500
      },
      // 讨论信息列表
      discussMsgList: ChapterStart,
      // 故事信息列表
      storyMsgList: [
        {
          id: '',
          isSystem: false,
          name: '谢拉',
          content: '故事的起因，是宿舍中的谢拉被人杀害，死因、其他线索以及公园湖边的案发地点一概被警察封锁了',
          voice: '',
          delay: 500
        }
      ],
      // 讨论事件列表
      discussEventMap: {},
      // 故事事件列表
      storyEventMap: {},
      nextDiscussMassage: undefined,
      nowDiscussMassage: undefined,
      nextStoryMassage: undefined,
      nowStoryMassage: undefined,
      message: {
        index: Number, // 序号
        id: String, // 唯一id
        syncId: String // 同步id
        // other
      },
      event: {
        index: Number, // 序号
        id: String, // 唯一id
        triggerId: String // 触发id
        // other
      },
      nowChattingItemMounted: false

    }
  },
  mounted () {
    setTimeout(() => {
      this.discussMessageLoad(0)
    }, 3000)
    setTimeout(() => {
      this.storyMessageLoad(0)
    }, 3000)
  },
  watch: {
    nowStoryMassage (message) {
      // 消息节点同步
      if (this.awaitStoryId === message.id) {
        this.discussMessageExec(this.nextDiscussMassage)
        this.awaitStoryId = undefined
      }
    },
    nowDiscussMassage (message) {
      // 消息节点同步
      if (this.awaitDiscussId === message.id) {
        // this.storyMsgExec(this.nextStoryMassage)
        this.awaitDiscussId = undefined
      }
      // 执行事件
      this.discussEventLoad(message.id)
    }
  },
  methods: {
    /**
     * 讨论消息加载
     **/
    discussMessageLoad (index) {
      // 加载消息列表
      if (index >= this.discussMsgList.length) {
        return
      }
      this.nextDiscussMassage = this.discussMsgList[index]
      if (!this.nextDiscussMassage.syncId || this.nowStoryMassage.id === this.nextDiscussMassage.syncId) {
        // 无需同步时，立即执行
        this.discussMessageExec(this.nextDiscussMassage)
      } else {
        // 设置等待故事id
        this.awaitStoryId = this.nextDiscussMassage.syncId
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
          setTimeout(() => this.discussEventExec(event))
        })
      }
    },
    /**
     * 讨论事件执行
     **/
    discussEventExec (event) {
      // 执行事件
    },
    /**
     * 故事消息加载
     **/
    storyMessageLoad (index) {
      // 加载消息列表
      if (index >= this.storyMsgList.length) {
        return
      }
      this.nextStoryMassage = this.storyMsgList[index]
      if (!this.nextStoryMassage.syncId || this.nowDiscussMassage.id === this.nextStoryMassage.syncId) {
        // 无需同步时，立即执行
        this.storyMessageExec(this.nextStoryMassage)
      } else {
        // 设置等待故事id
        this.awaitDiscussId = this.nextStoryMassage.syncId
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
          setTimeout(() => this.storyEventExec(event))
        })
      }
    },
    /**
     * 故事事件执行
     **/
    storyEventExec (event) {
      // 执行事件
    }
  }
}
</script>
<style lang="less" scoped>
@padding-size: 20px;

.main {
  width: 1920px;
  height: 1080px;
  background-image: url("../assets/宿舍3.png");
  display: flex;

  padding: @padding-size 0;
}

.chatting-window {
  width: 32%;
  height: 100%;
  max-width: 32%;
  max-height: 100%;

  padding: 0 20px;

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
</style>
