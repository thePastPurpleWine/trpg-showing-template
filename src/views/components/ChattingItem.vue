<template>
  <div v-if="isMount" :class="this.isContinuous ? 'message-continuous' : 'message-first'">
    <a-row class="message-item-info" v-if="isRevoke" type="flex" justify="center">
      <a-row class="message-bubble">
        <span v-if="pictureReady">{{ nickname }}撤回了一条消息</span>
      </a-row>
    </a-row>
    <a-row class="message-item-left" v-else-if="isNormal" type="flex" v-show="allReady">
      <div class="head-block">
        <img v-if="!isContinuous" :src="avatarImage" alt="" @load="avatarImageReady = true">
        <div v-else class="placeholder-block"/>
      </div>

      <div class="message-block">
        <a-row v-if="!isContinuous" class="nickname-block">
          <span>{{ nickname }}</span>
        </a-row>

        <a-row class="message-bubble">
          <img v-if="pictureSrc" :src="pictureSrc" @load="pictureReady = true" alt="">
          <span v-if="pictureReady">{{ content }}</span>
        </a-row>
      </div>

<!--      <div class="placeholder-block"/>-->
    </a-row>

    <a-row class="message-item-info" v-else-if="isInfo" type="flex" justify="center">
      <a-row class="message-bubble">
        <span v-if="pictureReady">{{ content }}</span>
      </a-row>
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

export default {
  name: 'ChattingItem',
  props: {
    avatar: {
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
        return val === 'normal' || val === 'info'
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
      avatarImage: undefined,
      mountedReady: false,
      pictureReady: false,
      avatarImageReady: false,
      pictureSrc: undefined,
      isRevoke: false
    }
  },
  created () {
    if (!this.isContinuous) {
      this.avatarImage = require(`@/assets/avatar/${this.avatar}`)
    } else {
      this.avatarImageReady = true
    }

    if (this.picture) {
      this.pictureSrc = require('@/assets/discussImages/' + this.picture)
    } else {
      this.pictureReady = true
    }
  },
  computed: {
    allReady () {
      return this.mountedReady && this.pictureReady && this.avatarImageReady
    },
    isNormal () {
      return this.type === 'normal'
    },
    isInfo () {
      return this.type === 'info'
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

    if (this.isInfo) {
      setTimeout(() => {
        this.$emit('mounted')
      }, 100)
    }
  },
  methods: {
    revoke () {
      this.isRevoke = true
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

.message-item-info {
  margin-top: 20px;
  margin-bottom: 40px;
  width: 100%;

  .message-bubble {
    margin-left: -20px;
    border-radius: 12px;
    background-color: #D9DADC;
    color: #777777;
    font-size: 18px;
    line-height: 30px;
    padding: 0 8px;
    font-family: '微软雅黑', serif;
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
