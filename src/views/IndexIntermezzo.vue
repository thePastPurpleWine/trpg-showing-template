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
  </div>
</template>
<script>
import ChattingItem from '@/views/ChattingItem'
import ChapterStart from '../assets/chattingData/ChapterStart.json'

export default {
  name: 'IndexIntermezzo',
  components: {
    ChattingItem
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
  background-image: url("../assets/间奏背景.png");
  display: flex;

  padding: @padding-size 0;
}

.chatting-window {
  margin-left: 400px;
  width: 32%;
  height: 95%;
  max-width: 32%;
  max-height: 100%;

  padding: 0 20px;

  overflow: hidden;

  .placeholder-top {
    width: 32%;
    height: 20px;
  }
}
</style>
