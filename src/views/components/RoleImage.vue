<template>
  <div id="role" class="main-role">
    <img :src="roleImageSrc" alt="">
  </div>
</template>

<script>
export default {
  name: 'RoleImage',
  props: {
    role: String
  },
  data () {
    return {
      element: undefined,
      roleImageSrc: ''
    }
  },
  computed: {
    elementStyle () {
      return this.element.style
    }
  },
  mounted () {
    this.element = document.getElementById('role')
    this.preload()
  },
  watch: {
    role (val) {
      if (val) {
        const role = val.split('-')[0]
        const image = role + '-' + val.split('-')[1] + '.png'

        this.roleImageSrc = require('@/assets/role/' + role + '/' + image)
      } else {
        this.roleImageSrc = ''
      }
    }
  },
  methods: {
    preload () {
      const roleList = ['aj', 'dj', 'hy', 'tz', 'xx']
      for (const role of roleList) {
        for (const i in 9) {
          new Image().src = require('@/assets/role/' + role + '/' + role + '-' + i + '.png')
        }
      }
      new Image().src = require('@/assets/role/other/other-小猴.png')
      new Image().src = require('@/assets/role/xl/xl-1.png')
    },
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
</style>
