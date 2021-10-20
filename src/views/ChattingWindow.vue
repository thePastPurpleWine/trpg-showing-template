<template>
  <div class="main-window">
    <div class="placeholder-top"/>
    <chatting-item v-for="(item, index) in itemList"
                   :key="index"
                   :id="'chatting-item-' + index"
                   :head="item.head"
                   :nickname="item.nickname"
                   :content="item.content"
                   :type="item.type"
                   :is-continuous="item.isContinuous"
                   @mounted="scrollWindow(index)"
    />
  </div>
</template>

<script>
import ChattingItem from '@/views/ChattingItem'
const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export default {
  name: 'ChattingWindow',
  components: {
    ChattingItem
  },
  data () {
    return {
      itemStruct: {
        head: undefined,
        nickname: undefined,
        content: undefined,
        emoji: undefined,
        picture: undefined,
        type: undefined,
        isImportant: undefined,
        isContinuous: undefined
      },
      itemList: [],
      itemTypeList: ['info', 'left', 'right']
    }
  },
  mounted () {
    const timer = setInterval(() => {
      this.itemList.push(this.randomData())
    }, 1000)
    setTimeout(() => {
      clearInterval(timer)
    }, 12000)
  },
  methods: {
    scrollWindow (index) {
      const theLastItem = document.getElementById('chatting-item-' + index)
      theLastItem.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    },
    randomData () {
      const item = {
        head: 'example',
        nickname: 'me',
        content: undefined,
        emoji: undefined,
        picture: undefined,
        type: undefined,
        isImportant: undefined,
        isContinuous: true
      }

      item.content = this.randomContent(Math.ceil(Math.random() * 128))
      item.type = 'left'
      item.isContinuous = Math.ceil(Math.random() * 10) % 2 === 0

      return item
    },
    randomContent (n) {
      let res = ''
      for (let i = 0; i < n; i++) {
        const id = Math.ceil(Math.random() * (chars.length - 1))
        res += chars[id]
      }
      return res
    }
  }
}
</script>

<style scoped lang="less">
.placeholder-top {
  width: 100%;
  height: 20px;
}
.main-window {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;

  padding: 0 20px;
  //background: rgba(0, 0, 0, 0.1);

  overflow: hidden;
}
</style>
