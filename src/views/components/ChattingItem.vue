<template>
  <div v-if="isMount" :class="this.isContinuous ? 'message-continuous' : 'message-first'">
    <a-row v-if="type === TYPE_LEFT" class="message-item-left" type="flex" v-show="allReady">
      <div class="head-block">
        <img v-if="!isContinuous" :src="headImg" alt="" @load="headImgReady = true">
        <div v-else class="placeholder-block"/>
      </div>

      <div class="message-block">
        <a-row v-if="!isContinuous" class="nickname-block">
          <span>{{ nickname }}</span>
        </a-row>

        <a-row class="message-bubble">
          <img v-if="pictureSrc" :src="pictureSrc" @load="pictureReady = true">
          <span v-if="pictureReady">{{ content }}</span>
        </a-row>
      </div>

<!--      <div class="placeholder-block"/>-->
    </a-row>

<!--    <a-row v-else-if="type === TYPE_RIGHT" class="message-item-right" type="flex" justify="end">-->
<!--&lt;!&ndash;      <div class="placeholder-block"/>&ndash;&gt;-->

<!--      <div class="message-block">-->
<!--        <div v-if="!isContinuous" class="nickname-block">-->
<!--          <span>{{ nickname }}</span>-->
<!--        </div>-->

<!--        <div class="message-bubble" v-if="content">-->
<!--          <span>{{ content }}</span>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="head-block">-->
<!--        <img v-if="!isContinuous" :src="headImg" alt="">-->
<!--        <div v-else class="placeholder-block"/>-->
<!--      </div>-->
<!--    </a-row>-->
  </div>
</template>

<script>
import chatImagesDict from '@/assets/images/chatImagesDict.js'

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
      default: ' '
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
      validator: (val) => {
        return val === TYPE_INFO || val === TYPE_RIGHT || val === TYPE_LEFT
      }
    },
    isContinuous: {
      type: Boolean,
      required: false,
      default: false
    },
    isMount: {
      type: Boolean
    }
  },
  data () {
    return {
      TYPE_LEFT,
      TYPE_RIGHT,
      TYPE_INFO,

      headImg: undefined,
      mountedReady: false,
      pictureReady: false,
      headImgReady: false,
      pictureSrc: undefined
    }
  },
  created () {
    if (!this.isContinuous) {
      this.headImg = require(`@/assets/headImages/${this.head}`)
    } else {
      this.headImgReady = true
    }

    if (this.picture) {
      this.pictureSrc = chatImagesDict.get(this.picture)
      if (this.pictureSrc === undefined) {
        this.pictureSrc = require('@/assets/images/' + this.picture + '.png')
      }
    } else {
      this.pictureReady = true
    }
  },
  computed: {
    allReady () {
      return this.mountedReady && this.pictureReady && this.headImgReady
    }
  },
  watch: {
    allReady (val) {
      if (val) {
        setTimeout(() => {
          this.$emit('mounted')
        }, 100)
      }
    }
  },
  mounted () {
    this.mountedReady = true
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
      -webkit-text-stroke: 0.025em black;
      color: lightgrey;
      height: 32px;
      width: 100%;

      span {
        font-size: 28px;
        line-height: 32px;
      }
    }

    .message-bubble {
      width: fit-content;
      margin-top: 3px;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 0 10px 10px 10px;
      word-break: break-word;

      font-size: 30px;
      font-family: '华康少女字体', serif;

      img {
        vertical-align: bottom;
        max-width: 475px;
      }
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
      -webkit-text-stroke: 0.025em black;
      color: lightgrey;
      height: 32px;
      width: 100%;

      span {
        float: right;
        font-size: 28px;
        line-height: 32px;
      }
    }

    .message-bubble {
      width: fit-content;
      margin-top: 3px;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 10px 0 10px 10px;
      word-break: break-word;

      font-size: 30px;
      font-family: '华康少女字体', serif;

      img {
        vertical-align: bottom;
      }
    }
  }

  .placeholder-block {
    width: @head-size;
    height: 100%;
  }
}
</style>
