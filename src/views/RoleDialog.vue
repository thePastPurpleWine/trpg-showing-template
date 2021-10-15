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
      content: 'FSGCZNDRWVC4VWLUBM3W3QPYUY8Z8WGMIQPGV22EO4ULQTZK63F7AQ2V5GXOO2IA5RLPYRMCR85HOPBXQKTUBFMGY2CJK1',
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
  word-break: break-all;
  font-size: 24px;
}
</style>
