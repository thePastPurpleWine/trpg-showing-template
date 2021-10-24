<template>
  <div class="main">
    <img v-if="image" style="z-index: 1;" :src="image">
    <div class="name-block">
      <span v-show="!isSystem">{{ name }}</span>
    </div>
    <div id="contentBlock" :class="contentBlockClass">
      <span>{{ currentContent }}</span>
    </div>
  </div>
</template>

<script>
const MAX_CONTENT = 92

export default {
  name: 'RoleDialog',
  props: {
    isSystem: {
      type: Boolean
    },
    name: {
      type: String,
      required: false
    },
    content: {
      type: String,
      validator (val) {
        return val.length <= MAX_CONTENT
      }
    }
  },
  data () {
    return {
      currentContent: ''
    }
  },
  watch: {
    isSystem () {
      this.contentBlockFix()
      this.imageImport()
    },
    content () {
      this.typeContent()
    }
  },
  mounted () {
    this.imageImport()
    this.typeContent()
    this.contentBlockFix()
  },
  computed: {
    contentBlockClass () {
      return 'content-block ' + (this.isSystem ? 'content-block-fix' : '')
    }
  },
  methods: {
    imageImport () {
      this.image = require('@/assets/' + (this.isSystem ? '对话框-系统.png' : '对话框.png'))
    },
    typeContent () {
      this.currentContent = ''
      let count = 1
      const length = this.content.length

      const timer = setInterval(() => {
        if (count <= length) {
          this.currentContent = this.content.slice(0, count++)
        } else {
          clearInterval(timer)
        }
      }, 20)
    },
    contentBlockFix () {
      const e = document.getElementById('contentBlock')

      if (this.isSystem) {
        e.style.marginTop = '-20px'
      } else {
        e.style.marginTop = ''
      }
    }
  }
}
</script>

<style scoped>
.main {
  height: 360px;
  word-break: break-all;
  font-weight: lighter;
}

.name-block {
  position: relative;
  top: -360px;

  z-index: 2;
  height: 88px;
  padding: 16px 180px;
  line-height: 56px;
  font-size: 56px;
  color: black;
  font-family: '华康海报体W12(P)', serif;
}

.content-block {
  position: relative;
  top: -360px;

  z-index: 2;
  padding: 0 160px 0 60px;
  font-size: 40px;
  color: #E9A92D;
  font-family: '华康少女字体', serif;
}

.content-block-fix {
  margin-top: -20px;
}
</style>
