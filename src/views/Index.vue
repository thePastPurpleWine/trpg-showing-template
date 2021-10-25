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
                     @mounted="chattingItemMounted(index)"
      />
    </div>
    <div v-if="false" class="main-stage">
      <main-stage/>
    </div>
  </div>
</template>
<script>
import ChattingItem from '@/views/ChattingItem'
import MainStage from '@/views/MainStage'
import ChapterStart from '../assets/chattingData/ChapterStart.json'

export default {
  name: 'Index',
  components: {
    ChattingItem,
    MainStage
  },
  data () {
    return {
      // Chatting Part
      chattingItemList: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.chattingItemList.push(ChapterStart[0])
    }, 3000)
  },
  methods: {
    /***
     * Chatting Part
     ***/
    chattingItemMounted (index) {
      this.scrollChattingWindow(index)
      this.delayPushChattingItem(index)
    },
    scrollChattingWindow (index) {
      const theLastItem = document.getElementById('chatting-item-' + index)
      theLastItem.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    },
    delayPushChattingItem (index) {
      if (index + 1 < ChapterStart.length) {
        setTimeout(() => {
          this.chattingItemList.push(ChapterStart[index + 1])
        }, ChapterStart[index].delay)
      }
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

.right-part {
  width: 10%;
  height: 100%;
}
</style>
