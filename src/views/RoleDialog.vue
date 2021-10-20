<template>
  <div class="main">
    <span>{{ currentContent }}</span>
  </div>
</template>

<script>
export default {
  name: 'RoleDialog',
  data () {
    return {
      content: '故事的起因，是宿舍中的谢拉被人杀害，\n' +
        '死因、其他线索以及公园湖边的案发地点一概被警察封锁了，\n',
      currentContent: ''
    }
  },
  mounted () {
    this.typeContent()
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
.main {
  height: 320px;
  background-color: rgba(0, 0, 0, 0.3);
  word-break: break-all;
  font-size: 40px;
  font-weight: lighter;
  color: #E9A92D;
  font-family: '华康少女字体', serif;
}
</style>
