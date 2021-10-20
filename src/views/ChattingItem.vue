<template>
  <div :class="this.isContinuous ? 'message-continuous' : 'message-first'">
    <a-row v-if="type === TYPE_LEFT" class="message-item-left" type="flex">
      <div class="head-block">
        <img v-if="!isContinuous" :src="headImg" alt="">
        <div v-else class="placeholder-block"/>
      </div>

      <div class="message-block">
        <div v-if="!isContinuous" class="nickname-block">
          <span>{{ nickname }}</span>
        </div>

        <div class="message-bubble" v-if="content">
          <span>{{ content }}</span>
        </div>
      </div>

<!--      <div class="placeholder-block"/>-->
    </a-row>

    <a-row v-else-if="type === TYPE_RIGHT" class="message-item-right" type="flex" justify="end">
<!--      <div class="placeholder-block"/>-->

      <div class="message-block">
        <div v-if="!isContinuous" class="nickname-block">
          <span>{{ nickname }}</span>
        </div>

        <div class="message-bubble" v-if="content">
          <span>{{ content }}</span>
        </div>
      </div>

      <div class="head-block">
        <img v-if="!isContinuous" :src="headImg" alt="">
        <div v-else class="placeholder-block"/>
      </div>
    </a-row>
  </div>
</template>

<script>
const TYPE_LEFT = 'left'
const TYPE_RIGHT = 'right'
const TYPE_INFO = 'info'

export default {
  name: 'ChattingItem',
  props: {
    head: {
      type: String,
      required: false,
      default: undefined
    },
    nickname: {
      type: String,
      required: false,
      default: ''
    },
    content: {
      type: String,
      required: false,
      default: ''
    },
    emoji: {
      type: String,
      required: false,
      default: undefined
    },
    picture: {
      type: String,
      required: false,
      default: undefined
    },
    type: {
      type: String,
      required: true,
      validate: (val) => {
        return val === TYPE_INFO || val === TYPE_RIGHT || val === TYPE_LEFT
      }
    },
    isContinuous: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      TYPE_LEFT,
      TYPE_RIGHT,
      TYPE_INFO,

      headImg: undefined
    }
  },
  created () {
    if (!this.isContinuous) {
      try {
        const jpgUrl = require(`@/assets/head-${this.head}.jpg`)
        if (jpgUrl) {
          this.headImg = jpgUrl
        }
      } catch (e) {}
      try {
        const pngUrl = require(`@/assets/head-${this.head}.png`)
        if (pngUrl) {
          this.headImg = pngUrl
        }
      } catch (e) {}
    }
  },
  mounted () {
    this.$emit('mounted')
  },
  methods: {
    getMessageClass () {
      return this.isContinuous ? 'message-continuous' : 'message-first'
    }
  }
}
</script>

<style scoped lang="less">
@head-size: 60px;

.message-first {
  width: 100%;
  padding-bottom: 5px;

  padding-top: 5px;
}

.message-continuous {
  width: 100%;
  padding-bottom: 5px;
  display: flex;
}

.message-item-left {
  width: 100%;

  .head-block {
    img {
      width: @head-size;
      height: @head-size;

      border-radius: 8px;
    }
  }

  .message-block {
    padding: 0 10px;
    max-width: calc(100% - @head-size * 1);

    .nickname-block {
      height: 32px;
      width: 100%;

      span {
        font-size: 28px;
        line-height: 32px;
      }
    }

    .message-bubble {
      margin-top: 3px;
      padding: 8px;
      background-color: rgba(200, 200, 200, 0.7);
      border-radius: 0 10px 10px 10px;
      word-break: break-all;

      font-size: 30px;
      font-family: '华康少女字体', serif;
    }
  }

  .placeholder-block {
    width: @head-size;
    height: 100%;
  }
}

.message-item-right {
  width: 100%;

  .head-block {
    img {
      width: @head-size;
      height: @head-size;

      border-radius: 8px;
    }
  }

  .message-block {
    padding: 0 10px;
    max-width: calc(100% - @head-size * 1);

    .nickname-block {
      height: 32px;
      width: 100%;

      span {
        float: right;
        font-size: 28px;
        line-height: 32px;
      }
    }

    .message-bubble {
      margin-top: 3px;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 10px 0 10px 10px;
      word-break: break-all;

      font-size: 30px;
      font-family: '华康少女字体', serif;
    }
  }

  .placeholder-block {
    width: @head-size;
    height: 100%;
  }
}
</style>
