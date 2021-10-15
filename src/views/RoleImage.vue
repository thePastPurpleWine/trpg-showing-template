<template>
  <div id="role" class="main">
    <div class="role"></div>
  </div>
</template>

<script>
export default {
  name: 'RoleImage',
  data () {
    return {
      element: undefined
    }
  },
  computed: {
    elementStyle () {
      return this.element.style
    }
  },
  mounted () {
    this.element = document.getElementById('role')
    setTimeout(() => this.fadeIn(40, 0.2), 3000)
    setTimeout(() => this.fadeOut(40, 0.2), 6000)
  },
  methods: {
    fadeIn (distance, second) {
      const paddingLeftStr = this.elementStyle.paddingLeft
      const paddingLeftValueStr = paddingLeftStr.slice(0, paddingLeftStr.length - 2)

      const times = Math.ceil(second * 50)
      const piecePaddingLeft = parseFloat((distance / times).toFixed(3))
      const pieceOpacity = parseFloat((1 / times).toFixed(4))

      const start = parseInt(paddingLeftValueStr) ? parseInt(paddingLeftValueStr) : 0
      const target = start + distance
      let totalPaddingLeft = start
      let totalOpacity = 0

      const startTime = Date.now()
      console.log('start fade in', 0, start, target)
      const timer = setInterval(() => {
        if (totalPaddingLeft < target) {
          totalPaddingLeft += piecePaddingLeft
          totalOpacity += pieceOpacity
          this.elementStyle.paddingLeft = totalPaddingLeft + 'px'
          this.elementStyle.opacity = totalOpacity
        } else {
          console.log('end fade in', Date.now() - startTime)
          this.elementStyle.paddingLeft = target + 'px'
          this.elementStyle.opacity = 1
          clearInterval(timer)
        }
      }, 20)
    },
    fadeOut (distance, second) {
      const paddingLeftStr = this.elementStyle.paddingLeft
      const paddingLeftValueStr = paddingLeftStr.slice(0, paddingLeftStr.length - 2)

      const times = Math.ceil(second * 50)
      const piecePaddingLeft = parseFloat((distance / times).toFixed(3))
      const pieceOpacity = parseFloat((1 / times).toFixed(4))

      const start = parseInt(paddingLeftValueStr) ? parseInt(paddingLeftValueStr) : 0
      const target = start + distance
      let totalPaddingLeft = start
      let totalOpacity = 1

      const startTime = Date.now()
      console.log('start fade out', 0)
      const timer = setInterval(() => {
        if (totalPaddingLeft < target) {
          totalPaddingLeft += piecePaddingLeft
          totalOpacity -= pieceOpacity
          this.elementStyle.paddingLeft = totalPaddingLeft + 'px'
          this.elementStyle.opacity = totalOpacity
        } else {
          console.log('end fade out', Date.now() - startTime)
          this.elementStyle.paddingLeft = target + 'px'
          this.elementStyle.opacity = 0
          clearInterval(timer)
        }
      }, 20)
    }
  }
}
</script>

<style scoped lang="less">
.main {
  opacity: 0;
}

.role {
  width: 150px;
  height: 400px;
  background-color: grey;
}
</style>
