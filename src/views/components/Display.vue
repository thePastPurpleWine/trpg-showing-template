<template>
  <div>
    <img id="image" class="picture" :src="imageSrc" alt="">
  </div>
</template>

<script>
export default {
  name: 'Display',
  props: {
    filepath: String,
    waiting: Boolean,
    duration: Number,
    trigger: Boolean
  },
  data () {
    return {
      imageSrc: undefined,
      imageVisible: false
    }
  },
  computed: {
    element () {
      return document.getElementById('image')
    },
    elementStyle () {
      return this.element.style
    }
  },
  watch: {
    trigger () {
      if (this.imageVisible) {
        if (this.waiting) {
          this.fadeOut(50, 1)
        }
      } else {
        this.imageSrc = require('@/assets/picture/' + this.filepath)
        this.fadeIn(50, 1)
        if (!this.waiting) {
          setTimeout(() => this.fadeOut(50, 1), this.duration)
        }
      }
    }
  },
  methods: {
    fadeIn (distance, second) {
      this.imageVisible = true

      const marginLeftStr = this.elementStyle.marginLeft
      const marginLeftValueStr = marginLeftStr.slice(0, marginLeftStr.length - 2)

      const times = Math.ceil(second * 50)
      const pieceMarginLeft = parseFloat((distance / times).toFixed(3))
      const pieceOpacity = parseFloat((1 / times).toFixed(4))

      const start = parseInt(marginLeftValueStr) ? parseInt(marginLeftValueStr) : 0
      const target = start + distance
      let totalMarginLeft = start
      let totalOpacity = 0

      const startTime = Date.now()
      console.log('start fade in', 0, start, target)
      const timer = setInterval(() => {
        if (totalMarginLeft < target) {
          totalMarginLeft += pieceMarginLeft
          totalOpacity += pieceOpacity
          this.elementStyle.marginLeft = totalMarginLeft + 'px'
          this.elementStyle.opacity = totalOpacity
        } else {
          console.log('end fade in', Date.now() - startTime)
          this.elementStyle.marginLeft = target + 'px'
          this.elementStyle.opacity = 1
          clearInterval(timer)
        }
      }, 20)
    },
    fadeOut (distance, second) {
      const marginLeftStr = this.elementStyle.marginLeft
      const marginLeftValueStr = marginLeftStr.slice(0, marginLeftStr.length - 2)

      const times = Math.ceil(second * 50)
      const pieceMarginLeft = parseFloat((distance / times).toFixed(3))
      const pieceOpacity = parseFloat((1 / times).toFixed(4))

      const start = parseInt(marginLeftValueStr) ? parseInt(marginLeftValueStr) : 0
      const target = start + distance
      let totalMarginLeft = start
      let totalOpacity = 1

      const startTime = Date.now()
      console.log('start fade out', 0)
      const timer = setInterval(() => {
        if (totalMarginLeft < target) {
          totalMarginLeft += pieceMarginLeft
          totalOpacity -= pieceOpacity
          this.elementStyle.marginLeft = totalMarginLeft + 'px'
          this.elementStyle.opacity = totalOpacity
        } else {
          console.log('end fade out', Date.now() - startTime)
          this.elementStyle.marginLeft = target + 'px'
          this.elementStyle.opacity = 0
          clearInterval(timer)

          this.elementStyle.marginLeft = '0'
          this.imageSrc = ''
          this.imageVisible = false
        }
      }, 20)
    }
  }
}
</script>

<style scoped>
.display {
  display: flex;
}
.picture {
  opacity: 0;
  max-width: 100%;
  max-height: 100%;
  margin: auto ;
}
</style>
